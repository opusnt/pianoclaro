import {
  getChordById,
  getChordQualityLabel,
  getDisplayNoteName,
  getWeakestChordIds,
  getWeakestChordQualities,
} from "@/lib/chords/theory";
import type { ChordAnswer, ChordAttempt, ChordExercise, ChordQuestion } from "@/types/chords";

export function pointsForChordAnswer({
  isCorrect,
  helpUsed,
  replayUsed,
  correctNotesCount,
}: {
  isCorrect: boolean;
  helpUsed: boolean;
  replayUsed: boolean;
  correctNotesCount?: number;
}) {
  if (typeof correctNotesCount === "number") {
    if (isCorrect) return helpUsed ? 60 : replayUsed ? 75 : 100;
    if (correctNotesCount >= 2) return 50;
    return 0;
  }
  if (!isCorrect) return 0;
  if (helpUsed) return 60;
  if (replayUsed) return 75;
  return 100;
}

export function scoreChordAnswers(answers: ChordAnswer[], totalUnits: number) {
  let combo = 0;
  let comboMax = 0;
  let score = 0;

  answers.forEach((answer) => {
    if (!answer.isCorrect) {
      combo = 0;
      score += answer.points;
      return;
    }

    combo += 1;
    comboMax = Math.max(comboMax, combo);
    const multiplier = Math.min(2, 1 + Math.floor(combo / 5) * 0.1);
    score += Math.round(answer.points * multiplier);
  });

  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  return {
    score,
    accuracy: totalUnits > 0 ? Math.min(1, correctAnswers / totalUnits) : 0,
    combo,
    comboMax,
    mistakes: answers.filter((answer) => !answer.isCorrect).length,
  };
}

export function buildChordAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: ChordExercise;
  startedAt: string;
  answers: ChordAnswer[];
  totalUnits: number;
}): ChordAttempt {
  const scoring = scoreChordAnswers(answers, totalUnits);
  const passed =
    scoring.accuracy >= exercise.requiredAccuracy &&
    (typeof exercise.maxMistakes !== "number" || scoring.mistakes <= exercise.maxMistakes);

  return {
    exerciseId: exercise.id,
    startedAt,
    finishedAt: new Date().toISOString(),
    answers,
    score: scoring.score,
    accuracy: scoring.accuracy,
    comboMax: scoring.comboMax,
    mistakes: scoring.mistakes,
    weakestChords: getWeakestChordIds(answers),
    weakestQualities: getWeakestChordQualities(answers),
    completed: true,
    passed,
  };
}

export function getChordFeedback({ question, answer }: { question: ChordQuestion; answer: ChordAnswer }) {
  const chord = getChordById(question.chordId);

  if (answer.isCorrect && question.taskType === "major_vs_minor_audio") {
    return `Bien: ese acorde es ${getChordQualityLabel(chord?.quality ?? "major")}.`;
  }

  if (answer.isCorrect && question.taskType === "missing_chord_note") {
    return `Exacto: la nota que faltaba era ${String(answer.expectedAnswer)}.`;
  }

  if (answer.isCorrect) {
    return `Correcto: ${chord?.displayName ?? "el acorde"} está formado por ${chord?.notes.map(getDisplayNoteName).join(", ")}.`;
  }

  const error = answer.errorDetails;
  if (error?.wrongNote && error.expectedNote) {
    return `Tocaste ${getDisplayNoteName(error.wrongNote)}, pero aquí necesitabas ${getDisplayNoteName(error.expectedNote)}.`;
  }

  if (error?.missingNotes?.length) {
    return `Falta una nota del acorde: ${error.missingNotes.map(getDisplayNoteName).join(", ")}.`;
  }

  if (error?.expectedQuality) {
    return `Este acorde es ${getChordQualityLabel(error.expectedQuality)}. Revisa la tercera: define gran parte del color.`;
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer}.`;
}
