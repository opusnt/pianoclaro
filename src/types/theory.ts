import type { NoteName, SolfegeName } from "@/types/lesson";

export type ChromaticNoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

export type KeySignatureName =
  | "Cb"
  | "Gb"
  | "Db"
  | "Ab"
  | "Eb"
  | "Bb"
  | "F"
  | "C"
  | "G"
  | "D"
  | "A"
  | "E"
  | "B"
  | "F#"
  | "C#";

export type KeySignatureDetails = {
  name: KeySignatureName;
  type: "natural" | "sharp" | "flat";
  alteredNotes: NoteName[];
  spanishName: string;
  beginnerExplanation: string;
};

export type TheoryConceptArea = "teclado" | "lectura" | "ritmo" | "tonalidad" | "practica";

export type TheoryKnowledgeItem = {
  id: string;
  area: TheoryConceptArea;
  title: string;
  summary: string;
  extractedFrom: string;
  pianoClaroUse: string;
  lessonHook: string;
};

export type NoteTheory = {
  note: NoteName;
  solfege: SolfegeName;
  midiInMiddleOctave: number;
  keyboardRole: "white-key";
  readingAnchor: string;
};
