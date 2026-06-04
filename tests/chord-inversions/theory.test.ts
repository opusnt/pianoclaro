import assert from "node:assert/strict";
import test from "node:test";

import {
  buildTriadInversionMidi,
  chordInversionDefinitions,
  identifyInversion,
  validateInversion,
} from "@/lib/chord-inversions/theory";

test("construye inversiones MIDI manteniendo orden grave a agudo", () => {
  assert.deepEqual(buildTriadInversionMidi([60, 64, 67], "root_position"), [60, 64, 67]);
  assert.deepEqual(buildTriadInversionMidi([60, 64, 67], "first_inversion"), [64, 67, 72]);
  assert.deepEqual(buildTriadInversionMidi([60, 64, 67], "second_inversion"), [67, 72, 76]);
});

test("mantiene definiciones predefinidas para DO mayor y LA menor", () => {
  const byId = Object.fromEntries(
    chordInversionDefinitions.map((inversion) => [inversion.id, inversion]),
  );

  assert.deepEqual(byId["c-major-root"]?.notes, ["C", "E", "G"]);
  assert.deepEqual(byId["c-major-first"]?.notes, ["E", "G", "C"]);
  assert.deepEqual(byId["c-major-second"]?.notes, ["G", "C", "E"]);
  assert.deepEqual(byId["a-minor-first"]?.midiNotes, [60, 64, 69]);
});

test("valida notas correctas y bajo correcto por separado", () => {
  assert.deepEqual(validateInversion(["C", "E", "G"], "E", ["E4", "G4", "C5"]), {
    hasCorrectNotes: true,
    hasCorrectBass: true,
    isCorrect: true,
  });

  assert.deepEqual(validateInversion(["C", "E", "G"], "E", ["C4", "E4", "G4"]), {
    hasCorrectNotes: true,
    hasCorrectBass: false,
    isCorrect: false,
  });
});

test("identifica inversión desde nota de bajo", () => {
  assert.equal(identifyInversion(["C", "E", "G"], "C"), "root_position");
  assert.equal(identifyInversion(["C", "E", "G"], "E"), "first_inversion");
  assert.equal(identifyInversion(["C", "E", "G"], "G"), "second_inversion");
});
