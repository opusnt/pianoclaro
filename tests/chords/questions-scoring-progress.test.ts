import test from "node:test";
import assert from "node:assert/strict";

import { chordExercises, CHORD_MODULE_ID } from "@/data/chords";
import { createInitialChordProgress, applyChordAttemptToProgress } from "@/lib/chords/progress";
import { generateChordQuestions } from "@/lib/chords/questions";
import { buildChordAttempt, scoreChordAnswers } from "@/lib/chords/scoring";
import type { ChordAnswer } from "@/types/chords";

test("genera preguntas jugables para construcción de acordes", () => {
  const buildMajor = chordExercises.find((exercise) => exercise.id === "build-major-chords");
  assert.ok(buildMajor);

  const questions = generateChordQuestions(buildMajor);
  assert.equal(questions.length, 4);
  assert.deepEqual(questions[0].expectedNotes?.map((note) => note.replace(/\d/g, "")), ["C", "E", "G"]);
});

test("genera desafío final de 24 rondas mixtas", () => {
  const finalExercise = chordExercises.find((exercise) => exercise.type === "final_challenge");
  assert.ok(finalExercise);
  const questions = generateChordQuestions(finalExercise);

  assert.equal(questions.length, 24);
  assert.ok(questions.some((question) => question.answerOptions));
  assert.ok(questions.some((question) => question.expectedNotes));
});

test("calcula puntaje parcial para acordes con dos notas correctas", () => {
  const answers: ChordAnswer[] = [
    {
      questionId: "q1",
      selectedNotes: ["C4", "E4", "A4"],
      isCorrect: false,
      expectedAnswer: ["DO", "MI", "SOL"],
      userAnswer: ["DO", "MI", "LA"],
      correctNotesCount: 2,
      helpUsed: false,
      replayUsed: false,
      chordId: "c-major",
      chordQuality: "major",
      points: 50,
    },
  ];

  const scoring = scoreChordAnswers(answers, 3);
  assert.equal(scoring.score, 50);
  assert.equal(scoring.accuracy, 0);
  assert.equal(scoring.mistakes, 1);
});

test("desbloquea el siguiente ejercicio al aprobar", () => {
  const progress = createInitialChordProgress(CHORD_MODULE_ID, chordExercises);
  const firstExercise = chordExercises[0];
  const answers = Array.from({ length: firstExercise.totalRounds }, (_, index): ChordAnswer => ({
    questionId: `q${index}`,
    selectedOption: "Acorde",
    isCorrect: true,
    expectedAnswer: "Acorde",
    userAnswer: "Acorde",
    helpUsed: false,
    replayUsed: false,
    chordId: "c-major",
    chordQuality: "major",
    points: 100,
  }));
  const attempt = buildChordAttempt({
    exercise: firstExercise,
    startedAt: "2026-01-01T00:00:00.000Z",
    answers,
    totalUnits: firstExercise.totalRounds,
  });
  const next = applyChordAttemptToProgress({ progress, exercises: chordExercises, attempt });

  assert.equal(next.exercises["single-note-vs-chord"].completed, true);
  assert.equal(next.exercises["build-c-major"].unlocked, true);
});
