import type { LessonPhase } from "@/types/lesson";

export const coreLessonPedagogy: LessonPhase[] = [
  {
    id: "observe",
    label: "Observa",
    description: "Primero mira la partitura y detecta el patrón visible.",
  },
  {
    id: "understand",
    label: "Entiende",
    description: "Relaciona ese patrón con teclado, ritmo o concepto musical.",
  },
  {
    id: "play",
    label: "Toca",
    description: "Practica un foco pequeño antes de unir la frase completa.",
  },
  {
    id: "confirm",
    label: "Confirma",
    description: "Revisa feedback, precisión y sensación antes de avanzar.",
  },
];
