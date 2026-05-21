import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type {
  KeySignatureAttempt,
  KeySignatureExercise,
  KeySignatureProgress,
} from "@/types/key-signature";

const progressKey = "piano-claro:key-signature-progress:v1";

export function createInitialKeySignatureProgress(
  moduleId: string,
  exercises: KeySignatureExercise[],
): KeySignatureProgress {
  return {
    moduleId,
    completed: false,
    currentExerciseId: exercises[0]?.id ?? "",
    totalAccuracy: 0,
    masteredKeys: [],
    needsReview: [],
    exercises: createSequentialExerciseProgress({
      exercises,
      createItem: ({ index }) => ({
        unlocked: index === 0,
        completed: false,
        bestScore: 0,
        bestAccuracy: 0,
        attempts: 0,
        weakestKeys: [],
        weakestAccidentals: [],
        weakestRelativePairs: [],
        helpUsedCount: 0,
        replayUsedCount: 0,
      }),
    }),
  };
}

export function readKeySignatureProgress(moduleId: string, exercises: KeySignatureExercise[]) {
  return readModuleProgress<KeySignatureProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialKeySignatureProgress(moduleId, exercises),
  });
}

export function writeKeySignatureProgress(progress: KeySignatureProgress) {
  writeModuleProgress({ storageKey: progressKey, progress });
}

export function applyKeySignatureAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: KeySignatureProgress;
  exercises: KeySignatureExercise[];
  attempt: KeySignatureAttempt;
}): KeySignatureProgress {
  const current = progress.exercises[attempt.exerciseId];
  let nextExercises = {
    ...progress.exercises,
    [attempt.exerciseId]: {
      unlocked: true,
      completed: current?.completed || attempt.passed,
      bestScore: Math.max(current?.bestScore ?? 0, attempt.score),
      bestAccuracy: Math.max(current?.bestAccuracy ?? 0, attempt.accuracy),
      attempts: (current?.attempts ?? 0) + 1,
      weakestKeys: attempt.weakestKeys,
      weakestAccidentals: attempt.weakestAccidentals,
      weakestRelativePairs: attempt.weakestRelativePairs,
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
  const needsReview = Array.from(new Set(Object.values(nextExercises).flatMap((exercise) => exercise.weakestKeys)));

  return {
    ...progress,
    completed: progress.completed || moduleCompleted,
    currentExerciseId,
    totalAccuracy,
    weakestKey: needsReview[0],
    masteredKeys: progress.masteredKeys,
    needsReview,
    exercises: nextExercises,
  };
}
