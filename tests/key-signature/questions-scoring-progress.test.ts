import assert from "node:assert/strict";
import test from "node:test";

import { keySignatureExercises } from "@/data/key-signatures";
import {
  applyKeySignatureAttemptToProgress,
  createInitialKeySignatureProgress,
} from "@/lib/key-signature/progress";
import { generateKeySignatureQuestions } from "@/lib/key-signature/questions";
import { pointsForKeySignatureAnswer, scoreKeySignatureAnswers } from "@/lib/key-signature/scoring";
import type { KeySignatureAnswer, KeySignatureAttempt } from "@/types/key-signature";

test("genera preguntas para armadura como regla global", () => {
  const exercise = keySignatureExercises.find((item) => item.id === "global-accidental-rule");
  assert.ok(exercise);

  const questions = generateKeySignatureQuestions(exercise);

  assert.equal(questions.length, 6);
  assert.equal(
    questions.every((question) => question.keyId === "g-major"),
    true,
  );
  assert.equal(
    questions.every((question) => question.selectedNoteTargetMidi === 66),
    true,
  );
});

test("genera desafío final de 24 rondas mixtas", () => {
  const exercise = keySignatureExercises.find((item) => item.id === "key-map-final");
  assert.ok(exercise);

  const questions = generateKeySignatureQuestions(exercise);

  assert.equal(questions.length, 24);
  assert.equal(
    questions.every((question) => question.taskType === "final_challenge"),
    true,
  );
});

test("calcula puntaje de armaduras con ayuda y replay", () => {
  assert.equal(
    pointsForKeySignatureAnswer({ isCorrect: true, helpUsed: false, replayUsed: false }),
    100,
  );
  assert.equal(
    pointsForKeySignatureAnswer({ isCorrect: true, helpUsed: true, replayUsed: false }),
    60,
  );
  assert.equal(
    pointsForKeySignatureAnswer({ isCorrect: true, helpUsed: false, replayUsed: true }),
    75,
  );
  assert.equal(
    pointsForKeySignatureAnswer({ isCorrect: false, helpUsed: false, replayUsed: false }),
    0,
  );

  const answers: KeySignatureAnswer[] = [
    answer({ questionId: "1", keyId: "g-major", isCorrect: true, points: 100 }),
    answer({ questionId: "2", keyId: "g-major", isCorrect: true, points: 100 }),
    answer({ questionId: "3", keyId: "d-major", isCorrect: false, points: 0 }),
  ];
  const scoring = scoreKeySignatureAnswers(answers, 4);

  assert.equal(scoring.score, 200);
  assert.equal(scoring.accuracy, 0.5);
  assert.equal(scoring.mistakes, 1);
});

test("desbloquea el siguiente ejercicio de armaduras al aprobar", () => {
  const exercises = keySignatureExercises.slice(0, 2);
  const progress = createInitialKeySignatureProgress("key-signatures", exercises);
  const attempt: KeySignatureAttempt = {
    exerciseId: "find-tonic-home",
    startedAt: "2026-05-19T00:00:00.000Z",
    finishedAt: "2026-05-19T00:03:00.000Z",
    answers: [],
    score: 600,
    accuracy: 1,
    comboMax: 6,
    mistakes: 0,
    weakestKeys: [],
    weakestAccidentals: [],
    weakestRelativePairs: [],
    completed: true,
    passed: true,
  };

  const nextProgress = applyKeySignatureAttemptToProgress({ progress, exercises, attempt });

  assert.equal(nextProgress.exercises["find-tonic-home"]?.completed, true);
  assert.equal(nextProgress.exercises["global-accidental-rule"]?.unlocked, true);
  assert.equal(nextProgress.currentExerciseId, "global-accidental-rule");
});

function answer({
  questionId,
  keyId,
  isCorrect,
  points,
}: {
  questionId: string;
  keyId: string;
  isCorrect: boolean;
  points: number;
}): KeySignatureAnswer {
  return {
    questionId,
    isCorrect,
    expectedAnswer: "FA#",
    userAnswer: "FA#",
    helpUsed: false,
    replayUsed: false,
    keyId,
    points,
  };
}
