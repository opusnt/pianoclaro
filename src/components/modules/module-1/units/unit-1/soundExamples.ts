export type SoundType = "musical" | "noise";

export type SoundExample = {
  id: string;
  label: string;
  type: SoundType;
  audioSrc?: string; // Para el futuro cuando tengamos archivos MP3 reales
  explanation: string;
  // Parámetros opcionales para la síntesis de la Web Audio API
  synthesisParams?: {
    type: "sine" | "triangle" | "noise";
    frequency?: number;
    duration?: number;
  };
};

export const soundExamples: SoundExample[] = [
  {
    id: "piano-note",
    label: "Nota de piano",
    type: "musical",
    audioSrc: "/audio/module-1/unit-1/piano-note.mp3",
    explanation:
      "Este sonido proviene de un instrumento musical y tiene una altura definida (una nota que puedes cantar).",
    synthesisParams: { type: "sine", frequency: 440, duration: 2 }, // A4
  },
  {
    id: "engine-noise",
    label: "Motor de automóvil",
    type: "noise",
    audioSrc: "/audio/module-1/unit-1/engine-noise.mp3",
    explanation:
      "Este sonido es irregular y complejo. No tiene una organización musical clara ni una nota que puedas cantar fácilmente.",
    synthesisParams: { type: "noise", duration: 2 },
  },
  {
    id: "flute-melody",
    label: "Melodía de flauta",
    type: "musical",
    audioSrc: "/audio/module-1/unit-1/flute-melody.mp3",
    explanation:
      "Es un sonido musical porque está organizado, tiene ritmo y sus frecuencias (notas) están ordenadas de forma intencional.",
    synthesisParams: { type: "triangle", frequency: 880, duration: 2 }, // A5
  },
  {
    id: "glass-breaking",
    label: "Vaso rompiéndose",
    type: "noise",
    audioSrc: "/audio/module-1/unit-1/glass-breaking.mp3",
    explanation:
      "Es un ruido. Es un estallido repentino y caótico de frecuencias sin ninguna intención musical ni altura estable.",
    synthesisParams: { type: "noise", duration: 0.5 },
  },
  {
    id: "cello-note",
    label: "Cuerda frotada (Violonchelo)",
    type: "musical",
    audioSrc: "/audio/module-1/unit-1/cello-note.mp3",
    explanation:
      "Muy bien. Este sonido tiene un timbre rico y una altura definida que se mantiene estable gracias al roce del arco.",
    synthesisParams: { type: "triangle", frequency: 130.81, duration: 3 }, // C3
  },
  {
    id: "wind-howling",
    label: "Viento aullando",
    type: "noise",
    audioSrc: "/audio/module-1/unit-1/wind-howling.mp3",
    explanation:
      "Aunque puede parecer que tiene un tono, es en realidad ruido blanco filtrado de forma caótica por la naturaleza, sin organización musical.",
    synthesisParams: { type: "noise", duration: 4 },
  },
];
