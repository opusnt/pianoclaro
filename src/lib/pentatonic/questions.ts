import {
  areRelativePentatonics,
  getDisplayPitchName,
  getPentatonicDisplaySequence,
  getPentatonicNoteNamesWithOctaves,
  getPentatonicScaleById,
  requirePentatonicScale,
} from "@/lib/pentatonic/theory";
import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type { PentatonicExercise, PentatonicQuestion } from "@/types/pentatonic";

const yesNoOptions = ["Sí", "No"];
const missingNotePlan = [
  { scaleId: "c-major-pentatonic", missingNoteIndex: 2 },
  { scaleId: "c-major-pentatonic", missingNoteIndex: 3 },
  { scaleId: "g-major-pentatonic", missingNoteIndex: 2 },
  { scaleId: "f-major-pentatonic", missingNoteIndex: 3 },
  { scaleId: "a-minor-pentatonic", missingNoteIndex: 1 },
  { scaleId: "a-minor-pentatonic", missingNoteIndex: 4 },
  { scaleId: "g-major-pentatonic", missingNoteIndex: 4 },
  { scaleId: "f-major-pentatonic", missingNoteIndex: 2 },
  { scaleId: "c-major-pentatonic", missingNoteIndex: 4 },
  { scaleId: "a-minor-pentatonic", missingNoteIndex: 2 },
];

const relativePlan = [
  ["c-major-pentatonic", "a-minor-pentatonic"],
  ["g-major-pentatonic", "e-minor-pentatonic"],
  ["f-major-pentatonic", "d-minor-pentatonic"],
  ["c-major-pentatonic", "e-minor-pentatonic"],
  ["g-major-pentatonic", "d-minor-pentatonic"],
  ["f-major-pentatonic", "a-minor-pentatonic"],
] as const;

