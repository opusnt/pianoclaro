import assert from "node:assert/strict";
import test from "node:test";

import {
  MAJOR_SCALE_CUMULATIVE_STEPS,
  MAJOR_SCALE_INTERVALS,
  buildMajorScaleFromMidi,
  getDisplayNoteName,
  getScaleById,
  noteToMidi,
  validatePlayedScale,
} from "@/lib/major-scale/theory";

test("define la fórmula de escala mayor", () => {
  assert.deepEqual([...MAJOR_SCALE_INTERVALS], [2, 2, 1, 2, 2, 2, 1]);
  assert.deepEqual([...MAJOR_SCALE_CUMULATIVE_STEPS], [0, 2, 4, 5, 7, 9, 11, 12]);
});

test("convierte notas con alteraciones a MIDI-like", () => {
  assert.equal(noteToMidi("C4"), 60);
  assert.equal(noteToMidi("F#4"), 66);
  assert.equal(noteToMidi("Bb4"), 70);
  assert.equal(noteToMidi("C5"), 72);
});

test("construye y valida DO mayor desde MIDI", () => {
  const cMajor = [60, 62, 64, 65, 67, 69, 71, 72];

  assert.deepEqual(buildMajorScaleFromMidi(60), cMajor);
  assert.equal(validatePlayedScale(60, cMajor), true);
  assert.equal(validatePlayedScale(60, [60, 62, 64, 66, 67, 69, 71, 72]), false);
});

test("mantiene las escalas predefinidas del módulo", () => {
  assert.deepEqual(getScaleById("c-major")?.notes, ["C", "D", "E", "F", "G", "A", "B", "C"]);
  assert.deepEqual(getScaleById("g-major")?.notes, ["G", "A", "B", "C", "D", "E", "F#", "G"]);
  assert.deepEqual(getScaleById("d-major")?.midiNotes, [62, 64, 66, 67, 69, 71, 73, 74]);
  assert.deepEqual(getScaleById("f-major")?.notes, ["F", "G", "A", "Bb", "C", "D", "E", "F"]);
});

test("muestra nombres en español neutro", () => {
  assert.equal(getDisplayNoteName("C4"), "DO4");
  assert.equal(getDisplayNoteName("F#4"), "FA#4");
  assert.equal(getDisplayNoteName("Bb4"), "SIb4");
});
