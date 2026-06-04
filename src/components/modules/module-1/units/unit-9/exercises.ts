import type { RhythmFigureId } from "@/lib/music/rhythmFigures";

export interface TieExercise {
  id: string;
  figures: RhythmFigureId[];
  isTied: boolean;
  correctAnswer: "separated" | "long";
}

export const tieExercises: TieExercise[] = [
  {
    id: "tie-1",
    figures: ["quarter", "quarter"],
    isTied: true,
    correctAnswer: "long",
  },
  {
    id: "tie-2",
    figures: ["half", "quarter"], // No ligadas visualmente
    isTied: false,
    correctAnswer: "separated",
  },
  {
    id: "tie-3",
    figures: ["half", "half"],
    isTied: true,
    correctAnswer: "long",
  },
];

export interface DottedNoteExercise {
  id: string;
  figureA: {
    id: RhythmFigureId;
    isDotted?: boolean;
  };
  figureB: {
    id: RhythmFigureId;
    isDotted?: boolean;
  };
  longestFigure: "A" | "B" | "equal";
}

export const dottedNoteExercises: DottedNoteExercise[] = [
  {
    id: "dot-1",
    figureA: { id: "half" }, // 2
    figureB: { id: "half", isDotted: true }, // 3
    longestFigure: "B",
  },
  {
    id: "dot-2",
    figureA: { id: "whole" }, // 4
    figureB: { id: "half", isDotted: true }, // 3
    longestFigure: "A",
  },
  {
    id: "dot-3",
    figureA: { id: "quarter" }, // 1
    figureB: { id: "half" }, // 2
    longestFigure: "B",
  },
];

export interface ActiveReadingExercise {
  id: string;
  sequence: {
    pitch: string;
    rhythm: RhythmFigureId;
    isDotted?: boolean;
    name: string;
  }[];
  question: string;
  options: string[];
  correctIndex: number;
}

export const activeReadingExercises: ActiveReadingExercise[] = [
  {
    id: "ar-1",
    sequence: [
      { pitch: "G4", rhythm: "quarter", name: "SOL negra" },
      { pitch: "A4", rhythm: "half", isDotted: true, name: "LA blanca c/ puntillo" },
      { pitch: "B4", rhythm: "quarter", name: "SI negra" },
    ],
    question: "¿Cuál nota dura más?",
    options: ["El primer SOL", "El LA en el medio", "El último SI"],
    correctIndex: 1,
  },
  {
    id: "ar-2",
    sequence: [
      { pitch: "C5", rhythm: "whole", name: "DO redonda" },
      { pitch: "B4", rhythm: "half", isDotted: true, name: "SI blanca c/ puntillo" },
    ],
    question: "¿Cuál nota dura más?",
    options: ["El DO inicial", "El SI del final"],
    correctIndex: 0,
  },
];
