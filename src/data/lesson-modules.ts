import type { LessonModule } from "@/types/lesson";

export const lessonModules: LessonModule[] = [
  {
    id: "piano-desde-cero",
    title: "Piano desde cero",
    description:
      "Primer módulo para conectar pentagrama, teclado, pulso y práctica guiada desde el inicio.",
    level: "Inicial",
    lessonSlugs: [
      "tus-primeras-5-notas",
      "lee-antes-de-tocar",
      "tu-primera-mini-cancion",
    ],
    nextModuleHint: "Próximo módulo sugerido: ritmo y lectura por compases.",
  },
  {
    id: "ritmo-y-compas",
    title: "Ritmo y compás",
    description:
      "Estructura preparada para nuevas lecciones centradas en pulso, silencios y subdivisión.",
    level: "Inicial",
    lessonSlugs: [],
    nextModuleHint: "Luego se podrá conectar con acompañamiento simple.",
  },
  {
    id: "lectura-con-patrones",
    title: "Lectura con patrones",
    description:
      "Estructura preparada para trabajar intervalos, repetición, frases y reconocimiento visual.",
    level: "Inicial",
    lessonSlugs: [],
  },
];

export function getLessonModuleById(moduleId: string) {
  return lessonModules.find((module) => module.id === moduleId);
}
