import test from "node:test";
import assert from "node:assert/strict";

import {
  CHORD_FORMULAS,
  buildChordFromMidi,
  chordDefinitions,
  countCorrectChordNotes,
  getDisplayPitchName,
  validateChordNotes,
} from "@/lib/chords/theory";

test("define fórmulas de tríadas básicas", () => {
  assert.deepEqual(CHORD_FORMULAS.major, [0, 4, 7]);
  assert.deepEqual(CHORD_FORMULAS.minor, [0, 3, 7]);
  assert.deepEqual(CHORD_FORMULAS.diminished, [0, 3, 6]);
  assert.deepEqual(CHORD_FORMULAS.augmented, [0, 4, 8]);
});

test("construye acordes desde MIDI", () => {
  assert.deepEqual(buildChordFromMidi(60, "major"), [60, 64, 67]);
  assert.deepEqual(buildChordFromMidi(60, "minor"), [60, 63, 67]);
  assert.deepEqual(buildChordFromMidi(60, "diminished"), [60, 63, 66]);
  assert.deepEqual(buildChordFromMidi(60, "augmented"), [60, 64, 68]);
});

test("mantiene acordes predefinidos esperados", () => {
  const byId = Object.fromEntries(chordDefinitions.map((chord) => [chord.id, chord]));

  assert.deepEqual(byId["c-major"].notes, ["C", "E", "G"]);
  assert.deepEqual(byId["c-minor"].notes, ["C", "Eb", "G"]);
  assert.deepEqual(byId["c-diminished"].notes, ["C", "Eb", "Gb"]);
  assert.deepEqual(byId["c-augmented"].notes, ["C", "E", "G#"]);
});

test("valida acordes sin depender del orden", () => {
  assert.equal(validateChordNotes(["C", "E", "G"], ["G4", "C4", "E4"]), true);
  assert.equal(validateChordNotes(["C", "E", "G"], ["C4", "Eb4", "G4"]), false);
  assert.equal(countCorrectChordNotes(["C", "E", "G"], ["C4", "Eb4", "G4"]), 2);
});

test("muestra nombres en español", () => {
  assert.equal(getDisplayPitchName("C"), "DO");
  assert.equal(getDisplayPitchName("Eb"), "MIb");
  assert.equal(getDisplayPitchName("F#"), "FA#");
});
