import assert from "node:assert/strict";
import test from "node:test";

import { minorScaleExercises } from "@/data/minor-scale";
import {
  applyMinorScaleAttemptToProgress,
  createInitialMinorScaleProgress,
} from "@/lib/minor-scale/progress";
import { generateMinorScaleQuestions } from "@/lib/minor-scale/questions";
import { pointsForMinorScaleAnswer, scoreMinorScaleAnswers } from "@/lib/minor-scale/scoring";
import type { MinorScaleAnswer, MinorScaleAttempt } from "@/types/minor-scale";

test("genera la secuencia de descubrimiento de LA menor natural sin repetir tónica", () => {
  const exercise = minorScaleExercises.find((item) => item.id === "discover-natural-pattern");
  assert.ok(exercise);

  const questions = generateMinorScaleQuestions(exercise);

  assert.equal(questions.length, 1);
  assert.deepEqual(questions[0]?.expectedNotes, ["B3", "C4", "D4", "E4", "F4", "G4", "A4"]);
  assert.deepEqual(questions[0]?.expectedMidiNotes, [59, 60, 62, 64, 65, 67, 69]);
});

test("genera preguntas de comparación y variantes menores", () => {
  const majorVsMinor = minorScaleExercises.find((item) => item.id === "major-vs-minor");
  const harmonic = minorScaleExercises.find((item) => item.id === "natural-vs-harmonic");
  const melodic = minorScaleExercises.find((item) => item.id === "natural-vs-melodic");
  assert.ok(majorVsMinor);
  assert.ok(harmonic);
  assert.ok(melodic);

  assert.equal(generateMinorScaleQuestions(majorVsMinor).length, majorVsMinor.totalRounds);
  assert.deepEqual(generateMinorScaleQuestions(harmonic)[0]?.highlightedDifferenceIndexes, [6]);
  assert.deepEqual(generateMinorScaleQuestions(melodic)[0]?.highlightedDifferenceIndexes, [5, 6]);
});

test("genera 24 rondas para el desafío final menor", () => {
  const exercise = minorScaleExercises.find((item) => item.id === "minor-builder-final");
  assert.ok(exercise);

  const questions = generateMinorScaleQuestions(exercise);

  assert.equal(questions.length, 24);
  assert.equal(questions.every((question) => question.taskType === "final_challenge"), true);
});

test("calcula puntaje de escalas menores con ayuda y replay", () => {
  assert.equal(pointsForMinorScaleAnswer({ isCorrect: true, helpUsed: false, replayUsed: false }), 100);
  assert.equal(pointsForMinorScaleAnswer({ isCorrect: true, helpUsed: true, replayUsed: false }), 60);
  assert.equal(pointsForMinorScaleAnswer({ isCorrect: true, helpUsed: false, replayUsed: true }), 75);
  assert.equal(pointsForMinorScaleAnswer({ isCorrect: false, helpUsed: false, replayUsed: false }), 0);

  const scoring = scoreMinorScaleAnswers(
    [
      answer({ questionId: "1", isCorrect: true, points: 100 }),
      answer({ questionId: "2", isCorrect: true, points: 100 }),
      answer({ questionId: "3", isCorrect: false, points: 0 }),
    ],
    4,
  );

  assert.equal(scoring.score, 200);
  assert.equal(scoring.accuracy, 0.5);
  assert.equal(scoring.mistakes, 1);
});

test("desbloquea el siguiente ejercicio de escalas menores al aprobar", () => {
  const exercises = minorScaleExercises.slice(0, 2);
  const progress = createInitialMinorScaleProgress("minor-scales", exercises);
  const attempt: MinorScaleAttempt = {
    exerciseId: "major-vs-minor",
    startedAt: "2026-05-19T00:00:00.000Z",
    finishedAt: "2026-05-19T00:03:00.000Z",
    answers: [],
    score: 600,
    accuracy: 1,
    comboMax: 6,
    mistakes: 0,
    weakestScales: [],
    weakestSteps: [],
    weakestScaleTypes: [],
    completed: true,
    passed: true,
  };

  const nextProgress = applyMinorScaleAttemptToProgress({ progress, exercises, attempt });

  assert.equal(nextProgress.exercises["major-vs-minor"]?.completed, true);
  assert.equal(nextProgress.exercises["discover-natural-pattern"]?.unlocked, true);
  assert.equal(nextProgress.currentExerciseId, "discover-natural-pattern");
});

function answer({
  questionId,
  isCorrect,
  points,
}: {
  questionId: string;
  isCorrect: boolean;
  points: number;
}): MinorScaleAnswer {
  return {
    questionId,
    isCorrect,
    expectedAnswer: "LA",
    userAnswer: "LA",
    helpUsed: false,
    replayUsed: false,
    scaleId: "a-minor-natural",
    scaleType: "natural",
    points,
  };
}
