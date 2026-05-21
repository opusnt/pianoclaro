import {
  getChordById,
  getChordDisplaySequence,
  getChordNoteNamesWithOctaves,
  getChordQualityLabel,
  getDisplayPitchName,
  requireChord,
} from "@/lib/chords/theory";
import { getQuestionUnitCount as getScalePracticeQuestionUnitCount } from "@/lib/scale-practice/progress-units";
import type { ChordExercise, ChordQuestion } from "@/types/chords";

const noteVsChordOptions = ["Nota sola", "Acorde"];
const qualityOptions = ["mayor", "menor"];

const audioPlan = ["c-major", "c-minor", "a-minor", "g-major", "d-major", "d-minor", "c-major", "a-minor"];
const missingPlan = [
  { chordId: "c-major", missingNoteIndex: 1 },
  { chordId: "g-major", missingNoteIndex: 2 },
  { chordId: "f-major", missingNoteIndex: 0 },
  { chordId: "a-minor", missingNoteIndex: 1 },
  { chordId: "e-minor", missingNoteIndex: 2 },
  { chordId: "d-minor", missingNoteIndex: 1 },
  { chordId: "c-minor", missingNoteIndex: 1 },
  { chordId: "d-major", missingNoteIndex: 1 },
  { chordId: "c-major", missingNoteIndex: 2 },
  { chordId: "a-minor", missingNoteIndex: 0 },
];

export function generateChordQuestions(exercise: ChordExercise): ChordQuestion[] {
  if (exercise.type === "single_note_vs_chord") {
    return Array.from({ length: exercise.totalRounds }, (_, index) => {
      const isChord = index % 2 === 1;
      const chordId = index % 4 < 2 ? "c-major" : "a-minor";
      return {
        id: `${exercise.id}-${index}`,
        exerciseId: exercise.id,
        chordId,
        taskType: exercise.type,
        mode: "audio",
        prompt: "Escucha y elige si sonó una nota sola o un acorde.",
        answerOptions: noteVsChordOptions,
        expectedAnswer: isChord ? "Acorde" : "Nota sola",
      };
    });
  }

  if (exercise.type === "build_c_major") {
    return [buildChordSequenceQuestion(exercise, "c-major")];
  }

  if (exercise.type === "major_vs_minor_audio") {
    return audioPlan.slice(0, exercise.totalRounds).map((chordId, index) =>
      buildQualityQuestion(exercise, chordId, index),
    );
  }

  if (exercise.type === "build_major_chords" || exercise.type === "build_minor_chords") {
    return exercise.allowedChords.map((chordId) => buildChordSequenceQuestion(exercise, chordId));
  }

  if (exercise.type === "missing_chord_note") {
    return missingPlan.slice(0, exercise.totalRounds).map((plan, index) =>
      buildMissingNoteQuestion(exercise, plan.chordId, plan.missingNoteIndex, index),
    );
  }

  if (exercise.type === "diminished_augmented_intro") {
    return exercise.allowedChords.map((chordId, index) =>
      index % 2 === 0 ? buildChordSequenceQuestion(exercise, chordId) : buildQualityWideQuestion(exercise, chordId, index),
    );
  }

  return buildFinalChallengeQuestions(exercise);
}

export function getQuestionUnitCount(question: ChordQuestion) {
  return getScalePracticeQuestionUnitCount(question);
}

export function getExerciseUnitCount(questions: ChordQuestion[]) {
  return questions.reduce((total, question) => total + getQuestionUnitCount(question), 0);
}

export function getExpectedOptionForQuestion(question: ChordQuestion) {
  if (typeof question.expectedAnswer === "string") return question.expectedAnswer;
  return question.expectedAnswer?.join(" y ") ?? "";
}

