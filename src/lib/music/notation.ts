import type { MeasureMock } from "@/types/lesson";
import type { MeasureEvent, NotatedNoteEvent, NoteDuration } from "@/types/music";

const durationBeats: Record<NoteDuration, number> = {
  redonda: 4,
  blanca: 2,
  negra: 1,
  corchea: 0.5,
};

export function getDurationBeats(duration: NoteDuration) {
  return durationBeats[duration];
}

export function getMeasureEvents(measure: MeasureMock): MeasureEvent[] {
  if (measure.events) {
    return measure.events;
  }

  return measure.notes.map((note, index) => ({
    kind: "note",
    pitch: { note },
    duration: measure.rhythm[index] ?? "negra",
  }));
}

export function getNotatedNotes(measure: MeasureMock): NotatedNoteEvent[] {
  return getMeasureEvents(measure).filter(
    (event): event is NotatedNoteEvent => event.kind === "note",
  );
}
