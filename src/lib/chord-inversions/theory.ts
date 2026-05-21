import type {
  ChordInversionAnswer,
  ChordInversionDefinition,
  ChordInversionQuality,
  ChordInversionType,
} from "@/types/chord-inversions";

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

const inversionLabels: Record<ChordInversionType, string> = {
  root_position: "posición fundamental",
  first_inversion: "primera inversión",
  second_inversion: "segunda inversión",
};

const baseTriads = [
  { chordId: "c-major", chordDisplayName: "DO mayor", quality: "major", root: "C", notes: ["C", "E", "G"], midiNotes: [60, 64, 67], difficulty: 1 },
  { chordId: "g-major", chordDisplayName: "SOL mayor", quality: "major", root: "G", notes: ["G", "B", "D"], midiNotes: [55, 59, 62], difficulty: 2 },
  { chordId: "f-major", chordDisplayName: "FA mayor", quality: "major", root: "F", notes: ["F", "A", "C"], midiNotes: [53, 57, 60], difficulty: 2 },
  { chordId: "a-minor", chordDisplayName: "LA menor", quality: "minor", root: "A", notes: ["A", "C", "E"], midiNotes: [57, 60, 64], difficulty: 1 },
  { chordId: "e-minor", chordDisplayName: "MI menor", quality: "minor", root: "E", notes: ["E", "G", "B"], midiNotes: [52, 55, 59], difficulty: 2 },
  { chordId: "d-minor", chordDisplayName: "RE menor", quality: "minor", root: "D", notes: ["D", "F", "A"], midiNotes: [50, 53, 57], difficulty: 2 },
] satisfies Array<{
  chordId: string;
  chordDisplayName: string;
  quality: ChordInversionQuality;
  root: string;
  notes: string[];
  midiNotes: number[];
  difficulty: 1 | 2 | 3;
}>;

export const chordInversionDefinitions: ChordInversionDefinition[] = baseTriads.flatMap((triad) =>
  (["root_position", "first_inversion", "second_inversion"] as const).map((inversionType) => {
    const midiNotes = buildTriadInversionMidi(triad.midiNotes, inversionType);
    const noteOrder = buildTriadInversionNotes(triad.notes, inversionType);
    const bassNote = stripOctave(midiToInternalNote(getBassNote(midiNotes)));
    return {
      id: `${triad.chordId.replace("-", "-")}-${inversionIdSuffix(inversionType)}`,
      chordId: triad.chordId,
      chordDisplayName: triad.chordDisplayName,
      quality: triad.quality,
      inversionType,
      inversionDisplayName: inversionLabels[inversionType],
      root: triad.root,
      bassNote,
      notes: noteOrder,
      midiNotes,
      slashNotation: inversionType === "root_position" ? triad.root : `${triad.root}/${bassNote}`,
      difficulty: inversionType === "root_position" ? triad.difficulty : ((triad.difficulty + 1) as 2 | 3),
    };
  }),
);

export function buildTriadInversionMidi(rootMidiNotes: number[], inversionType: ChordInversionType): number[] {
  if (inversionType === "root_position") return rootMidiNotes;
  if (inversionType === "first_inversion") return [rootMidiNotes[1], rootMidiNotes[2], rootMidiNotes[0] + 12];
  if (inversionType === "second_inversion") return [rootMidiNotes[2], rootMidiNotes[0] + 12, rootMidiNotes[1] + 12];
  throw new Error("Unknown inversion type");
}

export function buildTriadInversionNotes(rootNotes: string[], inversionType: ChordInversionType): string[] {
  if (inversionType === "root_position") return rootNotes;
  if (inversionType === "first_inversion") return [rootNotes[1], rootNotes[2], rootNotes[0]];
  if (inversionType === "second_inversion") return [rootNotes[2], rootNotes[0], rootNotes[1]];
  throw new Error("Unknown inversion type");
}

export function getBassNote(midiNotes: number[]): number {
  return Math.min(...midiNotes);
}

