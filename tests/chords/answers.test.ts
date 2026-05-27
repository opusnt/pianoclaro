import assert from "node:assert/strict";
import test from "node:test";

import {
  buildChordNotesAnswer,
  buildChordOptionAnswer,
  resolveExpectedChordNotes,
} from "@/lib/chords/answers";
import type { ChordQuestion } from "@/types/chords";

const chordQuestion: ChordQuestion = {
  id: "q-chord",
  exerciseId: "build-c-major",
  chordId: "c-major",
  taskType: "build_c_major",
  mode: "mixed",
  prompt: "Construye DO mayor.",
  expectedNotes: ["C4", "E4", "G4"],
  expectedMidiNotes: [60, 64, 67],
};

test("construye respuestas de acordes por notas sin depender del orden", () => {
  const correctAnswer = buildChordNotesAnswer({
    question: chordQuestion,
    selectedNotes: ["G4", "C4", "E4"],
    helpUsed: false,
    replayUsed: false,
  });
  const partialAnswer = buildChordNotesAnswer({
    question: chordQuestion,
    selectedNotes: ["C4", "E4", "F4"],
    helpUsed: false,
    replayUsed: false,
  });

  assert.deepEqual(resolveExpectedChordNotes(chordQuestion), ["C4", "E4", "G4"]);
  assert.equal(correctAnswer?.isCorrect, true);
  assert.equal(correctAnswer?.points, 100);
  assert.equal(partialAnswer?.isCorrect, false);
  assert.equal(partialAnswer?.correctNotesCount, 2);
  assert.equal(partialAnswer?.points, 50);
  assert.deepEqual(partialAnswer?.errorDetails?.missingNotes, ["G4"]);
});

test("construye respuestas de opción para reconocimiento de cualidad", () => {
  const qualityQuestion: ChordQuestion = {
    id: "q-quality",
    exerciseId: "major-vs-minor",
    chordId: "c-minor",
    taskType: "major_vs_minor_audio",
    mode: "audio",
    prompt: "Mayor o menor?",
    answerOptions: ["mayor", "menor"],
    expectedAnswer: "menor",
  };

  const correctAnswer = buildChordOptionAnswer({
    question: qualityQuestion,
    option: "menor",
    helpUsed: false,
    replayUsed: true,
  });
  const wrongAnswer = buildChordOptionAnswer({
    question: qualityQuestion,
    option: "mayor",
    helpUsed: false,
    replayUsed: false,
  });

  assert.equal(correctAnswer?.isCorrect, true);
  assert.equal(correctAnswer?.points, 75);
  assert.equal(wrongAnswer?.isCorrect, false);
  assert.equal(wrongAnswer?.errorDetails?.selectedQuality, "major");
  assert.equal(wrongAnswer?.errorDetails?.expectedQuality, "minor");
});
