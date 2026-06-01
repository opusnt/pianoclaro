import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type {
  FunctionalRole,
  HarmonicFieldExercise,
  HarmonicFieldQuestion,
  ScaleDegree,
} from "@/types/harmonic-field";
import {
  getChordByDegree,
  getChordDisplaySequence,
  getChordNoteNamesWithOctaves,
  getChordProgressionFromDegrees,
  getDisplayPitchName,
  getFunctionLabel,
  getQualityLabel,
  requireField,
} from "./theory";

const degreeOptions: ScaleDegree[] = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const qualityOptions = ["mayor", "menor", "disminuido"];
const functionOptions = ["casa", "preparación", "tensión"];
const popProgression: ScaleDegree[] = ["I", "V", "vi", "IV"];

export function generateHarmonicFieldQuestions(
  exercise: HarmonicFieldExercise,
): HarmonicFieldQuestion[] {
  if (exercise.type === "scale_to_chords") {
    return ["I", "ii", "V"].slice(0, exercise.totalRounds).map((degree, index) =>
      buildChordConstructionQuestion(exercise, "c-major", degree as ScaleDegree, index, {
        promptPrefix:
          index === 0 ? "Desde DO mayor, salta una nota y forma el acorde del I grado" : undefined,
      }),
    );
  }

  if (exercise.type === "build_c_major_field") {
    return degreeOptions.map((degree, index) =>
      buildChordConstructionQuestion(exercise, "c-major", degree, index),
    );
  }

  if (exercise.type === "identify_chord_quality") {
    return buildQualityQuestions(exercise);
  }

  if (exercise.type === "roman_numerals") {
    return buildRomanNumeralQuestions(exercise);
  }

  if (exercise.type === "play_pop_progression") {
    return popProgression.map((degree, index) =>
      buildChordConstructionQuestion(exercise, "c-major", degree, index, {
        progressionId: "I-V-vi-IV",
        mode: "progression",
        promptPrefix: `Progresión I - V - vi - IV, acorde ${index + 1}/4`,
      }),
    );
  }

  if (exercise.type === "transpose_progression") {
    return exercise.allowedFields
      .flatMap((fieldId) =>
        popProgression.map((degree, index) =>
          buildChordConstructionQuestion(exercise, fieldId, degree, index, {
            progressionId: `${fieldId}:I-V-vi-IV`,
            mode: "progression",
            promptPrefix: `${requireField(fieldId).displayName}: toca el grado ${degree}`,
          }),
        ),
      )
      .slice(0, exercise.totalRounds);
  }

  if (exercise.type === "basic_functions") {
    return buildFunctionQuestions(exercise);
  }

  if (exercise.type === "analyze_progression") {
    return buildAnalyzeProgressionQuestions(exercise);
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: HarmonicFieldQuestion) {
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: HarmonicFieldQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

export function getExpectedOptionForQuestion(question: HarmonicFieldQuestion) {
  if (typeof question.expectedAnswer === "string") return question.expectedAnswer;
  return question.expectedAnswer?.join(" - ") ?? "";
}

function buildChordConstructionQuestion(
  exercise: HarmonicFieldExercise,
  fieldId: string,
  degree: ScaleDegree,
  index: number,
  options: { promptPrefix?: string; progressionId?: string; mode?: "mixed" | "progression" } = {},
): HarmonicFieldQuestion {
  const field = requireField(fieldId);
  const chord = getChordByDegree(field, degree);
  const expectedNotes = getChordNoteNamesWithOctaves(chord);

  return {
    id: `${exercise.id}-${fieldId}-${degree}-${index}`,
    exerciseId: exercise.id,
    fieldId,
    taskType: exercise.type,
    degree,
    chordRoot: chord.root,
    chordQuality: chord.quality,
    expectedNotes,
    expectedMidiNotes: chord.midiNotes,
    expectedAnswer: expectedNotes,
    prompt: `${options.promptPrefix ?? `Construye el ${degree} grado en ${field.displayName}`}: ${chord.displayName} (${getChordDisplaySequence(chord)}).`,
    mode: options.mode ?? "mixed",
    progressionId: options.progressionId,
    progression: options.progressionId ? popProgression : undefined,
    expectedChordSequence: options.progressionId
      ? getChordProgressionFromDegrees(field, popProgression).map((item) => item.displayName)
      : undefined,
  };
}

function buildQualityQuestions(exercise: HarmonicFieldExercise) {
  return exercise.allowedFields
    .flatMap((fieldId) => {
      const field = requireField(fieldId);
      return field.chords.map((chord, index) => ({
        id: `${exercise.id}-${fieldId}-${chord.degree}-${index}`,
        exerciseId: exercise.id,
        fieldId,
        taskType: exercise.type,
        degree: chord.degree,
        chordRoot: chord.root,
        chordQuality: chord.quality,
        prompt: `¿Qué cualidad tiene el ${chord.degree} grado en ${field.displayName}?`,
        mode: "visual" as const,
        answerOptions: qualityOptions,
        expectedAnswer: getQualityLabel(chord.quality),
      }));
    })
    .slice(0, exercise.totalRounds);
}

function buildRomanNumeralQuestions(exercise: HarmonicFieldExercise) {
  const field = requireField("c-major");
  return field.chords.slice(0, exercise.totalRounds).map((chord, index) => ({
    id: `${exercise.id}-${chord.degree}-${index}`,
    exerciseId: exercise.id,
    fieldId: field.id,
    taskType: exercise.type,
    degree: chord.degree,
    chordRoot: chord.root,
    chordQuality: chord.quality,
    expectedDegree: chord.degree,
    prompt: `${chord.displayName} pertenece a DO mayor. ¿Qué grado es?`,
    mode: "visual" as const,
    answerOptions: degreeOptions,
    expectedAnswer: chord.degree,
  }));
}

function buildFunctionQuestions(exercise: HarmonicFieldExercise) {
  const plan: Array<{ fieldId: string; degree: ScaleDegree; expectedFunction: FunctionalRole }> = [
    { fieldId: "c-major", degree: "I", expectedFunction: "tonic" },
    { fieldId: "c-major", degree: "IV", expectedFunction: "subdominant" },
    { fieldId: "c-major", degree: "V", expectedFunction: "dominant" },
    { fieldId: "g-major", degree: "I", expectedFunction: "tonic" },
    { fieldId: "g-major", degree: "V", expectedFunction: "dominant" },
    { fieldId: "c-major", degree: "vi", expectedFunction: "tonic" },
    { fieldId: "g-major", degree: "IV", expectedFunction: "subdominant" },
    { fieldId: "c-major", degree: "V", expectedFunction: "dominant" },
  ];

  return plan.slice(0, exercise.totalRounds).map((item, index) => {
    const field = requireField(item.fieldId);
    const chord = getChordByDegree(field, item.degree);
    return {
      id: `${exercise.id}-${item.fieldId}-${item.degree}-${index}`,
      exerciseId: exercise.id,
      fieldId: item.fieldId,
      taskType: exercise.type,
      degree: item.degree,
      chordRoot: chord.root,
      chordQuality: chord.quality,
      expectedFunction: item.expectedFunction,
      prompt: `En ${field.displayName}, ${item.degree} (${chord.displayName}) funciona como...`,
      mode: "audio" as const,
      answerOptions: functionOptions,
      expectedAnswer: getFunctionLabel(item.expectedFunction),
    };
  });
}

function buildAnalyzeProgressionQuestions(exercise: HarmonicFieldExercise) {
  const plans = [
    { fieldId: "c-major", names: "DO - SOL - LA menor - FA" },
    { fieldId: "f-major", names: "FA - DO - RE menor - SIb" },
    { fieldId: "g-major", names: "SOL - RE - MI menor - DO" },
  ];

  return plans
    .flatMap((plan, planIndex) =>
      popProgression.map((degree, index) => {
        const field = requireField(plan.fieldId);
        const chord = getChordByDegree(field, degree);
        return {
          id: `${exercise.id}-${plan.fieldId}-${degree}-${planIndex}-${index}`,
          exerciseId: exercise.id,
          fieldId: plan.fieldId,
          taskType: exercise.type,
          degree,
          chordRoot: chord.root,
          chordQuality: chord.quality,
          expectedDegree: degree,
          progression: popProgression,
          expectedChordSequence: getChordProgressionFromDegrees(field, popProgression).map(
            (item) => item.displayName,
          ),
          prompt: `${plan.names}. El acorde ${chord.displayName} corresponde al grado...`,
          mode: "visual" as const,
          answerOptions: degreeOptions,
          expectedAnswer: degree,
        };
      }),
    )
    .slice(0, exercise.totalRounds);
}

function buildFinalChallengeQuestions(exercise: HarmonicFieldExercise) {
  const mixed: HarmonicFieldQuestion[] = [
    buildChordConstructionQuestion(exercise, "c-major", "ii", 0),
    buildChordConstructionQuestion(exercise, "c-major", "V", 1),
    ...buildQualityQuestions({ ...exercise, allowedFields: ["c-major"], totalRounds: 4 }),
    ...buildRomanNumeralQuestions({ ...exercise, totalRounds: 4 }),
    ...buildAnalyzeProgressionQuestions({ ...exercise, totalRounds: 4 }),
    ...buildFunctionQuestions({ ...exercise, totalRounds: 4 }),
    ...["g-major", "f-major", "d-major"].flatMap((fieldId, fieldIndex) =>
      ["I", "V", "vi", "vii°"].map((degree, index) =>
        buildChordConstructionQuestion(
          exercise,
          fieldId,
          degree as ScaleDegree,
          fieldIndex * 10 + index,
        ),
      ),
    ),
  ];

  return [
    ...mixed,
    ...mixed.map((question, index) => ({ ...question, id: `${question.id}-b-${index}` })),
  ]
    .slice(0, exercise.totalRounds)
    .map((question) => ({ ...question, taskType: "final_challenge" as const }));
}

export function formatProgressionLabel(progression: ScaleDegree[]) {
  return progression.join(" - ");
}

export function formatChordOptionsForField(fieldId: string) {
  return requireField(fieldId).chords.map(
    (chord) => `${chord.degree}: ${getDisplayPitchName(chord.root)}`,
  );
}
