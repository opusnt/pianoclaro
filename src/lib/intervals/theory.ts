import type { IntervalDefinition, IntervalDirection, IntervalQuestion } from "@/types/intervals";

const pitchClassToSemitone: Record<string, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

const semitoneToPitchClass = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const noteLabels: Record<string, string> = {
  C: "Do",
  "C#": "Do#",
  D: "Re",
  "D#": "Re#",
  E: "Mi",
  F: "Fa",
  "F#": "Fa#",
  G: "Sol",
  "G#": "Sol#",
  A: "La",
  "A#": "La#",
  B: "Si",
};

export const intervalDefinitions: IntervalDefinition[] = [
  { id: "unison", name: "unísono", semitones: 0, shortLabel: "0", difficulty: 1 },
  { id: "minor-second", name: "segunda menor", semitones: 1, shortLabel: "2m", difficulty: 1 },
  { id: "major-second", name: "segunda mayor", semitones: 2, shortLabel: "2M", difficulty: 1 },
  { id: "minor-third", name: "tercera menor", semitones: 3, shortLabel: "3m", difficulty: 2 },
  { id: "major-third", name: "tercera mayor", semitones: 4, shortLabel: "3M", difficulty: 2 },
  { id: "perfect-fourth", name: "cuarta justa", semitones: 5, shortLabel: "4J", difficulty: 2 },
  { id: "perfect-fifth", name: "quinta justa", semitones: 7, shortLabel: "5J", difficulty: 3 },
  { id: "perfect-octave", name: "octava justa", semitones: 12, shortLabel: "8J", difficulty: 3 },
];

export type KeyboardIntervalNote = {
  id: string;
  midi: number;
  pitchClass: string;
  octave: number;
  label: string;
  isBlack: boolean;
};

export function noteToMidi(note: string) {
  const match = /^([A-G]#?)(-?\d+)$/.exec(note);

  if (!match) {
    throw new Error(`Nota inválida: ${note}`);
  }

  const [, pitchClass, octaveText] = match;
  const semitone = pitchClassToSemitone[pitchClass];

  if (typeof semitone !== "number") {
    throw new Error(`Nota inválida: ${note}`);
  }

  return (Number(octaveText) + 1) * 12 + semitone;
}

export function midiToNote(midi: number) {
  const pitchClass = semitoneToPitchClass[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitchClass}${octave}`;
}

export function transposeNote(note: string, semitones: number) {
  return midiToNote(noteToMidi(note) + semitones);
}

export function getIntervalSemitones(baseNote: string, targetNote: string) {
  return noteToMidi(targetNote) - noteToMidi(baseNote);
}

export function getAbsoluteIntervalSemitones(baseNote: string, targetNote: string) {
  return Math.abs(getIntervalSemitones(baseNote, targetNote));
}

export function evaluateIntervalAnswer({
  baseNote,
  userNote,
  expectedSemitones,
  direction,
}: {
  baseNote: string;
  userNote: string;
  expectedSemitones: number;
  direction: IntervalDirection;
}) {
  const diff = getIntervalSemitones(baseNote, userNote);

  if (direction === "ascending") {
    return diff === expectedSemitones;
  }

  if (direction === "descending") {
    return diff === -expectedSemitones;
  }

  if (direction === "same") {
    return diff === 0;
  }

  return Math.abs(diff) === expectedSemitones;
}

export function getDirectionFromNotes(baseNote: string, targetNote: string): IntervalDirection {
  const diff = getIntervalSemitones(baseNote, targetNote);

  if (diff > 0) {
    return "ascending";
  }

  if (diff < 0) {
    return "descending";
  }

  return "same";
}

export function getDirectionLabel(direction: IntervalDirection) {
  const labels: Record<IntervalDirection, string> = {
    ascending: "sube",
    descending: "baja",
    same: "misma nota",
  };

  return labels[direction];
}

export function getIntervalDistanceCategory(semitones: number) {
  const absolute = Math.abs(semitones);

  if (absolute === 0) {
    return "misma nota";
  }

  if (absolute <= 2) {
    return "paso corto";
  }

  if (absolute <= 5) {
    return "salto medio";
  }

  return "salto grande";
}

export function getIntervalDefinitionById(id: string) {
  return intervalDefinitions.find((interval) => interval.id === id);
}

export function getIntervalDefinitionBySemitones(semitones: number) {
  return intervalDefinitions.find((interval) => interval.semitones === Math.abs(semitones));
}

export function getIntervalName(semitones: number) {
  return getIntervalDefinitionBySemitones(semitones)?.name ?? `${Math.abs(semitones)} semitonos`;
}

export function getNoteLabel(note: string) {
  const pitchClass = /^([A-G]#?)/.exec(note)?.[1] ?? note;
  const octave = /(-?\d+)$/.exec(note)?.[1];
  return `${noteLabels[pitchClass] ?? pitchClass}${octave ? octave : ""}`;
}

export function getNoteFrequency(note: string) {
  return 440 * 2 ** ((noteToMidi(note) - 69) / 12);
}

export function buildKeyboardNotes(startNote = "C4", endNote = "C5"): KeyboardIntervalNote[] {
  const startMidi = noteToMidi(startNote);
  const endMidi = noteToMidi(endNote);

  return Array.from({ length: endMidi - startMidi + 1 }, (_, index) => {
    const midi = startMidi + index;
    const id = midiToNote(midi);
    const pitchClass = /^([A-G]#?)/.exec(id)?.[1] ?? id;

    return {
      id,
      midi,
      pitchClass,
      octave: Math.floor(midi / 12) - 1,
      label: getNoteLabel(id),
      isBlack: pitchClass.includes("#"),
    };
  });
}

export function getExpectedOptionForQuestion(question: IntervalQuestion) {
  if (question.expectedOption) {
    return question.expectedOption;
  }

  if (question.taskType === "direction_recognition") {
    return getDirectionLabel(question.direction);
  }

  if (question.taskType === "melodic_vs_harmonic") {
    return question.playbackType === "harmonic" ? "armónico" : "melódico";
  }

  if (question.taskType === "audio_distance") {
    return getIntervalDistanceCategory(question.intervalSemitones);
  }

  return question.targetNote ?? "";
}
