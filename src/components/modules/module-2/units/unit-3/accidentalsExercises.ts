export type AccidentalType = "sharp" | "flat" | "natural";

export interface AccidentalExercise {
  id: string;
  prompt: string;
  note: string; // La nota esperada que el usuario toque, ej. "C#4" o "Db4"
  accidental: AccidentalType;
  baseNote: string; // La nota base desde donde se altera, ej. "C4"
  direction: "up" | "down" | "none";
  semitones: number;
}

// Helper para generar ejercicios repetitivos en diferentes octavas (3 y 4 por defecto)
const generateSharpExercises = (): AccidentalExercise[] => {
  const bases = [
    { base: "C", expected: "C#", name: "DO" },
    { base: "D", expected: "D#", name: "RE" },
    { base: "F", expected: "F#", name: "FA" },
    { base: "G", expected: "G#", name: "SOL" },
    { base: "A", expected: "A#", name: "LA" },
  ];

  const exercises: AccidentalExercise[] = [];
  let idCounter = 1;

  for (let i = 0; i < 3; i++) {
    // 3 repeticiones por cada nota para llegar a 15
    for (const { base, expected, name } of bases) {
      const octave = idCounter % 2 === 0 ? 4 : 3;
      exercises.push({
        id: `sharp-${idCounter}`,
        prompt: `Toca ${name}#`,
        note: `${expected}${octave}`,
        accidental: "sharp",
        baseNote: `${base}${octave}`,
        direction: "up",
        semitones: 1,
      });
      idCounter++;
    }
  }

  return exercises;
};

const generateFlatExercises = (): AccidentalExercise[] => {
  const bases = [
    { base: "D", expected: "C#", expectedName: "Db", name: "RE" },
    { base: "E", expected: "D#", expectedName: "Eb", name: "MI" },
    { base: "G", expected: "F#", expectedName: "Gb", name: "SOL" },
    { base: "A", expected: "G#", expectedName: "Ab", name: "LA" },
    { base: "B", expected: "A#", expectedName: "Bb", name: "SI" },
  ];

  const exercises: AccidentalExercise[] = [];
  let idCounter = 1;

  for (let i = 0; i < 3; i++) {
    // 3 repeticiones por cada nota para llegar a 15
    for (const { base, expected, expectedName, name } of bases) {
      const octave = idCounter % 2 === 0 ? 4 : 3;
      exercises.push({
        id: `flat-${idCounter}`,
        prompt: `Toca ${name}b`,
        note: `${expected}${octave}`, // Tone.js usa C#, D# etc, así que pasamos la nota física. La validación se puede hacer por la nota o su enharmónico.
        accidental: "flat",
        baseNote: `${base}${octave}`,
        direction: "down",
        semitones: 1,
      });
      idCounter++;
    }
  }

  return exercises;
};

export const sharpExercises = generateSharpExercises();
export const flatExercises = generateFlatExercises();

export const getRandomExercises = (arr: AccidentalExercise[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
