import { getExpectedOptionForQuestion } from "@/lib/key-signature/questions";
import { pointsForKeySignatureAnswer } from "@/lib/key-signature/scoring";
import {
  getDisplayNoteName,
  getKeySignatureById,
  midiToInternalNote,
} from "@/lib/key-signature/theory";
import type { KeySignatureAnswer, KeySignatureQuestion } from "@/types/key-signature";

export function midiToKeySignatureQuestionNote(question: KeySignatureQuestion, midi: number) {
  const key = getKeySignatureById(question.keyId);
  const index = key?.midiNotes.findIndex((scaleMidi) => scaleMidi === midi) ?? -1;

  if (key && index >= 0) {
    return `${key.scaleNotes[index]}${Math.floor(midi / 12) - 1}`;
  }

  return midiToInternalNote(midi);
}

export function buildKeySignatureNoteAnswer({
  question,
  note,
  expectedNote,
  selectedMidi,
  expectedMidi,
  playedNotes,
  helpUsed,
  replayUsed,
}: {
  question: KeySignatureQuestion;
  note: string;
  expectedNote: string;
  selectedMidi: number;
  expectedMidi: number;
  playedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
}): KeySignatureAnswer {
  const isCorrect = selectedMidi === expectedMidi;

  return {
    questionId: question.id,
    selectedNote: note,
    playedNotes: [...playedNotes, note],
    isCorrect,
    expectedAnswer: getDisplayNoteName(expectedNote),
    userAnswer: getDisplayNoteName(note),
    helpUsed,
    replayUsed,
    keyId: question.keyId,
    points: pointsForKeySignatureAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongNote: note,
          expectedNote,
          wrongStepIndex: playedNotes.length,
        },
  };
}

export function buildKeySignatureOptionAnswer({
  question,
  option,
  helpUsed,
  replayUsed,
}: {
  question: KeySignatureQuestion;
  option: string;
  helpUsed: boolean;
  replayUsed: boolean;
}): KeySignatureAnswer {
  const expectedAnswer = getExpectedOptionForQuestion(question);
  const isCorrect = option === expectedAnswer;
  const key = getKeySignatureById(question.keyId);
  const relative = question.comparisonKeyId
    ? getKeySignatureById(key?.relativeKeyId ?? "")
    : undefined;

  return {
    questionId: question.id,
    selectedOption: option,
    isCorrect,
    expectedAnswer,
    userAnswer: option,
    helpUsed,
    replayUsed,
    keyId: question.keyId,
    points: pointsForKeySignatureAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          expectedAccidentals: key?.accidentals,
          selectedAccidentals: [option],
          expectedRelativeKey:
            question.taskType === "find_relative_key" || question.taskType === "relative_keys_compare"
              ? relative?.displayName ??
                (typeof question.expectedAnswer === "string" ? question.expectedAnswer : undefined)
              : undefined,
          selectedRelativeKey: option,
        },
  };
}
