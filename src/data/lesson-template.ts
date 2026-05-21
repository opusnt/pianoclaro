import { coreLessonPedagogy } from "@/lib/practice/pedagogy";
import type { Lesson, LessonStep, NoteName, PracticeMode } from "@/types/lesson";

export type LessonDraft = {
  slug: string;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  objective: string;
  concepts: string[];
  notes: NoteName[];
  steps: LessonStep[];
};

const defaultPracticeModes: PracticeMode[] = [
  {
    id: "leer",
    label: "Leer primero",
    description: "Primero mira la partitura. Luego toca.",
  },
  {
    id: "foco",
    label: "Foco pequeño",
    description: "Aísla una nota, compás o frase antes de tocar todo.",
  },
  {
    id: "ritmo",
    label: "Pulso lento",
    description: "Practica con metrónomo lento y atención al tiempo.",
  },
];

export function createLessonSkeleton(draft: LessonDraft): Lesson {
  return {
    ...draft,
    level: "Inicial",
    estimatedMinutes: 12,
    tempoBpm: 72,
    pedagogy: coreLessonPedagogy,
    score: {
      title: draft.title,
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [],
    },
    practiceModes: defaultPracticeModes,
  };
}
