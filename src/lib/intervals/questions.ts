import {
  getDirectionLabel,
  getIntervalDefinitionById,
  getIntervalDistanceCategory,
  transposeNote,
} from "@/lib/intervals/theory";
import type {
  IntervalDirection,
  IntervalExercise,
  IntervalExerciseType,
  IntervalPlaybackType,
  IntervalQuestion,
} from "@/types/intervals";

type QuestionSeed = {
  baseNote: string;
  semitones: number;
  direction: IntervalDirection;
  taskType?: IntervalExerciseType;
  playbackType?: IntervalPlaybackType;
};

const visualSemitoneSeeds: QuestionSeed[] = [
  { baseNote: "C4", semitones: 1, direction: "ascending" },
  { baseNote: "D4", semitones: 1, direction: "descending" },
  { baseNote: "E4", semitones: 1, direction: "ascending" },
  { baseNote: "F4", semitones: 1, direction: "descending" },
  { baseNote: "G4", semitones: 1, direction: "ascending" },
  { baseNote: "A4", semitones: 1, direction: "descending" },
  { baseNote: "B4", semitones: 1, direction: "ascending" },
  { baseNote: "C5", semitones: 1, direction: "descending" },
];

const findIntervalSeeds: QuestionSeed[] = [
  { baseNote: "C4", semitones: 1, direction: "ascending" },
  { baseNote: "C4", semitones: 2, direction: "ascending" },
  { baseNote: "D4", semitones: 3, direction: "ascending" },
  { baseNote: "E4", semitones: 4, direction: "ascending" },
  { baseNote: "C4", semitones: 5, direction: "ascending" },
  { baseNote: "C4", semitones: 7, direction: "ascending" },
  { baseNote: "C4", semitones: 12, direction: "ascending" },
  { baseNote: "F4", semitones: 2, direction: "ascending" },
  { baseNote: "G4", semitones: 3, direction: "ascending" },
  { baseNote: "A4", semitones: 1, direction: "ascending" },
];

const directionSeeds: QuestionSeed[] = [
  { baseNote: "C4", semitones: 2, direction: "ascending" },
  { baseNote: "G4", semitones: 3, direction: "descending" },
  { baseNote: "E4", semitones: 0, direction: "same" },
  { baseNote: "F4", semitones: 5, direction: "ascending" },
  { baseNote: "C5", semitones: 7, direction: "descending" },
  { baseNote: "D4", semitones: 3, direction: "ascending" },
  { baseNote: "A4", semitones: 2, direction: "descending" },
  { baseNote: "G4", semitones: 0, direction: "same" },
  { baseNote: "C4", semitones: 7, direction: "ascending" },
  { baseNote: "B4", semitones: 5, direction: "descending" },
];

const playbackSeeds: QuestionSeed[] = [
  { baseNote: "C4", semitones: 2, direction: "ascending", playbackType: "melodic" },
  { baseNote: "D4", semitones: 4, direction: "ascending", playbackType: "harmonic" },
  { baseNote: "G4", semitones: 5, direction: "descending", playbackType: "melodic" },
  { baseNote: "C4", semitones: 7, direction: "ascending", playbackType: "harmonic" },
  { baseNote: "C4", semitones: 12, direction: "ascending", playbackType: "melodic" },
  { baseNote: "A4", semitones: 1, direction: "descending", playbackType: "harmonic" },
  { baseNote: "E4", semitones: 5, direction: "ascending", playbackType: "melodic" },
  { baseNote: "C5", semitones: 7, direction: "descending", playbackType: "harmonic" },
  { baseNote: "F4", semitones: 4, direction: "ascending", playbackType: "melodic" },
  { baseNote: "G4", semitones: 2, direction: "ascending", playbackType: "harmonic" },
];

const audioDistanceSeeds: QuestionSeed[] = [
  { baseNote: "C4", semitones: 0, direction: "same" },
  { baseNote: "E4", semitones: 1, direction: "ascending" },
  { baseNote: "F4", semitones: 2, direction: "ascending" },
  { baseNote: "D4", semitones: 3, direction: "ascending" },
  { baseNote: "E4", semitones: 4, direction: "ascending" },
  { baseNote: "C4", semitones: 5, direction: "ascending" },
  { baseNote: "C4", semitones: 7, direction: "ascending" },
  { baseNote: "C4", semitones: 12, direction: "ascending" },
  { baseNote: "G4", semitones: 2, direction: "descending" },
  { baseNote: "C5", semitones: 7, direction: "descending" },
  { baseNote: "A4", semitones: 0, direction: "same" },
  { baseNote: "B4", semitones: 5, direction: "descending" },
];

