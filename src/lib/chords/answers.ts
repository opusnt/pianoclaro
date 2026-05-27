import { getExpectedOptionForQuestion } from "@/lib/chords/questions";
import { pointsForChordAnswer } from "@/lib/chords/scoring";
import {
  countCorrectChordNotes,
  getChordById,
  getDisplayNoteName,
  normalizePitchSet,
  validateChordNotes,
} from "@/lib/chords/theory";
import type { ChordAnswer, ChordQuestion, ChordQuality } from "@/types/chords";

export function resolveExpectedChordNotes(question: ChordQuestion) {
  const chord = getChordById(question.chordId);
  if (!chord) return [];

  return chord.midiNotes.map((midi) => {
    const expected = question.expectedNotes?.find((note) => normalizePitchSet([note])[0] === midi % 12);
    return expected ?? chord.notes[chord.midiNotes.indexOf(midi)];
  });
}

export function buildChordNotesAnswer({
  question,
  selectedNotes,
  helpUsed,
  replayUsed,
}: {
  question: ChordQuestion;
  selectedNotes: string[];
  helpUsed: boolean;
  replayUsed: boolean;
}): ChordAnswer | null {
  const chord = getChordById(question.chordId);
  if (!chord) return null;

  const expectedNotes = resolveExpectedChordNotes(question);
  const isCorrect = validateChordNotes(expectedNotes, selectedNotes);
  const correctNotesCount = countCorrectChordNotes(expectedNotes, selectedNotes);
  const expectedPitchSet = new Set(normalizePitchSet(expectedNotes));
  const selectedPitchSet = new Set(normalizePitchSet(selectedNotes));
  const missingNotes = expectedNotes.filter((note) => !selectedPitchSet.has(normalizePitchSet([note])[0]));
  const wrongNote = selectedNotes.find((note) => !expectedPitchSet.has(normalizePitchSet([note])[0]));

  return {
    questionId: question.id,
    selectedNotes,
    isCorrect,
    expectedAnswer: chord.notes.map(getDisplayNoteName),
    userAnswer: selectedNotes.map(getDisplayNoteName),
    correctNotesCount,
    helpUsed,
    replayUsed,
    chordId: question.chordId,
    chordQuality: chord.quality,
    points: pointsForChordAnswer({ isCorrect, helpUsed, replayUsed, correctNotesCount }),
    errorDetails: isCorrect ? undefined : { wrongNote, missingNotes },
  };
}

export function buildChordOptionAnswer({
  question,
  option,
  helpUsed,
  replayUsed,
}: {
  question: ChordQuestion;
  option: string;
  helpUsed: boolean;
  replayUsed: boolean;
}): ChordAnswer | null {
  const chord = getChordById(question.chordId);
  if (!chord) return null;

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
    chordId: question.chordId,
    chordQuality: chord.quality,
    points: pointsForChordAnswer({ isCorrect, helpUsed, replayUsed }),
    errorDetails: isCorrect
      ? undefined
      : {
          selectedQuality: optionToChordQuality(option),
          expectedQuality: chord.quality,
        },
  };
}

function optionToChordQuality(option: string): ChordQuality | undefined {
  if (option === "mayor") return "major";
  if (option === "menor") return "minor";
  if (option === "disminuido") return "diminished";
  if (option === "aumentado") return "augmented";
  return undefined;
}