function buildChordSequenceQuestion(exercise: ChordExercise, chordId: string): ChordQuestion {
  const chord = requireChord(chordId);
  const expectedNotes = getChordNoteNamesWithOctaves(chord);

  return {
    id: `${exercise.id}-${chordId}`,
    exerciseId: exercise.id,
    chordId,
    taskType: exercise.type,
    mode: "mixed",
    prompt: `Selecciona las tres notas de ${chord.displayName}: ${getChordDisplaySequence(chord)}. El orden no importa.`,
    expectedNotes,
    expectedMidiNotes: chord.midiNotes,
    expectedAnswer: expectedNotes,
  };
}

function buildQualityQuestion(exercise: ChordExercise, chordId: string, index: number): ChordQuestion {
  const chord = requireChord(chordId);
  return {
    id: `${exercise.id}-${chordId}-${index}`,
    exerciseId: exercise.id,
    chordId,
    taskType: exercise.type,
    mode: "audio",
    prompt: "Escucha el acorde y elige si suena mayor o menor.",
    answerOptions: qualityOptions,
    expectedAnswer: getChordQualityLabel(chord.quality),
  };
}

function buildQualityWideQuestion(exercise: ChordExercise, chordId: string, index: number): ChordQuestion {
  const chord = requireChord(chordId);
  return {
    id: `${exercise.id}-${chordId}-quality-${index}`,
    exerciseId: exercise.id,
    chordId,
    taskType: exercise.type,
    mode: "mixed",
    prompt: `Identifica la sonoridad de ${chord.displayName}.`,
    answerOptions: ["disminuido", "aumentado"],
    expectedAnswer: getChordQualityLabel(chord.quality),
  };
}

function buildMissingNoteQuestion(
  exercise: ChordExercise,
  chordId: string,
  missingNoteIndex: number,
  index: number,
): ChordQuestion {
  const chord = requireChord(chordId);
  return {
    id: `${exercise.id}-${chordId}-${missingNoteIndex}-${index}`,
    exerciseId: exercise.id,
    chordId,
    taskType: exercise.type,
    mode: "visual",
    prompt: `Completa la nota faltante en ${chord.displayName}.`,
    missingNoteIndex,
    answerOptions: buildMissingNoteOptions(chordId, missingNoteIndex),
    expectedAnswer: getDisplayPitchName(chord.notes[missingNoteIndex]),
  };
}

function buildFinalChallengeQuestions(exercise: ChordExercise) {
  const mixed: ChordQuestion[] = [
    buildChordSequenceQuestion(exercise, "c-major"),
    buildQualityQuestion(exercise, "c-minor", 1),
    buildChordSequenceQuestion(exercise, "a-minor"),
    buildMissingNoteQuestion(exercise, "g-major", 1, 3),
    buildChordSequenceQuestion(exercise, "d-major"),
    buildQualityQuestion(exercise, "d-minor", 5),
    buildMissingNoteQuestion(exercise, "c-minor", 1, 6),
    buildChordSequenceQuestion(exercise, "f-major"),
    buildQualityWideQuestion(exercise, "c-diminished", 8),
    buildChordSequenceQuestion(exercise, "c-augmented"),
    buildQualityQuestion(exercise, "g-major", 10),
    buildMissingNoteQuestion(exercise, "e-minor", 2, 11),
  ];
  return [...mixed, ...mixed.map((question, index) => ({ ...question, id: `${question.id}-b-${index}` }))].slice(0, exercise.totalRounds).map((question) => ({
    ...question,
    taskType: "final_challenge" as const,
  }));
}

function buildMissingNoteOptions(chordId: string, missingNoteIndex: number) {
  const chord = requireChord(chordId);
  const correct = getDisplayPitchName(chord.notes[missingNoteIndex]);
  const pool = ["DO", "RE", "MI", "FA", "SOL", "LA", "SI", "FA#", "MIb", "SOL#"];
  return [correct, ...pool.filter((option) => option !== correct)].slice(0, 4);
}

export function getQuestionChordMidiNotes(question: ChordQuestion) {
  return getChordById(question.chordId)?.midiNotes ?? [];
}
