import assert from "node:assert/strict";
import test from "node:test";

import { lessons } from "@/data/lessons";
import {
  getBeatsPerMeasure,
  getPracticeEventsInScope,
  getRhythmDuration,
  lessonToPracticeSong,
  scoreToSong,
} from "@/lib/music/song-model";
import { getMeasureEvents } from "@/lib/music/notation";
import type { ScoreMock } from "@/types/lesson";

test("convierte una lección en canción practicable con eventos ordenados", () => {
  const lesson = lessons.find((item) => item.slug === "tus-primeras-5-notas");
  assert.ok(lesson);

  const song = lessonToPracticeSong(lesson);

  assert.equal(song.config.tempoBpm, 72);
  assert.equal(song.beatsPerMeasure, 4);
  assert.equal(song.events.length, 8);
  assert.deepEqual(
    song.events.slice(0, 4).map((event) => event.note),
    ["C", "D", "E", "F"],
  );
  assert.deepEqual(
    song.events.slice(0, 4).map((event) => event.startsAtBeat),
    [1, 2, 3, 4],
  );
});

test("respeta el tempo definido en los datos de la lección", () => {
  const lesson = lessons.find((item) => item.slug === "tu-primera-mini-cancion");
  assert.ok(lesson);

  assert.equal(lessonToPracticeSong(lesson).config.tempoBpm, 66);
});

test("filtra eventos por compás o frase", () => {
  const lesson = lessons.find((item) => item.slug === "tu-primera-mini-cancion");
  assert.ok(lesson);
  const song = lessonToPracticeSong(lesson);

  assert.equal(getPracticeEventsInScope(song, { measure: 1 }).length, 4);
  assert.equal(getPracticeEventsInScope(song, { phrase: "A" }).length, 16);
  assert.equal(getPracticeEventsInScope(song, { phrase: "B" }).length, 16);
});

test("interpreta compases y figuras básicas", () => {
  assert.equal(getBeatsPerMeasure("4/4"), 4);
  assert.equal(getBeatsPerMeasure("3/4"), 3);
  assert.equal(getRhythmDuration("redonda"), 4);
  assert.equal(getRhythmDuration("blanca"), 2);
  assert.equal(getRhythmDuration("negra"), 1);
  assert.equal(getRhythmDuration("corchea"), 0.5);
});

test("mantiene el pulso al convertir silencios en una partitura normalizada", () => {
  const score: ScoreMock = {
    title: "Silencio inicial",
    timeSignature: "4/4",
    keySignature: "Do mayor",
    clef: "treble",
    measures: [
      {
        number: 1,
        notes: ["C"],
        solfege: ["Do"],
        rhythm: ["negra"],
        events: [
          { kind: "rest", duration: "negra" },
          { kind: "note", pitch: { note: "C" }, duration: "negra" },
        ],
      },
    ],
  };

  const song = scoreToSong(score, "silencio-inicial", 72);

  assert.equal(song.events.length, 1);
  assert.equal(song.timelineEvents.length, 2);
  assert.equal(song.timelineEvents[0].kind, "rest");
  assert.equal(song.events[0].startsAtBeat, 2);
  assert.equal(song.events[0].beat, 2);
});

test("normaliza medidas legacy a eventos de nota", () => {
  const lesson = lessons.find((item) => item.slug === "tus-primeras-5-notas");
  assert.ok(lesson);

  const events = getMeasureEvents(lesson.score.measures[0]);

  assert.deepEqual(
    events.map((event) => event.kind),
    ["note", "note", "note", "note"],
  );
  assert.deepEqual(
    events.map((event) => event.duration),
    ["negra", "negra", "negra", "negra"],
  );
});
