import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDiatonicTriad,
  getChordByDegree,
  getChordProgressionFromDegrees,
  harmonicFieldDefinitions,
  MAJOR_FIELD_QUALITIES,
  requireField,
  validateChordPitchClasses,
} from "@/lib/harmonic-field/theory";

test("usa el patrón mayor del campo armónico", () => {
  assert.deepEqual(MAJOR_FIELD_QUALITIES, [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "diminished",
  ]);
});

test("construye tríadas diatónicas por terceras", () => {
  assert.deepEqual(buildDiatonicTriad(["C", "D", "E", "F", "G", "A", "B"], 0), ["C", "E", "G"]);
  assert.deepEqual(buildDiatonicTriad(["C", "D", "E", "F", "G", "A", "B"], 1), ["D", "F", "A"]);
  assert.deepEqual(buildDiatonicTriad(["C", "D", "E", "F", "G", "A", "B"], 6), ["B", "D", "F"]);
});

test("define los campos armónicos pedidos", () => {
  assert.equal(harmonicFieldDefinitions.length, 4);

  const c = requireField("c-major");
  assert.deepEqual(
    c.chords.map((chord) => chord.displayName),
    ["DO mayor", "RE menor", "MI menor", "FA mayor", "SOL mayor", "LA menor", "SI disminuido"],
  );

  const g = requireField("g-major");
  assert.deepEqual(getChordByDegree(g, "vii°").notes, ["F#", "A", "C"]);

  const f = requireField("f-major");
  assert.deepEqual(getChordByDegree(f, "IV").notes, ["Bb", "D", "F"]);

  const d = requireField("d-major");
  assert.deepEqual(getChordByDegree(d, "iii").notes, ["F#", "A", "C#"]);
});

test("traduce I-V-vi-IV entre tonalidades", () => {
  const progression = ["I", "V", "vi", "IV"] as const;
  assert.deepEqual(
    getChordProgressionFromDegrees(requireField("c-major"), [...progression]).map(
      (chord) => chord.displayName,
    ),
    ["DO mayor", "SOL mayor", "LA menor", "FA mayor"],
  );
  assert.deepEqual(
    getChordProgressionFromDegrees(requireField("g-major"), [...progression]).map(
      (chord) => chord.displayName,
    ),
    ["SOL mayor", "RE mayor", "MI menor", "DO mayor"],
  );
});

test("valida acordes por pitch class y permite inversiones", () => {
  assert.equal(validateChordPitchClasses(["C", "E", "G"], ["G4", "C5", "E5"]), true);
  assert.equal(validateChordPitchClasses(["D", "F", "A"], ["D4", "F#4", "A4"]), false);
});
