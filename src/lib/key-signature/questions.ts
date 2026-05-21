import {
  getAccidentalTypeLabel,
  getDisplayPitchName,
  getKeyDisplaySequence,
  getKeySignatureById,
  getRelativeKey,
  getScaleNoteNamesWithOctaves,
  keySignatureDefinitions,
  requireKeySignature,
} from "@/lib/key-signature/theory";
import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type {
  AccidentalType,
  KeySignatureExercise,
  KeySignatureExerciseType,
  KeySignatureQuestion,
} from "@/types/key-signature";

const accidentalOptions = ["sin alteraciones", "FA#", "FA# y DO#", "SIb", "SIb y MIb"];
const accidentalTypeOptions = ["usa sostenidos", "usa bemoles", "no usa alteraciones"];
const yesNoOptions = ["Sí", "No"];

const relativeComparisonPlan = [
  ["c-major", "a-minor", "Sí"],
  ["g-major", "e-minor", "Sí"],
  ["f-major", "d-minor", "Sí"],
  ["d-major", "b-minor", "Sí"],
  ["c-major", "e-minor", "No"],
  ["g-major", "d-minor", "No"],
  ["f-major", "g-minor", "No"],
  ["bb-major", "g-minor", "Sí"],
] as const;

export function generateKeySignatureQuestions(exercise: KeySignatureExercise): KeySignatureQuestion[] {
  if (exercise.type === "find_tonic") {
    return ["c-major", "a-minor", "c-major", "a-minor", "g-major", "e-minor"]
      .slice(0, exercise.totalRounds)
      .map((keyId, index) => buildTonicQuestion(exercise, keyId, index));
  }

  if (exercise.type === "global_accidental_rule") {
    return Array.from({ length: exercise.totalRounds }, (_, index) =>
      buildSingleNoteQuestion({
        exercise,
        keyId: "g-major",
        index,
        targetMidi: 66,
        prompt: index % 2 === 0 ? "En SOL mayor aparece FA. Toca la tecla que corresponde." : "La armadura dice FA#. Toca el FA alterado fijo.",
      }),
    );
  }

  if (exercise.type === "identify_accidentals") {
    return ["g-major", "d-major", "f-major", "bb-major", "e-minor", "b-minor", "d-minor", "g-minor"]
      .slice(0, exercise.totalRounds)
      .map((keyId, index) => buildAccidentalsQuestion(exercise, keyId, index));
  }

  if (exercise.type === "build_scale_with_signature") {
    return exercise.allowedKeys.map((keyId) => buildScaleQuestion(exercise, keyId)).slice(0, exercise.totalRounds);
  }

  if (exercise.type === "relative_keys_compare") {
    return relativeComparisonPlan.slice(0, exercise.totalRounds).map(([keyId, comparisonKeyId, expected], index) =>
      buildRelativeComparisonQuestion(exercise, keyId, comparisonKeyId, expected, index),
    );
  }

  if (exercise.type === "find_relative_key") {
    return exercise.allowedKeys.slice(0, exercise.totalRounds).map((keyId, index) =>
      buildFindRelativeQuestion(exercise, keyId, index),
    );
  }

  if (exercise.type === "sharp_flat_none") {
    return exercise.allowedKeys.slice(0, exercise.totalRounds).map((keyId, index) =>
      buildAccidentalTypeQuestion(exercise, keyId, index),
    );
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: KeySignatureQuestion) {
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: KeySignatureQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

export function getExpectedOptionForQuestion(question: KeySignatureQuestion) {
  if (Array.isArray(question.expectedAnswer)) return question.expectedAnswer.join(" y ");
  return question.expectedAnswer;
}

function buildTonicQuestion(
  exercise: KeySignatureExercise,
  keyId: string,
  index: number,
): KeySignatureQuestion {
  const key = requireKeySignature(keyId);
  return {
    id: `${exercise.id}-${keyId}-${index}`,
    exerciseId: exercise.id,
    keyId,
    mode: "audio",
    taskType: exercise.type,
    prompt: `Escucha ${key.displayName} y toca su tónica: la casa.`,
    expectedAnswer: getDisplayPitchName(key.tonic),
    selectedNoteTargetMidi: key.midiNotes[0],
  };
}

function buildSingleNoteQuestion({
  exercise,
  keyId,
  index,
  targetMidi,
  prompt,
}: {
  exercise: KeySignatureExercise;
  keyId: string;
  index: number;
  targetMidi: number;
  prompt: string;
}): KeySignatureQuestion {
  return {
    id: `${exercise.id}-${keyId}-${index}`,
    exerciseId: exercise.id,
    keyId,
    mode: "visual",
    taskType: exercise.type,
    prompt,
    expectedAnswer: "FA#",
    selectedNoteTargetMidi: targetMidi,
  };
}

function buildAccidentalsQuestion(
  exercise: KeySignatureExercise,
  keyId: string,
  index: number,
): KeySignatureQuestion {
  const key = requireKeySignature(keyId);
  return {
    id: `${exercise.id}-${keyId}-${index}`,
    exerciseId: exercise.id,
    keyId,
    mode: "visual",
    taskType: exercise.type,
    prompt: `Qué alteraciones fijas tiene ${key.displayName}?`,
    expectedAnswer: key.accidentals.length ? key.accidentals.map(getDisplayPitchName).join(" y ") : "sin alteraciones",
    answerOptions: accidentalOptions,
  };
}

function buildScaleQuestion(exercise: KeySignatureExercise, keyId: string): KeySignatureQuestion {
  const key = requireKeySignature(keyId);
  return {
    id: `${exercise.id}-${keyId}`,
    exerciseId: exercise.id,
    keyId,
    mode: "mixed",
    taskType: exercise.type,
    prompt: `Toca ${key.displayName} aplicando su armadura: ${getAccidentalSummary(keyId)}.`,
    expectedAnswer: getKeyDisplaySequence(key),
    expectedNotes: getScaleNoteNamesWithOctaves(key),
    expectedMidiNotes: key.midiNotes,
  };
}

function buildRelativeComparisonQuestion(
  exercise: KeySignatureExercise,
  keyId: string,
  comparisonKeyId: string,
  expected: "Sí" | "No",
  index: number,
): KeySignatureQuestion {
  const key = requireKeySignature(keyId);
  const comparison = requireKeySignature(comparisonKeyId);
  return {
    id: `${exercise.id}-${keyId}-${comparisonKeyId}-${index}`,
    exerciseId: exercise.id,
    keyId,
    comparisonKeyId,
    mode: "mixed",
    taskType: exercise.type,
    prompt: `${key.displayName} y ${comparison.displayName}: son relativas?`,
    expectedAnswer: expected,
    answerOptions: yesNoOptions,
  };
}

function buildFindRelativeQuestion(
  exercise: KeySignatureExercise,
  keyId: string,
  index: number,
): KeySignatureQuestion {
  const key = requireKeySignature(keyId);
  const relative = getRelativeKey(keyId);
  const options = buildRelativeOptions(relative.id);
  return {
    id: `${exercise.id}-${keyId}-${index}`,
    exerciseId: exercise.id,
    keyId,
    mode: "visual",
    taskType: exercise.type,
    prompt: `Cuál es la relativa de ${key.displayName}?`,
    expectedAnswer: relative.displayName,
    answerOptions: options,
  };
}

function buildAccidentalTypeQuestion(
  exercise: KeySignatureExercise,
  keyId: string,
  index: number,
): KeySignatureQuestion {
  const key = requireKeySignature(keyId);
  return {
    id: `${exercise.id}-${keyId}-${index}`,
    exerciseId: exercise.id,
    keyId,
    mode: "visual",
    taskType: exercise.type,
    prompt: `${key.displayName}: usa sostenidos, bemoles o no usa alteraciones?`,
    expectedAnswer: optionForAccidentalType(key.accidentalType),
    answerOptions: accidentalTypeOptions,
  };
}

function buildFinalChallengeQuestions(exercise: KeySignatureExercise) {
  const mixed: KeySignatureQuestion[] = [
    buildTonicQuestion(exercise, "c-major", 0),
    buildAccidentalsQuestion(exercise, "g-major", 1),
    buildScaleQuestion(exercise, "f-major"),
    buildRelativeComparisonQuestion(exercise, "g-major", "e-minor", "Sí", 3),
    buildFindRelativeQuestion(exercise, "d-major", 4),
    buildAccidentalTypeQuestion(exercise, "bb-major", 5),
    buildTonicQuestion(exercise, "a-minor", 6),
    buildAccidentalsQuestion(exercise, "d-major", 7),
    buildScaleQuestion(exercise, "e-minor"),
    buildRelativeComparisonQuestion(exercise, "c-major", "e-minor", "No", 9),
    buildFindRelativeQuestion(exercise, "f-major", 10),
    buildAccidentalTypeQuestion(exercise, "c-major", 11),
  ];

  const expanded = [...mixed, ...mixed.map((question, index) => ({ ...question, id: `${question.id}-b-${index}` }))];
  return expanded.slice(0, exercise.totalRounds).map((question) => ({
    ...question,
    taskType: "final_challenge" as KeySignatureExerciseType,
  }));
}

function buildRelativeOptions(correctKeyId: string) {
  const preferred = ["a-minor", "e-minor", "d-minor", "b-minor", "g-minor", "c-major", "g-major", "f-major"];
  const optionIds = [correctKeyId, ...preferred.filter((id) => id !== correctKeyId)].slice(0, 4);
  return optionIds.map((id) => requireKeySignature(id).displayName);
}

function optionForAccidentalType(type: AccidentalType) {
  if (type === "sharp") return "usa sostenidos";
  if (type === "flat") return "usa bemoles";
  return "no usa alteraciones";
}

function getAccidentalSummary(keyId: string) {
  const key = getKeySignatureById(keyId);
  if (!key || key.accidentals.length === 0) return "sin alteraciones";
  return `${getAccidentalTypeLabel(key.accidentalType)}: ${key.accidentals.map(getDisplayPitchName).join(", ")}`;
}

export function getQuestionScaleMidiNotes(question: KeySignatureQuestion) {
  return getKeySignatureById(question.keyId)?.midiNotes ?? [];
}

export function getComparisonScaleMidiNotes(question: KeySignatureQuestion) {
  return question.comparisonKeyId ? getKeySignatureById(question.comparisonKeyId)?.midiNotes ?? [] : [];
}

export function allKeySignatureIds() {
  return keySignatureDefinitions.map((key) => key.id);
}
