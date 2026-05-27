import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPentatonicImprovisationAnswer,
  buildPentatonicNoteAnswer,
  buildPentatonicOptionAnswer,
  isNoteAllowedInPentatonicScale,
} from "@/lib/pentatonic/answers";
import type { PentatonicQuestion } from "@/types/pentatonic";

const sequenceQuestion: PentatonicQuestion = {
  id: "q-penta-sequence",
  exerciseId: "play-c-major-pentatonic",
  scaleId: "c-major-pentatonic",
  taskType: "play_c_major_pentatonic",
  mode: "mixed",
  prompt: "Toca DO pentatónica mayor.",
  expectedNotes: ["C4", "D4", "E4"],
  expectedMidiNotes: [60, 62, 64],
};

test("construye respuestas de nota para pentatónicas fuera del hook React", () => {
  const correctAnswer = buildPentatonicNoteAnswer({
    question: sequenceQuestion,
    note: "D4",
    expectedNote: "D4",
    selectedMidi: 62,
    expectedMidi: 62,
    playedNotes: ["C4"],
    helpUsed: false,
    replayUsed: false,
  });
  const wrongAnswer = buildPentatonicNoteAnswer({
    question: sequenceQuestion,
    note: "F4",
    expectedNote: "D4",
    selectedMidi: 65,
    expectedMidi: 62,
    playedNotes: ["C4"],
    helpUsed: true,
    replayUsed: false,
  });

  assert.equal(correctAnswer.isCorrect, true);
  assert.equal(correctAnswer.points, 100);
  assert.equal(correctAnswer.expectedAnswer, "RE4");
  assert.equal(wrongAnswer.isCorrect, false);
  assert.equal(wrongAnswer.errorDetails?.wrongStepIndex, 1);
  assert.equal(isNoteAllowedInPentatonicScale("c-major-pentatonic", 64), true);
  assert.equal(isNoteAllowedInPentatonicScale("c-major-pentatonic", 65), false);
});

test("construye respuestas de relativa e improvisación pentatónica", () => {
  const relativeQuestion: PentatonicQuestion = {
    id: "q-relative",
    exerciseId: "relative-pentatonics",
    scaleId: "c-major-pentatonic",
    comparisonScaleId: "a-minor-pentatonic",
    taskType: "relative_pentatonics",
    mode: "mixed",
    prompt: "Comparten notas?",
    answerOptions: ["Sí", "No"],
    expectedAnswer: "Sí",
  };
  const improvisationQuestion: PentatonicQuestion = {
    id: "q-improv",
    exerciseId: "guided-improvisation",
    scaleId: "c-major-pentatonic",
    taskType: "guided_improvisation",
    mode: "improvisation",
    prompt: "Improvisa.",
  };

  const optionAnswer = buildPentatonicOptionAnswer({
    question: relativeQuestion,
    option: "Sí",
    helpUsed: false,
    replayUsed: true,
  });
  const improvAnswer = buildPentatonicImprovisationAnswer({
    question: improvisationQuestion,
    playedNotes: ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5", "C4", "E4"],
    helpUsed: false,
    replayUsed: false,
  });

  assert.equal(optionAnswer.isCorrect, true);
  assert.equal(optionAnswer.points, 75);
  assert.equal(improvAnswer.isCorrect, true);
  assert.equal(improvAnswer.improvisationMetrics?.notesPlayed, 12);
  assert.equal(improvAnswer.improvisationMetrics?.uniqueNotesUsed, 5);
});
