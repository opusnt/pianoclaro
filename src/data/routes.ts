import { keyboardNotesLessonSlug } from "@/data/learning-slugs";
import type { Route } from "@/types/learning";

export const learningRoutes: Route[] = [
  {
    slug: "piano-desde-cero",
    title: "Piano desde cero",
    description:
      "Construye postura, ubicación en el teclado y lectura inicial sin saltarte fundamentos.",
    level: "Inicial",
    estimatedDuration: "4 semanas",
    lessonCount: 3,
    progress: 32,
    accent: "blue",
    lessonSlugs: [keyboardNotesLessonSlug, "lee-antes-de-tocar", "tu-primera-mini-cancion"],
  },
  {
    slug: "lectura-de-partituras",
    title: "Lectura de partituras",
    description: "Relaciona pentagrama, ritmo y digitación con ejercicios cortos y progresivos.",
    level: "Principiante",
    estimatedDuration: "5 semanas",
    lessonCount: 22,
    progress: 18,
    accent: "gold",
    lessonSlugs: ["lee-antes-de-tocar"],
  },
  {
    slug: "acompanamiento-con-acordes",
    title: "Acompañamiento con acordes",
    description: "Aprende patrones útiles para tocar canciones con cifrado y mano izquierda clara.",
    level: "Principiante",
    estimatedDuration: "6 semanas",
    lessonCount: 20,
    progress: 8,
    accent: "teal",
    lessonSlugs: [],
  },
  {
    slug: "tecnica-util",
    title: "Técnica útil",
    description:
      "Ejercicios breves para coordinación, independencia y sonido sin convertirlo en gimnasia.",
    level: "Base",
    estimatedDuration: "3 semanas",
    lessonCount: 12,
    progress: 24,
    accent: "rose",
    lessonSlugs: [],
  },
  {
    slug: "canciones-faciles",
    title: "Canciones fáciles",
    description: "Repertorio reconocible por nivel, con teoría integrada dentro de cada canción.",
    level: "Inicial a intermedio",
    estimatedDuration: "Continuo",
    lessonCount: 30,
    progress: 41,
    accent: "blue",
    lessonSlugs: ["tu-primera-mini-cancion"],
  },
];

export function getRouteBySlug(slug: string) {
  return learningRoutes.find((route) => route.slug === slug);
}
