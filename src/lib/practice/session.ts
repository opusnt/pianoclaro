import { pianoLabelByNote, solfegeByNote } from "@/lib/music/notes";
import type {
  PianoClaroNoteEvent,
  PianoClaroTimelineEvent,
  PracticeSong,
} from "@/lib/music/song-model";
import type { LessonFocus } from "@/lib/practice/lesson-engine";
import type { LessonStep } from "@/types/lesson";

export type PracticeSessionSummary = {
  scopeLabel: string;
  currentNoteLabel: string;
  currentBeatLabel: string;
  nextNotesLabel: string;
  nextTimelineLabel: string;
  rhythmLabel: string;
  completionPercent: number;
  eventCount: number;
};

export function getPracticeSessionSummary({
  song,
  focus,
  activeStep,
  activeEvent,
}: {
  song: PracticeSong;
  focus: LessonFocus;
  activeStep: LessonStep;
  activeEvent?: PianoClaroNoteEvent;
}): PracticeSessionSummary {
  const currentEvent = activeEvent ?? focus.events[0];
  const currentEventIndex = currentEvent
    ? Math.max(
        0,
        focus.events.findIndex((event) => event.id === currentEvent.id),
      )
    : 0;
  const nextNotes = focus.events
    .slice(currentEventIndex, currentEventIndex + 4)
    .map((event) => solfegeByNote[event.note]);
  const rhythms = Array.from(new Set(focus.events.map((event) => event.rhythm)));
  const currentTimelineIndex = currentEvent
    ? Math.max(
        0,
        focus.timelineEvents.findIndex((event) => event.id === currentEvent.id),
      )
    : 0;
  const nextTimelineEvents = focus.timelineEvents.slice(
    currentTimelineIndex,
    currentTimelineIndex + 4,
  );
  const scopeLabel = focus.phrase
    ? `Frase ${focus.phrase}`
    : focus.measure
      ? `Compás ${focus.measure}`
      : "Lección completa";
  const completionPercent =
    focus.events.length > 0 ? Math.round(((currentEventIndex + 1) / focus.events.length) * 100) : 0;

  return {
    scopeLabel,
    currentNoteLabel: currentEvent ? pianoLabelByNote[currentEvent.note] : "Sin nota activa",
    currentBeatLabel: currentEvent
      ? `Pulso ${currentEvent.beat} de ${song.beatsPerMeasure}`
      : activeStep.title,
    nextNotesLabel: nextNotes.length > 0 ? nextNotes.join(" · ") : "Sin notas pendientes",
    nextTimelineLabel: formatTimelineLabel(nextTimelineEvents),
    rhythmLabel: rhythms.length > 0 ? rhythms.join(" · ") : "ritmo libre",
    completionPercent,
    eventCount: focus.events.length,
  };
}

function formatTimelineLabel(events: PianoClaroTimelineEvent[]) {
  if (events.length === 0) {
    return "Sin eventos pendientes";
  }

  return events
    .map((event) => (event.kind === "rest" ? "Silencio" : solfegeByNote[event.note]))
    .join(" · ");
}
