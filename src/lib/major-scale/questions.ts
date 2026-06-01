import {
  createAlteredScaleMidiNotes,
  getDisplayPitchName,
  getScaleById,
  getScaleNoteNamesWithOctaves,
} from "@/lib/major-scale/theory";
import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type {
  MajorScaleExercise,
  MajorScaleExerciseType,
  ScaleDefinition,
  ScaleQuestion,
} from "@/types/major-scale";

const missingNotePlan = [
  { scaleId: "c-major", missingNoteIndex: 1 },
  { scaleId: "c-major", missingNoteIndex: 3 },
  { scaleId: "c-major", missingNoteIndex: 6 },
  { scaleId: "g-major", missingNoteIndex: 6 },
  { scaleId: "g-major", missingNoteIndex: 2 },
  { scaleId: "g-major", missingNoteIndex: 4 },
  { scaleId: "f-major", missingNoteIndex: 3 },
  { scaleId: "f-major", missingNoteIndex: 5 },
  { scaleId: "c-major", missingNoteIndex: 4 },
  { scaleId: "f-major", missingNoteIndex: 2 },
];

const audioPlan = [
  { scaleId: "c-major", isCorrectScale: true },
  { scaleId: "g-major", isCorrectScale: true },
  { scaleId: "c-major", isCorrectScale: false, alteredNoteIndex: 2 },
  { scaleId: "f-major", isCorrectScale: true },
  { scaleId: "d-major", isCorrectScale: false, alteredNoteIndex: 6 },
  { scaleId: "g-major", isCorrectScale: false, alteredNoteIndex: 3 },
  { scaleId: "d-major", isCorrectScale: true },
  { scaleId: "f-major", isCorrectScale: false, alteredNoteIndex: 3 },
  { scaleId: "c-major", isCorrectScale: true },
  { scaleId: "g-major", isCorrectScale: false, alteredNoteIndex: 5 },
];

