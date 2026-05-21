import type { ExerciseAttempt, RhythmExercise, RhythmProgress } from "@/types/rhythm";
import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";

const progressKey = "piano-claro:rhythm-progress:v1";

export function createInitialRhythmProgress(
  moduleId: string,
  exercises: RhythmExercise[],
): RhythmProgress {
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
      }),
    }),
  };
}

export function readRhythmProgress(moduleId: string, exercises: RhythmExercise[]) {
  return readModuleProgress<RhythmProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialRhythmProgress(moduleId, exercises),
  });
}

export function writeRhythmProgress(progress: RhythmProgress) {
  writeModuleProgress({
    storageKey: progressKey,
    progress,
  });
}

export function applyRhythmAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: RhythmProgress;
  exercises: RhythmExercise[];
  attempt: ExerciseAttempt;
}): RhythmProgress {
  const current = progress.exercises[attempt.exerciseId];
  let nextExercises = {
    ...progress.exercises,
    [attempt.exerciseId]: {
      unlocked: true,
      completed: current?.completed || attempt.passed,
      bestScore: Math.max(current?.bestScore ?? 0, attempt.score),
      bestAccuracy: Math.max(current?.bestAccuracy ?? 0, attempt.accuracy),
      attempts: (current?.attempts ?? 0) + 1,
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

  const completed = Boolean(
    attempt.passed && isFinalExercise({ exercises, exerciseId: attempt.exerciseId }),
  );
  const currentExerciseId = getNextAvailableExerciseId({
    exercises,
    exerciseProgress: nextExercises,
    fallbackExerciseId: attempt.exerciseId,
  });

  return {
    ...progress,
    completed: progress.completed || completed,
    currentExerciseId,
    exercises: nextExercises,
  };
}
