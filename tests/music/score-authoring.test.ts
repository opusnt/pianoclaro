import assert from "node:assert/strict";
import test from "node:test";

import { createMeasure, note, notes, rest } from "@/lib/music/score-authoring";

test("construye compases completos desde eventos musicales", () => {
  const measure = createMeasure(3, [rest("negra"), note("C", "blanca"), note("D", "negra")]);

  assert.deepEqual(measure.notes, ["C", "D"]);
  assert.deepEqual(measure.solfege, ["Do", "Re"]);
  assert.deepEqual(measure.rhythm, ["blanca", "negra"]);
  assert.deepEqual(
    measure.events?.map((event) => event.kind),
    ["rest", "note", "note"],
  );
});

test("crea secuencias rápidas de negras para contenido inicial", () => {
  const measure = createMeasure(1, notes("C", "D", "E", "F"), "A");

  assert.equal(measure.phrase, "A");
  assert.deepEqual(measure.notes, ["C", "D", "E", "F"]);
  assert.deepEqual(measure.rhythm, ["negra", "negra", "negra", "negra"]);
});
