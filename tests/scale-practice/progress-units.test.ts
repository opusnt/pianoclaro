import assert from "node:assert/strict";
import test from "node:test";

import {
  getCompletedScaleStepCount,
  getCompletedUnits,
  getCurrentScaleStepIndex,
  getQuestionUnitCount,
} from "@/lib/scale-practice/progress-units";

test("cuenta una pregunta secuencial por cada nota esperada", () => {
  assert.equal(getQuestionUnitCount({ expectedNotes: ["C4", "D4", "E4"] }), 3);
});

test("cuenta una pregunta no secuencial como una unidad", () => {
  assert.equal(getQuestionUnitCount({}), 1);
});

test("calcula unidades completadas combinando preguntas previas y secuencia actual", () => {
  const questions = [{ expectedNotes: ["C4", "D4"] }, {}, { expectedNotes: ["E4", "F4", "G4"] }];

  assert.equal(
    getCompletedUnits({
      questions,
      currentIndex: 2,
      currentQuestion: questions[2],
      currentPlayedNotes: ["E4", "F4"],
      currentAnswer: null,
    }),
    5,
  );
});

test("calcula unidades completadas en preguntas de respuesta única", () => {
  const questions = [{ expectedNotes: ["C4", "D4"] }, {}];

  assert.equal(
    getCompletedUnits({
      questions,
      currentIndex: 1,
      currentQuestion: questions[1],
      currentPlayedNotes: [],
      currentAnswer: { isCorrect: true },
    }),
    3,
  );
});

test("calcula índice de paso cuando la secuencia incluye la tónica", () => {
  const sequence = [60, 62, 64, 65, 67, 69, 71, 72];

  assert.equal(
    getCurrentScaleStepIndex({
      expectedMidiNotes: sequence,
      tonicMidi: 60,
      playedCount: 0,
    }),
    0,
  );
  assert.equal(
    getCurrentScaleStepIndex({
      expectedMidiNotes: sequence,
      tonicMidi: 60,
      playedCount: 3,
    }),
    2,
  );
});

test("calcula índice de paso cuando la secuencia omite la tónica", () => {
  const sequence = [62, 64, 65, 67, 69, 71, 72];

  assert.equal(
    getCurrentScaleStepIndex({
      expectedMidiNotes: sequence,
      tonicMidi: 60,
      playedCount: 3,
    }),
    3,
  );
});

test("calcula pasos completados y limita al rango de la fórmula", () => {
  assert.equal(
    getCompletedScaleStepCount({
      expectedMidiNotes: [60, 62, 64, 65, 67, 69, 71, 72],
      tonicMidi: 60,
      playedCount: 9,
    }),
    7,
  );
  assert.equal(
    getCompletedScaleStepCount({
      expectedMidiNotes: [62, 64, 65, 67, 69, 71, 72],
      tonicMidi: 60,
      playedCount: 4,
    }),
    4,
  );
});
