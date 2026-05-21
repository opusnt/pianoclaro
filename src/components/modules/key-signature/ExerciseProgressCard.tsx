import { ExerciseProgressCard as SharedExerciseProgressCard } from "@/components/modules/shared/ExerciseProgressCard";
import type { KeySignatureExercise, KeySignatureExerciseProgress } from "@/types/key-signature";

type ExerciseProgressCardProps = {
  exercise: KeySignatureExercise;
  index: number;
  progress?: KeySignatureExerciseProgress;
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

  return (
    <SharedExerciseProgressCard
      index={index}
      title={exercise.title}
      description={exercise.description}
      selected={selected}
      unlocked={unlocked}
      completed={completed}
      meta={[
        `${exercise.totalRounds} unidades`,
        `Mejor ${Math.round((progress?.bestAccuracy ?? 0) * 100)}%`,
        ...(progress?.attempts ? [`${progress.attempts} intentos`] : []),
      ]}
      onSelect={onSelect}
    />
  );
}
