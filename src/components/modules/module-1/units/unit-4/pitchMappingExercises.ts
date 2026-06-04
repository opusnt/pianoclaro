export type SoundHuntExercise = {
  id: string;
  targetFreq: number; // Frecuencia a reproducir
  correctZone: "arriba" | "centro" | "abajo"; // La respuesta correcta
  options: { label: string; zone: "arriba" | "centro" | "abajo" }[];
};

// Generamos 10 ejercicios de Caza de Sonidos
// Frecuencias base:
// Abajo: 150 a 250 Hz
// Centro: 350 a 500 Hz
// Arriba: 700 a 1000 Hz
export const soundHuntExercises: SoundHuntExercise[] = [
  {
    id: "hunt-1",
    targetFreq: 196, // G3 (grave)
    correctZone: "abajo",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-2",
    targetFreq: 880, // A5 (agudo)
    correctZone: "arriba",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-3",
    targetFreq: 440, // A4 (centro)
    correctZone: "centro",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-4",
    targetFreq: 130.81, // C3 (muy grave)
    correctZone: "abajo",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-5",
    targetFreq: 987.77, // B5 (muy agudo)
    correctZone: "arriba",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-6",
    targetFreq: 349.23, // F4 (centro)
    correctZone: "centro",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-7",
    targetFreq: 1046.5, // C6 (agudísimo)
    correctZone: "arriba",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-8",
    targetFreq: 164.81, // E3 (grave)
    correctZone: "abajo",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-9",
    targetFreq: 493.88, // B4 (centro-alto)
    correctZone: "centro",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
  {
    id: "hunt-10",
    targetFreq: 783.99, // G5 (agudo)
    correctZone: "arriba",
    options: [
      { label: "Arriba", zone: "arriba" },
      { label: "Centro", zone: "centro" },
      { label: "Abajo", zone: "abajo" },
    ],
  },
];

export type LinesAndSpacesExercise = {
  id: string;
  yPos: number; // Posición de la nota
  isLine: boolean;
};

// Asumiendo 5 líneas dibujadas en posiciones relativas (en porcentajes)
// Línea 1: 20%, L2: 35%, L3: 50%, L4: 65%, L5: 80%
// Los espacios estarían en: E1: 27.5%, E2: 42.5%, E3: 57.5%, E4: 72.5%
export const linesAndSpacesExercises: LinesAndSpacesExercise[] = [
  { id: "ls-1", yPos: 20, isLine: true },
  { id: "ls-2", yPos: 57.5, isLine: false },
  { id: "ls-3", yPos: 80, isLine: true },
  { id: "ls-4", yPos: 27.5, isLine: false },
  { id: "ls-5", yPos: 50, isLine: true },
  { id: "ls-6", yPos: 72.5, isLine: false },
];