export function generatePentatonicQuestions(exercise: PentatonicExercise): PentatonicQuestion[] {
  if (exercise.type === "discover_five_notes") {
    return [buildScaleSequenceQuestion(exercise, "c-major-pentatonic", true)];
  }

  if (exercise.type === "play_c_major_pentatonic") {
    return [buildScaleSequenceQuestion(exercise, "c-major-pentatonic")];
  }

  if (exercise.type === "build_major_pentatonic") {
    return exercise.allowedScales.map((scaleId) => buildScaleSequenceQuestion(exercise, scaleId));
  }

  if (exercise.type === "minor_pentatonic") {
    return [buildScaleSequenceQuestion(exercise, "a-minor-pentatonic")];
  }

  if (exercise.type === "relative_pentatonics") {
    return relativePlan
      .slice(0, exercise.totalRounds)
      .map(([first, second], index) => buildRelativeQuestion(exercise, first, second, index));
  }

  if (exercise.type === "missing_note") {
    return missingNotePlan
      .slice(0, exercise.totalRounds)
      .map((plan, index) =>
        buildMissingNoteQuestion(exercise, plan.scaleId, plan.missingNoteIndex, index),
      );
  }

  if (exercise.type === "guided_improvisation") {
    return [
      {
        id: `${exercise.id}-c-major`,
        exerciseId: exercise.id,
        scaleId: "c-major-pentatonic",
        taskType: exercise.type,
        mode: "improvisation",
        prompt: "Improvisa durante 32 beats usando solo DO, RE, MI, SOL y LA.",
      },
    ];
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: PentatonicQuestion) {
  if (question.mode === "improvisation") return 1;
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: PentatonicQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

export function getExpectedOptionForQuestion(question: PentatonicQuestion) {
  if (typeof question.expectedAnswer === "string") return question.expectedAnswer;
  return question.expectedAnswer?.join(" y ") ?? "";
}

function buildScaleSequenceQuestion(
  exercise: PentatonicExercise,
  scaleId: string,
  omitOctave = false,
): PentatonicQuestion {
  const scale = requirePentatonicScale(scaleId);
  const midiNotes = omitOctave ? scale.midiNotes.slice(0, -1) : scale.midiNotes;
  const expectedNotes = midiNotes.map((midi) => {
    const index = scale.midiNotes.findIndex((note) => note === midi);
    const pitchClass = scale.notes[index];
    const octave = Math.floor(midi / 12) - 1;
    return `${pitchClass}${octave}`;
  });

  return {
    id: `${exercise.id}-${scaleId}`,
    exerciseId: exercise.id,
    scaleId,
    taskType: exercise.type,
    mode: "mixed",
    prompt:
      exercise.type === "discover_five_notes"
        ? "Toca las cinco notas principales: DO RE MI SOL LA."
        : `Toca ${scale.displayName}: ${getPentatonicDisplaySequence(scale)}.`,
    expectedNotes,
    expectedMidiNotes: midiNotes,
    expectedAnswer: expectedNotes,
  };
}

function buildRelativeQuestion(
  exercise: PentatonicExercise,
  scaleId: string,
  comparisonScaleId: string,
  index: number,
): PentatonicQuestion {
  const first = requirePentatonicScale(scaleId);
  const second = requirePentatonicScale(comparisonScaleId);
  return {
    id: `${exercise.id}-${scaleId}-${comparisonScaleId}-${index}`,
    exerciseId: exercise.id,
    scaleId,
    comparisonScaleId,
    taskType: exercise.type,
    mode: "mixed",
    prompt: `${first.displayName} y ${second.displayName}: comparten las mismas notas?`,
    answerOptions: yesNoOptions,
    expectedAnswer: areRelativePentatonics(scaleId, comparisonScaleId) ? "Sí" : "No",
  };
}

function buildMissingNoteQuestion(
  exercise: PentatonicExercise,
  scaleId: string,
  missingNoteIndex: number,
  index: number,
): PentatonicQuestion {
  const scale = requirePentatonicScale(scaleId);
  return {
    id: `${exercise.id}-${scaleId}-${missingNoteIndex}-${index}`,
    exerciseId: exercise.id,
    scaleId,
    taskType: exercise.type,
    mode: "visual",
    prompt: `Completa la nota faltante en ${scale.displayName}.`,
    missingNoteIndex,
    answerOptions: buildMissingNoteOptions(scaleId, missingNoteIndex),
    expectedAnswer: getDisplayPitchName(scale.notes[missingNoteIndex]),
  };
}

function buildFinalChallengeQuestions(exercise: PentatonicExercise) {
  const mixed: PentatonicQuestion[] = [
    buildScaleSequenceQuestion(exercise, "c-major-pentatonic"),
    buildMissingNoteQuestion(exercise, "c-major-pentatonic", 2, 1),
    buildRelativeQuestion(exercise, "c-major-pentatonic", "a-minor-pentatonic", 2),
    buildScaleSequenceQuestion(exercise, "a-minor-pentatonic"),
    buildScaleSequenceQuestion(exercise, "g-major-pentatonic"),
    buildMissingNoteQuestion(exercise, "g-major-pentatonic", 2, 5),
    buildRelativeQuestion(exercise, "g-major-pentatonic", "e-minor-pentatonic", 6),
    buildScaleSequenceQuestion(exercise, "f-major-pentatonic"),
    buildRelativeQuestion(exercise, "f-major-pentatonic", "a-minor-pentatonic", 8),
    {
      id: `${exercise.id}-improv-final`,
      exerciseId: exercise.id,
      scaleId: "c-major-pentatonic",
      taskType: exercise.type,
      mode: "improvisation",
      prompt: "Cierra con una mini improvisación de 16 beats usando DO pentatónica mayor.",
    },
  ];
  const expanded = [
    ...mixed,
    ...mixed.map((question, index) => ({ ...question, id: `${question.id}-b-${index}` })),
  ];
  return expanded.slice(0, exercise.totalRounds).map((question) => ({
    ...question,
    taskType: "final_challenge" as const,
  }));
}

function buildMissingNoteOptions(scaleId: string, missingNoteIndex: number) {
  const scale = requirePentatonicScale(scaleId);
  const correct = getDisplayPitchName(scale.notes[missingNoteIndex]);
  const pool = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"];
  return [correct, ...pool.filter((option) => option !== correct)].slice(0, 4);
}

export function getQuestionScaleMidiNotes(question: PentatonicQuestion) {
  return getPentatonicScaleById(question.scaleId)?.midiNotes ?? [];
}

export function getComparisonScaleMidiNotes(question: PentatonicQuestion) {
  return question.comparisonScaleId
    ? (getPentatonicScaleById(question.comparisonScaleId)?.midiNotes ?? [])
    : [];
}

export function getQuestionScaleNoteNames(question: PentatonicQuestion) {
  const scale = getPentatonicScaleById(question.scaleId);
  return scale ? getPentatonicNoteNamesWithOctaves(scale) : [];
}
