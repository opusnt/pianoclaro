import assert from "node:assert/strict";
import test from "node:test";

import { harmonicFieldExercises } from "@/data/harmonic-field";
import {
  applyHarmonicFieldAttemptToProgress,
  createInitialHarmonicFieldProgress,
} from "@/lib/harmonic-field/progress";
import { generateHarmonicFieldQuestions } from "@/lib/harmonic-field/questions";
import {
  buildHarmonicFieldAttempt,
  pointsForHarmonicFieldAnswer,
} from "@/lib/harmonic-field/scoring";
import type { HarmonicFieldAnswer } from "@/types/harmonic-field";

test("genera preguntas para los nueve ejercicios", () => {
  assert.equal(harmonicFieldExercises.length, 9);

  harmonicFieldExercises.forEach((exercise) => {
    const questions = generateHarmonicFieldQuestions(exercise);
    assert.ok(questions.length > 0, `${exercise.id} no generó preguntas`);
    assert.ok(questions.length <= exercise.totalRounds);
  });

  const final = harmonicFieldExercises.at(-1);
  assert.equal(final?.id, "harmonic-field-final");
  assert.equal(generateHarmonicFieldQuestions(final!).length, 28);
});

test("puntúa acordes completos y parciales", () => {
  assert.equal(
    pointsForHarmonicFieldAnswer({ isCorrect: true, helpUsed: false, replayUsed: false }),
    100,
  );
  assert.equal(
    pointsForHarmonicFieldAnswer({ isCorrect: true, helpUsed: true, replayUsed: false }),
    60,
  );
  assert.equal(
    pointsForHarmonicFieldAnswer({
      isCorrect: false,
      helpUsed: false,
      replayUsed: false,
      correctNotesCount: 2,
    }),
    50,
  );
  assert.equal(
    pointsForHarmonicFieldAnswer({
      isCorrect: false,
      helpUsed: false,
      replayUsed: false,
      correctNotesCount: 1,
    }),
    0,
  );
});

test("aplica progreso secuencial y desbloquea el siguiente ejercicio", () => {
  const progress = createInitialHarmonicFieldProgress("harmonic-field", harmonicFieldExercises);
  assert.equal(progress.exercises["scale-to-chords"].unlocked, true);
  assert.equal(progress.exercises["build-c-major-field"].unlocked, false);

  const firstExercise = harmonicFieldExercises[0];
  const answers: HarmonicFieldAnswer[] = [
    {
      questionId: "q1",
      selectedNotes: ["C4", "E4", "G4"],
      isCorrect: true,
      expectedAnswer: ["DO", "MI", "SOL"],
      userAnswer: ["DO", "MI", "SOL"],
      correctNotesCount: 3,
      helpUsed: false,
      replayUsed: false,
      fieldId: "c-major",
      keyId: "C_MAJOR",
      degree: "I",
      chordQuality: "major",
      functionRole: "tonic",
      points: 100,
    },
  ];
  const attempt = buildHarmonicFieldAttempt({
    exercise: { ...firstExercise, totalRounds: 1, requiredAccuracy: 0.75 },
    startedAt: new Date().toISOString(),
    answers,
    totalUnits: 1,
  });
  const next = applyHarmonicFieldAttemptToProgress({
    progress,
    exercises: harmonicFieldExercises,
    attempt,
  });

  assert.equal(next.exercises["scale-to-chords"].completed, true);
  assert.equal(next.exercises["build-c-major-field"].unlocked, true);
});
