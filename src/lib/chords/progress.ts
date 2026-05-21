import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  readModuleProgress,
  unlockNextSequentialExercise,
  writeModuleProgress,
} from "@/lib/modules/sequential-progress";
import type { ChordAttempt, ChordExercise, ChordProgress } from "@/types/chords";

const progressKey = "piano-claro:chord-progress:v1";

export function createInitialChordProgress(moduleId: string, exercises: ChordExercise[]): ChordProgress {
  return {
    moduleId,
    completed: false,
    currentExerciseId: exercises[0]?.id ?? "",
    totalAccuracy: 0,
    masteredChords: [],
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
        weakestQualities: [],
        helpUsedCount: 0,
        replayUsedCount: 0,
      }),
    }),
  };
}

export function readChordProgress(moduleId: string, exercises: ChordExercise[]) {
  return readModuleProgress<ChordProgress>({
    storageKey: progressKey,
    moduleId,
    createInitial: () => createInitialChordProgress(moduleId, exercises),
  });
}

export function writeChordProgress(progress: ChordProgress) {
  writeModuleProgress({ storageKey: progressKey, progress });
}

export function applyChordAttemptToProgress({
  progress,
  exercises,
  attempt,
}: {
  progress: ChordProgress;
  exercises: ChordExercise[];
  attempt: ChordAttempt;
}): ChordProgress {
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
      weakestQualities: attempt.weakestQualities,
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
  const needsReview = Array.from(new Set(Object.values(nextExercises).flatMap((exercise) => exercise.weakestChords)));
  const weakestQualities = Object.values(nextExercises).flatMap((exercise) => exercise.weakestQualities);

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
    weakestChord: needsReview[0],
    weakestQuality: weakestQualities[0],
    needsReview,
    exercises: nextExercises,
  };
}
