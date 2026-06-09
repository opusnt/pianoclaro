import { Music, BookOpen, PlayCircle, GraduationCap } from "lucide-react";

export const THEORY_MODULES = {
  "1": {
    title: "Fundamentos de la Música",
    description: "Tu viaje musical comienza aquí. Desde entender la diferencia entre ruido y sonido, hasta leer tus primeras notas y ritmos en el pentagrama.",
    theme: "sky",
    finalProject: {
      id: "9",
      title: "Entrenamiento y Ligaduras",
      description: "Consolida todo lo aprendido: altura, ritmo, notas, silencios y ligaduras en ejercicios prácticos e interactivos.",
      icon: GraduationCap,
      href: "/teoria/1/unidad/9"
    },
    units: [
      { id: 1, title: "Sonido Musical y Ruido", desc: "Aprende a diferenciar ruido de música.", icon: Music },
      { id: 2, title: "Propiedades del Sonido", desc: "Altura, intensidad, duración y timbre.", icon: BookOpen },
      { id: 3, title: "Melodía, Armonía y Ritmo", desc: "Los tres pilares fundamentales de la música.", icon: PlayCircle },
      { id: 4, title: "El Pentagrama", desc: "Tu mapa musical de 5 líneas.", icon: BookOpen },
      { id: 5, title: "Las Notas Musicales", desc: "Conoce el abecedario musical.", icon: Music },
      { id: 6, title: "Clave de Sol", desc: "Lectura básica en el pentagrama.", icon: PlayCircle },
      { id: 7, title: "Duración y Pulso", desc: "Figuras rítmicas y el latido de la música.", icon: BookOpen },
      { id: 8, title: "Compases", desc: "Organización temporal de la música.", icon: Music },
    ]
  },
  "2": {
    title: "Moverse por el teclado",
    description: "Conecta la lectura musical con la ejecución física. Entiende la topografía del piano, tonos, semitonos y alteraciones.",
    theme: "purple",
    finalProject: null,
    units: [
      { id: 1, title: "El mapa del teclado", desc: "Explora la topografía de teclas blancas y negras.", icon: Music },
      { id: 2, title: "Las distancias musicales", desc: "Descubre los semitonos y tonos de forma práctica.", icon: BookOpen },
      { id: 3, title: "Notas que se mueven", desc: "Introducción interactiva a las alteraciones.", icon: PlayCircle },
      { id: 4, title: "Alteraciones en la partitura", desc: "Aprende a leer alteraciones en el pentagrama.", icon: BookOpen },
    ]
  },
  "3": {
    title: "Construcción de Acordes",
    description: "La magia de la armonía. Aprende cómo se forman los acordes y acompaña tus primeras canciones.",
    theme: "emerald",
    finalProject: {
      id: "5",
      title: "Dominando las Tríadas",
      description: "Desafío final: Reconoce, construye y toca acordes mayores y menores en todas las tonalidades blancas.",
      icon: GraduationCap,
      href: "/teoria/3/unidad/5"
    },
    units: [
      { id: 1, title: "La Magia de la Armonía", desc: "Diferencia entre tocar notas sueltas y tocar acordes.", icon: Music },
      { id: 2, title: "Tríadas Mayores", desc: "La fórmula mágica: Tónica, Tercera Mayor y Quinta Justa.", icon: BookOpen },
      { id: 3, title: "Tríadas Menores", desc: "El sonido melancólico y su fórmula de construcción.", icon: PlayCircle },
      { id: 4, title: "Inversiones Básicas", desc: "Tocar el mismo acorde en diferente orden.", icon: BookOpen },
    ]
  },
  "4": {
    title: "Escalas y Tonalidades",
    description: "Comprende cómo se organizan las notas musicales. Aprende las escalas mayores y su armadura de clave.",
    theme: "purple",
    finalProject: {
      id: "4",
      title: "Maestro de las Escalas",
      description: "Desafío final: Reconoce visualmente y auditivamente las escalas mayores más importantes.",
      icon: GraduationCap,
      href: "/teoria/4/unidad/4"
    },
    units: [
      { id: 1, title: "La Escala Mayor", desc: "La estructura universal de Tono, Tono, Semitono.", icon: Music },
      { id: 2, title: "Armaduras de Clave", desc: "Sostenidos y bemoles que definen la tonalidad.", icon: BookOpen },
      { id: 3, title: "El Círculo de Quintas", desc: "El mapa definitivo para entender la música.", icon: PlayCircle },
    ]
  }
} as const;