const finalSeeds: QuestionSeed[] = [
  { baseNote: "C4", semitones: 2, direction: "ascending", taskType: "find_interval" },
  { baseNote: "G4", semitones: 3, direction: "descending", taskType: "direction_recognition" },
  { baseNote: "C4", semitones: 7, direction: "ascending", taskType: "audio_distance" },
  { baseNote: "E4", semitones: 1, direction: "ascending", taskType: "find_interval" },
  {
    baseNote: "D4",
    semitones: 4,
    direction: "ascending",
    taskType: "melodic_vs_harmonic",
    playbackType: "harmonic",
  },
  { baseNote: "C5", semitones: 12, direction: "descending", taskType: "find_interval" },
  { baseNote: "F4", semitones: 5, direction: "ascending", taskType: "direction_recognition" },
  { baseNote: "A4", semitones: 0, direction: "same", taskType: "audio_distance" },
  { baseNote: "G4", semitones: 2, direction: "ascending", taskType: "find_interval" },
  { baseNote: "B4", semitones: 5, direction: "descending", taskType: "direction_recognition" },
  { baseNote: "C4", semitones: 12, direction: "ascending", taskType: "audio_distance" },
  { baseNote: "F4", semitones: 4, direction: "ascending", taskType: "find_interval" },
  {
    baseNote: "E4",
    semitones: 5,
    direction: "ascending",
    taskType: "melodic_vs_harmonic",
    playbackType: "melodic",
  },
  { baseNote: "G4", semitones: 0, direction: "same", taskType: "direction_recognition" },
  { baseNote: "C4", semitones: 5, direction: "ascending", taskType: "find_interval" },
  { baseNote: "C5", semitones: 7, direction: "descending", taskType: "audio_distance" },
  { baseNote: "D4", semitones: 3, direction: "ascending", taskType: "find_interval" },
  { baseNote: "A4", semitones: 1, direction: "descending", taskType: "direction_recognition" },
  {
    baseNote: "C4",
    semitones: 7,
    direction: "ascending",
    taskType: "melodic_vs_harmonic",
    playbackType: "harmonic",
  },
  { baseNote: "C4", semitones: 12, direction: "ascending", taskType: "find_interval" },
];

export function generateIntervalQuestions(exercise: IntervalExercise): IntervalQuestion[] {
  const seeds = getSeedsForExercise(exercise);

  return seeds.slice(0, exercise.totalRounds).map((seed, index) =>
    buildQuestion({
      exercise,
      seed,
      index,
    }),
  );
}

function getSeedsForExercise(exercise: IntervalExercise) {
  if (exercise.type === "semitone_distance") {
    return visualSemitoneSeeds;
  }

  if (exercise.type === "find_interval") {
    return findIntervalSeeds;
  }

  if (exercise.type === "direction_recognition") {
    return directionSeeds;
  }

  if (exercise.type === "melodic_vs_harmonic") {
    return playbackSeeds;
  }

  if (exercise.type === "audio_distance") {
    return audioDistanceSeeds;
  }

  return finalSeeds;
}

function buildQuestion({
  exercise,
  seed,
  index,
}: {
  exercise: IntervalExercise;
  seed: QuestionSeed;
  index: number;
}): IntervalQuestion {
  const signedDistance =
    seed.direction === "descending"
      ? -seed.semitones
      : seed.direction === "same"
        ? 0
        : seed.semitones;
  const targetNote = transposeNote(seed.baseNote, signedDistance);
  const taskType = seed.taskType ?? exercise.type;
  const interval = getIntervalDefinitionById(
    exercise.allowedIntervals.find(
      (id) => getIntervalDefinitionById(id)?.semitones === seed.semitones,
    ) ?? "unison",
  );
  const intervalName = interval?.name ?? `${seed.semitones} semitonos`;

  return {
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    baseNote: seed.baseNote,
    targetNote,
    intervalSemitones: seed.semitones,
    direction: seed.direction,
    mode: getModeForTask(taskType),
    taskType,
    playbackType: seed.playbackType,
    answerOptions: getAnswerOptions(taskType),
    expectedOption: getExpectedOption(taskType, seed, intervalName),
    prompt: getPrompt(taskType, seed, intervalName),
  };
}

function getModeForTask(taskType: IntervalExerciseType) {
  if (taskType === "semitone_distance" || taskType === "find_interval") {
    return "visual";
  }

  if (taskType === "final_challenge") {
    return "mixed";
  }

  return "audio";
}

function getAnswerOptions(taskType: IntervalExerciseType) {
  if (taskType === "direction_recognition") {
    return ["sube", "baja", "misma nota"];
  }

  if (taskType === "melodic_vs_harmonic") {
    return ["melódico", "armónico"];
  }

  if (taskType === "audio_distance") {
    return ["misma nota", "paso corto", "salto medio", "salto grande"];
  }

  return undefined;
}

function getExpectedOption(
  taskType: IntervalExerciseType,
  seed: QuestionSeed,
  intervalName: string,
) {
  if (taskType === "direction_recognition") {
    return getDirectionLabel(seed.direction);
  }

  if (taskType === "melodic_vs_harmonic") {
    return seed.playbackType === "harmonic" ? "armónico" : "melódico";
  }

  if (taskType === "audio_distance") {
    return getIntervalDistanceCategory(seed.semitones);
  }

  return intervalName;
}

function getPrompt(taskType: IntervalExerciseType, seed: QuestionSeed, intervalName: string) {
  if (taskType === "semitone_distance") {
    return seed.direction === "ascending"
      ? "Toca la tecla inmediatamente a la derecha."
      : "Toca la tecla inmediatamente a la izquierda.";
  }

  if (taskType === "find_interval") {
    return `Toca ${seed.semitones} semitonos hacia ${seed.direction === "descending" ? "abajo" : "arriba"}: ${intervalName}.`;
  }

  if (taskType === "direction_recognition") {
    return "Escucha dos notas y decide si la segunda sube, baja o se mantiene.";
  }

  if (taskType === "melodic_vs_harmonic") {
    return "Escucha si las notas suenan sucesivas o simultáneas.";
  }

  if (taskType === "audio_distance") {
    return "Escucha la distancia y clasifícala por tamaño.";
  }

  return "Responde el reto de intervalos.";
}