export function generateMajorScaleQuestions(exercise: MajorScaleExercise): ScaleQuestion[] {
  if (exercise.type === "discover_pattern") {
    return [buildScaleSequenceQuestion(exercise, "c-major", "discover_pattern", true)];
  }

  if (exercise.type === "play_c_major") {
    return [buildScaleSequenceQuestion(exercise, "c-major", "play_c_major")];
  }

  if (exercise.type === "ascending_descending") {
    const scale = requireScale("c-major");
    const descendingMidi = scale.midiNotes.slice(0, -1).reverse();
    const expectedMidiNotes = [...scale.midiNotes, ...descendingMidi];
    const expectedNotes = [
      ...getScaleNoteNamesWithOctaves(scale),
      ...descendingMidi.map((midi) => scaleNoteFromMidiForScale(scale, midi)),
    ];

    return [
      {
        id: `${exercise.id}-c-major-up-down`,
        exerciseId: exercise.id,
        scaleId: scale.id,
        tonic: scale.tonic,
        mode: "visual",
        taskType: exercise.type,
        expectedNotes,
        expectedMidiNotes,
        prompt: "Toca DO mayor subiendo y luego bajando.",
      },
    ];
  }

  if (exercise.type === "missing_note") {
    return missingNotePlan
      .slice(0, exercise.totalRounds)
      .map((plan, index) =>
        buildMissingNoteQuestion(exercise, plan.scaleId, plan.missingNoteIndex, index),
      );
  }

  if (exercise.type === "build_from_tonic") {
    return exercise.allowedScales.map((scaleId) =>
      buildScaleSequenceQuestion(exercise, scaleId, "build_from_tonic", true),
    );
  }

  if (exercise.type === "audio_recognition") {
    return audioPlan
      .slice(0, exercise.totalRounds)
      .map((plan, index) =>
        buildAudioQuestion(
          exercise,
          plan.scaleId,
          index,
          plan.isCorrectScale,
          plan.alteredNoteIndex,
        ),
      );
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: ScaleQuestion) {
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: ScaleQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

function buildScaleSequenceQuestion(
  exercise: MajorScaleExercise,
  scaleId: string,
  taskType: MajorScaleExerciseType,
  omitTonic = false,
): ScaleQuestion {
  const scale = requireScale(scaleId);
  const expectedMidiNotes = omitTonic ? scale.midiNotes.slice(1) : scale.midiNotes;
  const expectedNotes = expectedMidiNotes.map((midi) => scaleNoteFromMidiForScale(scale, midi));
  const prompt =
    taskType === "discover_pattern"
      ? "Desde DO, toca cada nota siguiendo T - T - S - T - T - T - S."
      : taskType === "build_from_tonic"
        ? `Construye ${scale.displayName} usando solo el patrón mayor.`
        : `Toca ${scale.displayName} completa en orden ascendente.`;

  return {
    id: `${exercise.id}-${scale.id}`,
    exerciseId: exercise.id,
    scaleId: scale.id,
    tonic: scale.tonic,
    mode: "visual",
    taskType,
    expectedNotes,
    expectedMidiNotes,
    prompt,
  };
}

function buildMissingNoteQuestion(
  exercise: MajorScaleExercise,
  scaleId: string,
  missingNoteIndex: number,
  index: number,
): ScaleQuestion {
  const scale = requireScale(scaleId);
  const expectedNote = scale.notes[missingNoteIndex];

  return {
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    scaleId: scale.id,
    tonic: scale.tonic,
    mode: "mixed",
    taskType: exercise.type,
    missingNoteIndex,
    answerOptions: buildMissingNoteOptions(expectedNote),
    prompt: `Completa la nota ${missingNoteIndex + 1} de ${scale.displayName}.`,
  };
}

function buildAudioQuestion(
  exercise: MajorScaleExercise,
  scaleId: string,
  index: number,
  isCorrectScale: boolean,
  alteredNoteIndex?: number,
): ScaleQuestion {
  const scale = requireScale(scaleId);

  return {
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    scaleId: scale.id,
    tonic: scale.tonic,
    mode: "audio",
    taskType: exercise.type,
    expectedMidiNotes: isCorrectScale
      ? scale.midiNotes
      : createAlteredScaleMidiNotes(scale, alteredNoteIndex ?? 3, index % 2 === 0 ? 1 : -1),
    isCorrectScale,
    alteredNoteIndex,
    answerOptions: ["Suena correcta", "Algo suena fuera"],
    prompt: `Escucha ${scale.displayName}: ¿respeta el patrón mayor?`,
  };
}

function buildFinalChallengeQuestions(exercise: MajorScaleExercise): ScaleQuestion[] {
  const sequenceQuestions = [
    buildScaleSequenceQuestion(exercise, "c-major", "play_c_major"),
    buildMissingNoteQuestion(exercise, "g-major", 6, 1),
    buildAudioQuestion(exercise, "c-major", 2, true),
    buildScaleSequenceQuestion(exercise, "g-major", "build_from_tonic", true),
    buildMissingNoteQuestion(exercise, "f-major", 3, 4),
    buildAudioQuestion(exercise, "d-major", 5, false, 6),
    buildScaleSequenceQuestion(exercise, "d-major", "build_from_tonic", true),
    buildMissingNoteQuestion(exercise, "c-major", 2, 7),
    buildAudioQuestion(exercise, "g-major", 8, false, 5),
    buildScaleSequenceQuestion(exercise, "f-major", "build_from_tonic", true),
    buildMissingNoteQuestion(exercise, "d-major", 2, 10),
    buildAudioQuestion(exercise, "f-major", 11, true),
    buildScaleSequenceQuestion(exercise, "c-major", "build_from_tonic", true),
    buildMissingNoteQuestion(exercise, "c-major", 4, 13),
    buildAudioQuestion(exercise, "g-major", 14, true),
    buildScaleSequenceQuestion(exercise, "g-major", "build_from_tonic", true),
    buildMissingNoteQuestion(exercise, "f-major", 5, 16),
    buildAudioQuestion(exercise, "d-major", 17, true),
    buildMissingNoteQuestion(exercise, "d-major", 6, 18),
    buildAudioQuestion(exercise, "c-major", 19, false, 3),
  ];

  return sequenceQuestions.slice(0, exercise.totalRounds).map((question, index) => ({
    ...question,
    id: `${exercise.id}-${index + 1}`,
    exerciseId: exercise.id,
    taskType: "final_challenge",
    mode: question.mode === "audio" ? "audio" : "mixed",
  }));
}

function requireScale(scaleId: string) {
  const scale = getScaleById(scaleId);

  if (!scale) {
    throw new Error(`Escala desconocida: ${scaleId}`);
  }

  return scale;
}

function scaleNoteFromMidiForScale(scale: ScaleDefinition, midi: number) {
  const index = scale.midiNotes.findIndex((scaleMidi) => scaleMidi === midi);

  if (index >= 0) {
    const octave = Math.floor(midi / 12) - 1;
    return `${scale.notes[index]}${octave}`;
  }

  return `${scale.notes[0]}${Math.floor(midi / 12) - 1}`;
}

function buildMissingNoteOptions(expectedNote?: string) {
  const baseOptions = ["C", "D", "E", "F", "F#", "G", "A", "Bb", "B", "C#"];
  const expectedDisplay = expectedNote ? getDisplayPitchName(expectedNote) : "";
  const options = baseOptions.map(getDisplayPitchName);

  return Array.from(new Set([expectedDisplay, ...options])).slice(0, 4);
}
