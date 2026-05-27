import assert from "node:assert/strict";
import test from "node:test";

import {
  buildKeyboard,
  getKeyboardNotesAccuracy,
  getKeyboardNotesStageProgress,
  isCorrectBlackKeyGroup,
  isCorrectCKey,
  nextCOctave,
  nextPatternTarget,
} from "@/lib/keyboard-notes/theory";
import { buildKeyboardNotesProgressSnapshot } from "@/lib/keyboard-notes/progress";

test("construye el teclado base del módulo 1 con dos octavas", () => {
  const keyboard = buildKeyboard([4, 5]);

  assert.equal(keyboard.whiteKeys.length, 14);
  assert.equal(keyboard.blackKeys.length, 10);
  assert.equal(keyboard.whiteKeys[0]?.id, "C4");
  assert.equal(keyboard.whiteKeys[0]?.label, "Do");
  assert.equal(keyboard.blackKeys[0]?.id, "C#4");
  assert.equal(keyboard.blackKeys[0]?.groupType, 2);
});

test("evalúa patrones visuales y búsqueda de Do fuera de React", () => {
  const keyboard = buildKeyboard([4, 5]);
  const c4 = keyboard.whiteKeys.find((key) => key.id === "C4");
  const d4 = keyboard.whiteKeys.find((key) => key.id === "D4");
  const cSharp4 = keyboard.blackKeys.find((key) => key.id === "C#4");
  const fSharp4 = keyboard.blackKeys.find((key) => key.id === "F#4");

  assert.ok(c4);
  assert.ok(d4);
  assert.ok(cSharp4);
  assert.ok(fSharp4);
  assert.equal(isCorrectCKey(c4, 4), true);
  assert.equal(isCorrectCKey(d4, 4), false);
  assert.equal(isCorrectBlackKeyGroup(cSharp4, 2), true);
  assert.equal(isCorrectBlackKeyGroup(fSharp4, 2), false);
  assert.equal(nextPatternTarget(2), 3);
  assert.equal(nextCOctave(4), 5);
});

test("calcula progreso persistible del módulo 1", () => {
  assert.equal(getKeyboardNotesAccuracy(7, 10), 70);
  assert.equal(getKeyboardNotesStageProgress({ stage: "pattern", patternHits: 2, cHits: 0 }), 50);
  assert.equal(getKeyboardNotesStageProgress({ stage: "find-c", patternHits: 4, cHits: 5 }), 100);

  const snapshot = buildKeyboardNotesProgressSnapshot({
    stage: "complete",
    xp: 120,
    combo: 3,
    comboMax: 5,
    attempts: 10,
    correct: 8,
    patternHits: 4,
    cHits: 5,
    accuracy: 80,
  });

  assert.equal(snapshot.completed, true);
  assert.equal(snapshot.comboMax, 5);
  assert.equal(snapshot.bestAccuracy, 80);
});
