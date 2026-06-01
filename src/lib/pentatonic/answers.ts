import { getExpectedOptionForQuestion } from "@/lib/pentatonic/questions";
import { pointsForImprovisation, pointsForPentatonicAnswer } from "@/lib/pentatonic/scoring";
import { getDisplayNoteName, getPentatonicScaleById } from "@/lib/pentatonic/theory";
import type { PentatonicAnswer, PentatonicQuestion } from "@/types/pentatonic";

export function isNoteAllowedInPentatonicScale(scaleId: string, selectedMidi: number) {
  const scale = getPentatonicScaleById(scaleId);
  if (!scale) return false;

  return new Set(scale.midiNotes.map((midi) => midi % 12)).has(selectedMidi % 12);
}

export function buildPentatonicNoteAnswer({
  question,
  note,
  expectedNote,
  selectedMidi,
  expectedMidi,
  playedNotes,
  helpUsed,
  replayUsed,
}: {
  question: PentatonicQuestion;
  note: string;
  expectedNote: string;
  selectedMidi: number;
  expectedMidi: number;
  playedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
}): PentatonicAnswer {
  const scale = getPentatonicScaleById(question.scaleId);
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
    scaleId: question.scaleId,
    pentatonicType: scale?.type ?? "major",
    points: pointsForPentatonicAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          wrongNote: note,
          expectedNote,
          wrongStepIndex: playedNotes.length,
        },
  };
}

export function buildPentatonicOptionAnswer({
  question,
  option,
  helpUsed,
  replayUsed,
}: {
  question: PentatonicQuestion;
  option: string;
  helpUsed: boolean;
  replayUsed: boolean;
}): PentatonicAnswer {
  const scale = getPentatonicScaleById(question.scaleId);
  const expectedAnswer = getExpectedOptionForQuestion(question);
  const isCorrect = option === expectedAnswer;
  const expectedRelative = question.comparisonScaleId
    ? getPentatonicScaleById(scale?.relativeScaleId ?? "")?.displayName
    : undefined;

  return {
    questionId: question.id,
    selectedOption: option,
    isCorrect,
    expectedAnswer,
    userAnswer: option,
    helpUsed,
    replayUsed,
    scaleId: question.scaleId,
    pentatonicType: scale?.type ?? "major",
    points: pointsForPentatonicAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          expectedRelativeScale: expectedRelative,
          selectedRelativeScale: option,
        },
  };
}

export function buildPentatonicImprovisationAnswer({
  question,
  playedNotes,
  helpUsed,
  replayUsed,
  outsideNotes = 0,
}: {
  question: PentatonicQuestion;
  playedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
  outsideNotes?: number;
}): PentatonicAnswer {
  const uniqueNotesUsed = new Set(playedNotes.map((note) => note.replace(/\d/g, ""))).size;
  const notesPlayed = playedNotes.length;
  const isCorrect = outsideNotes === 0 && notesPlayed >= 12 && uniqueNotesUsed >= 3;

  return {
    questionId: question.id,
    playedNotes,
    isCorrect,
    expectedAnswer: "12 notas y 3 notas distintas",
    userAnswer: `${notesPlayed} notas, ${uniqueNotesUsed} distintas`,
    helpUsed,
    replayUsed,
    scaleId: question.scaleId,
    pentatonicType: getPentatonicScaleById(question.scaleId)?.type ?? "major",
    points: pointsForImprovisation({ notesPlayed, uniqueNotesUsed, outsideNotes }),
    improvisationMetrics: { notesPlayed, uniqueNotesUsed, outsideNotes },
  };
}
