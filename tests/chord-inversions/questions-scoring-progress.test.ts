import assert from "node:assert/strict";
import test from "node:test";

import { chordInversionExercises, CHORD_INVERSION_MODULE_ID } from "@/data/chord-inversions";
import { createInitialChordInversionProgress, applyChordInversionAttemptToProgress } from "@/lib/chord-inversions/progress";
import { generateChordInversionQuestions } from "@/lib/chord-inversions/questions";
import { buildChordInversionAttempt, pointsForChordInversionAnswer } from "@/lib/chord-inversions/scoring";
import type { ChordInversionAnswer } from "@/types/chord-inversions";

test("genera preguntas jugables para inversiones de acordes", () => {
  const first = chordInversionExercises[0];
  const questions = generateChordInversionQuestions(first);

  assert.equal(questions.length, first.totalRounds);
  assert.equal(questions[0]?.answerOptions?.includes("Sí"), true);
});

test("genera desafío final de 24 rondas mixtas", () => {
  const final = chordInversionExercises.at(-1);
  assert.ok(final);
  const questions = generateChordInversionQuestions(final);

  assert.equal(questions.length, 24);
  assert.equal(questions.some((question) => question.mode === "progression"), true);
  assert.equal(questions.some((question) => Boolean(question.answerOptions)), true);
});

test("puntúa parcialmente notas correctas con bajo incorrecto", () => {
  assert.equal(
    pointsForChordInversionAnswer({
      isCorrect: false,
      helpUsed: false,
      replayUsed: false,
      hasCorrectNotes: true,
      hasCorrectBass: false,
      correctNotesCount: 3,
    }),
    50,
  );

  assert.equal(
    pointsForChordInversionAnswer({
      isCorrect: false,
      helpUsed: false,
      replayUsed: false,
      hasCorrectNotes: false,
      hasCorrectBass: false,
      correctNotesCount: 1,
    }),
    25,
  );
});

test("desbloquea el siguiente ejercicio al aprobar", () => {
  const exercise = chordInversionExercises[0];
  const answer: ChordInversionAnswer = {
    questionId: "q1",
    selectedOption: "Sí",
    isCorrect: true,
    hasCorrectNotes: true,
    hasCorrectBass: true,
    expectedAnswer: "Sí",
    userAnswer: "Sí",
    helpUsed: false,
    replayUsed: false,
    inversionId: "c-major-root",
    chordId: "c-major",
    inversionType: "root_position",
    points: 100,
  };
  const attempt = buildChordInversionAttempt({
    exercise,
    startedAt: "2026-01-01T00:00:00.000Z",
    answers: Array.from({ length: exercise.totalRounds }, (_, index) => ({ ...answer, questionId: `q${index}` })),
    totalUnits: exercise.totalRounds,
  });
  const progress = createInitialChordInversionProgress(CHORD_INVERSION_MODULE_ID, chordInversionExercises);
  const next = applyChordInversionAttemptToProgress({ progress, exercises: chordInversionExercises, attempt });

  assert.equal(attempt.passed, true);
  assert.equal(next.exercises["build-first-inversion"]?.unlocked, true);
});

