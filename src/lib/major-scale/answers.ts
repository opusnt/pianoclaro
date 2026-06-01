import { pointsForScaleAnswer } from "@/lib/major-scale/scoring";
import {
  getDisplayNoteName,
  getDisplayPitchName,
  getIntervalBetweenMidiNotes,
  getScaleById,
  noteToMidi,
} from "@/lib/major-scale/theory";
import type { ScaleAnswer, ScaleQuestion } from "@/types/major-scale";

export function getExpectedScaleOption(question: ScaleQuestion) {
  if (question.taskType === "audio_recognition" || question.mode === "audio") {
    return question.isCorrectScale ? "Suena correcta" : "Algo suena fuera";
  }

  if (typeof question.missingNoteIndex === "number") {
    const scale = getScaleById(question.scaleId);
    const note = scale?.notes[question.missingNoteIndex] ?? "";
    return getDisplayPitchName(note);
  }

  return "";
}

export function getQuestionScaleMidiNotes(question: ScaleQuestion) {
  const scale = getScaleById(question.scaleId);
  return scale?.midiNotes ?? [];
}

export function buildMajorScaleNoteAnswer({
  question,
  note,
  expectedNote,
  selectedMidi,
  expectedMidi,
  playedNotes,
  helpUsed,
  replayUsed,
}: {
  question: ScaleQuestion;
  note: string;
  expectedNote: string;
  selectedMidi: number;
  expectedMidi: number;
  playedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
}): ScaleAnswer {
  const isCorrect = selectedMidi === expectedMidi;
  const scale = getScaleById(question.scaleId);
  const previousMidi =
    playedNotes.length > 0
      ? noteToMidi(playedNotes[playedNotes.length - 1])
      : (scale?.midiNotes[0] ?? question.expectedMidiNotes?.[0] ?? expectedMidi);
  const actualInterval = getIntervalBetweenMidiNotes(previousMidi, selectedMidi);
  const expectedInterval = getIntervalBetweenMidiNotes(previousMidi, expectedMidi);

  return {
    questionId: question.id,
    selectedNote: note,
    playedNotes: [...playedNotes, note],
    isCorrect,
    expectedAnswer: getDisplayNoteName(expectedNote),
    userAnswer: getDisplayNoteName(note),
    helpUsed,
    replayUsed,
    scaleId: question.scaleId,
    points: pointsForScaleAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongNote: note,
          expectedNote,
          wrongStepIndex: playedNotes.length,
          expectedInterval,
          actualInterval,
        },
  };
}

export function buildMajorScaleOptionAnswer({
  question,
  option,
  helpUsed,
  replayUsed,
}: {
  question: ScaleQuestion;
  option: string;
  helpUsed: boolean;
  replayUsed: boolean;
}): ScaleAnswer {
  const expectedAnswer = getExpectedScaleOption(question);
  const isCorrect = option === expectedAnswer;

  return {
    questionId: question.id,
    selectedOption: option,
    isCorrect,
    expectedAnswer,
    userAnswer: option,
    helpUsed,
    replayUsed,
    scaleId: question.scaleId,
    points: pointsForScaleAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongStepIndex: question.missingNoteIndex ?? question.alteredNoteIndex,
        },
  };
}
