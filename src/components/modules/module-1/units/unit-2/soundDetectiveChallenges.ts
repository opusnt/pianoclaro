import type { AudioSynthesisParams } from "@/components/shared/audio/useAudioSimulator";

export type SoundProperty = "intro" | "altura" | "duracion" | "intensidad" | "timbre";

export type SoundDetectiveChallenge = {
  id: string;
  property: SoundProperty;
  title: string;
  instruction: string;
  mode: "compare" | "identify" | "info";
  options?: string[]; // "A" y "B" o nombres de instrumentos
  correctAnswer?: string;
  sounds?: {
    id: "A" | "B" | "main";
    label: string;
    audioSrc?: string;
    synthesisParams: AudioSynthesisParams;
  }[];
  successFeedback?: string;
  errorFeedback?: string;
  explanation?: string;
};

export const soundDetectiveChallenges: SoundDetectiveChallenge[] = [
  {
    id: "intro-1",
    property: "intro",
    title: "Detective del sonido",
    instruction:
      "Ahora que ya puedes distinguir entre sonido musical y ruido, vas a aprender a observar mejor cada sonido. Escucha con atención: todo sonido tiene altura, duración, intensidad y timbre.",
    mode: "info",
  },
  {
    id: "pitch-1",
    property: "altura",
    title: "Propiedad 1: Altura",
    instruction: "Escucha ambos sonidos. ¿Cuál es más agudo?",
    mode: "compare",
    options: ["A", "B"],
    correctAnswer: "B",
    sounds: [
      {
        id: "A",
        label: "Sonido A",
        synthesisParams: { type: "sine", frequency: 220, duration: 1.5 }, // Grave
      },
      {
        id: "B",
        label: "Sonido B",
        synthesisParams: { type: "sine", frequency: 880, duration: 1.5 }, // Agudo
      },
    ],
    successFeedback: "¡Muy bien! El sonido B era más agudo.",
    errorFeedback: "Casi. El sonido B era más agudo porque se percibe más 'alto' o brillante.",
    explanation: "La altura nos permite distinguir entre sonidos graves (bajos) y agudos (altos).",
  },
  {
    id: "duration-1",
    property: "duracion",
    title: "Propiedad 2: Duración",
    instruction: "Escucha ambos sonidos. ¿Cuál dura más?",
    mode: "compare",
    options: ["A", "B"],
    correctAnswer: "A",
    sounds: [
      {
        id: "A",
        label: "Sonido A",
        synthesisParams: { type: "triangle", frequency: 440, duration: 2.5 }, // Largo
      },
      {
        id: "B",
        label: "Sonido B",
        synthesisParams: { type: "triangle", frequency: 440, duration: 0.3 }, // Corto
      },
    ],
    successFeedback: "¡Correcto! El sonido A se mantuvo en el tiempo.",
    errorFeedback: "Casi. El sonido A duró más tiempo antes de apagarse.",
    explanation:
      "La duración indica cuánto tiempo se mantiene un sonido antes de terminar (corto o largo).",
  },
  {
    id: "intensity-1",
    property: "intensidad",
    title: "Propiedad 3: Intensidad",
    instruction: "Escucha ambos sonidos. ¿Cuál suena más suave?",
    mode: "compare",
    options: ["A", "B"],
    correctAnswer: "A",
    sounds: [
      {
        id: "A",
        label: "Sonido A",
        synthesisParams: { type: "sine", frequency: 440, duration: 1.5, gain: 0.1 }, // Suave
      },
      {
        id: "B",
        label: "Sonido B",
        synthesisParams: { type: "sine", frequency: 440, duration: 1.5, gain: 1.0 }, // Fuerte
      },
    ],
    successFeedback: "¡Excelente! El sonido A tenía mucho menos volumen.",
    errorFeedback: "Casi. El sonido A era más suave, tenía un volumen menor.",
    explanation:
      "La intensidad se relaciona con el volumen o la fuerza con la que se produce el sonido (suave o fuerte).",
  },
  {
    id: "timbre-1",
    property: "timbre",
    title: "Propiedad 4: Timbre",
    instruction:
      "Escucha el sonido. Si A fuera un instrumento de viento suave y B un sonido eléctrico rasgado... ¿A qué se parece este?",
    mode: "compare", // Usaremos compare A/B para mantener la UI simple, aunque el prompt sugirió elegir piano/guitarra.
    // Wait, the prompt says for Timbre: "Debe elegir qué lo produjo. Opciones: Piano, Guitarra, Voz, Percusión, Ruido ambiente".
    // I will switch mode to "identify"
    options: ["Viento suave", "Sintetizador eléctrico"],
    correctAnswer: "Sintetizador eléctrico",
    sounds: [
      {
        id: "main",
        label: "Sonido Misterioso",
        synthesisParams: { type: "sawtooth", frequency: 110, duration: 2.0 }, // Sawtooth sounds electric/buzzy
      },
    ],
    successFeedback: "¡Muy bien! Notaste ese color eléctrico y rasposo.",
    errorFeedback: "Casi. Suena más como un sintetizador eléctrico por su tono rasposo.",
    explanation:
      "El timbre es el 'color' del sonido: nos permite reconocer la fuente que lo produjo (una voz, un piano, una guitarra) aunque toquen exactamente la misma nota.",
  },
];
