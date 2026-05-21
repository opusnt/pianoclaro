import type { MeasureMock } from "@/types/lesson";
import type {
  MeasureEvent,
  NoteDuration,
  NoteName,
  NotatedNoteEvent,
  SolfegeName,
} from "@/types/music";

const solfegeByNote: Record<NoteName, SolfegeName> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

export function note(
  noteName: NoteName,
  duration: NoteDuration = "negra",
): NotatedNoteEvent {
  return {
    kind: "note",
    pitch: { note: noteName },
    duration,
  };
}

export function notes(...noteNames: NoteName[]) {
  return noteNames.map((noteName) => note(noteName));
}

export function rest(duration: NoteDuration): MeasureEvent {
  return {
    kind: "rest",
    duration,
  };
}

export function createMeasure(
  number: number,
  events: MeasureEvent[],
  phrase?: "A" | "B",
): MeasureMock {
  const noteEvents = events.filter(
    (event): event is NotatedNoteEvent => event.kind === "note",
  );

  return {
    number,
    notes: noteEvents.map((event) => event.pitch.note),
    solfege: noteEvents.map((event) => solfegeByNote[event.pitch.note]),
    rhythm: noteEvents.map((event) => event.duration),
    events,
    phrase,
  };
}
