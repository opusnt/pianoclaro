import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type { ChordInversionExercise, ChordInversionQuestion } from "@/types/chord-inversions";
import {
  getDisplayPitchName,
  getInversionDisplaySequence,
  getInversionLabel,
  getInversionNoteNamesWithOctaves,
  haveSamePitchClasses,
  requireInversion,
} from "./theory";

const sameNotesPlan = [
  { inversionId: "c-major-root", comparisonNotes: ["E", "G", "C"], expectedAnswer: "Sí" },
  { inversionId: "c-major-root", comparisonNotes: ["C", "F", "G"], expectedAnswer: "No" },
  { inversionId: "a-minor-root", comparisonNotes: ["C", "E", "A"], expectedAnswer: "Sí" },
  { inversionId: "g-major-root", comparisonNotes: ["B", "D", "G"], expectedAnswer: "Sí" },
  { inversionId: "f-major-root", comparisonNotes: ["F", "Bb", "C"], expectedAnswer: "No" },
  { inversionId: "d-minor-root", comparisonNotes: ["F", "A", "D"], expectedAnswer: "Sí" },
  { inversionId: "e-minor-root", comparisonNotes: ["E", "G#", "B"], expectedAnswer: "No" },
  { inversionId: "c-major-root", comparisonNotes: ["G", "C", "E"], expectedAnswer: "Sí" },
];

const identifyPlan = [
  "c-major-root",
  "c-major-first",
  "c-major-second",
  "a-minor-root",
  "a-minor-first",
  "a-minor-second",
  "g-major-first",
  "f-major-second",
  "d-minor-first",
  "e-minor-second",
  "c-major-first",
  "a-minor-second",
];

const progressionPlan = ["c-major-root", "g-major-first", "a-minor-first", "f-major-second"];

export function generateChordInversionQuestions(exercise: ChordInversionExercise): ChordInversionQuestion[] {
  if (exercise.type === "same_notes_different_order") {
    return sameNotesPlan.slice(0, exercise.totalRounds).map((item, index) => {
      const inversion = requireInversion(item.inversionId);
      return {
        id: `${exercise.id}-${index}`,
        exerciseId: exercise.id,
        inversionId: item.inversionId,
        taskType: exercise.type,
        mode: "visual",
        prompt: `¿${inversion.notes.map(getDisplayPitchName).join(" · ")} y ${item.comparisonNotes.map(getDisplayPitchName).join(" · ")} contienen las mismas notas?`,
        answerOptions: ["Sí", "No"],
        expectedAnswer: item.expectedAnswer,
        comparisonNotes: item.comparisonNotes,
      };
    });
  }

  if (exercise.type === "build_first_inversion") {
    return [buildConstructionQuestion(exercise, "c-major-first")];
  }

  if (exercise.type === "build_second_inversion") {
    return [buildConstructionQuestion(exercise, "c-major-second")];
  }

  if (exercise.type === "identify_inversion" || exercise.type === "audio_recognition") {
    return identifyPlan.slice(0, exercise.totalRounds).map((inversionId, index) =>
      buildIdentifyQuestion(exercise, inversionId, index),
    );
  }

  if (exercise.type === "build_multiple_inversions") {
    return exercise.allowedInversions.slice(0, exercise.totalRounds).map((inversionId) =>
      buildConstructionQuestion(exercise, inversionId),
    );
  }

  if (exercise.type === "smooth_chord_movement") {
    return progressionPlan.map((inversionId, index) => ({
      ...buildConstructionQuestion(exercise, inversionId),
      id: `${exercise.id}-progression-${index}`,
      mode: "progression",
      progressionId: "c-g-am-f-close",
      prompt: `Progresión cercana ${index + 1}/4: toca ${requireInversion(inversionId).chordDisplayName} en ${requireInversion(inversionId).inversionDisplayName}.`,
    }));
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: ChordInversionQuestion) {
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: ChordInversionQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

export function getExpectedOptionForQuestion(question: ChordInversionQuestion) {
  if (typeof question.expectedAnswer === "string") return question.expectedAnswer;
  return question.expectedAnswer?.join(" y ") ?? "";
}

export function getComparisonTruth(inversionId: string, comparisonNotes: string[]) {
  const inversion = requireInversion(inversionId);
  return haveSamePitchClasses(inversion.notes, comparisonNotes) ? "Sí" : "No";
}

function buildConstructionQuestion(exercise: ChordInversionExercise, inversionId: string): ChordInversionQuestion {
  const inversion = requireInversion(inversionId);
  const expectedNotes = getInversionNoteNamesWithOctaves(inversion);

  return {
    id: `${exercise.id}-${inversionId}`,
    exerciseId: exercise.id,
    inversionId,
    taskType: exercise.type,
    mode: "mixed",
    prompt: `Selecciona ${inversion.chordDisplayName} en ${inversion.inversionDisplayName}: ${getInversionDisplaySequence(inversion)}. El bajo debe ser ${getDisplayPitchName(inversion.bassNote)}.`,
    expectedNotes,
    expectedMidiNotes: inversion.midiNotes,
    expectedBassNote: inversion.bassNote,
    expectedAnswer: expectedNotes,
  };
}

function buildIdentifyQuestion(exercise: ChordInversionExercise, inversionId: string, index: number): ChordInversionQuestion {
  const inversion = requireInversion(inversionId);
  return {
    id: `${exercise.id}-${inversionId}-${index}`,
    exerciseId: exercise.id,
    inversionId,
    taskType: exercise.type,
    mode: exercise.type === "audio_recognition" ? "audio" : "visual",
    prompt: `Identifica la posición de ${inversion.chordDisplayName}. Bajo: ${getDisplayPitchName(inversion.bassNote)}.`,
    answerOptions: ["posición fundamental", "primera inversión", "segunda inversión"],
    expectedAnswer: getInversionLabel(inversion.inversionType),
  };
}

function buildFinalChallengeQuestions(exercise: ChordInversionExercise) {
  const mixed: ChordInversionQuestion[] = [
    buildConstructionQuestion(exercise, "c-major-first"),
    buildIdentifyQuestion(exercise, "c-major-second", 1),
    buildConstructionQuestion(exercise, "a-minor-first"),
    {
      ...buildIdentifyQuestion(exercise, "g-major-first", 3),
      mode: "audio",
    },
    buildConstructionQuestion(exercise, "f-major-second"),
    buildIdentifyQuestion(exercise, "e-minor-second", 5),
    ...sameNotesPlan.slice(0, 3).map((item, index) => {
      const inversion = requireInversion(item.inversionId);
      return {
        id: `${exercise.id}-same-${index}`,
        exerciseId: exercise.id,
        inversionId: item.inversionId,
        taskType: "final_challenge" as const,
        mode: "visual" as const,
        prompt: `¿${inversion.notes.map(getDisplayPitchName).join(" · ")} y ${item.comparisonNotes.map(getDisplayPitchName).join(" · ")} contienen las mismas notas?`,
        answerOptions: ["Sí", "No"],
        expectedAnswer: item.expectedAnswer,
        comparisonNotes: item.comparisonNotes,
      };
    }),
    ...progressionPlan.map((inversionId, index) => ({
      ...buildConstructionQuestion(exercise, inversionId),
      id: `${exercise.id}-progression-${index}`,
      mode: "progression" as const,
      progressionId: "c-g-am-f-close",
    })),
  ];

  return [...mixed, ...mixed.map((question, index) => ({ ...question, id: `${question.id}-b-${index}` }))]
    .slice(0, exercise.totalRounds)
    .map((question) => ({ ...question, taskType: "final_challenge" as const }));
}

