import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMinorScaleFromMidi,
  getDisplayNoteName,
  getMajorMinorDifferenceIndexes,
  getMinorScaleById,
  getNaturalHarmonicDifferenceIndexes,
  getNaturalMelodicDifferenceIndexes,
  HARMONIC_MINOR_CUMULATIVE_STEPS,
  HARMONIC_MINOR_INTERVALS,
  MELODIC_MINOR_ASC_CUMULATIVE_STEPS,
  MELODIC_MINOR_ASC_INTERVALS,
  NATURAL_MINOR_CUMULATIVE_STEPS,
  NATURAL_MINOR_INTERVALS,
  noteToMidi,
  validatePlayedMinorScale,
} from "@/lib/minor-scale/theory";

test("define fórmulas de escalas menores", () => {
  assert.deepEqual([...NATURAL_MINOR_INTERVALS], [2, 1, 2, 2, 1, 2, 2]);
  assert.deepEqual([...NATURAL_MINOR_CUMULATIVE_STEPS], [0, 2, 3, 5, 7, 8, 10, 12]);
  assert.deepEqual([...HARMONIC_MINOR_INTERVALS], [2, 1, 2, 2, 1, 3, 1]);
  assert.deepEqual([...HARMONIC_MINOR_CUMULATIVE_STEPS], [0, 2, 3, 5, 7, 8, 11, 12]);
  assert.deepEqual([...MELODIC_MINOR_ASC_INTERVALS], [2, 1, 2, 2, 2, 2, 1]);
  assert.deepEqual([...MELODIC_MINOR_ASC_CUMULATIVE_STEPS], [0, 2, 3, 5, 7, 9, 11, 12]);
});

test("construye y valida escalas menores desde MIDI", () => {
  assert.deepEqual(buildMinorScaleFromMidi(57, "natural"), [57, 59, 60, 62, 64, 65, 67, 69]);
  assert.deepEqual(buildMinorScaleFromMidi(57, "harmonic"), [57, 59, 60, 62, 64, 65, 68, 69]);
  assert.deepEqual(
    buildMinorScaleFromMidi(57, "melodic_ascending"),
    [57, 59, 60, 62, 64, 66, 68, 69],
  );
  assert.equal(validatePlayedMinorScale(57, [57, 59, 60, 62, 64, 65, 67, 69], "natural"), true);
  assert.equal(validatePlayedMinorScale(57, [57, 59, 60, 62, 64, 65, 68, 69], "natural"), false);
});

test("mantiene escalas predefinidas del módulo", () => {
  assert.deepEqual(getMinorScaleById("a-minor-natural")?.notes, [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
  ]);
  assert.deepEqual(getMinorScaleById("c-minor-natural")?.notes, [
    "C",
    "D",
    "Eb",
    "F",
    "G",
    "Ab",
    "Bb",
    "C",
  ]);
  assert.deepEqual(
    getMinorScaleById("e-minor-natural")?.midiNotes,
    [64, 66, 67, 69, 71, 72, 74, 76],
  );
  assert.deepEqual(getMinorScaleById("a-minor-harmonic")?.notes, [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G#",
    "A",
  ]);
  assert.deepEqual(getMinorScaleById("a-minor-melodic-ascending")?.notes, [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F#",
    "G#",
    "A",
  ]);
});

test("expone diferencias pedagógicas entre escalas", () => {
  assert.deepEqual(getMajorMinorDifferenceIndexes(), [2]);
  assert.deepEqual(getNaturalHarmonicDifferenceIndexes(), [6]);
  assert.deepEqual(getNaturalMelodicDifferenceIndexes(), [5, 6]);
});

test("convierte nombres internos a display español", () => {
  assert.equal(noteToMidi("Eb4"), 63);
  assert.equal(noteToMidi("Ab4"), 68);
  assert.equal(getDisplayNoteName("A3"), "LA3");
  assert.equal(getDisplayNoteName("G#4"), "SOL#4");
  assert.equal(getDisplayNoteName("Bb4"), "SIb4");
  assert.equal(getDisplayNoteName("Eb4"), "MIb4");
});