export function normalizePitchClasses(notes: string[]): string[] {
  return [...new Set(notes.map(stripOctave).map((note) => pitchClassToMidi[note]))]
    .filter((note): note is number => typeof note === "number")
    .sort((a, b) => a - b)
    .map((pitchClass) => midiToSharpPitchClass[pitchClass]);
}

export function validateInversion(
  expectedPitchClasses: string[],
  expectedBassPitchClass: string,
  playedNotes: string[],
) {
  const expected = normalizePitchClasses(expectedPitchClasses);
  const played = normalizePitchClasses(playedNotes);
  const hasCorrectNotes = expected.length === played.length && expected.every((note, index) => note === played[index]);
  const userBass = getPlayedBassPitchClass(playedNotes);
  const hasCorrectBass = userBass === normalizePitchClasses([expectedBassPitchClass])[0];

  return {
    hasCorrectNotes,
    hasCorrectBass,
    isCorrect: hasCorrectNotes && hasCorrectBass,
  };
}

export function identifyInversion(chordPitchClasses: string[], bassPitchClass: string): ChordInversionType {
  const normalizedChord = chordPitchClasses.map(stripOctave);
  const normalizedBass = stripOctave(bassPitchClass);
  if (normalizedBass === normalizedChord[0]) return "root_position";
  if (normalizedBass === normalizedChord[1]) return "first_inversion";
  if (normalizedBass === normalizedChord[2]) return "second_inversion";
  return "root_position";
}

export function getInversionById(id: string) {
  return chordInversionDefinitions.find((inversion) => inversion.id === id);
}

export function requireInversion(id: string) {
  const inversion = getInversionById(id);
  if (!inversion) throw new Error(`Unknown inversion: ${id}`);
  return inversion;
}

export function getInversionLabel(inversionType: ChordInversionType) {
  return inversionLabels[inversionType];
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

export function getInversionDisplaySequence(inversion: ChordInversionDefinition) {
  return inversion.notes.map(getDisplayPitchName).join(" · ");
}

export function getInversionNoteNamesWithOctaves(inversion: ChordInversionDefinition) {
  return inversion.midiNotes.map(midiToInternalNote);
}

export function getPlayedBassPitchClass(playedNotes: string[]) {
  if (playedNotes.length === 0) return undefined;
  const bassMidi = Math.min(...playedNotes.map(noteToMidi));
  return stripOctave(midiToInternalNote(bassMidi));
}

export function countCorrectInversionNotes(expectedNotes: string[], playedNotes: string[]) {
  const expected = new Set(normalizePitchClasses(expectedNotes));
  return [...new Set(normalizePitchClasses(playedNotes))].filter((note) => expected.has(note)).length;
}

export function haveSamePitchClasses(first: string[], second: string[]) {
  const a = normalizePitchClasses(first);
  const b = normalizePitchClasses(second);
  return a.length === b.length && a.every((note, index) => note === b[index]);
}

export function buildKeyboardNotes(startMidi = 50, endMidi = 76) {
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

export function getWeakestChordIds(answers: ChordInversionAnswer[]) {
  return countAnswerErrors(answers, "chordId");
}

export function getWeakestInversionTypes(answers: ChordInversionAnswer[]) {
  return countAnswerErrors(answers, "inversionType") as ChordInversionType[];
}

function inversionIdSuffix(inversionType: ChordInversionType) {
  if (inversionType === "root_position") return "root";
  if (inversionType === "first_inversion") return "first";
  return "second";
}

function countAnswerErrors<TKey extends "chordId" | "inversionType">(answers: ChordInversionAnswer[], key: TKey) {
  const counts = new Map<string, number>();
  answers
    .filter((answer) => !answer.isCorrect)
    .forEach((answer) => counts.set(answer[key], (counts.get(answer[key]) ?? 0) + 1));
  const max = Math.max(0, ...counts.values());
  return [...counts.entries()]
    .filter(([, count]) => count === max && count > 0)
    .map(([value]) => value);
}

