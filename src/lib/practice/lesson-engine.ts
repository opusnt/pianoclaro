import { solfegeByNote } from "@/lib/music/notes";
import {
  getPracticeEventsInScope,
  getPracticeTimelineInScope,
  lessonToPracticeSong,
  type PianoClaroNoteEvent,
  type PianoClaroTimelineEvent,
  type PracticeSong,
} from "@/lib/music/song-model";
import { coreLessonPedagogy } from "@/lib/practice/pedagogy";
import type { Lesson, LessonStep, NoteName } from "@/types/lesson";

export type LessonFocus = {
  notes: NoteName[];
  measure?: number;
  phrase?: "A" | "B";
  events: PianoClaroNoteEvent[];
  timelineEvents: PianoClaroTimelineEvent[];
};

export function getLessonFocus(lesson: Lesson, step: LessonStep): LessonFocus {
  const song = lessonToPracticeSong(lesson);
  const scopedEvents = getPracticeEventsInScope(song, {
    measure: step.activeMeasure,
    phrase: step.activePhrase,
  });
  const scopedTimelineEvents = getPracticeTimelineInScope(song, {
    measure: step.activeMeasure,
    phrase: step.activePhrase,
  });
  const noteScopedEvents = step.activeNotes
    ? scopedEvents.filter((event) => step.activeNotes?.includes(event.note))
    : scopedEvents;
  const events =
    noteScopedEvents.length > 0
      ? noteScopedEvents
      : scopedEvents.length > 0
        ? scopedEvents
        : song.events;
  const notes = step.activeNotes ?? Array.from(new Set(events.map((event) => event.note)));

  return {
    notes,
    measure: step.activeMeasure,
    phrase: step.activePhrase,
    events,
    timelineEvents: scopedTimelineEvents.length > 0 ? scopedTimelineEvents : song.timelineEvents,
  };
}

export function getLessonFocusFromPracticeSong(song: PracticeSong, step: LessonStep): LessonFocus {
  const scopedEvents = getPracticeEventsInScope(song, {
    measure: step.activeMeasure,
    phrase: step.activePhrase,
  });
  const scopedTimelineEvents = getPracticeTimelineInScope(song, {
    measure: step.activeMeasure,
    phrase: step.activePhrase,
  });
  const noteScopedEvents = step.activeNotes
    ? scopedEvents.filter((event) => step.activeNotes?.includes(event.note))
    : scopedEvents;
  const events =
    noteScopedEvents.length > 0
      ? noteScopedEvents
      : scopedEvents.length > 0
        ? scopedEvents
        : song.events;
  const notes = step.activeNotes ?? Array.from(new Set(events.map((event) => event.note)));

  return {
    notes,
    measure: step.activeMeasure,
    phrase: step.activePhrase,
    events,
    timelineEvents: scopedTimelineEvents.length > 0 ? scopedTimelineEvents : song.timelineEvents,
  };
}

export function getStudyRoutine(lesson: Lesson, step: LessonStep, focus: LessonFocus) {
  const phases = lesson.pedagogy.length > 0 ? lesson.pedagogy : coreLessonPedagogy;
  const focusedNotesText =
    focus.notes.length > 0
      ? focus.notes.map((note) => solfegeByNote[note]).join(", ")
      : "la partitura completa";
  const currentScope = focus.phrase
    ? `frase ${focus.phrase}`
    : focus.measure
      ? `compás ${focus.measure}`
      : "lección completa";

  return phases.map((phase) => {
    if (phase.id === "observe") {
      return { title: phase.label, detail: step.description };
    }

    if (phase.id === "understand") {
      return { title: phase.label, detail: step.conceptTitle ?? lesson.objective };
    }

    if (phase.id === "play") {
      return { title: phase.label, detail: `Practica ${focusedNotesText} en ${currentScope}.` };
    }

    return { title: phase.label, detail: phase.description };
  });
}
