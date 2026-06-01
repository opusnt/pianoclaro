import { getExpectedOptionForQuestion } from "@/lib/minor-scale/questions";
import { pointsForMinorScaleAnswer } from "@/lib/minor-scale/scoring";
import {
  getDisplayNoteName,
  getIntervalBetweenMidiNotes,
  getMinorScaleById,
  noteToMidi,
} from "@/lib/minor-scale/theory";
import type { MinorScaleAnswer, MinorScaleQuestion } from "@/types/minor-scale";

export function getMinorQuestionScaleMidiNotes(question: MinorScaleQuestion) {
  const scale = getMinorScaleById(question.scaleId);
  return scale?.midiNotes ?? [];
}

export function midiToMinorScaleNote(question: MinorScaleQuestion, midi: number) {
  const scale = getMinorScaleById(question.scaleId);
  const index = scale?.midiNotes.findIndex((scaleMidi) => scaleMidi === midi) ?? -1;

  if (scale && index >= 0) {
    return `${scale.notes[index]}${Math.floor(midi / 12) - 1}`;
  }

  return "";
}

export function getMinorScaleNextInterval(question: MinorScaleQuestion, nextPlayedCount: number) {
  const scale = getMinorScaleById(question.scaleId);
  const sequenceStartsOnTonic = question.expectedMidiNotes?.[0] === scale?.midiNotes[0];
  const intervalIndex = sequenceStartsOnTonic ? nextPlayedCount - 1 : nextPlayedCount;
  return scale?.formula[Math.max(0, Math.min(6, intervalIndex))] ?? 2;
}

export function getMinorScaleWrongStep(question: MinorScaleQuestion, playedCount: number) {
  const scale = getMinorScaleById(question.scaleId);
  const sequenceStartsOnTonic = question.expectedMidiNotes?.[0] === scale?.midiNotes[0];
  return sequenceStartsOnTonic ? Math.max(0, playedCount - 1) : playedCount;
}

export function buildMinorScaleNoteAnswer({
  question,
  note,
  expectedNote,
  selectedMidi,
  expectedMidi,
  playedNotes,
  helpUsed,
  replayUsed,
}: {
  question: MinorScaleQuestion;
  note: string;
  expectedNote: string;
  selectedMidi: number;
  expectedMidi: number;
  playedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
}): MinorScaleAnswer {
  const isCorrect = selectedMidi === expectedMidi;
  const scale = getMinorScaleById(question.scaleId);
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
    scaleType: question.scaleType,
    points: pointsForMinorScaleAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongNote: note,
          expectedNote,
          wrongStepIndex: getMinorScaleWrongStep(question, playedNotes.length),
          expectedInterval,
          actualInterval,
        },
  };
}

export function buildMinorScaleOptionAnswer({
  question,
  option,
  helpUsed,
  replayUsed,
}: {
  question: MinorScaleQuestion;
  option: string;
  helpUsed: boolean;
  replayUsed: boolean;
}): MinorScaleAnswer {
  const expectedAnswer = getExpectedOptionForQuestion(question);
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
    scaleType: question.scaleType,
    points: pointsForMinorScaleAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongStepIndex: question.missingNoteIndex,
          expectedScaleType: question.scaleType,
        },
  };
}
