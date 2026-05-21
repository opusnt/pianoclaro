import type {
  ChromaticNoteName,
  KeySignatureDetails,
  KeySignatureName,
} from "@/types/theory";

const blackPitchClasses = new Set([1, 3, 6, 8, 10]);

const keySignaturePitchClass: Record<KeySignatureName, number> = {
  Cb: 11,
  Gb: 6,
  Db: 1,
  Ab: 8,
  Eb: 3,
  Bb: 10,
  F: 5,
  C: 0,
  G: 7,
  D: 2,
  A: 9,
  E: 4,
  B: 11,
  "F#": 6,
  "C#": 1,
};

export const keySignatures: KeySignatureDetails[] = [
  {
    name: "C",
    type: "natural",
    alteredNotes: [],
    spanishName: "Do mayor",
    beginnerExplanation: "No tiene sostenidos ni bemoles. Es la tonalidad ideal para comenzar.",
  },
  {
    name: "G",
    type: "sharp",
    alteredNotes: ["F"],
    spanishName: "Sol mayor",
    beginnerExplanation: "Tiene Fa sostenido. Introduce una primera tecla negra con contexto.",
  },
  {
    name: "D",
    type: "sharp",
    alteredNotes: ["F", "C"],
    spanishName: "Re mayor",
    beginnerExplanation: "Tiene Fa sostenido y Do sostenido. Ayuda a leer patrones con dos alteraciones.",
  },
  {
    name: "F",
    type: "flat",
    alteredNotes: ["B"],
    spanishName: "Fa mayor",
    beginnerExplanation: "Tiene Si bemol. Es la primera tonalidad cómoda para practicar bemoles.",
  },
  {
    name: "Bb",
    type: "flat",
    alteredNotes: ["B", "E"],
    spanishName: "Si bemol mayor",
    beginnerExplanation: "Tiene Si bemol y Mi bemol. Prepara repertorio popular y acompañamientos.",
  },
];

export function isBlackMidiNote(midiNote: number) {
  return blackPitchClasses.has(midiNote % 12);
}

export function isWhiteMidiNote(midiNote: number) {
  return !isBlackMidiNote(midiNote);
}

export function getOctaveFromMidi(midiNote: number) {
  return Math.floor((midiNote - 12) / 12);
}

export function getChromaticNameFromMidi(midiNote: number): ChromaticNoteName {
  const names: ChromaticNoteName[] = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
  ];

  return names[midiNote % 12];
}

export function transposeKeySignature(
  keySignature: KeySignatureName,
  semitones: number,
): KeySignatureName {
  const shifted = (((keySignaturePitchClass[keySignature] + semitones) % 12) + 12) % 12;
  const candidates = Object.entries(keySignaturePitchClass).filter(([, pitchClass]) => {
    return pitchClass === shifted;
  });
  const currentUsesFlats = keySignature.includes("b");
  const preferred = candidates.find(([name]) => {
    return currentUsesFlats ? name.includes("b") : name.includes("#");
  });

  return (preferred?.[0] ?? candidates[0]?.[0] ?? "C") as KeySignatureName;
}
