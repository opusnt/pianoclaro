export type OrderedExercise = {
  id: string;
};

export type SequentialExerciseProgressItem = {
  unlocked: boolean;
  completed: boolean;
};

export type SequentialModuleProgress<TItem extends SequentialExerciseProgressItem> = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  exercises: Record<string, TItem>;
};

export function createSequentialExerciseProgress<TItem extends SequentialExerciseProgressItem>({
  exercises,
  createItem,
}: {
  exercises: OrderedExercise[];
  createItem: (input: { exercise: OrderedExercise; index: number }) => TItem;
}) {
  return Object.fromEntries(
    exercises.map((exercise, index) => [exercise.id, createItem({ exercise, index })]),
  ) as Record<string, TItem>;
}

export function readModuleProgress<TProgress>({
  storageKey,
  moduleId,
  createInitial,
}: {
  storageKey: string;
  moduleId: string;
  createInitial: () => TProgress;
}) {
  if (typeof window === "undefined") {
    return createInitial();
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return createInitial();
  }

  try {
    const allProgress = JSON.parse(raw) as Record<string, TProgress>;
    return allProgress[moduleId] ?? createInitial();
  } catch {
    return createInitial();
  }
}

export function writeModuleProgress<TProgress extends { moduleId: string }>({
  storageKey,
  progress,
}: {
  storageKey: string;
  progress: TProgress;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const raw = window.localStorage.getItem(storageKey);
  const allProgress = raw ? (JSON.parse(raw) as Record<string, TProgress>) : {};
  allProgress[progress.moduleId] = progress;
  window.localStorage.setItem(storageKey, JSON.stringify(allProgress));
}

export function unlockNextSequentialExercise<TItem extends SequentialExerciseProgressItem>({
  exercises,
  exerciseProgress,
  currentExerciseId,
}: {
  exercises: OrderedExercise[];
  exerciseProgress: Record<string, TItem>;
  currentExerciseId: string;
}) {
  const currentIndex = exercises.findIndex((exercise) => exercise.id === currentExerciseId);
  const nextExercise = exercises[currentIndex + 1];

  if (!nextExercise) {
    return exerciseProgress;
  }

  return {
    ...exerciseProgress,
    [nextExercise.id]: {
      ...exerciseProgress[nextExercise.id],
      unlocked: true,
    },
  };
}

export function getNextAvailableExerciseId<TItem extends SequentialExerciseProgressItem>({
  exercises,
  exerciseProgress,
  fallbackExerciseId,
}: {
  exercises: OrderedExercise[];
  exerciseProgress: Record<string, TItem>;
  fallbackExerciseId: string;
}) {
  return (
    exercises.find(
      (exercise) =>
        exerciseProgress[exercise.id]?.unlocked && !exerciseProgress[exercise.id]?.completed,
    )?.id ??
    exercises.at(-1)?.id ??
    fallbackExerciseId
  );
}

export function isFinalExercise({
  exercises,
  exerciseId,
}: {
  exercises: OrderedExercise[];
  exerciseId: string;
}) {
  return exerciseId === exercises.at(-1)?.id;
}
