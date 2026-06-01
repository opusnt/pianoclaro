import type { NoteTheory, TheoryKnowledgeItem } from "@/types/theory";

export const extractedTheoryKnowledge: TheoryKnowledgeItem[] = [
  {
    id: "teclas-blancas-negras",
    area: "teclado",
    title: "Teclas blancas y negras como patrón de orientación",
    summary:
      "El teclado se puede leer por clases de altura: las teclas negras aparecen en grupos de dos y tres, y ayudan a encontrar Do, Re, Mi, Fa, Sol, La y Si.",
    extractedFrom: "sightread/src/features/theory/index.ts",
    pianoClaroUse:
      "Usarlo para enseñar ubicación sin memorizar posiciones aisladas: primero patrón visual, luego nombre y sonido.",
    lessonHook: "Antes de tocar Do, busca el grupo de dos teclas negras.",
  },
  {
    id: "solfeo-fijo",
    area: "lectura",
    title: "Solfeo fijo como traducción pedagógica",
    summary:
      "Las letras C D E F G A B pueden traducirse a Do Re Mi Fa Sol La Si para una experiencia en español.",
    extractedFrom: "sightread/src/features/theory/key-signature.ts",
    pianoClaroUse:
      "Mantener internamente letras musicales estándar, pero mostrar solfeo visible para principiantes hispanohablantes.",
    lessonHook: "C es Do, D es Re y E es Mi: cambia el idioma, no cambia la nota.",
  },
  {
    id: "armaduras-circulo-quintas",
    area: "tonalidad",
    title: "Armaduras ordenadas por círculo de quintas",
    summary:
      "Las tonalidades pueden ordenarse desde bemoles hasta sostenidos, con C como punto de partida sin alteraciones.",
    extractedFrom: "sightread/src/features/theory/key-signature.ts",
    pianoClaroUse:
      "Crear una ruta progresiva: Do mayor, Sol mayor, Fa mayor, Re mayor y Si bemol mayor según dificultad real.",
    lessonHook: "Do mayor no tiene alteraciones; por eso conviene empezar ahí.",
  },
  {
    id: "midi-como-modelo",
    area: "practica",
    title: "MIDI como representación exacta de práctica",
    summary:
      "Una canción puede modelarse como notas con tiempo, duración, compás, pista, velocidad y tempo.",
    extractedFrom: "sightread/src/types.ts",
    pianoClaroUse:
      "Preparar lecciones que puedan pasar de mock visual a lectura real, reproducción, feedback y Web MIDI.",
    lessonHook:
      "Cada nota no es solo un nombre: también tiene cuándo empieza, cuánto dura y en qué compás vive.",
  },
  {
    id: "manos-y-pistas",
    area: "practica",
    title: "Separar mano izquierda, mano derecha y ambas",
    summary:
      "Las pistas musicales pueden asignarse a mano izquierda, mano derecha, ambas o ninguna para practicar por capas.",
    extractedFrom: "sightread/src/types.ts",
    pianoClaroUse:
      "Agregar modos de práctica por mano cuando las lecciones tengan bajo, acordes o acompañamientos.",
    lessonHook:
      "Primero mano derecha para leer melodía; luego mano izquierda para sostener la armonía.",
  },
  {
    id: "generacion-ejercicios",
    area: "practica",
    title: "Ejercicios generados por nivel, octava y tonalidad",
    summary:
      "Los ejercicios pueden crearse eligiendo un rango de octavas, una tonalidad, un nivel rítmico y una mano.",
    extractedFrom: "sightread/src/features/theory/procedural.ts",
    pianoClaroUse:
      "Construir generadores de lectura: cinco notas, lectura por pasos, saltos pequeños y patrones de compás.",
    lessonHook: "Una buena práctica no necesita ser larga: necesita estar bien limitada.",
  },
];

export const firstOctaveNoteTheory: NoteTheory[] = [
  {
    note: "C",
    solfege: "Do",
    midiInMiddleOctave: 60,
    keyboardRole: "white-key",
    readingAnchor: "Debajo del pentagrama en clave de sol, con línea adicional.",
  },
  {
    note: "D",
    solfege: "Re",
    midiInMiddleOctave: 62,
    keyboardRole: "white-key",
    readingAnchor: "Debajo de la primera línea del pentagrama.",
  },
  {
    note: "E",
    solfege: "Mi",
    midiInMiddleOctave: 64,
    keyboardRole: "white-key",
    readingAnchor: "Primera línea del pentagrama en clave de sol.",
  },
  {
    note: "F",
    solfege: "Fa",
    midiInMiddleOctave: 65,
    keyboardRole: "white-key",
    readingAnchor: "Primer espacio del pentagrama en clave de sol.",
  },
  {
    note: "G",
    solfege: "Sol",
    midiInMiddleOctave: 67,
    keyboardRole: "white-key",
    readingAnchor: "Segunda línea del pentagrama en clave de sol.",
  },
];
