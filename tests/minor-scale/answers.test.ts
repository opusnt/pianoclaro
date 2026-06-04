import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMinorScaleNoteAnswer,
  buildMinorScaleOptionAnswer,
  getMinorQuestionScaleMidiNotes,
  getMinorScaleNextInterval,
  getMinorScaleWrongStep,
  midiToMinorScaleNote,
} from "@/lib/minor-scale/answers";
import type { MinorScaleQuestion } from "@/types/minor-scale";

const sequenceQuestion: MinorScaleQuestion = {
  id: "q-minor-sequence",
  exerciseId: "discover-natural-pattern",
  scaleId: "a-minor-natural",
  tonic: "A",
  scaleType: "natural",
  mode: "visual",
  taskType: "discover_natural_pattern",
  prompt: "Construye LA menor natural.",
  expectedNotes: ["B3", "C4", "D4"],
  expectedMidiNotes: [59, 60, 62],
};

test("construye respuestas de nota para escalas menores fuera del hook React", () => {
  const correctAnswer = buildMinorScaleNoteAnswer({
    question: sequenceQuestion,
    note: "C4",
    expectedNote: "C4",
    selectedMidi: 60,
    expectedMidi: 60,
    playedNotes: ["B3"],
    helpUsed: false,
    replayUsed: false,
  });
  const wrongAnswer = buildMinorScaleNoteAnswer({
    question: sequenceQuestion,
    note: "C#4",
    expectedNote: "C4",
    selectedMidi: 61,
    expectedMidi: 60,
    playedNotes: ["B3"],
    helpUsed: true,
    replayUsed: false,
  });

  assert.equal(correctAnswer.isCorrect, true);
  assert.equal(correctAnswer.points, 100);
  assert.equal(correctAnswer.expectedAnswer, "DO4");
  assert.equal(wrongAnswer.isCorrect, false);
  assert.equal(wrongAnswer.errorDetails?.wrongStepIndex, 1);
  assert.equal(wrongAnswer.errorDetails?.actualInterval, 2);
  assert.equal(wrongAnswer.errorDetails?.expectedInterval, 1);
});

test("resuelve notas MIDI, intervalos siguientes y respuestas de opción menores", () => {
  const optionQuestion: MinorScaleQuestion = {
    id: "q-minor-option",
    exerciseId: "natural-vs-harmonic",
    scaleId: "a-minor-harmonic",
    tonic: "A",
    scaleType: "harmonic",
    mode: "mixed",
    taskType: "natural_vs_harmonic",
    prompt: "¿Cuál escala tiene el séptimo grado más alto?",
    answerOptions: ["LA menor natural", "LA menor armónica"],
  };

  assert.deepEqual(
    getMinorQuestionScaleMidiNotes(optionQuestion),
    [57, 59, 60, 62, 64, 65, 68, 69],
  );
  assert.equal(midiToMinorScaleNote(optionQuestion, 68), "G#4");
  assert.equal(getMinorScaleNextInterval(sequenceQuestion, 1), 1);
  assert.equal(getMinorScaleWrongStep(sequenceQuestion, 1), 1);

  const answer = buildMinorScaleOptionAnswer({
    question: optionQuestion,
    option: "LA menor armónica",
    helpUsed: false,
    replayUsed: true,
  });

  assert.equal(answer.isCorrect, true);
  assert.equal(answer.points, 75);
  assert.equal(answer.scaleType, "harmonic");
});
