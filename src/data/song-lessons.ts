import { createMeasure, notes } from "@/lib/music/score-authoring";
import { coreLessonPedagogy } from "@/lib/practice/pedagogy";
import type { Lesson } from "@/types/lesson";

const songPracticeModes = [
  {
    id: "leer",
    label: "Leer primero",
    description: "Primero mira la partitura. Luego toca.",
  },
  {
    id: "frases",
    label: "Por frases",
    description: "Practica una frase corta antes de tocar la pieza completa.",
  },
  {
    id: "loop",
    label: "Repetición",
    description: "Repite el foco hasta que lectura y pulso se sientan estables.",
  },
];

export const playableSongLessons: Lesson[] = [
  {
    slug: "himno-a-la-alegria",
    moduleId: "biblioteca-mvp",
    order: 1,
    title: "Himno a la alegría",
    subtitle: "Arreglo inicial para lectura",
    level: "Inicial",
    estimatedMinutes: 10,
    tempoBpm: 72,
    objective: "Leer una melodía reconocible por grados conjuntos y patrones repetidos.",
    pedagogy: coreLessonPedagogy,
    concepts: ["melodía por grados conjuntos", "fraseo simple", "negras"],
    notes: ["C", "D", "E", "F", "G"],
    score: {
      title: "Himno a la alegría",
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [
        createMeasure(1, notes("E", "E", "F", "G"), "A"),
        createMeasure(2, notes("G", "F", "E", "D"), "A"),
        createMeasure(3, notes("C", "C", "D", "E"), "B"),
        createMeasure(4, notes("E", "D", "D", "D"), "B"),
      ],
    },
    practiceModes: songPracticeModes,
    steps: [
      {
        id: "leer-frase-a",
        title: "Leer frase A",
        description: "La melodía sube y luego vuelve paso a paso.",
        instruction: "Observa primero E, E, F, G y su regreso G, F, E, D.",
        activePhrase: "A",
        conceptTitle: "Movimiento conjunto",
        conceptExplanation:
          "Las notas vecinas crean una línea fácil de seguir con la vista y con la mano.",
        melodyDirection: "mixed",
      },
      {
        id: "leer-frase-b",
        title: "Leer frase B",
        description: "La segunda frase aterriza en Do y repite Re.",
        instruction: "Busca dónde cambia el patrón y dónde la melodía se queda quieta.",
        activePhrase: "B",
        conceptTitle: "Cierre de frase",
        conceptExplanation: "Una repetición al final ayuda a sentir que la idea musical descansa.",
        melodyDirection: "mixed",
      },
      {
        id: "tocar-completa",
        title: "Tocar la melodía completa",
        description: "Une las dos frases con pulso constante.",
        instruction: "Toca toda la pieza sin correr. Primero mira la partitura. Luego toca.",
        activeNotes: ["C", "D", "E", "F", "G"],
        conceptTitle: "Lectura por patrones",
        conceptExplanation:
          "Reconocer que una frase sube, baja o se repite reduce la carga de leer nota por nota.",
        melodyDirection: "mixed",
      },
    ],
  },
  {
    slug: "la-cucaracha",
    moduleId: "biblioteca-mvp",
    order: 2,
    title: "La Cucaracha",
    subtitle: "Motivo tradicional inicial",
    level: "Inicial",
    estimatedMinutes: 8,
    tempoBpm: 72,
    objective: "Practicar repetición, pulso y un motivo popular de lectura simple.",
    pedagogy: coreLessonPedagogy,
    concepts: ["frase corta", "repetición", "ritmo popular"],
    notes: ["C", "D", "E", "F"],
    score: {
      title: "La Cucaracha",
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [
        createMeasure(1, notes("C", "C", "C", "E"), "A"),
        createMeasure(2, notes("F", "F", "E", "D"), "A"),
        createMeasure(3, notes("C", "C", "C", "E"), "B"),
        createMeasure(4, notes("D", "D", "C", "C"), "B"),
      ],
    },
    practiceModes: songPracticeModes,
    steps: [
      {
        id: "repetir-motivo",
        title: "Reconocer el motivo",
        description: "Tres Do repetidos preparan un pequeño salto hacia Mi.",
        instruction: "Cuenta los Do repetidos antes de mover la mano.",
        activeMeasure: 1,
        conceptTitle: "Repetición rítmica",
        conceptExplanation:
          "Una misma altura repetida puede tener intención rítmica, no solo ser una nota repetida.",
        melodyDirection: "repeat",
      },
      {
        id: "respuesta",
        title: "Leer la respuesta",
        description: "La frase responde bajando desde Fa.",
        instruction: "Mira cómo la melodía vuelve hacia la izquierda del teclado.",
        activeMeasure: 2,
        conceptTitle: "Respuesta descendente",
        conceptExplanation: "Las canciones cortas suelen alternar una llamada y una respuesta.",
        melodyDirection: "down",
      },
      {
        id: "tocar-completa",
        title: "Tocar la pieza completa",
        description: "Une repetición y respuesta sin perder el pulso.",
        instruction: "Toca las cuatro medidas con tempo lento y estable.",
        activeNotes: ["C", "D", "E", "F"],
        conceptTitle: "Pulso popular",
        conceptExplanation:
          "Un motivo sencillo empieza a sonar musical cuando el pulso se mantiene firme.",
        melodyDirection: "mixed",
      },
    ],
  },
  {
    slug: "balada-pop",
    moduleId: "biblioteca-mvp",
    order: 3,
    title: "Balada pop I-V-vi-IV",
    subtitle: "Raíces de acompañamiento",
    level: "Base",
    estimatedMinutes: 15,
    tempoBpm: 72,
    objective: "Reconocer y tocar las raíces de una progresión pop frecuente.",
    pedagogy: coreLessonPedagogy,
    concepts: ["progresión armónica", "patrón de acompañamiento", "cadencia pop"],
    notes: ["C", "G", "A", "F"],
    score: {
      title: "Raíces I-V-vi-IV",
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [
        createMeasure(1, notes("C", "C", "C", "C"), "A"),
        createMeasure(2, notes("G", "G", "G", "G"), "A"),
        createMeasure(3, notes("A", "A", "A", "A"), "A"),
        createMeasure(4, notes("F", "F", "F", "F"), "A"),
        createMeasure(5, notes("C", "C", "C", "C"), "B"),
        createMeasure(6, notes("G", "G", "G", "G"), "B"),
        createMeasure(7, notes("A", "A", "A", "A"), "B"),
        createMeasure(8, notes("F", "F", "F", "F"), "B"),
      ],
    },
    practiceModes: songPracticeModes,
    steps: [
      {
        id: "leer-progresion",
        title: "Leer la progresión",
        description: "La base viaja por Do, Sol, La y Fa.",
        instruction: "Lee una raíz por compás antes de pensar en acordes completos.",
        activePhrase: "A",
        conceptTitle: "I-V-vi-IV",
        conceptExplanation:
          "La progresión se entiende primero por sus raíces; luego podrá crecer hacia acordes.",
        melodyDirection: "mixed",
      },
      {
        id: "sentir-repeticion",
        title: "Sentir la repetición",
        description: "La segunda frase repite el mismo ciclo armónico.",
        instruction: "Observa que la forma vuelve a empezar con Do después de Fa.",
        activePhrase: "B",
        conceptTitle: "Ciclo armónico",
        conceptExplanation:
          "Repetir una progresión crea una base estable sobre la que luego puede aparecer una melodía.",
        melodyDirection: "repeat",
      },
      {
        id: "tocar-ciclo",
        title: "Tocar el ciclo completo",
        description: "Sostén cuatro pulsos por cada raíz.",
        instruction: "Toca la progresión completa con pulso regular y escucha el viaje armónico.",
        activeNotes: ["C", "G", "A", "F"],
        conceptTitle: "Acompañamiento inicial",
        conceptExplanation:
          "Antes de tocar acordes complejos, una buena base es sentir dónde cambia la armonía.",
        melodyDirection: "mixed",
      },
    ],
  },
];

export function getPlayableSongLessonBySlug(slug: string) {
  return playableSongLessons.find((lesson) => lesson.slug === slug);
}
