import type { AudioEvent, MusicLayer } from "@/components/shared/audio/useAudioSequencer";

const TEMPO = 120;
const BEAT_DURATION = 60 / TEMPO; // 0.5s

// Melodía Simple (Twinkle Twinkle Little Star primeras notas)
// C4 (261.63), G4 (392.00), A4 (440.00)
const melodyEvents: AudioEvent[] = [
  {
    time: 0,
    duration: BEAT_DURATION,
    params: { type: "triangle", frequency: 261.63, gain: 0.8, instrument: "piano" },
  },
  {
    time: BEAT_DURATION,
    duration: BEAT_DURATION,
    params: { type: "triangle", frequency: 261.63, gain: 0.8, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 2,
    duration: BEAT_DURATION,
    params: { type: "triangle", frequency: 392.0, gain: 0.8, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 3,
    duration: BEAT_DURATION,
    params: { type: "triangle", frequency: 392.0, gain: 0.8, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 4,
    duration: BEAT_DURATION,
    params: { type: "triangle", frequency: 440.0, gain: 0.8, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 5,
    duration: BEAT_DURATION,
    params: { type: "triangle", frequency: 440.0, gain: 0.8, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 6,
    duration: BEAT_DURATION * 2,
    params: { type: "triangle", frequency: 392.0, gain: 0.8, instrument: "piano" },
  },
];

// Armonía (Acordes de C Mayor y F Mayor acompañando)
// C Mayor (C3: 130.81, E3: 164.81, G3: 196.00)
// F Mayor (F2: 87.31, A2: 110.00, C3: 130.81)
const harmonyEvents: AudioEvent[] = [
  // Compás 1: C Mayor
  {
    time: 0,
    duration: BEAT_DURATION * 4,
    params: { type: "sine", frequency: 130.81, gain: 0.6, instrument: "piano" },
  },
  {
    time: 0,
    duration: BEAT_DURATION * 4,
    params: { type: "sine", frequency: 164.81, gain: 0.6, instrument: "piano" },
  },
  {
    time: 0,
    duration: BEAT_DURATION * 4,
    params: { type: "sine", frequency: 196.0, gain: 0.6, instrument: "piano" },
  },
  // Compás 2: F Mayor a C Mayor
  {
    time: BEAT_DURATION * 4,
    duration: BEAT_DURATION * 2,
    params: { type: "sine", frequency: 87.31, gain: 0.6, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 4,
    duration: BEAT_DURATION * 2,
    params: { type: "sine", frequency: 110.0, gain: 0.6, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 4,
    duration: BEAT_DURATION * 2,
    params: { type: "sine", frequency: 130.81, gain: 0.6, instrument: "piano" },
  },

  {
    time: BEAT_DURATION * 6,
    duration: BEAT_DURATION * 2,
    params: { type: "sine", frequency: 130.81, gain: 0.6, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 6,
    duration: BEAT_DURATION * 2,
    params: { type: "sine", frequency: 164.81, gain: 0.6, instrument: "piano" },
  },
  {
    time: BEAT_DURATION * 6,
    duration: BEAT_DURATION * 2,
    params: { type: "sine", frequency: 196.0, gain: 0.6, instrument: "piano" },
  },
];

// Ritmo (Bombo en tiempos fuertes, platillo en tiempos débiles)
const rhythmEvents: AudioEvent[] = [];
for (let i = 0; i < 8; i++) {
  const isKick = i % 2 === 0;
  rhythmEvents.push({
    time: i * BEAT_DURATION,
    duration: isKick ? 0.2 : 0.1,
    params: { type: "noise", gain: isKick ? 0.8 : 0.6, instrument: "drums" },
    filterFrequency: isKick ? 150 : 6000, // Bombo vs Hi-hat
  });
}

export const musicPillarsLayers: MusicLayer[] = [
  {
    id: "melody",
    name: "Melodía",
    events: melodyEvents,
  },
  {
    id: "harmony",
    name: "Armonía",
    events: harmonyEvents,
  },
  {
    id: "rhythm",
    name: "Ritmo",
    events: rhythmEvents,
  },
];
