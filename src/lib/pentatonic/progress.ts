import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type {
  PentatonicAttempt,
  PentatonicExercise,
  PentatonicProgress,
} from "@/types/pentatonic";

const progressKey = "piano-claro:pentatonic-progress:v1";

export function createInitialPentatonicProgress(
  moduleId: string,
  exercises: PentatonicExercise[],
): PentatonicProgress {
  return {
    moduleId,
    completed: false,
    currentExerciseId: exercises[0]?.id ?? "",
    totalAccuracy: 0,
    masteredScales: [],
    needsReview: [],
    exercises: createSequentialExerciseProgress({
      exercises,
      createItem: ({ index }) => ({
        unlocked: index === 0,
        completed: false,
        bestScore: 0,
        bestAccuracy: 0,
        attempts: 0,
        weakestScales: [],
        helpUsedCount: 0,
        replayUsedCount: 0,
      }),
    }),
  };
}

export function readPentatonicProgress(moduleId: string, exercises: PentatonicExercise[]) {
  return readModuleProgress<PentatonicProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialPentatonicProgress(moduleId, exercises),
  });
}

export function writePentatonicProgress(progress: PentatonicProgress) {
  writeModuleProgress({ storageKey: progressKey, progress });
}

export function applyPentatonicAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: PentatonicProgress;
  exercises: PentatonicExercise[];
  attempt: PentatonicAttempt;
}): PentatonicProgress {
  const current = progress.exercises[attempt.exerciseId];
  let nextExercises = {
    ...progress.exercises,
    [attempt.exerciseId]: {
      unlocked: true,
      completed: current?.completed || attempt.passed,
      bestScore: Math.max(current?.bestScore ?? 0, attempt.score),
      bestAccuracy: Math.max(current?.bestAccuracy ?? 0, attempt.accuracy),
      attempts: (current?.attempts ?? 0) + 1,
      weakestScales: attempt.weakestScales,
      helpUsedCount: (current?.helpUsedCount ?? 0) + attempt.answers.filter((answer) => answer.helpUsed).length,
      replayUsedCount:
        (current?.replayUsedCount ?? 0) + attempt.answers.filter((answer) => answer.replayUsed).length,
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
  const completedExercises = Object.values(nextExercises).filter((exercise) => exercise.completed);
  const totalAccuracy =
    completedExercises.length > 0
      ? completedExercises.reduce((total, exercise) => total + exercise.bestAccuracy, 0) /
        completedExercises.length
      : 0;
  const needsReview = Array.from(new Set(Object.values(nextExercises).flatMap((exercise) => exercise.weakestScales)));

  return {
    ...progress,
    completed: progress.completed || moduleCompleted,
    currentExerciseId,
    totalAccuracy,
    weakestScale: needsReview[0],
    masteredScales: progress.masteredScales,
    needsReview,
    exercises: nextExercises,
  };
}
