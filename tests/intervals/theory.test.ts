import assert from "node:assert/strict";
import test from "node:test";

import { intervalExercises } from "@/data/intervals";
import { generateIntervalQuestions } from "@/lib/intervals/questions";
import {
  evaluateIntervalAnswer,
  getAbsoluteIntervalSemitones,
  getIntervalDistanceCategory,
  getIntervalSemitones,
  noteToMidi,
  transposeNote,
} from "@/lib/intervals/theory";

test("convierte notas a índices MIDI-like", () => {
  assert.equal(noteToMidi("C4"), 60);
  assert.equal(noteToMidi("C#4"), 61);
  assert.equal(noteToMidi("D4"), 62);
  assert.equal(noteToMidi("E4"), 64);
  assert.equal(noteToMidi("F4"), 65);
  assert.equal(noteToMidi("A4"), 69);
  assert.equal(noteToMidi("C5"), 72);
});

test("calcula distancias básicas de intervalos", () => {
  assert.equal(getIntervalSemitones("C4", "D4"), 2);
  assert.equal(getAbsoluteIntervalSemitones("C4", "C5"), 12);
  assert.equal(getIntervalSemitones("E4", "F4"), 1);
  assert.equal(getIntervalSemitones("G4", "E4"), -3);
  assert.equal(transposeNote("C4", 7), "G4");
});

test("evalúa dirección ascendente y descendente sin aceptar dirección equivocada", () => {
  assert.equal(
    evaluateIntervalAnswer({
      baseNote: "C4",
      userNote: "D4",
      expectedSemitones: 2,
      direction: "ascending",
    }),
    true,
  );
  assert.equal(
    evaluateIntervalAnswer({
      baseNote: "C4",
      userNote: "A#3",
      expectedSemitones: 2,
      direction: "ascending",
    }),
    false,
  );
  assert.equal(
    evaluateIntervalAnswer({
      baseNote: "C4",
      userNote: "A#3",
      expectedSemitones: 2,
      direction: "descending",
    }),
    true,
  );
});

test("clasifica distancias auditivas simples", () => {
  assert.equal(getIntervalDistanceCategory(0), "misma nota");
  assert.equal(getIntervalDistanceCategory(1), "paso corto");
  assert.equal(getIntervalDistanceCategory(5), "salto medio");
  assert.equal(getIntervalDistanceCategory(12), "salto grande");
});

test("genera preguntas jugables para el módulo de intervalos", () => {
  const exercise = intervalExercises.find((item) => item.id === "find-interval");
  assert.ok(exercise);

  const questions = generateIntervalQuestions(exercise);

  assert.equal(questions.length, exercise.totalRounds);
  assert.equal(questions[0]?.baseNote, "C4");
  assert.equal(questions[0]?.targetNote, "C#4");
  assert.equal(questions[1]?.targetNote, "D4");
});
