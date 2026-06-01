import { ExerciseProgressCard as SharedExerciseProgressCard } from "@/components/modules/shared/ExerciseProgressCard";

import type { MajorScaleExercise, MajorScaleExerciseProgress } from "@/types/major-scale";

type ExerciseProgressCardProps = {
  exercise: MajorScaleExercise;
  index: number;
  progress?: MajorScaleExerciseProgress;
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
  const locked = !progress?.unlocked;
  const completed = Boolean(progress?.completed);

  return (
    <SharedExerciseProgressCard
      index={index}
      title={exercise.title}
      description={exercise.description}
      selected={selected}
      unlocked={!locked}
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
