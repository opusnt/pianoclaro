import { ExerciseProgressCard as SharedExerciseProgressCard } from "@/components/modules/shared/ExerciseProgressCard";

import type { IntervalExercise, IntervalExerciseProgress } from "@/types/intervals";

type ExerciseProgressCardProps = {
  exercise: IntervalExercise;
  index: number;
  progress?: IntervalExerciseProgress;
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
        `${exercise.totalRounds} rondas`,
        `Mejor ${Math.round((progress?.bestAccuracy ?? 0) * 100)}%`,
      ]}
      onSelect={onSelect}
    />
  );
}
