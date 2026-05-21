import assert from "node:assert/strict";
import test from "node:test";

import {
  areRelativeKeys,
  classifyAccidentalType,
  findRelativeMajorFromMinor,
  findRelativeMinorFromMajor,
  getAccidentalsForKey,
  getDisplayPitchName,
  getKeySignatureById,
  validateScaleWithKeySignature,
} from "@/lib/key-signature/theory";

test("define armaduras simples esperadas", () => {
  assert.deepEqual(getAccidentalsForKey("c-major"), []);
  assert.deepEqual(getAccidentalsForKey("a-minor"), []);
  assert.deepEqual(getAccidentalsForKey("g-major"), ["F#"]);
  assert.deepEqual(getAccidentalsForKey("e-minor"), ["F#"]);
  assert.deepEqual(getAccidentalsForKey("d-major"), ["F#", "C#"]);
  assert.deepEqual(getAccidentalsForKey("b-minor"), ["F#", "C#"]);
  assert.deepEqual(getAccidentalsForKey("f-major"), ["Bb"]);
  assert.deepEqual(getAccidentalsForKey("d-minor"), ["Bb"]);
  assert.deepEqual(getAccidentalsForKey("bb-major"), ["Bb", "Eb"]);
  assert.deepEqual(getAccidentalsForKey("g-minor"), ["Bb", "Eb"]);
});

test("clasifica familias de sostenidos, bemoles y sin alteraciones", () => {
  assert.equal(classifyAccidentalType("c-major"), "none");
  assert.equal(classifyAccidentalType("g-major"), "sharp");
  assert.equal(classifyAccidentalType("f-major"), "flat");
});

test("resuelve relativas mayores y menores", () => {
  assert.equal(areRelativeKeys("c-major", "a-minor"), true);
  assert.equal(areRelativeKeys("g-major", "e-minor"), true);
  assert.equal(areRelativeKeys("f-major", "d-minor"), true);
  assert.equal(areRelativeKeys("c-major", "e-minor"), false);
  assert.equal(findRelativeMinorFromMajor(60), 57);
  assert.equal(findRelativeMajorFromMinor(57), 60);
});

test("valida escalas con armadura usando alteraciones fijas", () => {
  assert.equal(validateScaleWithKeySignature("g-major", ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"]), true);
  assert.equal(validateScaleWithKeySignature("g-major", ["G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5"]), false);
  assert.equal(validateScaleWithKeySignature("f-major", ["F4", "G4", "A4", "Bb4", "C5", "D5", "E5", "F5"]), true);
});

test("muestra nombres en español", () => {
  assert.equal(getDisplayPitchName("C"), "DO");
  assert.equal(getDisplayPitchName("F#"), "FA#");
  assert.equal(getDisplayPitchName("Bb"), "SIb");
  assert.equal(getKeySignatureById("bb-major")?.displayName, "SIb mayor");
});
