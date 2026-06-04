import type { AudioEvent } from "@/components/shared/audio/useAudioSequencer";

export type RecognitionExercise = {
  id: string;
  type: "melody" | "harmony" | "rhythm";
  instruction: string;
  events: AudioEvent[];
  explanation: string;
};

// Algunos eventos de audio hardcodeados para los ejercicios
const TEMPO = 110;
const BEAT_DURATION = 60 / TEMPO;

export const recognitionExercises: RecognitionExercise[] = [
  {
    id: "ex-1",
    type: "melody",
    instruction: "¿Qué elemento estás escuchando?",
    events: [
      { time: 0, duration: BEAT_DURATION, params: { type: "sine", frequency: 329.63, gain: 0.5 } }, // E4
      {
        time: BEAT_DURATION,
        duration: BEAT_DURATION,
        params: { type: "sine", frequency: 293.66, gain: 0.5 },
      }, // D4
      {
        time: BEAT_DURATION * 2,
        duration: BEAT_DURATION * 2,
        params: { type: "sine", frequency: 261.63, gain: 0.5 },
      }, // C4
    ],
    explanation: "Esa es la melodía. Es una línea simple de notas sucesivas que podrías cantar.",
  },
  {
    id: "ex-2",
    type: "rhythm",
    instruction: "¿Qué elemento estás escuchando?",
    events: [
      { time: 0, duration: 0.1, params: { type: "noise", gain: 0.6 }, filterFrequency: 200 },
      {
        time: BEAT_DURATION,
        duration: 0.1,
        params: { type: "noise", gain: 0.3 },
        filterFrequency: 3000,
      },
      {
        time: BEAT_DURATION * 2,
        duration: 0.1,
        params: { type: "noise", gain: 0.6 },
        filterFrequency: 200,
      },
      {
        time: BEAT_DURATION * 3,
        duration: 0.1,
        params: { type: "noise", gain: 0.3 },
        filterFrequency: 3000,
      },
    ],
    explanation: "¡Exacto! Ese patrón percusivo sin notas musicales es el ritmo.",
  },
  {
    id: "ex-3",
    type: "harmony",
    instruction: "¿Qué elemento estás escuchando?",
    events: [
      {
        time: 0,
        duration: BEAT_DURATION * 2,
        params: { type: "triangle", frequency: 130.81, gain: 0.3 },
      },
      {
        time: 0,
        duration: BEAT_DURATION * 2,
        params: { type: "triangle", frequency: 164.81, gain: 0.3 },
      },
      {
        time: 0,
        duration: BEAT_DURATION * 2,
        params: { type: "triangle", frequency: 196.0, gain: 0.3 },
      },
      {
        time: BEAT_DURATION * 2,
        duration: BEAT_DURATION * 2,
        params: { type: "triangle", frequency: 146.83, gain: 0.3 },
      },
      {
        time: BEAT_DURATION * 2,
        duration: BEAT_DURATION * 2,
        params: { type: "triangle", frequency: 174.61, gain: 0.3 },
      },
      {
        time: BEAT_DURATION * 2,
        duration: BEAT_DURATION * 2,
        params: { type: "triangle", frequency: 220.0, gain: 0.3 },
      },
    ],
    explanation:
      "Correcto, es la armonía. Son varios sonidos tocados simultáneamente formando acordes.",
  },
  {
    id: "ex-4",
    type: "rhythm",
    instruction: "Escucha con atención. ¿Qué pilar es este?",
    events: [
      { time: 0, duration: 0.05, params: { type: "noise", gain: 0.4 }, filterFrequency: 4000 },
      {
        time: BEAT_DURATION / 2,
        duration: 0.05,
        params: { type: "noise", gain: 0.4 },
        filterFrequency: 4000,
      },
      {
        time: BEAT_DURATION,
        duration: 0.1,
        params: { type: "noise", gain: 0.7 },
        filterFrequency: 300,
      },
    ],
    explanation: "¡Muy bien! Un pulso claro y estructurado. Es el ritmo.",
  },
  {
    id: "ex-5",
    type: "melody",
    instruction: "¿Cuál de los tres pilares acaba de sonar?",
    events: [
      {
        time: 0,
        duration: BEAT_DURATION / 2,
        params: { type: "square", frequency: 440, gain: 0.1 },
      },
      {
        time: BEAT_DURATION / 2,
        duration: BEAT_DURATION / 2,
        params: { type: "square", frequency: 493.88, gain: 0.1 },
      },
      {
        time: BEAT_DURATION,
        duration: BEAT_DURATION,
        params: { type: "square", frequency: 523.25, gain: 0.1 },
      },
    ],
    explanation: "Una línea sucesiva con altura definida. Esa es la melodía.",
  },
  {
    id: "ex-6",
    type: "harmony",
    instruction: "Último desafío. ¿De qué se trata esto?",
    events: [
      {
        time: 0,
        duration: BEAT_DURATION * 3,
        params: { type: "sine", frequency: 110.0, gain: 0.3 },
      },
      {
        time: 0,
        duration: BEAT_DURATION * 3,
        params: { type: "sine", frequency: 138.59, gain: 0.3 },
      },
      {
        time: 0,
        duration: BEAT_DURATION * 3,
        params: { type: "sine", frequency: 164.81, gain: 0.3 },
      },
    ],
    explanation:
      "¡Así es! Un bloque de notas sonando al mismo tiempo formando una base. Es la armonía.",
  },
];
