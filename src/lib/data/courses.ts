export type LessonType = "theory" | "practice";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  image?: string;
  href: string; // Ej: /modulos/1/unidad-1 o /practica/c1-l2
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
}

export const COURSES_MOCK: Course[] = [
  {
    id: "intro",
    title: "Introducción al Piano",
    description: "Tus primeros pasos en el instrumento. Postura, notas básicas y ritmo.",
    image: "/courses/course_intro.png",
    lessons: [
      {
        id: "/practica/intro-2",
        title: "El Teclado y las Notas Blancas",
        type: "practice",
        href: "/practica/intro-2",
      },
      {
        id: "/practica/intro-3",
        title: "Tu primera canción (Mano Derecha)",
        type: "practice",
        href: "/practica/intro-3",
      },
    ],
  },
  {
    id: "chords",
    title: "Dominando Acordes",
    description: "Aprende a acompañar canciones usando tríadas mayores y menores.",
    image: "/courses/course_chords.png",
    lessons: [
      {
        id: "/practica/chords-3",
        title: "Inversiones de Acordes",
        type: "practice",
        href: "/practica/chords-3",
      },
      {
        id: "/practica/chords-4",
        title: "Acompañando una balada",
        type: "practice",
        href: "/practica/chords-4",
      },
    ],
  },
  {
    id: "reading",
    title: "Entrenamiento de Lectura",
    description: "Domina la lectura a primera vista de partituras en clave de Sol y Fa.",
    image: "/courses/course_reading.png",
    lessons: [
      {
        id: "/practica/read-2",
        title: "Líneas Adicionales",
        type: "practice",
        href: "/practica/read-2",
      },
      { id: "/practica/read-3", title: "Clave de Fa", type: "practice", href: "/practica/read-3" },
      {
        id: "/practica/read-4",
        title: "Lectura con ambas manos",
        type: "practice",
        href: "/practica/read-4",
      },
    ],
  },
  {
    id: "both-hands",
    title: "Tocando con Ambas Manos",
    description: "Ejercicios de independencia y coordinación rítmica.",
    image: "/courses/course_both_hands.png",
    lessons: [
      {
        id: "/practica/both-1",
        title: "Coordinación Básica",
        type: "practice",
        href: "/practica/both-1",
      },
      {
        id: "/practica/both-2",
        title: "Melodía + Acorde de Bloque",
        type: "practice",
        href: "/practica/both-2",
      },
      {
        id: "/practica/both-3",
        title: "Acordes Arpegiados (Bajo Alberti)",
        type: "practice",
        href: "/practica/both-3",
      },
    ],
  },
];
