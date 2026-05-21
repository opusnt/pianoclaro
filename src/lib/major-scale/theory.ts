import type { NoteDefinition, ScaleAnswer, ScaleDefinition } from "@/types/major-scale";

export const MAJOR_SCALE_INTERVALS = [2, 2, 1, 2, 2, 2, 1] as const;
export const MAJOR_SCALE_CUMULATIVE_STEPS = [0, 2, 4, 5, 7, 9, 11, 12] as const;

const pitchClassToSemitone: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const sharpPitchClasses = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const displayByPitchClass: Record<string, string> = {
  C: "DO",
  "C#": "DO#",
  Db: "REb",
  D: "RE",
  "D#": "RE#",
  Eb: "MIb",
  E: "MI",
  F: "FA",
  "F#": "FA#",
  Gb: "SOLb",
  G: "SOL",
  "G#": "SOL#",
  Ab: "LAb",
  A: "LA",
  "A#": "LA#",
  Bb: "SIb",
  B: "SI",
};

export const scaleDefinitions: ScaleDefinition[] = [
  {
    id: "c-major",
    tonic: "C",
    internalName: "C Major",
    displayName: "DO mayor",
    difficulty: 1,
    notes: ["C", "D", "E", "F", "G", "A", "B", "C"],
    midiNotes: [60, 62, 64, 65, 67, 69, 71, 72],
    formula: [...MAJOR_SCALE_INTERVALS],
    cumulativeSteps: [...MAJOR_SCALE_CUMULATIVE_STEPS],
  },
  {
    id: "g-major",
    tonic: "G",
    internalName: "G Major",
    displayName: "SOL mayor",
    difficulty: 2,
    notes: ["G", "A", "B", "C", "D", "E", "F#", "G"],
    midiNotes: [67, 69, 71, 72, 74, 76, 78, 79],
    formula: [...MAJOR_SCALE_INTERVALS],
    cumulativeSteps: [...MAJOR_SCALE_CUMULATIVE_STEPS],
  },
  {
    id: "d-major",
    tonic: "D",
    internalName: "D Major",
    displayName: "RE mayor",
    difficulty: 3,
    notes: ["D", "E", "F#", "G", "A", "B", "C#", "D"],
    midiNotes: [62, 64, 66, 67, 69, 71, 73, 74],
    formula: [...MAJOR_SCALE_INTERVALS],
    cumulativeSteps: [...MAJOR_SCALE_CUMULATIVE_STEPS],
  },
  {
    id: "f-major",
    tonic: "F",
    internalName: "F Major",
    displayName: "FA mayor",
    difficulty: 3,
    notes: ["F", "G", "A", "Bb", "C", "D", "E", "F"],
    midiNotes: [65, 67, 69, 70, 72, 74, 76, 77],
    formula: [...MAJOR_SCALE_INTERVALS],
    cumulativeSteps: [...MAJOR_SCALE_CUMULATIVE_STEPS],
  },
];

export function noteToMidi(note: string) {
  const match = /^([A-G](?:#|b)?)(-?\d+)$/.exec(note);

  if (!match) {
    throw new Error(`Nota inválida: ${note}`);
  }

  const [, pitchClass, octaveText] = match;
  const semitone = pitchClassToSemitone[pitchClass];

  if (typeof semitone !== "number") {
    throw new Error(`Nota inválida: ${note}`);
  }

  return (Number(octaveText) + 1) * 12 + semitone;
}

export function midiToInternalNote(midi: number) {
  const pitchClass = sharpPitchClasses[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitchClass}${octave}`;
}

export function getDisplayNoteName(internalName: string) {
  const pitchClass = /^([A-G](?:#|b)?)/.exec(internalName)?.[1] ?? internalName;
  const octave = /(-?\d+)$/.exec(internalName)?.[1];
  return `${displayByPitchClass[pitchClass] ?? pitchClass}${octave ? octave : ""}`;
}

export function getDisplayPitchName(internalName: string) {
  const pitchClass = /^([A-G](?:#|b)?)/.exec(internalName)?.[1] ?? internalName;
  return displayByPitchClass[pitchClass] ?? pitchClass;
}

export function getNoteFrequency(noteOrMidi: string | number) {
  const midi = typeof noteOrMidi === "number" ? noteOrMidi : noteToMidi(noteOrMidi);
  return 440 * 2 ** ((midi - 69) / 12);
}

export function buildMajorScaleFromMidi(tonicMidi: number): number[] {
  return MAJOR_SCALE_CUMULATIVE_STEPS.map((step) => tonicMidi + step);
}

export function validatePlayedScale(tonicMidi: number, playedMidiNotes: number[]) {
  const expected = buildMajorScaleFromMidi(tonicMidi);

  if (playedMidiNotes.length !== expected.length) {
    return false;
  }

  return expected.every((note, index) => note === playedMidiNotes[index]);
}

export function getMissingNote(scaleNotes: string[], missingIndex: number) {
  return scaleNotes[missingIndex];
}

export function getWeakestScaleSteps(answers: ScaleAnswer[]): number[] {
  const counts = answers.reduce<Record<number, number>>((acc, answer) => {
    const step = answer.errorDetails?.wrongStepIndex;

    if (answer.isCorrect || typeof step !== "number") {
      return acc;
    }

    acc[step] = (acc[step] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([step]) => Number(step));
}

export function getScaleById(scaleId: string) {
  return scaleDefinitions.find((scale) => scale.id === scaleId);
}

export function getScaleNoteNamesWithOctaves(scale: ScaleDefinition) {
  return scale.midiNotes.map((midi, index) => {
    const pitchClass = scale.notes[index];
    const octave = Math.floor(midi / 12) - 1;
    return `${pitchClass}${octave}`;
  });
}

export function buildKeyboardNotes(startMidi = 60, endMidi = 84): NoteDefinition[] {
  return Array.from({ length: endMidi - startMidi + 1 }, (_, index) => {
    const midi = startMidi + index;
    const internalName = midiToInternalNote(midi);
    const pitchClass = /^([A-G]#?)/.exec(internalName)?.[1] ?? internalName;

    return {
      midi,
      internalName,
      displayName: getDisplayNoteName(internalName),
      octave: Math.floor(midi / 12) - 1,
      isBlackKey: pitchClass.includes("#"),
    };
  });
}

export function getScaleDisplaySequence(scale: ScaleDefinition) {
  return scale.notes.map(getDisplayPitchName).join(" · ");
}

export function getIntervalBetweenMidiNotes(previousMidi: number, currentMidi: number) {
  return currentMidi - previousMidi;
}

export function getStepLabel(interval: number) {
  return interval === 1 ? "Semitono" : "Tono";
}

export function createAlteredScaleMidiNotes(scale: ScaleDefinition, alteredIndex = 3, direction: 1 | -1 = 1) {
  return scale.midiNotes.map((midi, index) => {
    if (index === alteredIndex) {
      return midi + direction;
    }

    return midi;
  });
}
