"use client";

import { useCallback, useRef } from "react";

export type AudioSynthesisParams = {
  type: "sine" | "square" | "sawtooth" | "triangle" | "noise";
  frequency?: number;
  duration?: number;
  gain?: number;
};

export function useAudioSimulator() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSimulatedSound = useCallback(
    (params: AudioSynthesisParams, filterFrequency?: number) => {
      const ctx = initAudio();

      const duration = params.duration || 1;
      const targetGain = params.gain !== undefined ? params.gain : 0.5;

      const gainNode = ctx.createGain();

      // Envolvente tipo "Órgano" (Ataque rápido, sustain completo, decaimiento rápido)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.02);
      gainNode.gain.setValueAtTime(
        targetGain,
        Math.max(ctx.currentTime + 0.02, ctx.currentTime + duration - 0.05),
      );
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      gainNode.connect(ctx.destination);

      if (params.type === "noise") {
        // Generar ruido blanco
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;

        // Si hay frecuencia de filtro provista, se usa
        if (filterFrequency) {
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = filterFrequency;
          noiseSource.connect(filter);
          filter.connect(gainNode);
        } else {
          noiseSource.connect(gainNode);
        }

        noiseSource.start();
        noiseSource.stop(ctx.currentTime + duration);
      } else {
        // Generar onda osciladora (musical)
        const osc = ctx.createOscillator();
        osc.type = params.type;
        osc.frequency.setValueAtTime(params.frequency || 440, ctx.currentTime);

        osc.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    },
    [initAudio],
  );

  return { playSimulatedSound };
}
