import {
  getDisplayPitchName,
  getMajorMinorDifferenceIndexes,
  getMinorScaleById,
  getMinorScaleNoteNamesWithOctaves,
  getNaturalHarmonicDifferenceIndexes,
  getNaturalMelodicDifferenceIndexes,
} from "@/lib/minor-scale/theory";
import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type {
  MinorScaleDefinition,
  MinorScaleExercise,
  MinorScaleExerciseType,
  MinorScaleQuestion,
} from "@/types/minor-scale";

const cMajorMidiNotes = [60, 62, 64, 65, 67, 69, 71, 72];

const comparisonPlan = [
  {
    scaleId: "c-minor-natural",
    comparisonScaleId: "c-major",
    prompt: "Escucha ambas escalas: ¿cuál suena menor?",
    answerOptions: ["Primera", "Segunda"],
    expectedAnswer: "Segunda",
  },
  {
    scaleId: "c-minor-natural",
    comparisonScaleId: "c-major",
    prompt: "La diferencia clave aparece en una nota. ¿Cuál cambió?",
    answerOptions: ["Segunda nota", "Tercera nota", "Quinta nota"],
    expectedAnswer: "Tercera nota",
  },
  {
    scaleId: "c-minor-natural",
    comparisonScaleId: "c-major",
    prompt: "¿Cuál suena mayor?",
    answerOptions: ["Primera", "Segunda"],
    expectedAnswer: "Primera",
  },
  {
    scaleId: "a-minor-natural",
    comparisonScaleId: "c-major",
    prompt: "Escucha el contraste: ¿qué escala suena menor?",
    answerOptions: ["DO mayor", "LA menor natural"],
    expectedAnswer: "LA menor natural",
  },
  {
    scaleId: "c-minor-natural",
    comparisonScaleId: "c-major",
    prompt: "En menor, la tercera nota está...",
    answerOptions: ["Igual", "Un semitono más abajo", "Una octava más arriba"],
    expectedAnswer: "Un semitono más abajo",
  },
  {
    scaleId: "a-minor-natural",
    comparisonScaleId: "c-major",
    prompt: "¿Qué conviene escuchar para distinguir mayor y menor?",
    answerOptions: ["La tercera nota", "La última nota", "El tempo"],
    expectedAnswer: "La tercera nota",
  },
];

const missingNotePlan = [
  { scaleId: "a-minor-natural", missingNoteIndex: 2 },
  { scaleId: "a-minor-natural", missingNoteIndex: 5 },
  { scaleId: "c-minor-natural", missingNoteIndex: 2 },
  { scaleId: "c-minor-natural", missingNoteIndex: 5 },
  { scaleId: "c-minor-natural", missingNoteIndex: 6 },
  { scaleId: "e-minor-natural", missingNoteIndex: 1 },
  { scaleId: "e-minor-natural", missingNoteIndex: 2 },
  { scaleId: "e-minor-natural", missingNoteIndex: 5 },
  { scaleId: "a-minor-natural", missingNoteIndex: 6 },
  { scaleId: "c-minor-natural", missingNoteIndex: 3 },
];

