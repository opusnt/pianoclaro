import assert from "node:assert/strict";
import test from "node:test";
import { keyboardNotesLessonSlug } from "@/data/learning-slugs";
import { lessons } from "@/data/lessons";
import { createMeasure, note, rest } from "@/lib/music/score-authoring";
import { lessonToPracticeSong } from "@/lib/music/song-model";
import { getLessonFocusFromPracticeSong, getStudyRoutine } from "@/lib/practice/lesson-engine";
import type { Lesson } from "@/types/lesson";

test("deriva foco por nota activa y compás", () => {
  const lesson = lessons.find((item) => item.slug === keyboardNotesLessonSlug);
  assert.ok(lesson);
  const step = lesson.steps[1];
  const focus = getLessonFocusFromPracticeSong(lessonToPracticeSong(lesson), step);

  assert.deepEqual(focus.notes, ["D"]);
  assert.equal(focus.measure, 1);
  assert.deepEqual(
    focus.events.map((event) => event.note),
    ["D"],
  );
});

test("deriva foco por frase completa", () => {
  const lesson = lessons.find((item) => item.slug === "tu-primera-mini-cancion");
  assert.ok(lesson);
  const phraseStep = lesson.steps.find((step) => step.activePhrase === "A");
  assert.ok(phraseStep);

  const focus = getLessonFocusFromPracticeSong(lessonToPracticeSong(lesson), phraseStep);
  assert.equal(focus.phrase, "A");
  assert.equal(focus.events.length, 16);
});

test("construye la rutina pedagógica con el foco actual", () => {
  const lesson = lessons.find((item) => item.slug === "lee-antes-de-tocar");
  assert.ok(lesson);
  const step = lesson.steps[0];
  const focus = getLessonFocusFromPracticeSong(lessonToPracticeSong(lesson), step);
  const routine = getStudyRoutine(lesson, step, focus);

  assert.equal(routine.length, 4);
  assert.deepEqual(
    routine.map((item) => item.title),
    ["Observa", "Entiende", "Toca", "Confirma"],
  );
  assert.match(routine[2].detail, /Do, Re, Mi, Fa/);
});

test("mantiene silencios dentro de la línea temporal del foco", () => {
  const lesson: Lesson = {
    ...lessons[0],
    slug: "foco-con-silencio",
    score: {
      ...lessons[0].score,
      measures: [createMeasure(1, [rest("negra"), note("C"), note("D"), note("E")])],
    },
    steps: [
      {
        ...lessons[0].steps[0],
        activeNotes: undefined,
        activeMeasure: 1,
      },
    ],
  };

  const focus = getLessonFocusFromPracticeSong(lessonToPracticeSong(lesson), lesson.steps[0]);

  assert.deepEqual(
    focus.timelineEvents.map((event) => event.kind),
    ["rest", "note", "note", "note"],
  );
  assert.deepEqual(
    focus.events.map((event) => event.note),
    ["C", "D", "E"],
  );
});
