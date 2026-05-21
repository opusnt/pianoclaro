import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type {
  HarmonicFieldAttempt,
  HarmonicFieldExercise,
  HarmonicFieldProgress,
} from "@/types/harmonic-field";

const progressKey = "piano-claro:harmonic-field-progress:v1";

export function createInitialHarmonicFieldProgress(
  moduleId: string,
  exercises: HarmonicFieldExercise[],
): HarmonicFieldProgress {
  return {
    moduleId,
    completed: false,
    currentExerciseId: exercises[0]?.id ?? "",
    totalAccuracy: 0,
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
        weakestDegrees: [],
        weakestChordQualities: [],
        weakestProgressions: [],
        helpUsedCount: 0,
        replayUsedCount: 0,
      }),
    }),
  };
}

export function readHarmonicFieldProgress(moduleId: string, exercises: HarmonicFieldExercise[]) {
  return readModuleProgress<HarmonicFieldProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialHarmonicFieldProgress(moduleId, exercises),
  });
}

export function writeHarmonicFieldProgress(progress: HarmonicFieldProgress) {
  writeModuleProgress({ storageKey: progressKey, progress });
}

export function applyHarmonicFieldAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: HarmonicFieldProgress;
  exercises: HarmonicFieldExercise[];
  attempt: HarmonicFieldAttempt;
}): HarmonicFieldProgress {
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
      weakestDegrees: attempt.weakestDegrees,
      weakestChordQualities: attempt.weakestChordQualities,
      weakestProgressions: attempt.weakestProgressions,
      helpUsedCount: (current?.helpUsedCount ?? 0) + attempt.answers.filter((answer) => answer.helpUsed).length,
      replayUsedCount: (current?.replayUsedCount ?? 0) + attempt.answers.filter((answer) => answer.replayUsed).length,
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

  const completedExercises = Object.values(nextExercises).filter((exercise) => exercise.completed);
  const totalAccuracy =
    completedExercises.length > 0
      ? completedExercises.reduce((total, exercise) => total + exercise.bestAccuracy, 0) / completedExercises.length
      : 0;
  const weakestKeys = Object.values(nextExercises).flatMap((exercise) => exercise.weakestKeys);
  const weakestDegrees = Object.values(nextExercises).flatMap((exercise) => exercise.weakestDegrees);
  const weakestChordQualities = Object.values(nextExercises).flatMap((exercise) => exercise.weakestChordQualities);

  return {
    ...progress,
    completed:
      progress.completed || Boolean(attempt.passed && isFinalExercise({ exercises, exerciseId: attempt.exerciseId })),
    currentExerciseId: getNextAvailableExerciseId({
      exercises,
      exerciseProgress: nextExercises,
      fallbackExerciseId: attempt.exerciseId,
    }),
    totalAccuracy,
    weakestKey: weakestKeys[0],
    weakestDegree: weakestDegrees[0],
    weakestChordQuality: weakestChordQualities[0],
    needsReview: Array.from(new Set([...weakestKeys, ...weakestDegrees, ...weakestChordQualities])),
    exercises: nextExercises,
  };
}
