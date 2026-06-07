export type NotationAccidental = "sharp" | "flat" | "natural";

export type AccidentalExerciseNote = {
  id: string;
  note: string; // Ej: "C4", "F4" (Nota base del pentagrama)
  yPos: number; // Posición vertical en PitchVisualizer
  accidental?: NotationAccidental;
  measure: number;
  // Propiedad para evaluación
  expectedMidiBase: string; // Ej: "C", "F"
  expectedAccidentalMod: "sharp" | "flat" | "natural"; // Lo que el alumno debe tocar realmente
};

export type AccidentalNotationExercise = {
  id: string;
  title: string;
  description: string;
  notes: AccidentalExerciseNote[];
};

export const accidentalNotationExercises: AccidentalNotationExercise[] = [
  {
    id: "detective-1",
    title: "El efecto del compás",
    description: "¿Qué notas siguen alteradas?",
    notes: [
      {
        id: "n1",
        note: "FA",
        yPos: 27.5,
        accidental: "sharp",
        measure: 1,
        expectedMidiBase: "F",
        expectedAccidentalMod: "sharp",
      },
      {
        id: "n2",
        note: "SOL",
        yPos: 35,
        measure: 1,
        expectedMidiBase: "G",
        expectedAccidentalMod: "natural",
      },
      {
        id: "n3",
        note: "FA",
        yPos: 27.5,
        measure: 1,
        expectedMidiBase: "F",
        expectedAccidentalMod: "sharp",
      }, // Sigue activa
      {
        id: "n4",
        note: "FA",
        yPos: 27.5,
        measure: 2,
        expectedMidiBase: "F",
        expectedAccidentalMod: "natural",
      }, // Cancelada por barra
    ],
  },
  {
    id: "detective-2",
    title: "El poder del becuadro",
    description: "Cuidado con las cancelaciones",
    notes: [
      {
        id: "n1",
        note: "SI",
        yPos: 50,
        accidental: "flat",
        measure: 1,
        expectedMidiBase: "B",
        expectedAccidentalMod: "flat",
      },
      {
        id: "n2",
        note: "LA",
        yPos: 42.5,
        measure: 1,
        expectedMidiBase: "A",
        expectedAccidentalMod: "natural",
      },
      {
        id: "n3",
        note: "SI",
        yPos: 50,
        accidental: "natural",
        measure: 1,
        expectedMidiBase: "B",
        expectedAccidentalMod: "natural",
      }, // Cancelada por becuadro
      {
        id: "n4",
        note: "SI",
        yPos: 50,
        measure: 1,
        expectedMidiBase: "B",
        expectedAccidentalMod: "natural",
      }, // Sigue natural
    ],
  },
  {
    id: "detective-3",
    title: "Múltiples alteraciones",
    description: "Sigue la pista a cada alteración",
    notes: [
      {
        id: "n1",
        note: "DO",
        yPos: 5,
        accidental: "sharp",
        measure: 1,
        expectedMidiBase: "C",
        expectedAccidentalMod: "sharp",
      },
      {
        id: "n2",
        note: "FA",
        yPos: 27.5,
        accidental: "sharp",
        measure: 1,
        expectedMidiBase: "F",
        expectedAccidentalMod: "sharp",
      },
      {
        id: "n3",
        note: "DO",
        yPos: 5,
        measure: 1,
        expectedMidiBase: "C",
        expectedAccidentalMod: "sharp",
      },
      {
        id: "n4",
        note: "DO",
        yPos: 5,
        measure: 2,
        expectedMidiBase: "C",
        expectedAccidentalMod: "natural",
      }, // Cancelada
    ],
  },
  {
    id: "detective-4",
    title: "Desafío Final",
    description: "Demuestra tu dominio absoluto",
    notes: [
      {
        id: "n1",
        note: "FA",
        yPos: 27.5,
        accidental: "sharp",
        measure: 1,
        expectedMidiBase: "F",
        expectedAccidentalMod: "sharp",
      },
      {
        id: "n2",
        note: "SOL",
        yPos: 35,
        measure: 1,
        expectedMidiBase: "G",
        expectedAccidentalMod: "natural",
      },
      {
        id: "n3",
        note: "FA",
        yPos: 27.5,
        measure: 1,
        expectedMidiBase: "F",
        expectedAccidentalMod: "sharp",
      },

      {
        id: "n4",
        note: "FA",
        yPos: 27.5,
        measure: 2,
        expectedMidiBase: "F",
        expectedAccidentalMod: "natural",
      },
      {
        id: "n5",
        note: "SOL",
        yPos: 35,
        accidental: "flat",
        measure: 2,
        expectedMidiBase: "G",
        expectedAccidentalMod: "flat",
      },
      {
        id: "n6",
        note: "FA",
        yPos: 27.5,
        accidental: "sharp",
        measure: 2,
        expectedMidiBase: "F",
        expectedAccidentalMod: "sharp",
      },

      {
        id: "n7",
        note: "FA",
        yPos: 27.5,
        accidental: "natural",
        measure: 3,
        expectedMidiBase: "F",
        expectedAccidentalMod: "natural",
      },
      {
        id: "n8",
        note: "SOL",
        yPos: 35,
        measure: 3,
        expectedMidiBase: "G",
        expectedAccidentalMod: "natural",
      }, // Flat cancelled by bar
      {
        id: "n9",
        note: "FA",
        yPos: 27.5,
        measure: 3,
        expectedMidiBase: "F",
        expectedAccidentalMod: "natural",
      },
    ],
  },
];

export function generateRandomNotationExercises(count: number): AccidentalNotationExercise[] {
  // Para la etapa 6: juegos interactivos rápidos (A vs B)
  // Devolvemos pequeños ejercicios generados al azar
  const exercises: AccidentalNotationExercise[] = [];

  for (let i = 0; i < count; i++) {
    const isSharp = Math.random() > 0.5;
    const isCancelled = Math.random() > 0.5;
    const cancelMethod = Math.random() > 0.5 ? "bar" : "natural";

    // Ejercicio base:
    // N1 (alterada), N2 (otra), N3 (evaluada)

    let n3Expected: "sharp" | "flat" | "natural" = isSharp ? "sharp" : "flat";
    let n3Accidental: NotationAccidental | undefined;
    let n3Measure = 1;

    if (isCancelled) {
      n3Expected = "natural";
      if (cancelMethod === "bar") {
        n3Measure = 2;
      } else {
        n3Accidental = "natural";
      }
    }

    exercises.push({
      id: `random-${i}`,
      title: "Juego Rápido",
      description: "¿Cómo suena esta nota?",
      notes: [
        {
          id: "n1",
          note: "FA",
          yPos: 27.5,
          accidental: isSharp ? "sharp" : "flat",
          measure: 1,
          expectedMidiBase: "F",
          expectedAccidentalMod: isSharp ? "sharp" : "flat",
        },
        {
          id: "n2",
          note: "SOL",
          yPos: 35,
          measure: 1,
          expectedMidiBase: "G",
          expectedAccidentalMod: "natural",
        },
        {
          id: "n3",
          note: "FA",
          yPos: 27.5,
          measure: n3Measure,
          accidental: n3Accidental,
          expectedMidiBase: "F",
          expectedAccidentalMod: n3Expected,
        },
      ],
    });
  }

  return exercises;
}
