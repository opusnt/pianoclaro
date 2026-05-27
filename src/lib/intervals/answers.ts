import { pointsForIntervalAnswer } from "@/lib/intervals/scoring";
import {
  evaluateIntervalAnswer,
  getExpectedOptionForQuestion,
  getIntervalName,
  getIntervalSemitones,
  getNoteLabel,
} from "@/lib/intervals/theory";
import type { IntervalAnswer, IntervalQuestion } from "@/types/intervals";

export function canAnswerIntervalWithNote(question?: IntervalQuestion) {
  if (!question) {
    return false;
  }

  return (
    question.taskType === "semitone_distance" ||
    question.taskType === "find_interval" ||
    (question.taskType === "final_challenge" && !question.answerOptions)
  );
}

export function buildIntervalNoteAnswer({
  question,
  selectedNote,
  usedHint,
}: {
  question: IntervalQuestion;
  selectedNote: string;
  usedHint: boolean;
}): IntervalAnswer {
  const isCorrect = evaluateIntervalAnswer({
    baseNote: question.baseNote,
    userNote: selectedNote,
    expectedSemitones: question.intervalSemitones,
    direction: question.direction,
  });
  const intervalError = getIntervalSemitones(question.baseNote, selectedNote);
  const intervalName = getIntervalName(question.intervalSemitones);

  return {
    questionId: question.id,
    selectedNote,
    isCorrect,
    expectedAnswer: question.targetNote ? getNoteLabel(question.targetNote) : intervalName,
    userAnswer: getNoteLabel(selectedNote),
    intervalError,
    intervalSemitones: question.intervalSemitones,
    intervalName,
    points: pointsForIntervalAnswer({ isCorrect, usedHint }),
    usedHint,
  };
}

export function buildIntervalOptionAnswer({
  question,
  selectedOption,
  usedHint,
}: {
  question: IntervalQuestion;
  selectedOption: string;
  usedHint: boolean;
}): IntervalAnswer {
  const expectedOption = getExpectedOptionForQuestion(question);
  const isCorrect = selectedOption === expectedOption;
  const intervalName = getIntervalName(question.intervalSemitones);

  return {
    questionId: question.id,
    selectedOption,
    isCorrect,
    expectedAnswer: expectedOption,
    userAnswer: selectedOption,
    intervalSemitones: question.intervalSemitones,
    intervalName,
    points: pointsForIntervalAnswer({ isCorrect, usedHint }),
    usedHint,
  };
}
