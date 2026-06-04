"use client";

import { CheckCircle2, Play, RotateCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import type { PitchNote } from "@/components/shared/visualizers/PitchVisualizer";
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface FinalReadingChallengeProps {
  onComplete: (score: number) => void;
}

const FINAL_SCORE_NOTES: PitchNote[] = [
  // Compás 1
  { id: "n1", yPos: 35, xPos: 5, rhythm: "quarter", color: "bg-slate-800 text-slate-900" }, // SOL
  { id: "n2", yPos: 40, xPos: 12, rhythm: "quarter", color: "bg-slate-800 text-slate-900" }, // LA
  { id: "n3", yPos: 45, xPos: 20, rhythm: "half", color: "bg-slate-800 text-slate-900" }, // SI

  // Compás 2
  {
    id: "n4",
    yPos: 35,
    xPos: 32,
    rhythm: "half",
    color: "bg-slate-800 text-slate-900",
    tieNext: true,
  }, // SOL (Ligada)
  { id: "n5", yPos: 35, xPos: 45, rhythm: "quarter", color: "bg-slate-800 text-slate-900" }, // SOL
  { id: "n6", yPos: 30, xPos: 52, rhythm: "quarter", color: "bg-slate-800 text-slate-900" }, // FA

  // Compás 3
  {
    id: "n7",
    yPos: 40,
    xPos: 65,
    rhythm: "half",
    isDotted: true,
    color: "bg-slate-800 text-slate-900",
  }, // LA (blanca c/ puntillo)
  { id: "n8", yPos: 35, xPos: 78, rhythm: "quarter", color: "bg-slate-800 text-slate-900" }, // SOL

  // Compás 4
  { id: "n9", yPos: 50, xPos: 90, rhythm: "whole", color: "bg-slate-800 text-slate-900" }, // DO
];

// Mapeo para el reproductor de audio (notas musicales de Tone.js)
const AUDIO_NOTES = [
  { pitch: "G", durationMs: 1000 }, // n1
  { pitch: "A", durationMs: 1000 }, // n2
  { pitch: "B", durationMs: 2000 }, // n3
  { pitch: "G", durationMs: 3000 }, // n4 ligada a n5 (se tocan como una sola)
  { pitch: null, durationMs: 0 }, // n5 (silencio virtual porque está ligada)
  { pitch: "F", durationMs: 1000 }, // n6
  { pitch: "A", durationMs: 3000 }, // n7
  { pitch: "G", durationMs: 1000 }, // n8
  { pitch: "C5", durationMs: 4000 }, // n9
];

const QUESTIONS: ChallengeQuestion[] = [
  {
    id: "q1",
    question: "¿Cuántos compases tiene esta partitura?",
    options: ["2 compases", "3 compases", "4 compases", "5 compases"],
    correctIndex: 2,
  },
  {
    id: "q2",
    question: "¿Qué notas están conectadas por una ligadura?",
    options: ["Los dos primeros SOL", "El SI y el LA", "Las dos notas finales"],
    correctIndex: 0,
  },
  {
    id: "q3",
    question: "¿Cuál es la nota más larga de toda la melodía?",
    options: ["La blanca con puntillo", "La redonda del final", "Las negras iniciales"],
    correctIndex: 1,
  },
];

export function FinalReadingChallenge({ onComplete }: FinalReadingChallengeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const engineRef = useRef<PianoAudioEngine | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    // PianoAudioEngine doesn't have dispose
  }, []);

  const playScore = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveNoteId(null);

    // Iniciar AudioContext
    const Tone = await import("tone");
    await Tone.start();
    await engineRef.current?.prepare();

    let accumulatedTime = 0;

    for (let i = 0; i < FINAL_SCORE_NOTES.length; i++) {
      const noteData = FINAL_SCORE_NOTES[i];
      const audioData = AUDIO_NOTES[i];

      // Programar iluminación visual
      setTimeout(() => {
        setActiveNoteId(noteData.id);
      }, accumulatedTime);

      // Reproducir audio si corresponde
      if (audioData.pitch && audioData.durationMs > 0) {
        setTimeout(() => {
          engineRef.current?.playSustainedNote(audioData.pitch as any, audioData.durationMs);
        }, accumulatedTime);
      }

      // Si la nota actual dura 0 (está ligada), iluminamos inmediatamente pero avanzamos con la duración total que ya fue tomada por la primera
      if (audioData.durationMs > 0) {
        accumulatedTime += audioData.durationMs;
      }
      // Sin embargo, si es una nota individual de una ligadura visual, en el array AUDIO_NOTES la 2da dura 0ms.
      // Para la animación visual necesitamos que pase el tiempo de la nota ligada individualmente.
      // Así que la lógica visual debe ser distinta a la de audio.
    }

    // Mejorar lógica visual de la ligadura para el highlight:
    // N4 (Blanca) dura 2000, N5 (Negra) dura 1000. Total = 3000.
  };

  // Lógica mejorada del reproductor
  const playScoreFixed = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveNoteId(null);

    const Tone = await import("tone");
    await Tone.start();
    await engineRef.current?.prepare();

    // Tiempos visuales de cada figura (ms)
    const visualDurations = [
      1000,
      1000,
      2000, // M1
      2000,
      1000,
      1000, // M2 (n4 y n5)
      3000,
      1000, // M3
      4000, // M4
    ];

    let currentVisualTime = 0;

    for (let i = 0; i < FINAL_SCORE_NOTES.length; i++) {
      const noteId = FINAL_SCORE_NOTES[i].id;
      const audioPitch = AUDIO_NOTES[i].pitch;
      const audioDuration = AUDIO_NOTES[i].durationMs;
      const durationMs = visualDurations[i];

      setTimeout(() => {
        setActiveNoteId(noteId);
        if (audioPitch && audioDuration > 0) {
          engineRef.current?.playSustainedNote(audioPitch as any, audioDuration);
        }
      }, currentVisualTime);

      currentVisualTime += durationMs;
    }

    // Al finalizar
    setTimeout(() => {
      setActiveNoteId(null);
      setIsPlaying(false);
      setHasPlayed(true);
      setShowQuiz(true);
    }, currentVisualTime + 500);
  };

  const activeNotes = FINAL_SCORE_NOTES.map((note) => ({
    ...note,
    color: activeNoteId === note.id ? "bg-fuchsia-500 text-white" : note.color,
    pulse: activeNoteId === note.id,
  }));

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calcular score final
      let correctCount = 0;
      QUESTIONS.forEach((q, i) => {
        if (newAnswers[i] === q.correctIndex) correctCount++;
      });
      const finalScore = Math.round((correctCount / QUESTIONS.length) * 100);
      setIsFinished(true);
      setTimeout(() => {
        onComplete(finalScore);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Partitura */}
      <div className="w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 mb-8 relative">
        <TrebleClefVisualizer notes={activeNotes} barLines={[27, 58, 84]} height={200} />

        {!isPlaying && !showQuiz && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
            <button
              onClick={playScoreFixed}
              className="flex items-center gap-3 px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-full shadow-xl shadow-fuchsia-200 transition-all hover:scale-105"
            >
              <Play className="w-6 h-6" fill="currentColor" />
              <span>Escuchar Partitura</span>
            </button>
          </div>
        )}

        {!isPlaying && hasPlayed && !showQuiz && !isFinished && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={playScoreFixed}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-500 font-bold rounded-full transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Escuchar de nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* Quiz */}
      {showQuiz && !isFinished && (
        <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}
            </span>
            <span className="px-3 py-1 bg-fuchsia-50 text-fuchsia-600 font-bold rounded-full text-sm">
              Proyecto Final
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-8">
            {QUESTIONS[currentQuestionIndex].question}
          </h3>

          <div className="flex flex-col gap-3">
            {QUESTIONS[currentQuestionIndex].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full text-left px-6 py-4 rounded-2xl border-2 border-slate-100 hover:border-fuchsia-300 hover:bg-fuchsia-50 font-bold text-slate-500 transition-all hover:translate-x-2"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pantalla de éxito post-quiz */}
      {isFinished && (
        <div className="flex flex-col items-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-slate-900" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">¡Desafío Completado!</h2>
          <p className="text-slate-500 font-medium text-lg">Procesando tus resultados...</p>
        </div>
      )}
    </div>
  );
}
