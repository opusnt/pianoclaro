"use client";

import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

import type { HarmonicFieldExercise, HarmonicFieldExerciseProgress } from "@/types/harmonic-field";

type ExerciseProgressCardProps = {
  exercise: HarmonicFieldExercise;
  index: number;
  progress?: HarmonicFieldExerciseProgress;
  selected: boolean;
  onSelect: () => void;
};

export function ExerciseProgressCard({ exercise, index, progress, selected, onSelect }: ExerciseProgressCardProps) {
  const locked = !progress?.unlocked;
  const completed = Boolean(progress?.completed);

  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={`focus-ring w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-gold-soft bg-gold-soft/15 shadow-soft"
          : "border-blue-deep/10 bg-white/85 hover:bg-blue-soft/25"
      } ${locked ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 text-blue-deep">
          {locked ? <Lock className="h-5 w-5" /> : completed ? <CheckCircle2 className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-bold uppercase text-muted">Ejercicio {index + 1}</span>
          <span className="mt-1 block text-base font-bold text-blue-deep">{exercise.title}</span>
          <span className="mt-1 block text-sm leading-5 text-muted">{exercise.description}</span>
          {progress?.attempts ? (
            <span className="mt-2 block text-xs font-bold text-blue-deep">
              Mejor precisión: {Math.round(progress.bestAccuracy * 100)}% · intentos {progress.attempts}
            </span>
          ) : null}
        </span>
      </div>
    </button>
  );
}
