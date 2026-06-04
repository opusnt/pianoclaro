"use client";

import * as Pitchfinder from "pitchfinder";
import { useEffect, useRef } from "react";
import type { PianoNoteName, SharpNoteName } from "@/lib/music/notes";
import type { NoteName } from "@/types/lesson";

type UseMicrophonePitchDetectionOptions = {
  enabled: boolean;
  onNaturalKeyPress: (note: NoteName) => void;
  onSharpKeyPress: (note: SharpNoteName) => void;
};

const pitchClasses: PianoNoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function useMicrophonePitchDetection({
  enabled,
  onNaturalKeyPress,
  onSharpKeyPress,
}: UseMicrophonePitchDetectionOptions) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Guardamos las callbacks en refs para evitar problemas de dependencias en el bucle de animación
  const onNaturalKeyPressRef = useRef(onNaturalKeyPress);
  const onSharpKeyPressRef = useRef(onSharpKeyPress);

  useEffect(() => {
    onNaturalKeyPressRef.current = onNaturalKeyPress;
    onSharpKeyPressRef.current = onSharpKeyPress;
  }, [onNaturalKeyPress, onSharpKeyPress]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    async function initAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const detectPitch = Pitchfinder.YIN({ sampleRate: audioCtx.sampleRate });
        const float32Array = new Float32Array(analyser.fftSize);

        let lastNote: PianoNoteName | null = null;
        let noteSustainTime = 0;

        function loop() {
          if (!isMounted) return;

          analyser.getFloatTimeDomainData(float32Array);

          // Calcular RMS (volumen) para ignorar el ruido de fondo
          let sumSquares = 0;
          for (let i = 0; i < float32Array.length; i++) {
            sumSquares += float32Array[i] * float32Array[i];
          }
          const rms = Math.sqrt(sumSquares / float32Array.length);

          if (rms > 0.015) {
            // Umbral de volumen
            const pitch = detectPitch(float32Array);
            // Validamos que el pitch esté en un rango razonable para un piano
            if (pitch !== null && pitch > 20 && pitch < 4000) {
              const midiNum = Math.round(12 * Math.log2(pitch / 440) + 69);
              const note = pitchClasses[midiNum % 12];

              if (note) {
                // Prevenir que la misma nota se dispare múltiples veces rapidísimo (debounce simple)
                if (note !== lastNote || Date.now() - noteSustainTime > 500) {
                  lastNote = note;
                  noteSustainTime = Date.now();

                  if (note.includes("#")) {
                    onSharpKeyPressRef.current(note as SharpNoteName);
                  } else {
                    onNaturalKeyPressRef.current(note as NoteName);
                  }
                }
              }
            }
          } else {
            // Si el volumen cae, reseteamos la nota para permitir repeticiones de la misma nota
            lastNote = null;
          }

          animationRef.current = requestAnimationFrame(loop);
        }

        loop();
      } catch (error) {
        console.error("Error al acceder al micrófono:", error);
      }
    }

    void initAudio();

    return () => {
      isMounted = false;
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(console.error);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled]);
}
