import type {
  MinorScaleAnswer,
  MinorScaleDefinition,
  MinorScaleType,
  NoteDefinition,
} from "@/types/minor-scale";

export const NATURAL_MINOR_INTERVALS = [2, 1, 2, 2, 1, 2, 2] as const;
export const NATURAL_MINOR_CUMULATIVE_STEPS = [0, 2, 3, 5, 7, 8, 10, 12] as const;
export const HARMONIC_MINOR_INTERVALS = [2, 1, 2, 2, 1, 3, 1] as const;
export const HARMONIC_MINOR_CUMULATIVE_STEPS = [0, 2, 3, 5, 7, 8, 11, 12] as const;
export const MELODIC_MINOR_ASC_INTERVALS = [2, 1, 2, 2, 2, 2, 1] as const;
export const MELODIC_MINOR_ASC_CUMULATIVE_STEPS = [0, 2, 3, 5, 7, 9, 11, 12] as const;
export const MAJOR_CUMULATIVE_STEPS = [0, 2, 4, 5, 7, 9, 11, 12] as const;

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

export const minorScaleDefinitions: MinorScaleDefinition[] = [
  {
    id: "a-minor-natural",
    tonic: "A",
    internalName: "A Minor Natural",
    displayName: "LA menor natural",
    scaleType: "natural",
    difficulty: 1,
    notes: ["A", "B", "C", "D", "E", "F", "G", "A"],
    midiNotes: [57, 59, 60, 62, 64, 65, 67, 69],
    formula: [...NATURAL_MINOR_INTERVALS],
    cumulativeSteps: [...NATURAL_MINOR_CUMULATIVE_STEPS],
  },
  {
    id: "c-minor-natural",
    tonic: "C",
    internalName: "C Minor Natural",
    displayName: "DO menor natural",
    scaleType: "natural",
    difficulty: 2,
    notes: ["C", "D", "Eb", "F", "G", "Ab", "Bb", "C"],
    midiNotes: [60, 62, 63, 65, 67, 68, 70, 72],
    formula: [...NATURAL_MINOR_INTERVALS],
    cumulativeSteps: [...NATURAL_MINOR_CUMULATIVE_STEPS],
  },
  {
    id: "e-minor-natural",
    tonic: "E",
    internalName: "E Minor Natural",
    displayName: "MI menor natural",
    scaleType: "natural",
    difficulty: 2,
    notes: ["E", "F#", "G", "A", "B", "C", "D", "E"],
    midiNotes: [64, 66, 67, 69, 71, 72, 74, 76],
    formula: [...NATURAL_MINOR_INTERVALS],
    cumulativeSteps: [...NATURAL_MINOR_CUMULATIVE_STEPS],
  },
  {
    id: "a-minor-harmonic",
    tonic: "A",
    internalName: "A Minor Harmonic",
    displayName: "LA menor armónica",
    scaleType: "harmonic",
    difficulty: 3,
    notes: ["A", "B", "C", "D", "E", "F", "G#", "A"],
    midiNotes: [57, 59, 60, 62, 64, 65, 68, 69],
    formula: [...HARMONIC_MINOR_INTERVALS],
    cumulativeSteps: [...HARMONIC_MINOR_CUMULATIVE_STEPS],
  },
  {
    id: "a-minor-melodic-ascending",
    tonic: "A",
    internalName: "A Minor Melodic Ascending",
    displayName: "LA menor melódica ascendente",
    scaleType: "melodic_ascending",
    difficulty: 4,
    notes: ["A", "B", "C", "D", "E", "F#", "G#", "A"],
    midiNotes: [57, 59, 60, 62, 64, 66, 68, 69],
    formula: [...MELODIC_MINOR_ASC_INTERVALS],
    cumulativeSteps: [...MELODIC_MINOR_ASC_CUMULATIVE_STEPS],
  },
];

export function getMinorScaleIntervals(scaleType: MinorScaleType): number[] {
  if (scaleType === "natural") return [...NATURAL_MINOR_INTERVALS];
  if (scaleType === "harmonic") return [...HARMONIC_MINOR_INTERVALS];
  if (scaleType === "melodic_ascending") return [...MELODIC_MINOR_ASC_INTERVALS];
  throw new Error("Unknown minor scale type");
}

export function getMinorScaleCumulativeSteps(scaleType: MinorScaleType): number[] {
  if (scaleType === "natural") return [...NATURAL_MINOR_CUMULATIVE_STEPS];
  if (scaleType === "harmonic") return [...HARMONIC_MINOR_CUMULATIVE_STEPS];
  if (scaleType === "melodic_ascending") return [...MELODIC_MINOR_ASC_CUMULATIVE_STEPS];
  throw new Error("Unknown minor scale type");
}

export function buildMinorScaleFromMidi(tonicMidi: number, scaleType: MinorScaleType): number[] {
  return getMinorScaleCumulativeSteps(scaleType).map((step) => tonicMidi + step);
}

export function validatePlayedMinorScale(
  tonicMidi: number,
  playedMidiNotes: number[],
  scaleType: MinorScaleType,
) {
  const expected = buildMinorScaleFromMidi(tonicMidi, scaleType);

  if (playedMidiNotes.length !== expected.length) return false;

  return expected.every((note, index) => note === playedMidiNotes[index]);
}

export function getMajorMinorDifferenceIndexes(): number[] {
  return [2];
}

export function getNaturalHarmonicDifferenceIndexes(): number[] {
  return [6];
}

export function getNaturalMelodicDifferenceIndexes(): number[] {
  return [5, 6];
}

export function noteToMidi(note: string) {
  const match = /^([A-G](?:#|b)?)(-?\d+)$/.exec(note);

  if (!match) throw new Error(`Nota inválida: ${note}`);

  const [, pitchClass, octaveText] = match;
  const semitone = pitchClassToSemitone[pitchClass];

  if (typeof semitone !== "number") throw new Error(`Nota inválida: ${note}`);

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

export function getMinorScaleById(scaleId: string) {
  return minorScaleDefinitions.find((scale) => scale.id === scaleId);
}

export function getMinorScaleNoteNamesWithOctaves(scale: MinorScaleDefinition) {
  return scale.midiNotes.map((midi, index) => {
    const pitchClass = scale.notes[index];
    const octave = Math.floor(midi / 12) - 1;
    return `${pitchClass}${octave}`;
  });
}

export function buildKeyboardNotes(startMidi = 57, endMidi = 84): NoteDefinition[] {
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

export function getMinorScaleDisplaySequence(scale: MinorScaleDefinition) {
  return scale.notes.map(getDisplayPitchName).join(" · ");
}

export function getIntervalBetweenMidiNotes(previousMidi: number, currentMidi: number) {
  return currentMidi - previousMidi;
}

export function getWeakestScaleSteps(answers: MinorScaleAnswer[]): number[] {
  const counts = answers.reduce<Record<number, number>>((acc, answer) => {
    const step = answer.errorDetails?.wrongStepIndex;

    if (answer.isCorrect || typeof step !== "number") return acc;

    acc[step] = (acc[step] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([step]) => Number(step));
}

export function getScaleTypeLabel(scaleType: MinorScaleType) {
  if (scaleType === "natural") return "menor natural";
  if (scaleType === "harmonic") return "menor armónica";
  return "menor melódica ascendente";
}
