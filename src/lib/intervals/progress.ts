import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type { IntervalAttempt, IntervalExercise, IntervalProgress } from "@/types/intervals";

const progressKey = "piano-claro:interval-progress:v1";

export function createInitialIntervalProgress(
  moduleId: string,
  exercises: IntervalExercise[],
): IntervalProgress {
  return {
    moduleId,
    completed: false,
    currentExerciseId: exercises[0]?.id ?? "",
    exercises: createSequentialExerciseProgress({
      exercises,
      createItem: ({ index }) => ({
        unlocked: index === 0,
        completed: false,
        bestScore: 0,
        bestAccuracy: 0,
        attempts: 0,
        weakestIntervals: [],
      }),
    }),
  };
}

export function readIntervalProgress(moduleId: string, exercises: IntervalExercise[]) {
  return readModuleProgress<IntervalProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialIntervalProgress(moduleId, exercises),
  });
}

export function writeIntervalProgress(progress: IntervalProgress) {
  writeModuleProgress({
    storageKey: progressKey,
    progress,
  });
}

export function applyIntervalAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: IntervalProgress;
  exercises: IntervalExercise[];
  attempt: IntervalAttempt;
}): IntervalProgress {
  const current = progress.exercises[attempt.exerciseId];
  let nextExercises = {
    ...progress.exercises,
    [attempt.exerciseId]: {
      unlocked: true,
      completed: current?.completed || attempt.passed,
      bestScore: Math.max(current?.bestScore ?? 0, attempt.score),
      bestAccuracy: Math.max(current?.bestAccuracy ?? 0, attempt.accuracy),
      attempts: (current?.attempts ?? 0) + 1,
      weakestIntervals: attempt.weakestIntervals,
      lastAttempt: attempt,
    },
  };

  if (attempt.passed) {
    nextExercises = unlockNextSequentialExercise({
      exercises,
      exerciseProgress: nextExercises,
      currentExerciseId: attempt.exerciseId,
    });
  }

  const moduleCompleted = Boolean(
    attempt.passed && isFinalExercise({ exercises, exerciseId: attempt.exerciseId }),
  );
  const currentExerciseId = getNextAvailableExerciseId({
    exercises,
    exerciseProgress: nextExercises,
    fallbackExerciseId: attempt.exerciseId,
  });

  return {
    ...progress,
    completed: progress.completed || moduleCompleted,
    currentExerciseId,
    exercises: nextExercises,
  };
}
