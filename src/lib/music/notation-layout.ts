import { getDurationBeats, getMeasureEvents } from "@/lib/music/notation";
import type { MeasureMock } from "@/types/lesson";
import type { MeasureEvent, NotatedNoteEvent } from "@/types/music";

export type PositionedMeasureEvent = {
  event: MeasureEvent;
  eventIndex: number;
  noteIndex: number | null;
  startsAtBeat: number;
  durationBeats: number;
  x: number;
};

export function getPositionedMeasureEvents({
  measure,
  measureStart,
  measureWidth,
}: {
  measure: MeasureMock;
  measureStart: number;
  measureWidth: number;
}): PositionedMeasureEvent[] {
  const events = getMeasureEvents(measure);
  const totalBeats = events.reduce((beats, event) => {
    if (event.kind === "note" && event.isChord) return beats;
    return beats + getDurationBeats(event.duration);
  }, 0);

  const usableWidth = Math.max(measureWidth - 96, 1);
  let elapsedBeats = 0;
  let noteIndex = 0;

  return events.map((event, eventIndex) => {
    const durationBeats = getDurationBeats(event.duration);
    const isChord = event.kind === "note" && event.isChord;

    const startsAtBeat = elapsedBeats + 1;
    const xRatio = totalBeats > 0 ? elapsedBeats / totalBeats : 0;

    const positionedEvent: PositionedMeasureEvent = {
      event,
      eventIndex,
      noteIndex: event.kind === "note" ? noteIndex : null,
      startsAtBeat,
      durationBeats,
      x: measureStart + 38 + usableWidth * xRatio,
    };

    if (!isChord) {
      elapsedBeats += durationBeats;
    }

    if (event.kind === "note") {
      noteIndex += 1;
    }

    return positionedEvent;
  });
}

export function isPositionedNoteEvent(
  event: PositionedMeasureEvent,
): event is PositionedMeasureEvent & { event: NotatedNoteEvent; noteIndex: number } {
  return event.event.kind === "note" && event.noteIndex !== null;
}
