import assert from "node:assert/strict";
import test from "node:test";

import { pentatonicExercises } from "@/data/pentatonic";
import {
  applyPentatonicAttemptToProgress,
  createInitialPentatonicProgress,
} from "@/lib/pentatonic/progress";
import { generatePentatonicQuestions } from "@/lib/pentatonic/questions";
import {
  pointsForImprovisation,
  pointsForPentatonicAnswer,
  scorePentatonicAnswers,
} from "@/lib/pentatonic/scoring";
import type { PentatonicAnswer, PentatonicAttempt } from "@/types/pentatonic";

test("genera secuencia de descubrimiento con cinco notas principales", () => {
  const exercise = pentatonicExercises.find((item) => item.id === "discover-five-notes");
  assert.ok(exercise);

  const questions = generatePentatonicQuestions(exercise);

  assert.equal(questions.length, 1);
  assert.deepEqual(questions[0]?.expectedNotes, ["C4", "D4", "E4", "G4", "A4"]);
  assert.deepEqual(questions[0]?.expectedMidiNotes, [60, 62, 64, 67, 69]);
});

test("genera pregunta de improvisación guiada", () => {
  const exercise = pentatonicExercises.find((item) => item.id === "guided-improvisation");
  assert.ok(exercise);

  const questions = generatePentatonicQuestions(exercise);

  assert.equal(questions.length, 1);
  assert.equal(questions[0]?.mode, "improvisation");
  assert.equal(questions[0]?.scaleId, "c-major-pentatonic");
});

test("calcula puntaje pentatónico e improvisación", () => {
  assert.equal(
    pointsForPentatonicAnswer({ isCorrect: true, helpUsed: false, replayUsed: false }),
    100,
  );
  assert.equal(
    pointsForPentatonicAnswer({ isCorrect: true, helpUsed: true, replayUsed: false }),
    60,
  );
  assert.equal(
    pointsForPentatonicAnswer({ isCorrect: true, helpUsed: false, replayUsed: true }),
    75,
  );
  assert.equal(
    pointsForImprovisation({ notesPlayed: 12, uniqueNotesUsed: 3, outsideNotes: 0 }),
    600,
  );

  const answers: PentatonicAnswer[] = [
    answer({ questionId: "1", scaleId: "c-major-pentatonic", isCorrect: true, points: 100 }),
    answer({ questionId: "2", scaleId: "c-major-pentatonic", isCorrect: false, points: 0 }),
  ];
  const scoring = scorePentatonicAnswers(answers, 3);

  assert.equal(scoring.score, 100);
  assert.equal(scoring.accuracy, 1 / 3);
  assert.equal(scoring.mistakes, 1);
});

test("desbloquea el siguiente ejercicio pentatónico al aprobar", () => {
  const exercises = pentatonicExercises.slice(0, 2);
  const progress = createInitialPentatonicProgress("pentatonic-scale", exercises);
  const attempt: PentatonicAttempt = {
    exerciseId: "discover-five-notes",
    startedAt: "2026-05-19T00:00:00.000Z",
    finishedAt: "2026-05-19T00:03:00.000Z",
    answers: [],
    score: 500,
    accuracy: 1,
    comboMax: 5,
    mistakes: 0,
    weakestScales: [],
    completed: true,
    passed: true,
  };

  const nextProgress = applyPentatonicAttemptToProgress({ progress, exercises, attempt });

  assert.equal(nextProgress.exercises["discover-five-notes"]?.completed, true);
  assert.equal(nextProgress.exercises["play-c-major-pentatonic"]?.unlocked, true);
  assert.equal(nextProgress.currentExerciseId, "play-c-major-pentatonic");
});

function answer({
  questionId,
  scaleId,
  isCorrect,
  points,
}: {
  questionId: string;
  scaleId: string;
  isCorrect: boolean;
  points: number;
}): PentatonicAnswer {
  return {
    questionId,
    isCorrect,
    expectedAnswer: "DO",
    userAnswer: "DO",
    helpUsed: false,
    replayUsed: false,
    scaleId,
    pentatonicType: "major",
    points,
  };
}
