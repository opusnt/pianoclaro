import type { Lesson, MeasureMock, NoteName, ScoreMock } from "@/types/lesson";
import type { KeySignatureName } from "@/types/theory";
import type { NoteDuration } from "@/types/music";
import { getDurationBeats, getMeasureEvents } from "@/lib/music/notation";

export type PianoClef = "treble" | "bass";
export type PracticeHand = "right" | "left" | "both";
export type PracticeVisualization = "sheet" | "keyboard" | "guided";

export type PianoClaroNoteEvent = {
  kind: "note";
  id: string;
  note: NoteName;
  midiNote: number;
  hand: PracticeHand;
  clef: PianoClef;
  measureNumber: number;
  noteIndex: number;
  beat: number;
  startsAtBeat: number;
  durationBeats: number;
  durationSeconds: number;
  rhythm: NoteDuration;
  phrase?: "A" | "B";
};

export type PianoClaroRestEvent = {
  kind: "rest";
  id: string;
  measureNumber: number;
  eventIndex: number;
  beat: number;
  startsAtBeat: number;
  durationBeats: number;
  durationSeconds: number;
  rhythm: NoteDuration;
  phrase?: "A" | "B";
};

export type PianoClaroTimelineEvent = PianoClaroNoteEvent | PianoClaroRestEvent;

export type PianoClaroSong = {
  id: string;
  title: string;
  clef: PianoClef;
  keySignature: string;
  timeSignature: string;
  beatsPerMeasure: number;
  measures: MeasureMock[];
  events: PianoClaroNoteEvent[];
  timelineEvents: PianoClaroTimelineEvent[];
};

export type PracticeSongTrack = {
  id: number;
  label: string;
  hand: PracticeHand;
  sound: boolean;
};

export type PracticeSongConfig = {
  tempoBpm: number;
  transpose: number;
  loop: {
    enabled: boolean;
    measureStart: number;
    measureEnd: number;
  };
  metronome: {
    enabled: boolean;
    emphasizeFirstBeat: boolean;
  };
  noteLabels: "solfege" | "letter" | "none";
  visualization: PracticeVisualization;
};

export type PracticeSong = PianoClaroSong & {
  source: "lesson-mock" | "midi-future";
  totalBeats: number;
  durationSeconds: number;
  tracks: PracticeSongTrack[];
  config: PracticeSongConfig;
};

const middleOctaveMidiByNote: Record<NoteName, number> = {
  C: 60,
  D: 62,
  E: 64,
  F: 65,
  G: 67,
  A: 69,
  B: 71,
};

const normalizedKeySignature: Record<string, KeySignatureName> = {
  "Do mayor": "C",
  "Sol mayor": "G",
  "Re mayor": "D",
  "Fa mayor": "F",
};

export function getBeatsPerMeasure(timeSignature: string) {
  const [numerator] = timeSignature.split("/").map(Number);
  return Number.isFinite(numerator) && numerator > 0 ? numerator : 4;
}

export function getRhythmDuration(rhythm: NoteDuration) {
  return getDurationBeats(rhythm);
}

export function getSecondsPerBeat(tempoBpm: number) {
  return 60 / tempoBpm;
}

export function getMidiNoteForScoreNote(note: NoteName, clef: PianoClef) {
  if (clef === "bass") {
    return middleOctaveMidiByNote[note] - 24;
  }

  return middleOctaveMidiByNote[note];
}

export function getKeySignatureName(keySignature: string): KeySignatureName {
  return normalizedKeySignature[keySignature] ?? "C";
}

