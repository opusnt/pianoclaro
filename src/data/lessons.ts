import { coreLessonPedagogy } from "@/lib/practice/pedagogy";
import { createMeasure, notes } from "@/lib/music/score-authoring";
import type { Lesson } from "@/types/lesson";

const basePracticeModes = [
  {
    id: "leer",
    label: "Leer primero",
    description: "Primero mira la partitura. Luego toca.",
  },
  {
    id: "teclado",
    label: "Teclado guiado",
    description: "Relaciona cada nota escrita con su tecla blanca correspondiente.",
  },
  {
    id: "ritmo",
    label: "Pulso lento",
    description: "Cuenta cuatro tiempos por compás antes de avanzar.",
  },
];

export const lessons: Lesson[] = [
  {
    slug: "tus-primeras-5-notas",
    moduleId: "piano-desde-cero",
    order: 1,
    title: "Tus primeras 5 notas",
    subtitle: "Do, Re, Mi, Fa y Sol",
    level: "Inicial",
    estimatedMinutes: 12,
    tempoBpm: 72,
    objective: "Relacionar teclado, nombre de nota y posición en la partitura.",
    pedagogy: coreLessonPedagogy,
    concepts: ["teclado", "pentagrama", "clave de sol", "negra", "lectura ascendente"],
    notes: ["C", "D", "E", "F", "G"],
    score: {
      title: "Cinco notas ascendentes",
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [
        createMeasure(1, notes("C", "D", "E", "F")),
        createMeasure(2, notes("G", "G", "G", "G")),
      ],
    },
    practiceModes: basePracticeModes,
    steps: [
      {
        id: "reconocer-do",
        title: "Reconocer Do",
        description: "Ubica Do central en el teclado y debajo del pentagrama.",
        instruction: "Encuentra Do antes del grupo de dos teclas negras y míralo en la partitura.",
        activeNotes: ["C"],
        activeMeasure: 1,
        conceptTitle: "Do como punto de partida",
        conceptExplanation:
          "No memorices teclas: entiende lo que estás tocando. Do central te da una referencia estable para empezar a leer.",
        melodyDirection: "repeat",
      },
      {
        id: "reconocer-re",
        title: "Reconocer Re",
        description: "Re está una tecla blanca a la derecha de Do.",
        instruction: "Lee Do y Re como dos posiciones vecinas, no como nombres aislados.",
        activeNotes: ["D"],
        activeMeasure: 1,
        conceptTitle: "Movimiento hacia la derecha",
        conceptExplanation:
          "Cuando las notas suben en la partitura, avanzan hacia la derecha en el teclado.",
        melodyDirection: "up",
      },
      {
        id: "reconocer-mi",
        title: "Reconocer Mi",
        description: "Mi aparece en la primera línea del pentagrama en clave de sol.",
        instruction: "Mira la línea de Mi y tócalo después de Do y Re.",
        activeNotes: ["E"],
        activeMeasure: 1,
        conceptTitle: "Líneas y espacios",
        conceptExplanation:
          "Leer música es aprender a ver movimiento, no solo nombres de notas.",
        melodyDirection: "up",
      },
      {
        id: "reconocer-fa",
        title: "Reconocer Fa",
        description: "Fa completa el primer compás de cuatro negras.",
        instruction: "Cuenta uno, dos, tres, cuatro mientras lees Do, Re, Mi, Fa.",
        activeNotes: ["F"],
        activeMeasure: 1,
        conceptTitle: "Cuatro tiempos por compás",
        conceptExplanation:
          "En 4/4, cada compás organiza cuatro pulsos. Aquí cada negra ocupa un pulso.",
        melodyDirection: "up",
      },
      {
        id: "reconocer-sol",
        title: "Reconocer Sol",
        description: "Sol inicia el segundo compás y se repite para afirmar la lectura.",
        instruction: "Observa que Sol se mantiene en la misma altura durante todo el compás.",
        activeNotes: ["G"],
        activeMeasure: 2,
        conceptTitle: "Repetición",
        conceptExplanation:
          "Cuando una nota se repite, tus ojos ven la misma altura y tus manos vuelven a la misma tecla.",
        melodyDirection: "repeat",
      },
      {
        id: "tocar-cinco-notas",
        title: "Tocar las 5 notas lentamente",
        description: "Une lectura, teclado y pulso en una frase corta.",
        instruction: "Toca Do, Re, Mi, Fa y Sol sin apurarte. Primero mira la partitura. Luego toca.",
        activeNotes: ["C", "D", "E", "F", "G"],
        activeMeasure: 1,
        conceptTitle: "Lectura ascendente",
        conceptExplanation:
          "La partitura muestra una subida gradual. El teclado responde avanzando hacia la derecha.",
        melodyDirection: "up",
      },
    ],
  },
  {
    slug: "lee-antes-de-tocar",
    moduleId: "piano-desde-cero",
    order: 2,
    title: "Lee antes de tocar",
    subtitle: "Mira el movimiento",
    level: "Inicial",
    estimatedMinutes: 14,
    tempoBpm: 72,
    objective: "Enseñar a observar la partitura antes de tocar.",
    pedagogy: coreLessonPedagogy,
    concepts: ["línea", "espacio", "dirección melódica", "repetición", "compás"],
    notes: ["C", "D", "E", "F", "G"],
    score: {
      title: "Mira el movimiento",
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [
        createMeasure(1, notes("C", "D", "E", "F")),
        createMeasure(2, notes("G", "F", "E", "D")),
        createMeasure(3, notes("C", "C", "D", "D")),
        createMeasure(4, notes("E", "D", "C", "C")),
      ],
    },
    practiceModes: [
      ...basePracticeModes,
      {
        id: "compas",
        label: "Compás por compás",
        description: "Aísla un compás, reconoce su movimiento y recién ahí practícalo.",
      },
    ],
    steps: [
      {
        id: "melodia-sube",
        title: "Observar si la melodía sube",
        description: "El primer compás asciende paso a paso.",
        instruction: "Antes de tocar, di en voz baja: la melodía sube.",
        activeNotes: ["C", "D", "E", "F"],
        activeMeasure: 1,
        conceptTitle: "Dirección ascendente",
        conceptExplanation:
          "Cuando las notas suben en la partitura, avanzan hacia la derecha en el teclado.",
        melodyDirection: "up",
      },
      {
        id: "melodia-baja",
        title: "Observar si la melodía baja",
        description: "El segundo compás baja desde Sol hacia Re.",
        instruction: "Lee el movimiento descendente antes de poner los dedos en el teclado.",
        activeNotes: ["G", "F", "E", "D"],
        activeMeasure: 2,
        conceptTitle: "Dirección descendente",
        conceptExplanation:
          "Cuando la melodía baja, la mano vuelve hacia la izquierda en el teclado.",
        melodyDirection: "down",
      },
      {
        id: "notas-repetidas",
        title: "Identificar notas repetidas",
        description: "El tercer compás repite Do y luego Re.",
        instruction: "Marca mentalmente qué notas se quedan en la misma altura.",
        activeNotes: ["C", "D"],
        activeMeasure: 3,
        conceptTitle: "Repetición visible",
        conceptExplanation:
          "Leer música es aprender a ver movimiento, no solo nombres de notas.",
        melodyDirection: "repeat",
      },
      {
        id: "contar-cuatro-tiempos",
        title: "Contar cuatro tiempos por compás",
        description: "Cada compás tiene cuatro negras.",
        instruction: "Cuenta 1, 2, 3, 4 en cada compás antes de tocar.",
        activeMeasure: 4,
        conceptTitle: "Compás y pulso",
        conceptExplanation:
          "El compás organiza el tiempo para que la lectura no sea una lista suelta de notas.",
        melodyDirection: "mixed",
      },
      {
        id: "practicar-compas",
        title: "Practicar compás por compás",
        description: "Une observación y ejecución sin correr.",
        instruction: "Primero mira la partitura. Luego toca un compás y detente.",
        activeNotes: ["C", "D", "E", "F", "G"],
        activeMeasure: 1,
        conceptTitle: "Lectura antes de acción",
        conceptExplanation:
          "Primero mira la partitura. Luego toca. Esa pausa hace que practiques con intención.",
        melodyDirection: "mixed",
      },
    ],
  },
  {
    slug: "tu-primera-mini-cancion",
    moduleId: "piano-desde-cero",
    order: 3,
    title: "Tu primera mini canción",
    subtitle: "Primer viaje",
    level: "Inicial",
    estimatedMinutes: 18,
    tempoBpm: 66,
    objective: "Tocar una melodía simple leyendo partitura.",
    pedagogy: coreLessonPedagogy,
    concepts: ["frase musical", "repetición", "negras", "blancas", "lectura por patrones"],
    notes: ["C", "D", "E", "F", "G"],
    score: {
      title: "Primer viaje",
      timeSignature: "4/4",
      keySignature: "Do mayor",
      clef: "treble",
      measures: [
        createMeasure(1, notes("C", "D", "E", "G"), "A"),
        createMeasure(2, notes("G", "E", "D", "C"), "A"),
        createMeasure(3, notes("C", "E", "G", "E"), "A"),
        createMeasure(4, notes("D", "C", "C", "C"), "A"),
        createMeasure(5, notes("E", "F", "G", "G"), "B"),
        createMeasure(6, notes("G", "F", "E", "D"), "B"),
        createMeasure(7, notes("C", "D", "E", "C"), "B"),
        createMeasure(8, notes("D", "C", "C", "C"), "B"),
      ],
    },
    practiceModes: [
      ...basePracticeModes,
      {
        id: "frases",
        label: "Por frases",
        description: "Practica frase A y frase B por separado antes de unir la canción.",
      },
    ],
    steps: [
      {
        id: "practicar-frase-a",
        title: "Practicar frase A",
        description: "La frase A ocupa los compases 1 al 4.",
        instruction: "Lee la forma de la frase A completa antes de tocarla.",
        activeNotes: ["C", "D", "E", "G"],
        activePhrase: "A",
        conceptTitle: "Frase A",
        conceptExplanation:
          "Una frase musical es una idea con sentido. Aquí la primera idea viaja desde Do hacia Sol y vuelve.",
        melodyDirection: "mixed",
      },
      {
        id: "practicar-frase-b",
        title: "Practicar frase B",
        description: "La frase B responde con un movimiento parecido, pero no idéntico.",
        instruction: "Observa qué se mantiene y qué cambia en los compases 5 al 8.",
        activeNotes: ["E", "F", "G", "D"],
        activePhrase: "B",
        conceptTitle: "Frase B",
        conceptExplanation:
          "La segunda frase contrasta suavemente con la primera y completa la mini canción.",
        melodyDirection: "mixed",
      },
      {
        id: "identificar-repeticion",
        title: "Identificar repetición",
        description: "Hay notas y movimientos que vuelven a aparecer.",
        instruction: "Busca patrones repetidos antes de tocar. No memorices teclas: entiende lo que estás tocando.",
        activeNotes: ["C", "D", "E", "G"],
        activeMeasure: 8,
        conceptTitle: "Lectura por patrones",
        conceptExplanation:
          "Reconocer patrones reduce la carga mental: no lees todo desde cero cada vez.",
        melodyDirection: "repeat",
      },
      {
        id: "tocar-completa",
        title: "Tocar canción completa",
        description: "Une frase A y frase B con pulso constante.",
        instruction: "Cuenta cuatro tiempos por compás y mantén la mirada un poco por delante de tus dedos.",
        activeNotes: ["C", "D", "E", "F", "G"],
        activePhrase: "A",
        conceptTitle: "Canción completa",
        conceptExplanation:
          "Leer una canción simple es coordinar dirección, ritmo y teclado dentro de una forma musical.",
        melodyDirection: "mixed",
      },
      {
        id: "completar-mini-cancion",
        title: "Completar primera mini canción",
        description: "Cierra la lección con una pasada consciente.",
        instruction: "Toca una vez lenta y limpia. Después marca la lección como completada.",
        activeNotes: ["C", "D", "E", "F", "G"],
        activePhrase: "B",
        conceptTitle: "Primer viaje completo",
        conceptExplanation:
          "Acabas de leer una mini canción usando notas, compases, frases y patrones.",
        melodyDirection: "mixed",
      },
    ],
  },
];

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonsByModule(moduleId: string) {
  return lessons.filter((lesson) => lesson.moduleId === moduleId).sort((a, b) => a.order - b.order);
}
