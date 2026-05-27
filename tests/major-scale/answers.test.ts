import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMajorScaleNoteAnswer,
  buildMajorScaleOptionAnswer,
  getExpectedScaleOption,
  getQuestionScaleMidiNotes,
} from "@/lib/major-scale/answers";
import type { ScaleQuestion } from "@/types/major-scale";

const sequenceQuestion: ScaleQuestion = {
  id: "q-scale",
  exerciseId: "play-c-major",
  scaleId: "c-major",
  tonic: "C",
  mode: "visual",
  expectedNotes: ["C4", "D4", "E4"],
  expectedMidiNotes: [60, 62, 64],
  prompt: "Toca DO mayor.",
  taskType: "play_c_major",
};

test("construye respuestas de nota para escala mayor fuera del hook React", () => {
  const correctAnswer = buildMajorScaleNoteAnswer({
    question: sequenceQuestion,
    note: "D4",
    expectedNote: "D4",
    selectedMidi: 62,
    expectedMidi: 62,
    playedNotes: ["C4"],
    helpUsed: false,
    replayUsed: false,
  });
  const wrongAnswer = buildMajorScaleNoteAnswer({
    question: sequenceQuestion,
    note: "D#4",
    expectedNote: "D4",
    selectedMidi: 63,
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
  assert.equal(wrongAnswer.errorDetails?.actualInterval, 3);
  assert.equal(wrongAnswer.errorDetails?.expectedInterval, 2);
});

test("resuelve respuestas de opción y MIDI esperado para escala mayor", () => {
  const missingNoteQuestion: ScaleQuestion = {
    id: "q-missing",
    exerciseId: "missing-note",
    scaleId: "g-major",
    tonic: "G",
    mode: "mixed",
    missingNoteIndex: 6,
    answerOptions: ["FA", "FA#", "SOL"],
    prompt: "Completa la nota faltante.",
    taskType: "missing_note",
  };
  const audioQuestion: ScaleQuestion = {
    ...missingNoteQuestion,
    id: "q-audio",
    mode: "audio",
    isCorrectScale: false,
    taskType: "audio_recognition",
  };

  assert.equal(getExpectedScaleOption(missingNoteQuestion), "FA#");
  assert.equal(getExpectedScaleOption(audioQuestion), "Algo suena fuera");
  assert.deepEqual(getQuestionScaleMidiNotes(missingNoteQuestion), [67, 69, 71, 72, 74, 76, 78, 79]);

  const answer = buildMajorScaleOptionAnswer({
    question: missingNoteQuestion,
    option: "FA#",
    helpUsed: false,
    replayUsed: true,
  });

  assert.equal(answer.isCorrect, true);
  assert.equal(answer.points, 75);
});