export function scoreToSong(
  score: ScoreMock,
  id = score.title,
  tempoBpm = 72,
): PianoClaroSong {
  const beatsPerMeasure = getBeatsPerMeasure(score.timeSignature);
  const secondsPerBeat = getSecondsPerBeat(tempoBpm);
  const timelineEvents = score.measures.flatMap((measure) => {
    let beat = 1;
    let noteIndex = 0;

    return getMeasureEvents(measure).map((event, eventIndex) => {
      const durationBeats = getRhythmDuration(event.duration);
      const startsAtBeat = (measure.number - 1) * beatsPerMeasure + beat;
      beat += durationBeats;

      if (event.kind === "rest") {
        const restEvent: PianoClaroRestEvent = {
          kind: "rest",
          id: `${measure.number}:rest:${eventIndex}`,
          measureNumber: measure.number,
          eventIndex,
          beat: startsAtBeat - (measure.number - 1) * beatsPerMeasure,
          startsAtBeat,
          durationBeats,
          durationSeconds: durationBeats * secondsPerBeat,
          rhythm: event.duration,
          phrase: measure.phrase,
        };

        return restEvent;
      }

      const pianoEvent: PianoClaroNoteEvent = {
        kind: "note",
        id: `${measure.number}:${noteIndex}:${event.pitch.note}`,
        note: event.pitch.note,
        midiNote: getMidiNoteForScoreNote(event.pitch.note, score.clef),
        hand: score.clef === "bass" ? "left" : "right",
        clef: score.clef,
        measureNumber: measure.number,
        noteIndex,
        beat: startsAtBeat - (measure.number - 1) * beatsPerMeasure,
        startsAtBeat,
        durationBeats,
        durationSeconds: durationBeats * secondsPerBeat,
        rhythm: event.duration,
        phrase: measure.phrase,
      };

      noteIndex += 1;
      return pianoEvent;
    });
  });
  const events = timelineEvents.filter(
    (event): event is PianoClaroNoteEvent => event.kind === "note",
  );

  return {
    id,
    title: score.title,
    clef: score.clef,
    keySignature: score.keySignature,
    timeSignature: score.timeSignature,
    beatsPerMeasure,
    measures: score.measures,
    events,
    timelineEvents,
  };
}

export function lessonToSong(lesson: Lesson) {
  return scoreToSong(lesson.score, lesson.slug, lesson.tempoBpm);
}

export function lessonToPracticeSong(lesson: Lesson): PracticeSong {
  const tempoBpm = lesson.tempoBpm;
  const song = scoreToSong(lesson.score, lesson.slug, tempoBpm);
  const measureEnd = lesson.score.measures.at(-1)?.number ?? 1;
  const totalBeats = lesson.score.measures.reduce((total, measure) => {
    const measureDuration = getMeasureEvents(measure).reduce((beats, event) => {
      return beats + getDurationBeats(event.duration);
    }, 0);

    return Math.max(total, (measure.number - 1) * song.beatsPerMeasure + measureDuration);
  }, 0);

  return {
    ...song,
    source: "lesson-mock",
    totalBeats,
    durationSeconds: totalBeats * getSecondsPerBeat(tempoBpm),
    tracks: [
      {
        id: 0,
        label: song.clef === "bass" ? "Mano izquierda" : "Mano derecha",
        hand: song.clef === "bass" ? "left" : "right",
        sound: true,
      },
    ],
    config: {
      tempoBpm,
      transpose: 0,
      loop: {
        enabled: false,
        measureStart: 1,
        measureEnd,
      },
      metronome: {
        enabled: true,
        emphasizeFirstBeat: true,
      },
      noteLabels: "solfege",
      visualization: "sheet",
    },
  };
}

export function getPracticeEventsInScope(
  song: PracticeSong,
  scope: { measure?: number; phrase?: "A" | "B" },
) {
  return song.events.filter((event) => {
    if (scope.phrase) {
      return event.phrase === scope.phrase;
    }

    if (scope.measure) {
      return event.measureNumber === scope.measure;
    }

    return true;
  });
}

export function getPracticeTimelineInScope(
  song: PracticeSong,
  scope: { measure?: number; phrase?: "A" | "B" },
) {
  return song.timelineEvents.filter((event) => {
    if (scope.phrase) {
      return event.phrase === scope.phrase;
    }

    if (scope.measure) {
      return event.measureNumber === scope.measure;
    }

    return true;
  });
}
