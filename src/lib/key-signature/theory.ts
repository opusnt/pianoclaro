import type {
  AccidentalType,
  KeySignatureAnswer,
  KeySignatureDefinition,
  NoteDefinition,
} from "@/types/key-signature";

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

export const keySignatureDefinitions: KeySignatureDefinition[] = [
  {
    id: "c-major",
    internalName: "C Major",
    displayName: "DO mayor",
    tonic: "C",
    mode: "major",
    accidentals: [],
    accidentalType: "none",
    relativeKeyId: "a-minor",
    scaleNotes: ["C", "D", "E", "F", "G", "A", "B", "C"],
    midiNotes: [60, 62, 64, 65, 67, 69, 71, 72],
    difficulty: 1,
  },
  {
    id: "a-minor",
    internalName: "A Minor",
    displayName: "LA menor",
    tonic: "A",
    mode: "minor",
    accidentals: [],
    accidentalType: "none",
    relativeKeyId: "c-major",
    scaleNotes: ["A", "B", "C", "D", "E", "F", "G", "A"],
    midiNotes: [57, 59, 60, 62, 64, 65, 67, 69],
    difficulty: 1,
  },
  {
    id: "g-major",
    internalName: "G Major",
    displayName: "SOL mayor",
    tonic: "G",
    mode: "major",
    accidentals: ["F#"],
    accidentalType: "sharp",
    relativeKeyId: "e-minor",
    scaleNotes: ["G", "A", "B", "C", "D", "E", "F#", "G"],
    midiNotes: [67, 69, 71, 72, 74, 76, 78, 79],
    difficulty: 2,
  },
  {
    id: "e-minor",
    internalName: "E Minor",
    displayName: "MI menor",
    tonic: "E",
    mode: "minor",
    accidentals: ["F#"],
    accidentalType: "sharp",
    relativeKeyId: "g-major",
    scaleNotes: ["E", "F#", "G", "A", "B", "C", "D", "E"],
    midiNotes: [64, 66, 67, 69, 71, 72, 74, 76],
    difficulty: 2,
  },
  {
    id: "d-major",
    internalName: "D Major",
    displayName: "RE mayor",
    tonic: "D",
    mode: "major",
    accidentals: ["F#", "C#"],
    accidentalType: "sharp",
    relativeKeyId: "b-minor",
    scaleNotes: ["D", "E", "F#", "G", "A", "B", "C#", "D"],
    midiNotes: [62, 64, 66, 67, 69, 71, 73, 74],
    difficulty: 3,
  },
  {
    id: "b-minor",
    internalName: "B Minor",
    displayName: "SI menor",
    tonic: "B",
    mode: "minor",
    accidentals: ["F#", "C#"],
    accidentalType: "sharp",
    relativeKeyId: "d-major",
    scaleNotes: ["B", "C#", "D", "E", "F#", "G", "A", "B"],
    midiNotes: [59, 61, 62, 64, 66, 67, 69, 71],
    difficulty: 3,
  },
  {
    id: "f-major",
    internalName: "F Major",
    displayName: "FA mayor",
    tonic: "F",
    mode: "major",
    accidentals: ["Bb"],
    accidentalType: "flat",
    relativeKeyId: "d-minor",
    scaleNotes: ["F", "G", "A", "Bb", "C", "D", "E", "F"],
    midiNotes: [65, 67, 69, 70, 72, 74, 76, 77],
    difficulty: 2,
  },
  {
    id: "d-minor",
    internalName: "D Minor",
    displayName: "RE menor",
    tonic: "D",
    mode: "minor",
    accidentals: ["Bb"],
    accidentalType: "flat",
    relativeKeyId: "f-major",
    scaleNotes: ["D", "E", "F", "G", "A", "Bb", "C", "D"],
    midiNotes: [62, 64, 65, 67, 69, 70, 72, 74],
    difficulty: 2,
  },
  {
    id: "bb-major",
    internalName: "Bb Major",
    displayName: "SIb mayor",
    tonic: "Bb",
    mode: "major",
    accidentals: ["Bb", "Eb"],
    accidentalType: "flat",
    relativeKeyId: "g-minor",
    scaleNotes: ["Bb", "C", "D", "Eb", "F", "G", "A", "Bb"],
    midiNotes: [58, 60, 62, 63, 65, 67, 69, 70],
    difficulty: 4,
  },
  {
    id: "g-minor",
    internalName: "G Minor",
    displayName: "SOL menor",
    tonic: "G",
    mode: "minor",
    accidentals: ["Bb", "Eb"],
    accidentalType: "flat",
    relativeKeyId: "bb-major",
    scaleNotes: ["G", "A", "Bb", "C", "D", "Eb", "F", "G"],
    midiNotes: [67, 69, 70, 72, 74, 75, 77, 79],
    difficulty: 4,
  },
];

