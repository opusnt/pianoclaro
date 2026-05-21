import assert from "node:assert/strict";
import test from "node:test";

import {
  MAJOR_PENTATONIC_INTERVALS,
  MAJOR_PENTATONIC_STEPS,
  MINOR_PENTATONIC_INTERVALS,
  MINOR_PENTATONIC_STEPS,
  areRelativePentatonics,
  buildPentatonicScaleFromMidi,
  getDisplayPitchName,
  getPentatonicScaleById,
  validatePlayedPentatonicScale,
} from "@/lib/pentatonic/theory";

test("define fórmulas pentatónicas", () => {
  assert.deepEqual([...MAJOR_PENTATONIC_STEPS], [0, 2, 4, 7, 9, 12]);
  assert.deepEqual([...MAJOR_PENTATONIC_INTERVALS], [2, 2, 3, 2, 3]);
  assert.deepEqual([...MINOR_PENTATONIC_STEPS], [0, 3, 5, 7, 10, 12]);
  assert.deepEqual([...MINOR_PENTATONIC_INTERVALS], [3, 2, 2, 3, 2]);
});

test("construye y valida pentatónicas desde MIDI", () => {
  assert.deepEqual(buildPentatonicScaleFromMidi(60, "major"), [60, 62, 64, 67, 69, 72]);
  assert.deepEqual(buildPentatonicScaleFromMidi(57, "minor"), [57, 60, 62, 64, 67, 69]);
  assert.equal(validatePlayedPentatonicScale(60, [60, 62, 64, 67, 69, 72], "major"), true);
  assert.equal(validatePlayedPentatonicScale(60, [60, 62, 65, 67, 69, 72], "major"), false);
});

test("mantiene escalas predefinidas del módulo", () => {
  assert.deepEqual(getPentatonicScaleById("c-major-pentatonic")?.notes, ["C", "D", "E", "G", "A", "C"]);
  assert.deepEqual(getPentatonicScaleById("a-minor-pentatonic")?.notes, ["A", "C", "D", "E", "G", "A"]);
  assert.deepEqual(getPentatonicScaleById("g-major-pentatonic")?.notes, ["G", "A", "B", "D", "E", "G"]);
  assert.deepEqual(getPentatonicScaleById("e-minor-pentatonic")?.notes, ["E", "G", "A", "B", "D", "E"]);
  assert.deepEqual(getPentatonicScaleById("f-major-pentatonic")?.notes, ["F", "G", "A", "C", "D", "F"]);
  assert.deepEqual(getPentatonicScaleById("d-minor-pentatonic")?.notes, ["D", "F", "G", "A", "C", "D"]);
});

test("detecta pentatónicas relativas", () => {
  assert.equal(areRelativePentatonics("c-major-pentatonic", "a-minor-pentatonic"), true);
  assert.equal(areRelativePentatonics("g-major-pentatonic", "e-minor-pentatonic"), true);
  assert.equal(areRelativePentatonics("f-major-pentatonic", "d-minor-pentatonic"), true);
  assert.equal(areRelativePentatonics("c-major-pentatonic", "e-minor-pentatonic"), false);
});

test("muestra nombres en español", () => {
  assert.equal(getDisplayPitchName("C"), "DO");
  assert.equal(getDisplayPitchName("F"), "FA");
  assert.equal(getDisplayPitchName("A"), "LA");
});
