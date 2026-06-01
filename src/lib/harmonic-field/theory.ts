import type {
  FunctionalRole,
  HarmonicFieldAnswer,
  HarmonicFieldChord,
  HarmonicFieldChordQuality,
  HarmonicFieldDefinition,
  ScaleDegree,
} from "@/types/harmonic-field";

const pitchClassToMidi: Record<string, number> = {
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

const midiToSharpPitchClass = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const displayByPitch: Record<string, string> = {
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

export const MAJOR_FIELD_QUALITIES: HarmonicFieldChordQuality[] = [
  "major",
  "minor",
  "minor",
  "major",
  "major",
  "minor",
  "diminished",
];

export const MAJOR_FIELD_DEGREES: ScaleDegree[] = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];

export const MAJOR_FUNCTIONS_BY_DEGREE: Record<ScaleDegree, FunctionalRole> = {
  I: "tonic",
  ii: "subdominant",
  iii: "tonic",
  IV: "subdominant",
  V: "dominant",
  vi: "tonic",
  "vii°": "dominant",
};

const functionLabels: Record<FunctionalRole, string> = {
  tonic: "casa",
  subdominant: "preparación",
  dominant: "tensión",
  other: "otro",
};

const qualityLabels: Record<HarmonicFieldChordQuality, string> = {
  major: "mayor",
  minor: "menor",
  diminished: "disminuido",
};

const fieldSeeds = [
  {
    id: "c-major",
    keyId: "C_MAJOR",
    internalName: "C Major harmonic field",
    displayName: "DO mayor",
    scaleNotes: ["C", "D", "E", "F", "G", "A", "B"],
    scaleMidiNotes: [60, 62, 64, 65, 67, 69, 71],
    difficulty: 1,
  },
  {
    id: "g-major",
    keyId: "G_MAJOR",
    internalName: "G Major harmonic field",
    displayName: "SOL mayor",
    scaleNotes: ["G", "A", "B", "C", "D", "E", "F#"],
    scaleMidiNotes: [67, 69, 71, 72, 74, 76, 78],
    difficulty: 2,
  },
  {
    id: "f-major",
    keyId: "F_MAJOR",
    internalName: "F Major harmonic field",
    displayName: "FA mayor",
    scaleNotes: ["F", "G", "A", "Bb", "C", "D", "E"],
    scaleMidiNotes: [65, 67, 69, 70, 72, 74, 76],
    difficulty: 3,
  },
  {
    id: "d-major",
    keyId: "D_MAJOR",
    internalName: "D Major harmonic field",
    displayName: "RE mayor",
    scaleNotes: ["D", "E", "F#", "G", "A", "B", "C#"],
    scaleMidiNotes: [62, 64, 66, 67, 69, 71, 73],
    difficulty: 4,
  },
] satisfies Array<Omit<HarmonicFieldDefinition, "chords">>;

export const harmonicFieldDefinitions: HarmonicFieldDefinition[] = fieldSeeds.map((seed) => ({
  ...seed,
  chords: buildMajorHarmonicField(seed.scaleNotes, seed.id),
}));

export function buildDiatonicTriad(scaleNotes: string[], degreeIndex: number): string[] {
  const sevenNotes = scaleNotes.slice(0, 7);
  const root = sevenNotes[degreeIndex % 7];
  const third = sevenNotes[(degreeIndex + 2) % 7];
  const fifth = sevenNotes[(degreeIndex + 4) % 7];
  return [root, third, fifth];
}

export function buildMajorHarmonicField(scaleNotes: string[], keyId: string): HarmonicFieldChord[] {
  return scaleNotes.slice(0, 7).map((root, index) => {
    const degree = MAJOR_FIELD_DEGREES[index];
    const quality = MAJOR_FIELD_QUALITIES[index];
    const notes = buildDiatonicTriad(scaleNotes, index);

    return {
      degree,
      root,
      quality,
      notes,
      midiNotes: convertChordNotesToMidi(notes),
      displayName: buildChordDisplayName(root, quality),
      functionRole: MAJOR_FUNCTIONS_BY_DEGREE[degree],
    };
  });
}

export function convertChordNotesToMidi(notes: string[], baseOctave = 4) {
  let previous = -Infinity;
  return notes.map((note, index) => {
    let midi = noteToMidi(`${stripOctave(note)}${index === 0 ? baseOctave : baseOctave}`);
    while (midi <= previous) midi += 12;
    previous = midi;
    return midi;
  });
}

export function getFieldById(id: string) {
  return harmonicFieldDefinitions.find((field) => field.id === id);
}

export function requireField(id: string) {
  const field = getFieldById(id);
  if (!field) throw new Error(`Unknown harmonic field: ${id}`);
  return field;
}

export function getChordByDegree(field: HarmonicFieldDefinition, degree: ScaleDegree) {
  const chord = field.chords.find((item) => item.degree === degree);
  if (!chord) throw new Error(`Missing degree ${degree} in ${field.id}`);
  return chord;
}

export function getChordProgressionFromDegrees(
  field: HarmonicFieldDefinition,
  progression: ScaleDegree[],
) {
  return progression.map((degree) => getChordByDegree(field, degree));
}

export function validateChordPitchClasses(expectedNotes: string[], selectedNotes: string[]) {
  const expected = normalizePitchClasses(expectedNotes);
  const selected = normalizePitchClasses(selectedNotes);
  return (
    expected.length === selected.length && expected.every((note, index) => note === selected[index])
  );
}

export function countCorrectChordNotes(expectedNotes: string[], selectedNotes: string[]) {
  const expected = new Set(normalizePitchClasses(expectedNotes));
  return [...new Set(normalizePitchClasses(selectedNotes))].filter((note) => expected.has(note))
    .length;
}

export function normalizePitchClasses(notes: string[]) {
  return [...new Set(notes.map(stripOctave).map((note) => pitchClassToMidi[note]))]
    .filter((note): note is number => typeof note === "number")
    .sort((a, b) => a - b)
    .map((pitchClass) => midiToSharpPitchClass[pitchClass]);
}

export function stripOctave(noteName: string) {
  return noteName.replace(/\d/g, "");
}

export function noteToMidi(noteName: string) {
  const match = noteName.match(/^([A-G](?:#|b)?)(-?\d)?$/);
  if (!match) throw new Error(`Invalid note: ${noteName}`);
  const pitch = match[1];
  const octave = typeof match[2] === "string" ? Number(match[2]) : 4;
  const pitchClass = pitchClassToMidi[pitch];
  if (typeof pitchClass !== "number") throw new Error(`Invalid pitch: ${noteName}`);
  return (octave + 1) * 12 + pitchClass;
}

export function midiToInternalNote(midi: number) {
  const pitch = midiToSharpPitchClass[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitch}${octave}`;
}

export function midiToFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function getDisplayPitchName(internalName: string) {
  return displayByPitch[stripOctave(internalName)] ?? internalName;
}

export function getDisplayNoteName(noteName: string) {
  const pitch = stripOctave(noteName);
  const octave = noteName.match(/\d$/)?.[0];
  return `${getDisplayPitchName(pitch)}${octave ?? ""}`;
}

export function getQualityLabel(quality: HarmonicFieldChordQuality) {
  return qualityLabels[quality];
}

export function getFunctionLabel(role: FunctionalRole) {
  return functionLabels[role];
}

export function buildChordDisplayName(root: string, quality: HarmonicFieldChordQuality) {
  return `${getDisplayPitchName(root)} ${qualityLabels[quality]}`;
}

export function getChordNoteNamesWithOctaves(chord: HarmonicFieldChord) {
  return chord.midiNotes.map(midiToInternalNote);
}

export function getChordDisplaySequence(chord: HarmonicFieldChord) {
  return chord.notes.map(getDisplayPitchName).join(" · ");
}

export function buildKeyboardNotes(startMidi = 48, endMidi = 78) {
  return Array.from({ length: endMidi - startMidi + 1 }, (_, index) => {
    const midi = startMidi + index;
    const internalName = midiToInternalNote(midi);
    const pitch = stripOctave(internalName);
    return {
      midi,
      internalName,
      displayName: getDisplayNoteName(internalName),
      octave: Math.floor(midi / 12) - 1,
      isBlackKey: pitch.includes("#"),
    };
  });
}

export function getWeakestKeys(answers: HarmonicFieldAnswer[]) {
  return countAnswerErrors(answers, "keyId");
}

export function getWeakestDegrees(answers: HarmonicFieldAnswer[]) {
  return countAnswerErrors(answers, "degree") as ScaleDegree[];
}

export function getWeakestChordQualities(answers: HarmonicFieldAnswer[]) {
  return countAnswerErrors(answers, "chordQuality") as HarmonicFieldChordQuality[];
}

export function getWeakestProgressions(answers: HarmonicFieldAnswer[]) {
  return countAnswerErrors(answers, "progressionId");
}

function countAnswerErrors<TKey extends "keyId" | "degree" | "chordQuality" | "progressionId">(
  answers: HarmonicFieldAnswer[],
  key: TKey,
) {
  const counts = new Map<string, number>();
  answers
    .filter((answer) => !answer.isCorrect)
    .forEach((answer) => {
      const value = answer[key];
      if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  const max = Math.max(0, ...counts.values());
  return [...counts.entries()]
    .filter(([, count]) => count === max && count > 0)
    .map(([value]) => value);
}
