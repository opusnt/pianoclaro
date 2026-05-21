import assert from "node:assert/strict";
import test from "node:test";

import { createMeasure, note, rest } from "@/lib/music/score-authoring";
import {
  getPositionedMeasureEvents,
  isPositionedNoteEvent,
} from "@/lib/music/notation-layout";

test("posiciona eventos según su duración real dentro del compás", () => {
  const measure = createMeasure(1, [
    rest("negra"),
    note("C", "blanca"),
    note("D", "negra"),
  ]);

  const events = getPositionedMeasureEvents({
    measure,
    measureStart: 100,
    measureWidth: 300,
  });

  assert.deepEqual(
    events.map((event) => event.startsAtBeat),
    [1, 2, 4],
  );
  assert.deepEqual(
    events.map((event) => Math.round(event.x)),
    [138, 189, 291],
  );
});

test("mantiene índices de nota aunque haya silencios entre eventos", () => {
  const measure = createMeasure(1, [note("C"), rest("negra"), note("D")]);
  const events = getPositionedMeasureEvents({
    measure,
    measureStart: 100,
    measureWidth: 300,
  }).filter(isPositionedNoteEvent);

  assert.deepEqual(
    events.map((event) => event.noteIndex),
    [0, 1],
  );
});
