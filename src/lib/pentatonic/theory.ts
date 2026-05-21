import type {
  NoteDefinition,
  PentatonicAnswer,
  PentatonicScaleDefinition,
  PentatonicType,
} from "@/types/pentatonic";

export const MAJOR_PENTATONIC_STEPS = [0, 2, 4, 7, 9, 12] as const;
export const MAJOR_PENTATONIC_INTERVALS = [2, 2, 3, 2, 3] as const;
export const MINOR_PENTATONIC_STEPS = [0, 3, 5, 7, 10, 12] as const;
export const MINOR_PENTATONIC_INTERVALS = [3, 2, 2, 3, 2] as const;

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

export const pentatonicScaleDefinitions: PentatonicScaleDefinition[] = [
  {
    id: "c-major-pentatonic",
    tonic: "C",
    internalName: "C Major Pentatonic",
    displayName: "DO pentatónica mayor",
    type: "major",
    relativeScaleId: "a-minor-pentatonic",
    notes: ["C", "D", "E", "G", "A", "C"],
    midiNotes: [60, 62, 64, 67, 69, 72],
    formula: [...MAJOR_PENTATONIC_STEPS],
    intervals: [...MAJOR_PENTATONIC_INTERVALS],
    difficulty: 1,
  },
  {
    id: "a-minor-pentatonic",
    tonic: "A",
    internalName: "A Minor Pentatonic",
    displayName: "LA pentatónica menor",
    type: "minor",
    relativeScaleId: "c-major-pentatonic",
    notes: ["A", "C", "D", "E", "G", "A"],
    midiNotes: [57, 60, 62, 64, 67, 69],
    formula: [...MINOR_PENTATONIC_STEPS],
    intervals: [...MINOR_PENTATONIC_INTERVALS],
    difficulty: 1,
  },
  {
    id: "g-major-pentatonic",
    tonic: "G",
    internalName: "G Major Pentatonic",
    displayName: "SOL pentatónica mayor",
    type: "major",
    relativeScaleId: "e-minor-pentatonic",
    notes: ["G", "A", "B", "D", "E", "G"],
    midiNotes: [67, 69, 71, 74, 76, 79],
    formula: [...MAJOR_PENTATONIC_STEPS],
    intervals: [...MAJOR_PENTATONIC_INTERVALS],
    difficulty: 2,
  },
  {
    id: "e-minor-pentatonic",
    tonic: "E",
    internalName: "E Minor Pentatonic",
    displayName: "MI pentatónica menor",
    type: "minor",
    relativeScaleId: "g-major-pentatonic",
    notes: ["E", "G", "A", "B", "D", "E"],
    midiNotes: [64, 67, 69, 71, 74, 76],
    formula: [...MINOR_PENTATONIC_STEPS],
    intervals: [...MINOR_PENTATONIC_INTERVALS],
    difficulty: 2,
  },
  {
    id: "f-major-pentatonic",
    tonic: "F",
    internalName: "F Major Pentatonic",
    displayName: "FA pentatónica mayor",
    type: "major",
    relativeScaleId: "d-minor-pentatonic",
    notes: ["F", "G", "A", "C", "D", "F"],
    midiNotes: [65, 67, 69, 72, 74, 77],
    formula: [...MAJOR_PENTATONIC_STEPS],
    intervals: [...MAJOR_PENTATONIC_INTERVALS],
    difficulty: 2,
  },
  {
    id: "d-minor-pentatonic",
    tonic: "D",
    internalName: "D Minor Pentatonic",
    displayName: "RE pentatónica menor",
    type: "minor",
    relativeScaleId: "f-major-pentatonic",
    notes: ["D", "F", "G", "A", "C", "D"],
    midiNotes: [62, 65, 67, 69, 72, 74],
    formula: [...MINOR_PENTATONIC_STEPS],
    intervals: [...MINOR_PENTATONIC_INTERVALS],
    difficulty: 2,
  },
];

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
  return `${displayByPitchClass[pitchClass] ?? pitchClass}${octave ?? ""}`;
}

export function getDisplayPitchName(internalName: string) {
  const pitchClass = /^([A-G](?:#|b)?)/.exec(internalName)?.[1] ?? internalName;
  return displayByPitchClass[pitchClass] ?? pitchClass;
}

export function getNoteFrequency(noteOrMidi: string | number) {
  const midi = typeof noteOrMidi === "number" ? noteOrMidi : noteToMidi(noteOrMidi);
  return 440 * 2 ** ((midi - 69) / 12);
}

export function getPentatonicScaleById(scaleId: string) {
  return pentatonicScaleDefinitions.find((scale) => scale.id === scaleId);
}

export function requirePentatonicScale(scaleId: string) {
  const scale = getPentatonicScaleById(scaleId);
  if (!scale) throw new Error(`Escala pentatónica no encontrada: ${scaleId}`);
  return scale;
}

export function buildPentatonicScaleFromMidi(tonicMidi: number, type: PentatonicType) {
  const steps = type === "major" ? MAJOR_PENTATONIC_STEPS : MINOR_PENTATONIC_STEPS;
  return steps.map((step) => tonicMidi + step);
}

export function validatePlayedPentatonicScale(
  tonicMidi: number,
  playedMidiNotes: number[],
  type: PentatonicType,
) {
  const expected = buildPentatonicScaleFromMidi(tonicMidi, type);
  if (playedMidiNotes.length !== expected.length) return false;
  return expected.every((note, index) => note === playedMidiNotes[index]);
}

export function removeOctave(note: string) {
  return /^([A-G](?:#|b)?)/.exec(note)?.[1] ?? note;
}

export function areRelativePentatonics(firstScaleId: string, secondScaleId: string) {
  const first = requirePentatonicScale(firstScaleId);
  const second = requirePentatonicScale(secondScaleId);
  const a = [...new Set(first.notes.map(removeOctave))].sort();
  const b = [...new Set(second.notes.map(removeOctave))].sort();
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getPentatonicDisplaySequence(scale: PentatonicScaleDefinition) {
  return scale.notes.map(getDisplayPitchName).join(" · ");
}

export function getPentatonicNoteNamesWithOctaves(scale: PentatonicScaleDefinition) {
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

export function getWeakestPentatonicScales(answers: PentatonicAnswer[]) {
  const counts = answers.reduce<Record<string, number>>((acc, answer) => {
    if (answer.isCorrect) return acc;
    acc[answer.scaleId] = (acc[answer.scaleId] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([scaleId]) => getPentatonicScaleById(scaleId)?.displayName ?? scaleId);
}
