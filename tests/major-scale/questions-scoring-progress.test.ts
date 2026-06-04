import assert from "node:assert/strict";
import test from "node:test";

import { majorScaleExercises } from "@/data/major-scale";
import {
  applyMajorScaleAttemptToProgress,
  createInitialMajorScaleProgress,
} from "@/lib/major-scale/progress";
import { generateMajorScaleQuestions } from "@/lib/major-scale/questions";
import { pointsForScaleAnswer, scoreScaleAnswers } from "@/lib/major-scale/scoring";
import { getScaleById } from "@/lib/major-scale/theory";
import type { MajorScaleAttempt, ScaleAnswer } from "@/types/major-scale";

test("genera la secuencia de descubrimiento sin repetir la tónica", () => {
  const exercise = majorScaleExercises.find((item) => item.id === "discover-pattern");
  assert.ok(exercise);

  const questions = generateMajorScaleQuestions(exercise);

  assert.equal(questions.length, 1);
  assert.deepEqual(questions[0]?.expectedNotes, ["D4", "E4", "F4", "G4", "A4", "B4", "C5"]);
  assert.deepEqual(questions[0]?.expectedMidiNotes, [62, 64, 65, 67, 69, 71, 72]);
});

test("genera escalas auditivas alterando solo grados internos", () => {
  const exercise = majorScaleExercises.find((item) => item.id === "audio-recognition");
  assert.ok(exercise);

  const alteredQuestions = generateMajorScaleQuestions(exercise).filter(
    (question) => question.isCorrectScale === false,
  );

  assert.ok(alteredQuestions.length > 0);
  alteredQuestions.forEach((question) => {
    const scale = getScaleById(question.scaleId);
    assert.ok(scale);
    assert.equal(question.expectedMidiNotes?.[0], scale.midiNotes[0]);
    assert.equal(question.expectedMidiNotes?.at(-1), scale.midiNotes.at(-1));
  });
});

test("genera 20 rondas para el desafío final", () => {
  const exercise = majorScaleExercises.find((item) => item.id === "scale-builder-final");
  assert.ok(exercise);

  const questions = generateMajorScaleQuestions(exercise);

  assert.equal(questions.length, 20);
  assert.equal(
    questions.every((question) => question.taskType === "final_challenge"),
    true,
  );
});

test("calcula puntaje de escala con ayuda y replay", () => {
  assert.equal(pointsForScaleAnswer({ isCorrect: true, helpUsed: false, replayUsed: false }), 100);
  assert.equal(pointsForScaleAnswer({ isCorrect: true, helpUsed: true, replayUsed: false }), 60);
  assert.equal(pointsForScaleAnswer({ isCorrect: true, helpUsed: false, replayUsed: true }), 75);
  assert.equal(pointsForScaleAnswer({ isCorrect: false, helpUsed: false, replayUsed: false }), 0);

  const answers: ScaleAnswer[] = [
    answer({ questionId: "1", isCorrect: true, points: 100 }),
    answer({ questionId: "2", isCorrect: true, points: 100 }),
    answer({ questionId: "3", isCorrect: false, points: 0 }),
  ];
  const scoring = scoreScaleAnswers(answers, 4);

  assert.equal(scoring.score, 200);
  assert.equal(scoring.accuracy, 0.5);
  assert.equal(scoring.mistakes, 1);
});

test("desbloquea el siguiente ejercicio de escala mayor al aprobar", () => {
  const exercises = majorScaleExercises.slice(0, 2);
  const progress = createInitialMajorScaleProgress("major-scale", exercises);
  const attempt: MajorScaleAttempt = {
    exerciseId: "discover-pattern",
    startedAt: "2026-05-19T00:00:00.000Z",
    finishedAt: "2026-05-19T00:03:00.000Z",
    answers: [],
    score: 700,
    accuracy: 1,
    comboMax: 7,
    mistakes: 0,
    weakestScales: [],
    weakestSteps: [],
    completed: true,
    passed: true,
  };

  const nextProgress = applyMajorScaleAttemptToProgress({ progress, exercises, attempt });

  assert.equal(nextProgress.exercises["discover-pattern"]?.completed, true);
  assert.equal(nextProgress.exercises["play-c-major"]?.unlocked, true);
  assert.equal(nextProgress.currentExerciseId, "play-c-major");
});

function answer({
  questionId,
  isCorrect,
  points,
}: {
  questionId: string;
  isCorrect: boolean;
  points: number;
}): ScaleAnswer {
  return {
    questionId,
    isCorrect,
    expectedAnswer: "DO",
    userAnswer: "DO",
    helpUsed: false,
    replayUsed: false,
    scaleId: "c-major",
    points,
  };
}
