import assert from "node:assert/strict";
import test from "node:test";

import { intervalExercises } from "@/data/intervals";
import {
  applyIntervalAttemptToProgress,
  createInitialIntervalProgress,
} from "@/lib/intervals/progress";
import { getWeakestIntervals, scoreIntervalAnswers } from "@/lib/intervals/scoring";
import type { IntervalAnswer, IntervalAttempt } from "@/types/intervals";

test("calcula score, accuracy y combo de intervalos", () => {
  const answers: IntervalAnswer[] = [
    answer({ questionId: "1", isCorrect: true, points: 100, intervalName: "segunda mayor" }),
    answer({ questionId: "2", isCorrect: true, points: 100, intervalName: "tercera menor" }),
    answer({ questionId: "3", isCorrect: true, points: 100, intervalName: "tercera mayor" }),
    answer({ questionId: "4", isCorrect: true, points: 100, intervalName: "cuarta justa" }),
    answer({ questionId: "5", isCorrect: true, points: 100, intervalName: "quinta justa" }),
    answer({ questionId: "6", isCorrect: false, points: 0, intervalName: "octava justa" }),
  ];

  const scoring = scoreIntervalAnswers(answers, 6);

  assert.equal(scoring.score, 510);
  assert.equal(scoring.accuracy, 5 / 6);
  assert.equal(scoring.comboMax, 5);
  assert.equal(scoring.mistakes, 1);
});

test("detecta intervalos débiles por errores repetidos", () => {
  const answers: IntervalAnswer[] = [
    answer({ questionId: "1", isCorrect: false, points: 0, intervalName: "segunda menor" }),
    answer({ questionId: "2", isCorrect: false, points: 0, intervalName: "segunda menor" }),
    answer({ questionId: "3", isCorrect: false, points: 0, intervalName: "octava justa" }),
  ];

  assert.deepEqual(getWeakestIntervals(answers), ["segunda menor"]);
});

test("desbloquea el siguiente ejercicio de intervalos al aprobar", () => {
  const exercises = intervalExercises.slice(0, 2);
  const progress = createInitialIntervalProgress("intervals", exercises);
  const attempt: IntervalAttempt = {
    exerciseId: "semitone-distance",
    startedAt: "2026-05-19T00:00:00.000Z",
    finishedAt: "2026-05-19T00:02:00.000Z",
    answers: [],
    score: 700,
    accuracy: 0.875,
    comboMax: 5,
    mistakes: 1,
    weakestIntervals: [],
    completed: true,
    passed: true,
  };

  const nextProgress = applyIntervalAttemptToProgress({ progress, exercises, attempt });

  assert.equal(nextProgress.exercises["semitone-distance"]?.completed, true);
  assert.equal(nextProgress.exercises["find-interval"]?.unlocked, true);
  assert.equal(nextProgress.currentExerciseId, "find-interval");
});

function answer({
  questionId,
  isCorrect,
  points,
  intervalName,
}: {
  questionId: string;
  isCorrect: boolean;
  points: number;
  intervalName: string;
}): IntervalAnswer {
  return {
    questionId,
    isCorrect,
    expectedAnswer: "esperado",
    userAnswer: "usuario",
    intervalSemitones: 2,
    intervalName,
    points,
    usedHint: false,
  };
}
