import type { RhythmExercise, RhythmModule } from "@/types/rhythm";

export const RHYTHM_MODULE_ID = "basic-rhythm";

export const rhythmExercises: RhythmExercise[] = [
  {
    id: "follow-pulse",
    moduleId: RHYTHM_MODULE_ID,
    title: "Sigue el pulso",
    description: "Toca cada vez que el círculo llegue al centro.",
    bpm: 60,
    totalBeats: 16,
    type: "follow_pulse",
    requiredAccuracy: 0.7,
  },
  {
    id: "tempo-compare",
    moduleId: RHYTHM_MODULE_ID,
    title: "Pulso lento vs rápido",
    description: "Siente cómo cambia la distancia entre beats a 60, 90 y 120 BPM.",
    bpm: 60,
    totalBeats: 24,
    type: "tempo_compare",
    rounds: [
      { bpm: 60, totalBeats: 8, label: "Lento" },
      { bpm: 90, totalBeats: 8, label: "Medio" },
      { bpm: 120, totalBeats: 8, label: "Rápido" },
    ],
    requiredAccuracy: 0.7,
    unlockedBy: "follow-pulse",
  },
  {
    id: "marked-beats",
    moduleId: RHYTHM_MODULE_ID,
    title: "Toca solo los marcados",
    description: "Toca en las celdas activas y espera en los silencios.",
    bpm: 72,
    totalBeats: 24,
    type: "pattern_tap",
    patterns: [
      { id: "alternating", label: "1 - 0", beats: [1, 0, 1, 0, 1, 0, 1, 0] },
      { id: "three-space", label: "cada tres", beats: [1, 0, 0, 1, 0, 0, 1, 0] },
      { id: "pairs", label: "pares", beats: [1, 1, 0, 0, 1, 1, 0, 0] },
    ],
    requiredAccuracy: 0.7,
    unlockedBy: "tempo-compare",
  },
  {
    id: "repeat-pattern",
    moduleId: RHYTHM_MODULE_ID,
    title: "Repite el patrón",
    description: "Memoriza patrones de 4, 6 y 8 beats y repítelos con el pulso.",
    bpm: 68,
    totalBeats: 18,
    type: "pattern_repeat",
    patterns: [
      { id: "four", label: "4 beats", beats: [1, 0, 1, 1] },
      { id: "six", label: "6 beats", beats: [1, 0, 1, 0, 1, 1] },
      { id: "eight", label: "8 beats", beats: [1, 1, 0, 1, 0, 1, 1, 0] },
    ],
    requiredAccuracy: 0.7,
    unlockedBy: "marked-beats",
  },
  {
    id: "mini-performance",
    moduleId: RHYTHM_MODULE_ID,
    title: "Mini performance rítmica",
    description: "Toca una nota fija siguiendo el patrón final de beats y silencios.",
    bpm: 76,
    totalBeats: 16,
    type: "final_performance",
    pattern: [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0],
    requiredAccuracy: 0.75,
    maxMisses: 5,
    unlockedBy: "repeat-pattern",
  },
];

export const rhythmModule: RhythmModule = {
  id: RHYTHM_MODULE_ID,
  title: "Ritmo Básico",
  subtitle: "Toca con pulso, no con suerte",
  description:
    "Aprende a sentir un beat constante, tocar sincronizado y respetar silencios simples sin usar partituras todavía.",
  estimatedMinutes: 35,
  exercises: rhythmExercises,
};
