import assert from "node:assert/strict";
import test from "node:test";

import {
  createSequentialExerciseProgress,
  getNextAvailableExerciseId,
  isFinalExercise,
  unlockNextSequentialExercise,
} from "@/lib/modules/sequential-progress";

const exercises = [{ id: "one" }, { id: "two" }, { id: "three" }];

test("crea progreso secuencial con solo el primer ejercicio desbloqueado", () => {
  const progress = createSequentialExerciseProgress({
    exercises,
    createItem: ({ index }) => ({
      unlocked: index === 0,
      completed: false,
      attempts: 0,
    }),
  });

  assert.equal(progress.one?.unlocked, true);
  assert.equal(progress.two?.unlocked, false);
  assert.equal(progress.three?.unlocked, false);
});

test("desbloquea el siguiente ejercicio y resuelve el próximo disponible", () => {
  const progress = createSequentialExerciseProgress({
    exercises,
    createItem: ({ index }) => ({
      unlocked: index === 0,
      completed: index === 0,
    }),
  });
  const unlocked = unlockNextSequentialExercise({
    exercises,
    exerciseProgress: progress,
    currentExerciseId: "one",
  });

  assert.equal(unlocked.two?.unlocked, true);
  assert.equal(
    getNextAvailableExerciseId({
      exercises,
      exerciseProgress: unlocked,
      fallbackExerciseId: "one",
    }),
    "two",
  );
});

test("detecta el ejercicio final", () => {
  assert.equal(isFinalExercise({ exercises, exerciseId: "two" }), false);
  assert.equal(isFinalExercise({ exercises, exerciseId: "three" }), true);
});
