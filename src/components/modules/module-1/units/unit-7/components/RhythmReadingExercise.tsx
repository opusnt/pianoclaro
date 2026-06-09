"use client";

import { Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import { getRhythmFigureById, type RhythmFigureId } from "@/lib/music/rhythmFigures";

interface RhythmReadingExerciseProps {
  sequence: RhythmFigureId[];
  mode?: "guided" | "active";
  timeSignature?: number; // Ej: 4 para 4/4
  onComplete?: (score: number) => void;
}

export function RhythmReadingExercise({
  sequence,
  mode = "guided",
  timeSignature,
  onComplete,
}: RhythmReadingExerciseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const engineRef = useRef<PianoAudioEngine | null>(null);
  const _sequenceEventIds = useRef<number[]>([]);

  // Calcular las posiciones de las barras divisorias
  const barLineIndices = new Set<number>();
  if (timeSignature) {
    let currentSum = 0;
    sequence.forEach((fig, idx) => {
      currentSum += getRhythmFigureById(fig).durationUnits;
      if (currentSum % timeSignature === 0 && idx < sequence.length - 1) {
        barLineIndices.add(idx);
      }
    });
  }

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    engineRef.current.prepare();

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      engineRef.current?.close();
    };
  }, []);

  const handleStart = async () => {
    if (!engineRef.current) return;

    await Tone.start();
    await engineRef.current.prepare();

    // Configurar metrónomo
    Tone.Transport.bpm.value = 60; // 1 negra = 1 segundo

    setIsPlaying(true);
    setActiveIndex(null);
    setFeedback("Escucha 4 pulsos de preparación...");

    // Limpiar eventos anteriores
    Tone.Transport.cancel();

    // Contar 4 tiempos de entrada usando el piano (más suave y natural)
    for (let i = 0; i < 4; i++) {
      Tone.Transport.schedule((_time) => {
        const freq = i === 0 ? 523.25 : 440; // C5 para el acento, A4 para los demás
        engineRef.current?.playPianoTone(freq, { durationMs: 200, velocity: i === 0 ? 0.6 : 0.3 });
      }, `+${i} * 4n`);
    }

    // Calcular el tiempo de inicio (después de 4 pulsos)
    let currentTimeInBeats = 4;

    sequence.forEach((figureId, index) => {
      const figure = getRhythmFigureById(figureId);

      // Programar iluminación visual
      Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          setActiveIndex(index);
          if (mode === "guided") {
            setFeedback("Escucha y observa...");
          } else {
            setFeedback("¡Toca ahora!");
          }
        }, time);
      }, `+${currentTimeInBeats} * 4n`);

      // Programar audio si es modo guiado
      if (mode === "guided") {
        Tone.Transport.schedule((_time) => {
          // Usamos el motor de piano para que no suene a "midi", usando un SOL de referencia
          engineRef.current?.playPianoTone(392.0, { durationMs: figure.durationUnits * 1000 });
        }, `+${currentTimeInBeats} * 4n`);
      }

      currentTimeInBeats += figure.durationUnits;
    });

    // Programar fin
    Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        setIsPlaying(false);
        setActiveIndex(null);
        setFeedback("¡Excelente!");
        if (onComplete) onComplete(100);
      }, time);
    }, `+${currentTimeInBeats} * 4n`);

    Tone.Transport.start();
  };

  const handleTap = () => {
    if (mode !== "active" || !isPlaying) return;
    // Implementar lógica de puntuación de precisión (similar a BeatTracker)
    // Para no complicar excesivamente esta primera etapa, dejaremos un tap libre que de un pequeño feedback visual.
    engineRef.current?.playFrequency(440, 200);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="mb-8 text-xl font-bold text-slate-500 h-8">{feedback}</div>

      <div
        className={`flex flex-wrap justify-center gap-4 p-8 rounded-3xl border-2 transition-colors ${
          mode === "active" && isPlaying
            ? "bg-sky-50 border-sky-200 cursor-pointer"
            : "bg-white border-slate-100"
        }`}
        onClick={mode === "active" ? handleTap : undefined}
      >
        {sequence.map((figureId, index) => {
          const isActive = activeIndex === index;
          return (
            <React.Fragment key={`${figureId}-${index}`}>
              <div
                className={`transition-all duration-300 ${isActive ? "scale-110" : "scale-100 opacity-70"}`}
              >
                <RhythmVisualizer
                  figureId={figureId}
                  durationSeconds={getRhythmFigureById(figureId).durationUnits}
                  isPlaying={isActive && mode === "guided"}
                />
              </div>
              {barLineIndices.has(index) && (
                <div className="w-1 bg-slate-300 rounded-full mx-2 my-2 opacity-50" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!isPlaying && (
        <button
          type="button"
          onClick={handleStart}
          className="mt-8 flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg"
        >
          <Play fill="currentColor" />
          <span>Comenzar Lectura</span>
        </button>
      )}
    </div>
  );
}
