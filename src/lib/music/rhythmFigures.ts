export type RhythmFigureId = "whole" | "half" | "quarter" | "dotted-half";

export interface RhythmFigure {
  id: RhythmFigureId;
  name: string;
  durationUnits: number; // En base 1 (Negra = 1, Blanca = 2, Redonda = 4)
  description: string;
}

export const rhythmFigures: RhythmFigure[] = [
  {
    id: "whole",
    name: "Redonda",
    durationUnits: 4,
    description: "Un sonido muy largo. Dura cuatro pulsos completos.",
  },
  {
    id: "half",
    name: "Blanca",
    durationUnits: 2,
    description: "Un sonido medio. Dura dos pulsos.",
  },
  {
    id: "dotted-half",
    name: "Blanca c/ puntillo",
    durationUnits: 3,
    description: "Una blanca extendida. Dura tres pulsos.",
  },
  {
    id: "quarter",
    name: "Negra",
    durationUnits: 1,
    description: "Un sonido corto. Dura exactamente un pulso.",
  },
];

export function getRhythmFigureById(id: RhythmFigureId): RhythmFigure {
  const figure = rhythmFigures.find((f) => f.id === id);
  if (!figure) throw new Error(`Figure not found: ${id}`);
  return figure;
}

export function getDuration(id: RhythmFigureId, isDotted: boolean = false): number {
  const figure = getRhythmFigureById(id);
  const baseDuration = figure.durationUnits;
  return isDotted ? baseDuration * 1.5 : baseDuration;
}
