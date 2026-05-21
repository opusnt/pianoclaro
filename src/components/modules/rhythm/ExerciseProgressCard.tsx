import { ExerciseProgressCard as SharedExerciseProgressCard } from "@/components/modules/shared/ExerciseProgressCard";

import type { RhythmExercise, RhythmExerciseProgress } from "@/types/rhythm";

type ExerciseProgressCardProps = {
  exercise: RhythmExercise;
  index: number;
  progress?: RhythmExerciseProgress;
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
        `${exercise.bpm} BPM`,
        `${exercise.totalBeats} beats`,
        `Mejor ${Math.round((progress?.bestAccuracy ?? 0) * 100)}%`,
      ]}
      onSelect={onSelect}
    />
  );
}
