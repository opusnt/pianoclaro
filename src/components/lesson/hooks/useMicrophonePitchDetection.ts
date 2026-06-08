"use client";

import * as Pitchfinder from "pitchfinder";
import { useEffect, useRef } from "react";
import type { PianoNoteName, SharpNoteName } from "@/lib/music/notes";
import type { NoteName } from "@/types/lesson";

type UseMicrophonePitchDetectionOptions = {
  enabled: boolean;
  onNaturalKeyPress: (note: NoteName) => void;
  onSharpKeyPress: (note: SharpNoteName) => void;
  onError?: (errorMessage: string) => void;
  onDebug?: (rms: number, pitch: number | null) => void;
  onMidiNote?: (midiNote: number) => void;
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
  onError,
  onDebug,
  onMidiNote,
}: UseMicrophonePitchDetectionOptions) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const onNaturalKeyPressRef = useRef(onNaturalKeyPress);
  const onSharpKeyPressRef = useRef(onSharpKeyPress);
  const onErrorRef = useRef(onError);
  const onDebugRef = useRef(onDebug);
  const onMidiNoteRef = useRef(onMidiNote);

  useEffect(() => {
    onNaturalKeyPressRef.current = onNaturalKeyPress;
    onSharpKeyPressRef.current = onSharpKeyPress;
    onErrorRef.current = onError;
    onDebugRef.current = onDebug;
    onMidiNoteRef.current = onMidiNote;
  }, [onNaturalKeyPress, onSharpKeyPress, onError, onDebug, onMidiNote]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    async function initAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
          },
        });
        if (!isMounted) {
          stream.getTracks().forEach((t) => {
            t.stop();
          });
          return;
        }

        streamRef.current = stream;
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        if (audioCtx.state === "suspended") {
          await audioCtx.resume();
        }
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);

        // Preamplificador digital: Multiplicamos el volumen x10
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 10.0;

        // Añadir filtro pasa-bajos para eliminar ruido de alta frecuencia (como estática a 17kHz)
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1500; // Suficiente para captar hasta C6 (1046 Hz), elimina siseos

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;

        source.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(analyser);

        // Usamos YIN (ahora que el AudioContext no está suspendido, debería funcionar)
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
          const pitch = detectPitch(float32Array);

          if (onDebugRef.current) {
            onDebugRef.current(rms, pitch);
          }

          if (rms > 0.0005) {
            // Umbral súper bajo
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

                  if (onMidiNoteRef.current) {
                    onMidiNoteRef.current(midiNum);
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
      } catch (error: any) {
        console.warn("Permiso de micrófono denegado o no disponible:", error);
        if (onErrorRef.current) {
          onErrorRef.current(error.message || "Microphone access denied");
        }
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
