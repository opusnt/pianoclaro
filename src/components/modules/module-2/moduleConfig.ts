export interface UnitConfig {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  isAvailable: boolean;
}

export const module2Units: UnitConfig[] = [
  {
    id: "unit-1",
    title: "El mapa del teclado",
    description: "Aprende a ubicar las notas en el piano usando los grupos de teclas negras.",
    estimatedMinutes: 15,
    isAvailable: true,
  },
  {
    id: "unit-2",
    title: "Tonos y semitonos",
    description: "Comprende la distancia más pequeña entre las notas musicales.",
    estimatedMinutes: 20,
    isAvailable: true,
  },
  {
    id: "unit-3",
    title: "Sostenidos y bemoles",
    description: "Descubre qué son y cómo suenan las teclas negras.",
    estimatedMinutes: 20,
    isAvailable: true,
  },
  {
    id: "unit-4",
    title: "Alteraciones accidentales",
    description: "Aprende a leer y tocar alteraciones que aparecen temporalmente.",
    estimatedMinutes: 15,
    isAvailable: true,
  },
  {
    id: "unit-5",
    title: "Alteraciones propias",
    description: "Descubre la armadura de clave y cómo afecta a toda la canción.",
    estimatedMinutes: 20,
    isAvailable: true,
  },
  {
    id: "unit-6",
    title: "Distancias entre notas",
    description: "Una introducción a los intervalos musicales.",
    estimatedMinutes: 25,
    isAvailable: false,
  },
  {
    id: "unit-7",
    title: "Compases simples avanzados",
    description: "Combina figuras rítmicas complejas en compases de 2/4, 3/4 y 4/4.",
    estimatedMinutes: 20,
    isAvailable: false,
  },
  {
    id: "unit-8",
    title: "Tiempos fuertes y débiles",
    description: "Siente el pulso natural de la música.",
    estimatedMinutes: 15,
    isAvailable: false,
  },
  {
    id: "unit-9",
    title: "Síncopa y contratiempo",
    description: "Desafía el pulso tocando en los tiempos débiles.",
    estimatedMinutes: 20,
    isAvailable: false,
  },
  {
    id: "unit-10",
    title: "Proyecto integrador",
    description: "Aplica todo lo aprendido tocando tu primera pieza a dos manos.",
    estimatedMinutes: 30,
    isAvailable: false,
  },
];

export const module2Config = {
  id: "2",
  title: "Moverse por el teclado",
  description: "Conecta la lectura musical con la ejecución física y domina el mapa del piano.",
  units: module2Units,
};
