import type { NoteName, SolfegeName } from "@/types/lesson";

export type SharpNoteName = "C#" | "D#" | "F#" | "G#" | "A#";

export type PianoNoteName = NoteName | SharpNoteName;

export const solfegeByNote: Record<NoteName, SolfegeName> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

export const pianoLabelByNote: Record<PianoNoteName, string> = {
  ...solfegeByNote,
  "C#": "Do#",
  "D#": "Re#",
  "F#": "Fa#",
  "G#": "Sol#",
  "A#": "La#",
};

export const noteFrequencies: Record<PianoNoteName, number> = {
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
