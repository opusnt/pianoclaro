"use client";

import { CheckCircle2, Clock, Target, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MeasureBuilder } from "@/components/shared/interactive/MeasureBuilder";
import { RhythmVisualizer } from "@/components/shared/visualizers/RhythmVisualizer";
// Visualizadores reutilizados
import { TrebleClefVisualizer } from "@/components/shared/visualizers/TrebleClefVisualizer";
import { PianoAudioEngine } from "@/lib/audio/piano-engine";
import {
  generateClefQuestion,
  generateDottedNotesQuestion,
  generateMeasuresQuestion,
  generateNotesQuestion,
  generateRandomQuestion,
  generateRhythmQuestion,
  generateTiesQuestion,
  type ModuleMasterySkill,
  type TrainingQuestion,
} from "@/lib/exercises/exerciseGenerators";
import { useMastery } from "@/lib/masteryStore";

export type TrainingMode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface TrainingArenaProps {
  mode: TrainingMode;
  onExit: () => void;
}

export function TrainingArena({ mode, onExit }: TrainingArenaProps) {
  const { mastery, updateMastery, addXP, completeSession } = useMastery();
  const engineRef = useRef<PianoAudioEngine | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<TrainingQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);

  // Modo 8 (Rápido)
  const [timeLeft, setTimeLeft] = useState(60);

  // Feedback
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const totalQuestions = mode === 8 ? Infinity : 10;

  useEffect(() => {
    engineRef.current = new PianoAudioEngine();
    loadNextQuestion();
  }, []);

  useEffect(() => {
    if (mode === 8 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isFinished]);

  const loadNextQuestion = () => {
    setFeedback(null);
    let weakestSkill: ModuleMasterySkill | undefined;

    if (mode === 7 || mode === 8) {
      // Find weakest skill
      const skills = Object.entries(mastery) as [ModuleMasterySkill, number][];
      skills.sort((a, b) => a[1] - b[1]);
      weakestSkill = skills[0][0];
    }

    let q: TrainingQuestion;
    switch (mode) {
      case 1:
        q = generateNotesQuestion();
        break;
      case 2:
        q = generateClefQuestion();
        break;
      case 3:
        q = generateRhythmQuestion();
        break;
      case 4:
        q = generateMeasuresQuestion();
        break;
      case 5:
        q = generateTiesQuestion();
        break;
      case 6:
        q = generateDottedNotesQuestion();
        break;
      default:
        q = generateRandomQuestion(weakestSkill);
        break;
    }
    setCurrentQuestion(q);
  };

  const handleAnswer = (index: number | boolean) => {
    if (feedback !== null) return; // Ya respondió

    let isCorrect = false;
    if (typeof index === "number" && currentQuestion?.correctIndex === index) {
      isCorrect = true;
    } else if (typeof index === "boolean" && index === true) {
      isCorrect = true; // For builder success
    }

    setFeedback(isCorrect ? "success" : "error");

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      if (currentQuestion) {
        updateMastery(currentQuestion.skill, 5); // +5% mastery on success
      }
    } else {
      if (currentQuestion) {
        updateMastery(currentQuestion.skill, -2); // -2% mastery on error
      }
    }

    setTimeout(() => {
      if (questionNumber >= totalQuestions && mode !== 8) {
        finishSession();
      } else {
        setQuestionNumber((prev) => prev + 1);
        loadNextQuestion();
      }
    }, 1000);
  };

  const finishSession = () => {
    setIsFinished(true);
    const xpEarned = correctCount * 10 + (mode === 8 ? correctCount * 5 : 0);
    addXP(xpEarned);
    completeSession(mode === 8 ? 60 - timeLeft : questionNumber * 5); // Aprox
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
          <Target className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-2">¡Entrenamiento Completado!</h2>
        <p className="text-xl text-slate-500 mb-8 font-medium">Lograste {correctCount} aciertos.</p>

        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 mb-10 w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-500">XP Ganada</span>
            <span className="font-black text-2xl text-fuchsia-500">+{correctCount * 10}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105"
        >
          Volver al Centro
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onExit}
          className="p-3 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-sm"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>

        <div className="flex gap-4">
          {mode === 8 ? (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm ${timeLeft <= 10 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-white text-slate-600"}`}
            >
              <Clock className="w-5 h-5" />
              <span>{timeLeft}s</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full font-bold text-slate-600 shadow-sm">
              <Target className="w-5 h-5 text-sky-500" />
              <span>
                {questionNumber} / {totalQuestions}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full font-bold text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{correctCount}</span>
          </div>
        </div>
      </div>

      {/* Arena Content */}
      <div
        className={`bg-white rounded-3xl shadow-sm border-2 p-8 transition-all duration-300 ${
          feedback === "success"
            ? "border-emerald-400 bg-emerald-50"
            : feedback === "error"
              ? "border-rose-400 bg-rose-50"
              : "border-slate-100"
        }`}
      >
        <h3 className="text-2xl font-black text-slate-800 mb-8 text-center">
          {currentQuestion.question}
        </h3>

        {/* Renderizado Dinámico del Ejercicio */}
        <div className="mb-12 flex justify-center w-full">
          {currentQuestion.type === "text" && currentQuestion.payload.audioPitch && (
            <button
              type="button"
              onClick={async () => {
                const Tone = await import("tone");
                await Tone.start();
                await engineRef.current?.prepare();
                engineRef.current?.playSustainedNote(currentQuestion.payload.audioPitch, 1500);
              }}
              className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center hover:bg-sky-100 hover:scale-110 transition-all text-sky-500"
            >
              <Zap className="w-10 h-10" fill="currentColor" />
            </button>
          )}

          {currentQuestion.type === "clef" && (
            <div className="w-full">
              <TrebleClefVisualizer notes={currentQuestion.payload.notes} height={180} />
            </div>
          )}

          {currentQuestion.type === "rhythm_visual" && (
            <div className="scale-150 py-8">
              <RhythmVisualizer figureId={currentQuestion.payload.figureId} />
            </div>
          )}

          {currentQuestion.type === "builder" && (
            <div className="w-full">
              <MeasureBuilder
                targetDuration={currentQuestion.payload.targetDuration}
                availableOptions={currentQuestion.payload.options}
                onSuccess={() => handleAnswer(true)}
              />
            </div>
          )}

          {currentQuestion.type === "audio_compare" && (
            <div className="flex gap-8">
              <button
                type="button"
                onClick={async () => {
                  const Tone = await import("tone");
                  await Tone.start();
                  await engineRef.current?.prepare();
                  engineRef.current?.playSustainedNote(
                    currentQuestion.payload.audioA.pitch,
                    currentQuestion.payload.audioA.durationMs,
                  );
                }}
                className="px-8 py-4 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200"
              >
                Sonido A
              </button>
              <button
                type="button"
                onClick={async () => {
                  const Tone = await import("tone");
                  await Tone.start();
                  await engineRef.current?.prepare();
                  engineRef.current?.playSustainedNote(
                    currentQuestion.payload.audioB.pitch,
                    currentQuestion.payload.audioB.durationMs,
                  );
                }}
                className="px-8 py-4 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200"
              >
                Sonido B
              </button>
            </div>
          )}
        </div>

        {/* Options */}
        {currentQuestion.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((opt, idx) => {
              const _isSelected = feedback !== null && currentQuestion.correctIndex === idx;
              const _isWrong = feedback === "error" && currentQuestion.correctIndex !== idx; // Solo resalta el correcto, pero podemos mejorar

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={feedback !== null}
                  className={`p-6 rounded-2xl font-black text-lg transition-all ${
                    feedback === null
                      ? "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:-translate-y-1 border-2 border-transparent hover:border-slate-200"
                      : currentQuestion.correctIndex === idx
                        ? "bg-emerald-500 text-white border-2 border-emerald-600 scale-105"
                        : "bg-slate-100 text-slate-400 opacity-50 border-2 border-transparent"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
