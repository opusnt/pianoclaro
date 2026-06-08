"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import type { AudioSynthesisParams } from "@/components/shared/audio/useAudioSimulator";

export type AudioEvent = {
  time: number; // Start time in seconds relative to sequence start
  duration: number; // Duration in seconds
  params: AudioSynthesisParams & { instrument?: "piano" | "drums" | "synth" }; // Expandimos params
  filterFrequency?: number;
};

export type MusicLayer = {
  id: string;
  name: string;
  events: AudioEvent[];
};

export function useAudioSequencer() {
  const isInitialized = useRef(false);

  // Instancias estáticas de instrumentos para no recrearlas cada vez
  const pianoSamplerRef = useRef<Tone.Sampler | null>(null);
  const drumSamplerRef = useRef<Tone.Sampler | null>(null);
  const genericSynthRef = useRef<Tone.PolySynth | null>(null);

  // Nodos de volumen por capa para permitir el muting al vuelo
  const layerVolumesRef = useRef<Map<string, Tone.Volume>>(new Map());

  // Parts activos de Tone.js para poder detenerlos
  const activePartsRef = useRef<Tone.Part[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());

  const initAudio = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    await Tone.start();

    // 1. Piano Real (Salamander Grand)
    pianoSamplerRef.current = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    });

    // 2. Batería Acústica
    drumSamplerRef.current = new Tone.Sampler({
      urls: {
        // Mapeo básico: kick (C2), snare (D2), hihat cerrado (F#2), open hihat (A#2)
        C2: "kick.mp3",
        D2: "snare.mp3",
        "F#2": "hihat.mp3", // closed hihat
      },
      baseUrl: "https://tonejs.github.io/audio/drum-samples/Acoustic/",
    });

    // 3. Sintetizador Genérico (PolySynth)
    genericSynthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();

    // Solo podemos rutear los samplers cuando estén listos. Tone.js permite encadenarlos inmediatamente aunque el audio se esté descargando.
  }, []);

  const getOrCreateLayerVolume = useCallback((layerId: string) => {
    if (!layerVolumesRef.current.has(layerId)) {
      const vol = new Tone.Volume(-Infinity).toDestination();
      layerVolumesRef.current.set(layerId, vol);
    }
    return layerVolumesRef.current.get(layerId)!;
  }, []);

  // Actualizar el mute/unmute de las capas dinámicamente
  useEffect(() => {
    layerVolumesRef.current.forEach((volNode, layerId) => {
      const isActive = activeLayers.has(layerId);
      // Hacemos un fade out/in de 0.1s para evitar clicks
      volNode.volume.rampTo(isActive ? 0 : -100, 0.1);
    });
  }, [activeLayers]);

  const toggleLayer = useCallback((layerId: string, isActive: boolean) => {
    setActiveLayers((prev) => {
      const newSet = new Set(prev);
      if (isActive) newSet.add(layerId);
      else newSet.delete(layerId);
      return newSet;
    });
  }, []);

  const setLayers = useCallback((layers: string[]) => {
    setActiveLayers(new Set(layers));
  }, []);

  const stopAll = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0); // Limpia todo el scheduler

    activePartsRef.current.forEach((part) => {
      part.stop();
      part.dispose();
    });
    activePartsRef.current = [];
    setIsPlaying(false);
  }, []);

  const playSequence = useCallback(
    async (layers: MusicLayer[], initialActiveLayers: string[]) => {
      stopAll();
      await initAudio(); // Asegura Tone.start() y la creación de samplers

      setLayers(initialActiveLayers);

      // Preparamos los volúmenes iniciales instantáneamente
      layers.forEach((layer) => {
        const volNode = getOrCreateLayerVolume(layer.id);
        volNode.volume.value = initialActiveLayers.includes(layer.id) ? 0 : -100;

        // Rutear los instrumentos de esta capa a través de su nodo de volumen.
        // Debido a cómo funciona Tone.js, los Samplers son globales. Para rutear capas,
        // podríamos usar múltiples samplers, pero eso duplicaría la descarga.
        // Una solución elegante es conectar las notas individuales al volumen, pero Tone.Sampler no lo permite fácilmente a nivel nota.
        // Como solución híbrida para esta arquitectura educativa, mutaremos la capa.
      });

      let maxEndTime = 0;

      layers.forEach((layer) => {
        const layerVol = getOrCreateLayerVolume(layer.id);

        const events = layer.events.map((event) => {
          const absoluteEndTime = event.time + event.duration;
          maxEndTime = Math.max(maxEndTime, absoluteEndTime);

          return {
            time: event.time,
            duration: event.duration,
            note: event.params.frequency
              ? Tone.Frequency(event.params.frequency).toNote()
              : // Si es ruido/ritmo, el parser de exercises le pone frequency igual.
                // En drums usaremos mapeos MIDI específicos luego.
                "C4",
            instrument: event.params.instrument || "synth",
            originalEvent: event,
          };
        });

        const part = new Tone.Part((time, value) => {
          // Si la capa está muteada, no disparamos la nota (ahorra CPU y rutea correctamente sin duplicar samplers)
          if (!activeLayers.has(layer.id)) return;

          const gainLevel = value.originalEvent.params.gain || 0.5;
          const velocity = gainLevel * 2; // Ajuste empírico de volumen relativo

          if (value.instrument === "piano" && pianoSamplerRef.current?.loaded) {
            pianoSamplerRef.current.triggerAttackRelease(
              value.note,
              value.duration,
              time,
              velocity,
            );
          } else if (value.instrument === "drums" && drumSamplerRef.current?.loaded) {
            // Mapeo simple: si era noise (snare), si era low (kick), etc.
            // Para mantener compatibilidad con las secuencias antiguas:
            let drumNote = "C2"; // kick
            if (value.originalEvent.params.type === "noise") {
              drumNote =
                value.originalEvent.filterFrequency && value.originalEvent.filterFrequency > 5000
                  ? "F#2" // hihat
                  : "D2"; // snare
            } else if (
              value.originalEvent.params.frequency &&
              value.originalEvent.params.frequency < 100
            ) {
              drumNote = "C2"; // kick
            }

            drumSamplerRef.current.triggerAttackRelease(drumNote, value.duration, time, velocity);
          } else if (genericSynthRef.current) {
            genericSynthRef.current.triggerAttackRelease(
              value.note,
              value.duration,
              time,
              velocity,
            );
          }
        }, events).start(0);

        activePartsRef.current.push(part);
      });

      setIsPlaying(true);

      // Iniciar el transporte
      Tone.Transport.start();

      // Programar la detención automática
      Tone.Transport.scheduleOnce(() => {
        setIsPlaying(false);
      }, maxEndTime + 0.1);
    },
    [initAudio, getOrCreateLayerVolume, setLayers, stopAll, activeLayers],
  );

  return {
    playSequence,
    stopAll,
    toggleLayer,
    setLayers,
    isPlaying,
    activeLayers,
  };
}
