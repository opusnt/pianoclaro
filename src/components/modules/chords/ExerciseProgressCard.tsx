import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

import type { ChordExercise, ChordExerciseProgress } from "@/types/chords";

type ExerciseProgressCardProps = {
  exercise: ChordExercise;
  index: number;
  progress?: ChordExerciseProgress;
  selected: boolean;
  onSelect: () => void;
};

export function ExerciseProgressCard({
  exercise,
  index,
  progress,
  selected,
  onSelect,
}: ExerciseProgressCardProps) {
  const unlocked = progress?.unlocked ?? index === 0;
  const completed = Boolean(progress?.completed);
  const Icon = completed ? CheckCircle2 : unlocked ? PlayCircle : Lock;

  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onSelect}
      className={`focus-ring w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-blue-deep bg-blue-deep text-white shadow-soft"
          : completed
            ? "border-emerald-500/30 bg-emerald-50 text-blue-deep"
            : unlocked
              ? "border-blue-deep/10 bg-white text-blue-deep hover:bg-blue-soft/35"
              : "border-blue-deep/5 bg-slate-50 text-muted opacity-70"
      }`}
    >
      <p className="flex items-center justify-between gap-3 text-xs font-bold uppercase">
        Ejercicio {index + 1}
        <Icon aria-hidden="true" className={selected ? "h-5 w-5 text-gold-soft" : "h-5 w-5"} />
      </p>
      <h3 className="mt-2 text-lg font-bold">{exercise.title}</h3>
      <p className={`mt-2 text-sm leading-6 ${selected ? "text-white/80" : "text-muted"}`}>
        {exercise.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
        <span
          className={`rounded-full px-3 py-1 ${selected ? "bg-white/15" : "bg-cream text-blue-deep"}`}
        >
          {exercise.totalRounds} unidades
        </span>
        <span
          className={`rounded-full px-3 py-1 ${selected ? "bg-white/15" : "bg-blue-soft/40 text-blue-deep"}`}
        >
          Mejor {Math.round((progress?.bestAccuracy ?? 0) * 100)}%
        </span>
      </div>
    </button>
  );
}