export function generateMinorScaleQuestions(exercise: MinorScaleExercise): MinorScaleQuestion[] {
  if (exercise.type === "major_vs_minor") {
    return comparisonPlan.slice(0, exercise.totalRounds).map((plan, index) =>
      buildComparisonQuestion({
        exercise,
        index,
        scaleId: plan.scaleId,
        comparisonScaleId: plan.comparisonScaleId,
        prompt: plan.prompt,
        answerOptions: plan.answerOptions,
        expectedAnswer: plan.expectedAnswer,
        highlightedDifferenceIndexes: getMajorMinorDifferenceIndexes(),
      }),
    );
  }

  if (exercise.type === "discover_natural_pattern") {
    return [buildScaleSequenceQuestion(exercise, "a-minor-natural", exercise.type, true)];
  }

  if (exercise.type === "play_a_minor_natural") {
    return [buildScaleSequenceQuestion(exercise, "a-minor-natural", exercise.type)];
  }

  if (exercise.type === "build_natural_from_tonic") {
    return exercise.allowedScales.map((scaleId) =>
      buildScaleSequenceQuestion(exercise, scaleId, exercise.type, true),
    );
  }

  if (exercise.type === "missing_note") {
    return missingNotePlan
      .slice(0, exercise.totalRounds)
      .map((plan, index) =>
        buildMissingNoteQuestion(exercise, plan.scaleId, plan.missingNoteIndex, index),
      );
  }

  if (exercise.type === "natural_vs_harmonic") {
    return buildVariantQuestions({
      exercise,
      variantScaleId: "a-minor-harmonic",
      comparisonScaleId: "a-minor-natural",
      differenceIndexes: getNaturalHarmonicDifferenceIndexes(),
      prompts: [
        {
          prompt: "¿Cuál escala tiene el séptimo grado más alto?",
          options: ["LA menor natural", "LA menor armónica"],
          expected: "LA menor armónica",
        },
        {
          prompt: "Toca la nota que cambia en LA menor armónica.",
          noteTargetMidi: 68,
        },
        {
          prompt: "Completa LA menor armónica.",
          sequence: true,
        },
      ],
    }).slice(0, exercise.totalRounds);
  }

  if (exercise.type === "natural_vs_melodic") {
    return buildVariantQuestions({
      exercise,
      variantScaleId: "a-minor-melodic-ascending",
      comparisonScaleId: "a-minor-natural",
      differenceIndexes: getNaturalMelodicDifferenceIndexes(),
      prompts: [
        {
          prompt: "¿Qué dos notas cambian en la menor melódica ascendente?",
          options: ["Sexta y séptima", "Segunda y quinta", "Tercera y cuarta"],
          expected: "Sexta y séptima",
        },
        {
          prompt: "Toca la sexta modificada de LA menor melódica.",
          noteTargetMidi: 66,
        },
        {
          prompt: "Toca la séptima modificada de LA menor melódica.",
          noteTargetMidi: 68,
        },
        {
          prompt: "Completa LA menor melódica ascendente.",
          sequence: true,
        },
      ],
    }).slice(0, exercise.totalRounds);
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: MinorScaleQuestion) {
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: MinorScaleQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

export function getExpectedOptionForQuestion(question: MinorScaleQuestion) {
  if (question.taskType === "missing_note" && typeof question.missingNoteIndex === "number") {
    const scale = getMinorScaleById(question.scaleId);
    return getDisplayPitchName(scale?.notes[question.missingNoteIndex] ?? "");
  }

  if (question.prompt.includes("séptimo grado más alto")) return "LA menor armónica";
  if (question.prompt.includes("dos notas cambian")) return "Sexta y séptima";
  if (question.prompt.includes("cuál suena menor"))
    return question.prompt.includes("ambas") ? "Segunda" : "LA menor natural";
  if (question.prompt.includes("Cuál suena mayor")) return "Primera";
  if (question.prompt.includes("Cuál cambió")) return "Tercera nota";
  if (question.prompt.includes("está...")) return "Un semitono más abajo";
  if (question.prompt.includes("conviene escuchar")) return "La tercera nota";

  return question.isCorrectScale ? "Suena correcta" : "Algo suena fuera";
}

function buildScaleSequenceQuestion(
  exercise: MinorScaleExercise,
  scaleId: string,
  taskType: MinorScaleExerciseType,
  omitTonic = false,
): MinorScaleQuestion {
  const scale = requireScale(scaleId);
  const expectedMidiNotes = omitTonic ? scale.midiNotes.slice(1) : scale.midiNotes;
  const expectedNotes = expectedMidiNotes.map((midi) => scaleNoteFromMidiForScale(scale, midi));

  return {
    id: `${exercise.id}-${scale.id}`,
    exerciseId: exercise.id,
    scaleId: scale.id,
    tonic: scale.tonic,
    scaleType: scale.scaleType,
    mode: "visual",
    taskType,
    expectedNotes,
    expectedMidiNotes,
    prompt:
      taskType === "discover_natural_pattern"
        ? "Desde LA, toca cada nota siguiendo T - S - T - T - S - T - T."
        : `Toca ${scale.displayName} en orden ascendente.`,
  };
}

function buildMissingNoteQuestion(
  exercise: MinorScaleExercise,
  scaleId: string,
  missingNoteIndex: number,
  index: number,
): MinorScaleQuestion {
  const scale = requireScale(scaleId);

  return {
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    scaleId: scale.id,
    tonic: scale.tonic,
    scaleType: scale.scaleType,
    mode: "mixed",
    taskType: exercise.type,
    missingNoteIndex,
    answerOptions: buildMissingNoteOptions(scale.notes[missingNoteIndex]),
    prompt: `Completa la nota ${missingNoteIndex + 1} de ${scale.displayName}.`,
  };
}

function buildComparisonQuestion({
  exercise,
  index,
  scaleId,
  comparisonScaleId,
  prompt,
  answerOptions,
  expectedAnswer,
  highlightedDifferenceIndexes,
}: {
  exercise: MinorScaleExercise;
  index: number;
  scaleId: string;
  comparisonScaleId: string;
  prompt: string;
  answerOptions: string[];
  expectedAnswer: string;
  highlightedDifferenceIndexes: number[];
}) {
  const scale = requireScale(scaleId);

  return {
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    scaleId: scale.id,
    tonic: scale.tonic,
    scaleType: scale.scaleType,
    mode: "audio",
    taskType: exercise.type,
    answerOptions,
    comparisonScaleId,
    highlightedDifferenceIndexes,
    prompt,
    isCorrectScale: expectedAnswer === "Suena correcta",
  } satisfies MinorScaleQuestion;
}

function buildVariantQuestions({
  exercise,
  variantScaleId,
  comparisonScaleId,
  differenceIndexes,
  prompts,
}: {
  exercise: MinorScaleExercise;
  variantScaleId: string;
  comparisonScaleId: string;
  differenceIndexes: number[];
  prompts: Array<{
    prompt: string;
    options?: string[];
    expected?: string;
    noteTargetMidi?: number;
    sequence?: boolean;
  }>;
}) {
  const scale = requireScale(variantScaleId);

  return prompts.map((item, index) => {
    if (item.sequence) {
      return {
        ...buildScaleSequenceQuestion(exercise, variantScaleId, exercise.type, true),
        id: `${exercise.id}-${index + 1}`,
        mode: "mixed",
        comparisonScaleId,
        highlightedDifferenceIndexes: differenceIndexes,
        prompt: item.prompt,
      } satisfies MinorScaleQuestion;
    }

    return {
      id: `${exercise.id}-${index + 1}`,
      exerciseId: exercise.id,
      scaleId: scale.id,
      tonic: scale.tonic,
      scaleType: scale.scaleType,
      mode: item.noteTargetMidi ? "mixed" : "audio",
      taskType: exercise.type,
      answerOptions: item.options,
      selectedNoteTargetMidi: item.noteTargetMidi,
      comparisonScaleId,
      highlightedDifferenceIndexes: differenceIndexes,
      prompt: item.prompt,
    } satisfies MinorScaleQuestion;
  });
}

function buildFinalChallengeQuestions(exercise: MinorScaleExercise): MinorScaleQuestion[] {
  const questions = [
    ...generateMinorScaleQuestions({ ...exercise, type: "major_vs_minor", totalRounds: 3 }),
    buildScaleSequenceQuestion(exercise, "a-minor-natural", "play_a_minor_natural"),
    buildMissingNoteQuestion(exercise, "c-minor-natural", 2, 5),
    buildScaleSequenceQuestion(exercise, "c-minor-natural", "build_natural_from_tonic", true),
    buildMissingNoteQuestion(exercise, "e-minor-natural", 1, 7),
    buildScaleSequenceQuestion(exercise, "e-minor-natural", "build_natural_from_tonic", true),
    ...buildVariantQuestions({
      exercise,
      variantScaleId: "a-minor-harmonic",
      comparisonScaleId: "a-minor-natural",
      differenceIndexes: getNaturalHarmonicDifferenceIndexes(),
      prompts: [
        {
          prompt: "¿Cuál tiene el séptimo grado más alto?",
          options: ["LA menor natural", "LA menor armónica"],
        },
        { prompt: "Toca SOL# en LA menor armónica.", noteTargetMidi: 68 },
      ],
    }),
    ...buildVariantQuestions({
      exercise,
      variantScaleId: "a-minor-melodic-ascending",
      comparisonScaleId: "a-minor-natural",
      differenceIndexes: getNaturalMelodicDifferenceIndexes(),
      prompts: [
        {
          prompt: "¿Qué dos notas cambian en la melódica?",
          options: ["Sexta y séptima", "Segunda y quinta"],
        },
        { prompt: "Toca FA# en LA menor melódica.", noteTargetMidi: 66 },
        { prompt: "Completa LA menor melódica ascendente.", sequence: true },
      ],
    }),
    buildMissingNoteQuestion(exercise, "a-minor-natural", 5, 14),
    buildScaleSequenceQuestion(exercise, "a-minor-harmonic", "natural_vs_harmonic", true),
    buildMissingNoteQuestion(exercise, "c-minor-natural", 6, 16),
    buildScaleSequenceQuestion(exercise, "a-minor-natural", "build_natural_from_tonic", true),
    buildMissingNoteQuestion(exercise, "e-minor-natural", 5, 18),
    buildScaleSequenceQuestion(exercise, "c-minor-natural", "build_natural_from_tonic", true),
    buildMissingNoteQuestion(exercise, "a-minor-harmonic", 6, 20),
    buildMissingNoteQuestion(exercise, "a-minor-melodic-ascending", 5, 21),
    buildScaleSequenceQuestion(exercise, "a-minor-melodic-ascending", "natural_vs_melodic", true),
    buildMissingNoteQuestion(exercise, "a-minor-melodic-ascending", 6, 23),
    buildScaleSequenceQuestion(exercise, "a-minor-natural", "build_natural_from_tonic", true),
  ];

  return questions.slice(0, exercise.totalRounds).map((question, index) => ({
    ...question,
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    taskType: "final_challenge",
    mode: question.mode === "audio" ? "audio" : "mixed",
  }));
}

function requireScale(scaleId: string) {
  const scale = getMinorScaleById(scaleId);
  if (!scale) throw new Error(`Escala desconocida: ${scaleId}`);
  return scale;
}

function scaleNoteFromMidiForScale(scale: MinorScaleDefinition, midi: number) {
  const index = scale.midiNotes.findIndex((scaleMidi) => scaleMidi === midi);

  if (index >= 0) {
    const octave = Math.floor(midi / 12) - 1;
    return `${scale.notes[index]}${octave}`;
  }

  return `${scale.notes[0]}${Math.floor(midi / 12) - 1}`;
}

function buildMissingNoteOptions(expectedNote?: string) {
  const baseOptions = ["A", "B", "C", "D", "Eb", "E", "F", "F#", "G", "G#", "Ab", "Bb"];
  const expectedDisplay = expectedNote ? getDisplayPitchName(expectedNote) : "";
  const options = baseOptions.map(getDisplayPitchName);

  return Array.from(new Set([expectedDisplay, ...options])).slice(0, 4);
}

export function getComparisonMidiNotes(question: MinorScaleQuestion) {
  if (question.comparisonScaleId === "c-major") return cMajorMidiNotes;
  return getMinorScaleById(question.comparisonScaleId ?? "")?.midiNotes ?? [];
}
