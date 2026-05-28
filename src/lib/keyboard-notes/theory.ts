import { pianoLabelByNote, solfegeByNote, type PianoNoteName, type SharpNoteName } from "@/lib/music/notes";
import type { KeyboardNotesBlackKey, KeyboardNotesWhiteKey } from "@/types/keyboard-notes";
import type { NoteName } from "@/types/music";

export const keyboardNotesModuleId = "keyboard-notes";

export const whiteNoteOrder: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];

export const blackKeyPattern: Array<{
  note: SharpNoteName;
  afterWhiteIndex: number;
  groupType: 2 | 3;
}> = [
  { note: "C#", afterWhiteIndex: 0, groupType: 2 },
  { note: "D#", afterWhiteIndex: 1, groupType: 2 },
  { note: "F#", afterWhiteIndex: 3, groupType: 3 },
  { note: "G#", afterWhiteIndex: 4, groupType: 3 },
  { note: "A#", afterWhiteIndex: 5, groupType: 3 },
];

const baseFrequencies: Record<PianoNoteName, number> = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392,
  "G#": 415.3,
  A: 440,
  "A#": 466.16,
  B: 493.88,
};

export function frequencyFor(note: PianoNoteName, octave: number) {
  return baseFrequencies[note] * 2 ** (octave - 4);
}

export function buildKeyboard(octaves: number[]) {
  const whiteKeys: KeyboardNotesWhiteKey[] = octaves.flatMap((octave) =>
    whiteNoteOrder.map((note) => ({
      id: `${note}${octave}`,
      note,
      octave,
      label: solfegeByNote[note],
      frequency: frequencyFor(note, octave),
    })),
  );

  const blackKeys: KeyboardNotesBlackKey[] = octaves.flatMap((octave, octaveIndex) =>
    blackKeyPattern.map((key) => {
      const absoluteWhiteIndex = octaveIndex * 7 + key.afterWhiteIndex;

      return {
        id: `${key.note}${octave}`,
        note: key.note,
        octave,
        label: pianoLabelByNote[key.note],
        groupType: key.groupType,
        groupIndex: key.groupType === 2 ? octaveIndex * 2 : octaveIndex * 2 + 1,
        leftPercent: ((absoluteWhiteIndex + 1) / whiteKeys.length) * 100,
        frequency: frequencyFor(key.note, octave),
      };
    }),
  );

  return { whiteKeys, blackKeys };
}

export function nextPatternTarget(previous?: 2 | 3): 2 | 3 {
  return previous === 2 ? 3 : 2;
}

export function nextCOctave(previous: number) {
  return previous === 4 ? 5 : 4;
}

export function isCorrectBlackKeyGroup(key: KeyboardNotesBlackKey, targetGroup: 2 | 3) {
  return key.groupType === targetGroup;
}

export function isCorrectCKey(key: KeyboardNotesWhiteKey, targetOctave: number) {
  return key.note === "C" && key.octave === targetOctave;
}

export function getKeyboardNotesAccuracy(correct: number, attempts: number) {
  return attempts > 0 ? Math.round((correct / attempts) * 100) : 100;
}

export function getKeyboardNotesStageProgress({
  stage,
  patternHits,
  cHits,
}: {
  stage: "pattern" | "find-c" | "complete";
  patternHits: number;
  cHits: number;
}) {
  if (stage === "pattern") {
    return Math.min(100, (patternHits / 4) * 100);
  }

  if (stage === "find-c") {
    return Math.min(100, (cHits / 5) * 100);
  }

  return 100;
}
