import type { ChordAnswer, ChordDefinition, ChordQuality } from "@/types/chords";

export const CHORD_FORMULAS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
};

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

export const chordDefinitions: ChordDefinition[] = [
  { id: "c-major", tonic: "C", internalName: "C Major", displayName: "DO mayor", quality: "major", notes: ["C", "E", "G"], midiNotes: [60, 64, 67], formula: CHORD_FORMULAS.major, difficulty: 1 },
  { id: "g-major", tonic: "G", internalName: "G Major", displayName: "SOL mayor", quality: "major", notes: ["G", "B", "D"], midiNotes: [67, 71, 74], formula: CHORD_FORMULAS.major, difficulty: 2 },
  { id: "f-major", tonic: "F", internalName: "F Major", displayName: "FA mayor", quality: "major", notes: ["F", "A", "C"], midiNotes: [65, 69, 72], formula: CHORD_FORMULAS.major, difficulty: 2 },
  { id: "d-major", tonic: "D", internalName: "D Major", displayName: "RE mayor", quality: "major", notes: ["D", "F#", "A"], midiNotes: [62, 66, 69], formula: CHORD_FORMULAS.major, difficulty: 2 },
  { id: "a-minor", tonic: "A", internalName: "A Minor", displayName: "LA menor", quality: "minor", notes: ["A", "C", "E"], midiNotes: [57, 60, 64], formula: CHORD_FORMULAS.minor, difficulty: 1 },
  { id: "e-minor", tonic: "E", internalName: "E Minor", displayName: "MI menor", quality: "minor", notes: ["E", "G", "B"], midiNotes: [64, 67, 71], formula: CHORD_FORMULAS.minor, difficulty: 2 },
  { id: "d-minor", tonic: "D", internalName: "D Minor", displayName: "RE menor", quality: "minor", notes: ["D", "F", "A"], midiNotes: [62, 65, 69], formula: CHORD_FORMULAS.minor, difficulty: 2 },
  { id: "c-minor", tonic: "C", internalName: "C Minor", displayName: "DO menor", quality: "minor", notes: ["C", "Eb", "G"], midiNotes: [60, 63, 67], formula: CHORD_FORMULAS.minor, difficulty: 2 },
  { id: "b-diminished", tonic: "B", internalName: "B Diminished", displayName: "SI disminuido", quality: "diminished", notes: ["B", "D", "F"], midiNotes: [59, 62, 65], formula: CHORD_FORMULAS.diminished, difficulty: 3 },
  { id: "c-diminished", tonic: "C", internalName: "C Diminished", displayName: "DO disminuido", quality: "diminished", notes: ["C", "Eb", "Gb"], midiNotes: [60, 63, 66], formula: CHORD_FORMULAS.diminished, difficulty: 3 },
  { id: "c-augmented", tonic: "C", internalName: "C Augmented", displayName: "DO aumentado", quality: "augmented", notes: ["C", "E", "G#"], midiNotes: [60, 64, 68], formula: CHORD_FORMULAS.augmented, difficulty: 3 },
  { id: "g-augmented", tonic: "G", internalName: "G Augmented", displayName: "SOL aumentado", quality: "augmented", notes: ["G", "B", "D#"], midiNotes: [67, 71, 75], formula: CHORD_FORMULAS.augmented, difficulty: 3 },
];

export function getChordById(id: string) {
  return chordDefinitions.find((chord) => chord.id === id);
}

export function requireChord(id: string) {
  const chord = getChordById(id);
  if (!chord) throw new Error(`Unknown chord: ${id}`);
  return chord;
}

export function getDisplayPitchName(internalName: string) {
  return displayByPitch[stripOctave(internalName)] ?? internalName;
}

export function getDisplayNoteName(noteName: string) {
  const pitch = stripOctave(noteName);
  const octave = noteName.match(/\d$/)?.[0];
  return `${getDisplayPitchName(pitch)}${octave ?? ""}`;
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

export function buildChordFromMidi(tonicMidi: number, quality: ChordQuality) {
  return CHORD_FORMULAS[quality].map((step) => tonicMidi + step);
}

export function normalizePitchSet(notes: string[]) {
  return [...new Set(notes.map(stripOctave).map((note) => pitchClassToMidi[note]))].sort((a, b) => a - b);
}

export function validateChordNotes(expectedNotes: string[], playedNotes: string[]) {
  const expected = normalizePitchSet(expectedNotes);
  const played = normalizePitchSet(playedNotes);
  return expected.length === played.length && expected.every((note, index) => note === played[index]);
}

export function countCorrectChordNotes(expectedNotes: string[], playedNotes: string[]) {
  const expected = new Set(normalizePitchSet(expectedNotes));
  return new Set(normalizePitchSet(playedNotes)).size === 0
    ? 0
    : [...new Set(normalizePitchSet(playedNotes))].filter((note) => expected.has(note)).length;
}

export function getChordQualityLabel(quality: ChordQuality) {
  if (quality === "major") return "mayor";
  if (quality === "minor") return "menor";
  if (quality === "diminished") return "disminuido";
  return "aumentado";
}

export function getChordDisplaySequence(chord: ChordDefinition) {
  return chord.notes.map(getDisplayPitchName).join(" · ");
}

export function getChordNoteNamesWithOctaves(chord: ChordDefinition) {
  return chord.midiNotes.map(midiToInternalNote);
}

export function buildKeyboardNotes(startMidi = 57, endMidi = 77) {
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

export function getWeakestChordIds(answers: ChordAnswer[]) {
  return countAnswerErrors(answers, "chordId");
}

export function getWeakestChordQualities(answers: ChordAnswer[]) {
  return countAnswerErrors(answers, "chordQuality") as ChordQuality[];
}

function countAnswerErrors<TKey extends "chordId" | "chordQuality">(answers: ChordAnswer[], key: TKey) {
  const counts = new Map<string, number>();
  answers
    .filter((answer) => !answer.isCorrect)
    .forEach((answer) => counts.set(answer[key], (counts.get(answer[key]) ?? 0) + 1));
  const max = Math.max(0, ...counts.values());
  return [...counts.entries()]
    .filter(([, count]) => count === max && count > 0)
    .map(([value]) => value);
}
