import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

import type { ChordInversionExercise, ChordInversionExerciseProgress } from "@/types/chord-inversions";

type ExerciseProgressCardProps = {
  exercise: ChordInversionExercise;
  index: number;
  progress?: ChordInversionExerciseProgress;
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
  const completed = progress?.completed ?? false;
  const Icon = completed ? CheckCircle2 : unlocked ? PlayCircle : Lock;

  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onSelect}
      className={`focus-ring w-full rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
        selected
          ? "border-blue-deep bg-blue-deep text-white shadow-soft"
          : completed
            ? "border-emerald-500/30 bg-emerald-50 text-emerald-950"
            : "border-blue-deep/10 bg-white/85 text-blue-deep hover:bg-blue-soft/35"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className={`mt-1 h-5 w-5 shrink-0 ${selected ? "text-gold-soft" : "text-gold-soft"}`} />
        <div>
          <p className="text-xs font-bold uppercase opacity-75">Ejercicio {index + 1}</p>
          <h3 className="mt-1 text-base font-bold">{exercise.title}</h3>
          <p className={`mt-1 text-sm leading-5 ${selected ? "text-white/78" : "text-muted"}`}>{exercise.description}</p>
          {progress?.attempts ? (
            <p className={`mt-2 text-xs font-bold ${selected ? "text-white/80" : "text-blue-deep"}`}>
              Mejor accuracy: {Math.round(progress.bestAccuracy * 100)}% · intentos: {progress.attempts}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

