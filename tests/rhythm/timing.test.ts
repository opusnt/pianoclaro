import assert from "node:assert/strict";
import test from "node:test";

import { rhythmExercises } from "@/data/rhythm-basics";
import {
  collectMissedBeats,
  evaluateHit,
  generateBeatEvents,
  getBeatIntervalMs,
} from "@/lib/rhythm/timing";

test("calcula intervalos de beat según BPM", () => {
  assert.equal(getBeatIntervalMs(60), 1000);
  assert.equal(getBeatIntervalMs(120), 500);
  assert.equal(Math.round(getBeatIntervalMs(90)), 667);
});

test("genera beats y silencios desde patrones rítmicos", () => {
  const exercise = rhythmExercises.find((item) => item.id === "marked-beats");
  assert.ok(exercise);

  const events = generateBeatEvents({ exercise, startTimestamp: 1000 });

  assert.equal(events.length, 24);
  assert.deepEqual(
    events.slice(0, 8).map((beat) => beat.shouldTap),
    [true, false, true, false, true, false, true, false],
  );
  assert.equal(Math.round(events[1].expectedTimestamp - events[0].expectedTimestamp), 833);
});

test("evalúa inputs contra el beat más cercano sin doble conteo", () => {
  const baseExercise = rhythmExercises[0];
  const exercise = { ...baseExercise, totalBeats: 4 };
  const events = generateBeatEvents({ exercise, startTimestamp: 1000 });

  assert.equal(evaluateHit({ timestamp: 1008, inputType: "keyboard" }, events)?.grade, "perfect");
  assert.equal(evaluateHit({ timestamp: 1010, inputType: "keyboard" }, events), null);
  assert.equal(evaluateHit({ timestamp: 2080, inputType: "keyboard" }, events)?.grade, "good");
  assert.equal(evaluateHit({ timestamp: 2880, inputType: "keyboard" }, events)?.grade, "early");
  assert.equal(evaluateHit({ timestamp: 4150, inputType: "keyboard" }, events)?.grade, "late");
});

test("registra misses automáticos al superar la ventana esperada", () => {
  const exercise = { ...rhythmExercises[0], totalBeats: 2 };
  const events = generateBeatEvents({ exercise, startTimestamp: 1000 });

  const misses = collectMissedBeats(1181, events);

  assert.equal(misses.length, 1);
  assert.equal(misses[0]?.grade, "miss");
  assert.equal(events[0]?.wasEvaluated, true);
  assert.equal(events[1]?.wasEvaluated, false);
});