export function getDisplayNoteName(internalName: string) {
  const pitchClass = /^([A-G](?:#|b)?)/.exec(internalName)?.[1] ?? internalName;
  const octave = /(-?\d+)$/.exec(internalName)?.[1];
  return `${displayByPitchClass[pitchClass] ?? pitchClass}${octave ?? ""}`;
}

export function getDisplayPitchName(internalName: string) {
  const pitchClass = /^([A-G](?:#|b)?)/.exec(internalName)?.[1] ?? internalName;
  return displayByPitchClass[pitchClass] ?? pitchClass;
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

export function getNoteFrequency(noteOrMidi: string | number) {
  const midi = typeof noteOrMidi === "number" ? noteOrMidi : noteToMidi(noteOrMidi);
  return 440 * 2 ** ((midi - 69) / 12);
}

export function getKeySignatureById(id: string) {
  return keySignatureDefinitions.find((key) => key.id === id);
}

export function requireKeySignature(id: string) {
  const key = getKeySignatureById(id);
  if (!key) throw new Error(`Tonalidad no encontrada: ${id}`);
  return key;
}

export function getRelativeKey(keyId: string) {
  return requireKeySignature(requireKeySignature(keyId).relativeKeyId);
}

export function getAccidentalsForKey(keyId: string) {
  return requireKeySignature(keyId).accidentals;
}

export function validateScaleWithKeySignature(keyId: string, playedNotes: string[]) {
  const key = requireKeySignature(keyId);
  const playedMidi = playedNotes.map(noteToMidi);
  return key.midiNotes.length === playedMidi.length && key.midiNotes.every((midi, index) => midi === playedMidi[index]);
}

export function classifyAccidentalType(keyId: string): AccidentalType {
  return requireKeySignature(keyId).accidentalType;
}

export function areRelativeKeys(firstKeyId: string, secondKeyId: string) {
  return requireKeySignature(firstKeyId).relativeKeyId === secondKeyId;
}

export function findRelativeMinorFromMajor(majorTonicMidi: number) {
  return majorTonicMidi - 3;
}

export function findRelativeMajorFromMinor(minorTonicMidi: number) {
  return minorTonicMidi + 3;
}

export function getKeyDisplaySequence(key: KeySignatureDefinition) {
  return key.scaleNotes.map(getDisplayPitchName).join(" · ");
}

export function getScaleNoteNamesWithOctaves(key: KeySignatureDefinition) {
  return key.midiNotes.map((midi, index) => {
    const pitchClass = key.scaleNotes[index];
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

export function getAccidentalTypeLabel(type: AccidentalType) {
  if (type === "sharp") return "sostenidos";
  if (type === "flat") return "bemoles";
  return "sin alteraciones";
}

export function getWeakestKeys(answers: KeySignatureAnswer[]) {
  return getWeakestByKey(answers, "keyId").map((keyId) => getKeySignatureById(keyId)?.displayName ?? keyId);
}

export function getWeakestAccidentals(answers: KeySignatureAnswer[]) {
  const counts = answers.reduce<Record<string, number>>((acc, answer) => {
    if (answer.isCorrect) return acc;
    answer.errorDetails?.expectedAccidentals?.forEach((accidental) => {
      acc[accidental] = (acc[accidental] ?? 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([accidental]) => getDisplayPitchName(accidental));
}

export function getWeakestRelativePairs(answers: KeySignatureAnswer[]) {
  return answers
    .filter((answer) => !answer.isCorrect && answer.errorDetails?.expectedRelativeKey)
    .map((answer) => `${getKeySignatureById(answer.keyId)?.displayName ?? answer.keyId} / ${answer.errorDetails?.expectedRelativeKey}`)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function getWeakestByKey(answers: KeySignatureAnswer[], key: "keyId") {
  const counts = answers.reduce<Record<string, number>>((acc, answer) => {
    if (answer.isCorrect) return acc;
    acc[answer[key]] = (acc[answer[key]] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([id]) => id);
}
