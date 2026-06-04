import type { RhythmFigureId } from "@/lib/music/rhythmFigures";

export type MeasureExercise = {
  id: string;
  timeSignature: "4/4"; // Para soportar 3/4 o 2/4 en el futuro
  initialFigures: RhythmFigureId[]; // Figuras pre-existentes en el compás
  options: RhythmFigureId[]; // Opciones disponibles para el usuario
  targetDuration: number; // Capacidad (ej: 4 para 4/4)
  validAnswers: RhythmFigureId[][]; // Múltiples formas válidas de llenarlo
};

export const measureExercises: MeasureExercise[] = [
  {
    id: "ex-1",
    timeSignature: "4/4",
    initialFigures: ["half"], // Tiene 2 tiempos
    options: ["quarter", "half", "whole"],
    targetDuration: 4,
    validAnswers: [["half"], ["quarter", "quarter"]],
  },
  {
    id: "ex-2",
    timeSignature: "4/4",
    initialFigures: ["quarter", "quarter"], // Tiene 2 tiempos
    options: ["quarter", "half", "whole"],
    targetDuration: 4,
    validAnswers: [["half"], ["quarter", "quarter"]],
  },
  {
    id: "ex-3",
    timeSignature: "4/4",
    initialFigures: ["quarter"], // Tiene 1 tiempo
    options: ["quarter", "half", "whole"],
    targetDuration: 4,
    validAnswers: [
      ["half", "quarter"],
      ["quarter", "half"],
      ["quarter", "quarter", "quarter"],
    ],
  },
  {
    id: "ex-4",
    timeSignature: "4/4",
    initialFigures: [], // Vacío
    options: ["quarter", "half", "whole"],
    targetDuration: 4,
    validAnswers: [
      ["whole"],
      ["half", "half"],
      ["half", "quarter", "quarter"],
      ["quarter", "quarter", "half"],
      ["quarter", "half", "quarter"],
      ["quarter", "quarter", "quarter", "quarter"],
    ],
  },
];
