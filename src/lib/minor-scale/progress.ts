import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type {
  MinorScaleAttempt,
  MinorScaleExercise,
  MinorScaleProgress,
} from "@/types/minor-scale";

const progressKey = "piano-claro:minor-scale-progress:v1";

export function createInitialMinorScaleProgress(
  moduleId: string,
  exercises: MinorScaleExercise[],
): MinorScaleProgress {
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
        weakestSteps: [],
        weakestScaleTypes: [],
        helpUsedCount: 0,
        replayUsedCount: 0,
      }),
    }),
  };
}

export function readMinorScaleProgress(moduleId: string, exercises: MinorScaleExercise[]) {
  return readModuleProgress<MinorScaleProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialMinorScaleProgress(moduleId, exercises),
  });
}

export function writeMinorScaleProgress(progress: MinorScaleProgress) {
  writeModuleProgress({ storageKey: progressKey, progress });
}

export function applyMinorScaleAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: MinorScaleProgress;
  exercises: MinorScaleExercise[];
  attempt: MinorScaleAttempt;
}): MinorScaleProgress {
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
      weakestSteps: attempt.weakestSteps,
      weakestScaleTypes: attempt.weakestScaleTypes,
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
    strongestScale: attempt.passed && attempt.weakestScales.length === 0 ? "última escala aprobada" : progress.strongestScale,
    masteredScales: progress.masteredScales,
    needsReview,
    exercises: nextExercises,
  };
}
