export type TrebleClefExercise = {
  id: string;
  targetNoteId: string; // "do", "re", "mi", etc.
  difficulty: number; // 1 = notas vecinas (FA, LA), 2 = un poco más lejos (MI, SI), 3 = lejos (DO, RE)
};

// 25 ejercicios progresivos de reconocimiento de notas
export const trebleClefExercises: TrebleClefExercise[] = [
  // Nivel 1: El ancla y sus vecinos (SOL, LA, FA)
  { id: "treb-1", targetNoteId: "sol", difficulty: 1 },
  { id: "treb-2", targetNoteId: "la", difficulty: 1 },
  { id: "treb-3", targetNoteId: "fa", difficulty: 1 },
  { id: "treb-4", targetNoteId: "sol", difficulty: 1 },
  { id: "treb-5", targetNoteId: "la", difficulty: 1 },
  { id: "treb-6", targetNoteId: "fa", difficulty: 1 },
  { id: "treb-7", targetNoteId: "sol", difficulty: 1 },
  { id: "treb-8", targetNoteId: "la", difficulty: 1 },

  // Nivel 2: Expandiendo a MI y SI
  { id: "treb-9", targetNoteId: "si", difficulty: 2 },
  { id: "treb-10", targetNoteId: "mi", difficulty: 2 },
  { id: "treb-11", targetNoteId: "sol", difficulty: 1 },
  { id: "treb-12", targetNoteId: "la", difficulty: 1 },
  { id: "treb-13", targetNoteId: "si", difficulty: 2 },
  { id: "treb-14", targetNoteId: "fa", difficulty: 1 },
  { id: "treb-15", targetNoteId: "mi", difficulty: 2 },
  { id: "treb-16", targetNoteId: "si", difficulty: 2 },

  // Nivel 3: El pentagrama completo (incluyendo DO y RE)
  { id: "treb-17", targetNoteId: "do", difficulty: 3 },
  { id: "treb-18", targetNoteId: "re", difficulty: 3 },
  { id: "treb-19", targetNoteId: "fa", difficulty: 1 },
  { id: "treb-20", targetNoteId: "do", difficulty: 3 },
  { id: "treb-21", targetNoteId: "la", difficulty: 1 },
  { id: "treb-22", targetNoteId: "si", difficulty: 2 },
  { id: "treb-23", targetNoteId: "re", difficulty: 3 },
  { id: "treb-24", targetNoteId: "mi", difficulty: 2 },
  { id: "treb-25", targetNoteId: "do", difficulty: 3 },
];

export const guidedReadingSequences = [
  ["sol", "la", "si"],
  ["si", "la", "sol"],
  ["mi", "fa", "sol"],
  ["do", "re", "mi"],
];

export const activeReadingSequence = ["sol", "la", "si", "la", "sol"];

// Melodía tipo himno a la alegría o estrellita
// SOL SOL LA SOL MI es una frase simple que suena musical.
export const microMelodySequence = ["sol", "sol", "la", "sol", "mi"];
