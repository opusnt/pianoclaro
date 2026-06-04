"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioSynthesisParams } from "@/components/shared/audio/useAudioSimulator";

export type AudioEvent = {
  time: number; // Start time in seconds relative to sequence start
  duration: number; // Duration in seconds
  params: AudioSynthesisParams;
  filterFrequency?: number;
};

export type MusicLayer = {
  id: string;
  name: string;
  events: AudioEvent[];
};

export function useAudioSequencer() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const layerGainsRef = useRef<Map<string, GainNode>>(new Map());

  // Para limpiar los nodos activos al detener
  const activeOscillators = useRef<AudioScheduledSourceNode[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());

  // Temporizador para detener automáticamente cuando la secuencia termine
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const getOrCreateLayerGain = useCallback(
    (layerId: string) => {
      const ctx = initAudio();
      if (!masterGainRef.current) return null;

      if (!layerGainsRef.current.has(layerId)) {
        const gain = ctx.createGain();
        // Inicialmente en silencio hasta que revisemos los activeLayers
        gain.gain.value = 0;
        gain.connect(masterGainRef.current);
        layerGainsRef.current.set(layerId, gain);
      }
      return layerGainsRef.current.get(layerId);
    },
    [initAudio],
  );

  // Actualizar el mute/unmute de las capas dinámicamente cuando el estado cambia
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Suavizamos la transición para evitar clicks
    layerGainsRef.current.forEach((gainNode, layerId) => {
      const targetVolume = activeLayers.has(layerId) ? 1 : 0;
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.05);
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
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);

    activeOscillators.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        /* Ya se detuvo */
      }
    });
    activeOscillators.current = [];
    setIsPlaying(false);
  }, []);

  const playSequence = useCallback(
    (layers: MusicLayer[], initialActiveLayers: string[]) => {
      stopAll();
      const ctx = initAudio();
      const startTime = ctx.currentTime + 0.1; // Pequeño buffer

      setLayers(initialActiveLayers);

      let maxEndTime = 0;

      layers.forEach((layer) => {
        const layerGain = getOrCreateLayerGain(layer.id);
        if (!layerGain) return;

        // Aplicar el volumen inicial inmediatamente
        layerGain.gain.setValueAtTime(
          initialActiveLayers.includes(layer.id) ? 1 : 0,
          ctx.currentTime,
        );

        layer.events.forEach((event) => {
          const absoluteStartTime = startTime + event.time;
          const absoluteEndTime = absoluteStartTime + event.duration;
          maxEndTime = Math.max(maxEndTime, absoluteEndTime);

          const nodeGain = ctx.createGain();
          const targetGain = event.params.gain !== undefined ? event.params.gain : 0.3;

          // Envolvente de cada nota
          nodeGain.gain.setValueAtTime(0, absoluteStartTime);
          nodeGain.gain.linearRampToValueAtTime(targetGain, absoluteStartTime + 0.05); // Attack
          nodeGain.gain.setValueAtTime(targetGain, absoluteEndTime - 0.05); // Sustain
          nodeGain.gain.linearRampToValueAtTime(0, absoluteEndTime); // Release

          nodeGain.connect(layerGain);

          if (event.params.type === "noise") {
            const bufferSize = ctx.sampleRate * event.duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = buffer;

            if (event.filterFrequency) {
              const filter = ctx.createBiquadFilter();
              filter.type = "lowpass";
              filter.frequency.value = event.filterFrequency;
              noiseSource.connect(filter);
              filter.connect(nodeGain);
            } else {
              noiseSource.connect(nodeGain);
            }

            noiseSource.start(absoluteStartTime);
            noiseSource.stop(absoluteEndTime);
            activeOscillators.current.push(noiseSource);
          } else {
            const osc = ctx.createOscillator();
            osc.type = event.params.type;
            osc.frequency.setValueAtTime(event.params.frequency || 440, absoluteStartTime);

            osc.connect(nodeGain);
            osc.start(absoluteStartTime);
            osc.stop(absoluteEndTime);
            activeOscillators.current.push(osc);
          }
        });
      });

      setIsPlaying(true);

      // Calcular cuándo termina exactamente la secuencia en milisegundos
      const totalDurationMs = (maxEndTime - startTime) * 1000;
      stopTimerRef.current = setTimeout(() => {
        setIsPlaying(false);
        activeOscillators.current = [];
      }, totalDurationMs + 100);
    },
    [initAudio, getOrCreateLayerGain, setLayers, stopAll],
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
