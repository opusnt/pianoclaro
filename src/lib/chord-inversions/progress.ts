import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type {
  ChordInversionAttempt,
  ChordInversionExercise,
  ChordInversionProgress,
} from "@/types/chord-inversions";

const progressKey = "piano-claro:chord-inversion-progress:v1";

export function createInitialChordInversionProgress(
  moduleId: string,
  exercises: ChordInversionExercise[],
): ChordInversionProgress {
  return {
    moduleId,
    completed: false,
    currentExerciseId: exercises[0]?.id ?? "",
    totalAccuracy: 0,
    bassMistakes: 0,
    masteredInversions: [],
    needsReview: [],
    exercises: createSequentialExerciseProgress({
      exercises,
      createItem: ({ index }) => ({
        unlocked: index === 0,
        completed: false,
        bestScore: 0,
        bestAccuracy: 0,
        attempts: 0,
        weakestChords: [],
        weakestInversions: [],
        bassMistakes: 0,
        helpUsedCount: 0,
        replayUsedCount: 0,
      }),
    }),
  };
}

export function readChordInversionProgress(moduleId: string, exercises: ChordInversionExercise[]) {
  return readModuleProgress<ChordInversionProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialChordInversionProgress(moduleId, exercises),
  });
}

export function writeChordInversionProgress(progress: ChordInversionProgress) {
  writeModuleProgress({ storageKey: progressKey, progress });
}

export function applyChordInversionAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: ChordInversionProgress;
  exercises: ChordInversionExercise[];
  attempt: ChordInversionAttempt;
}): ChordInversionProgress {
  const current = progress.exercises[attempt.exerciseId];
  let nextExercises = {
    ...progress.exercises,
    [attempt.exerciseId]: {
      unlocked: true,
      completed: current?.completed || attempt.passed,
      bestScore: Math.max(current?.bestScore ?? 0, attempt.score),
      bestAccuracy: Math.max(current?.bestAccuracy ?? 0, attempt.accuracy),
      attempts: (current?.attempts ?? 0) + 1,
      weakestChords: attempt.weakestChords,
      weakestInversions: attempt.weakestInversions,
      bassMistakes: (current?.bassMistakes ?? 0) + attempt.bassMistakes,
      helpUsedCount:
        (current?.helpUsedCount ?? 0) + attempt.answers.filter((answer) => answer.helpUsed).length,
      replayUsedCount:
        (current?.replayUsedCount ?? 0) +
        attempt.answers.filter((answer) => answer.replayUsed).length,
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
      ? completedExercises.reduce((total, exercise) => total + exercise.bestAccuracy, 0) /
        completedExercises.length
      : 0;
  const needsReview = Array.from(
    new Set(Object.values(nextExercises).flatMap((exercise) => exercise.weakestChords)),
  );
  const weakestInversions = Object.values(nextExercises).flatMap(
    (exercise) => exercise.weakestInversions,
  );
  const bassMistakes = Object.values(nextExercises).reduce(
    (total, exercise) => total + exercise.bassMistakes,
    0,
  );

  return {
    ...progress,
    completed:
      progress.completed ||
      Boolean(attempt.passed && isFinalExercise({ exercises, exerciseId: attempt.exerciseId })),
    currentExerciseId: getNextAvailableExerciseId({
      exercises,
      exerciseProgress: nextExercises,
      fallbackExerciseId: attempt.exerciseId,
    }),
    totalAccuracy,
    weakestChord: needsReview[0],
    weakestInversion: weakestInversions[0],
    bassMistakes,
    needsReview,
    masteredInversions: completedExercises
      .map((exercise) => exercise.lastAttempt?.exerciseId)
      .filter(Boolean) as string[],
    exercises: nextExercises,
  };
}
