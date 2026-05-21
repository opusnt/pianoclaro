import type {
  ChordInversionAnswer,
  ChordInversionAttempt,
  ChordInversionExercise,
  ChordInversionQuestion,
} from "@/types/chord-inversions";
import {
  getDisplayNoteName,
  getDisplayPitchName,
  getInversionById,
  getInversionLabel,
  getWeakestChordIds,
  getWeakestInversionTypes,
} from "./theory";

export function pointsForChordInversionAnswer({
  isCorrect,
  helpUsed,
  replayUsed,
  hasCorrectNotes,
  hasCorrectBass,
  correctNotesCount,
}: {
  isCorrect: boolean;
  helpUsed: boolean;
  replayUsed: boolean;
  hasCorrectNotes?: boolean;
  hasCorrectBass?: boolean;
  correctNotesCount?: number;
}) {
  if (isCorrect) {
    if (helpUsed) return 60;
    if (replayUsed) return 75;
    return 100;
  }

  if (hasCorrectNotes && !hasCorrectBass) return 50;
  if (typeof correctNotesCount === "number" && correctNotesCount > 0) return 25;
  return 0;
}

export function scoreChordInversionAnswers(answers: ChordInversionAnswer[], totalUnits: number) {
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

export function buildChordInversionAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: ChordInversionExercise;
  startedAt: string;
  answers: ChordInversionAnswer[];
  totalUnits: number;
}): ChordInversionAttempt {
  const scoring = scoreChordInversionAnswers(answers, totalUnits);
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
    weakestInversions: getWeakestInversionTypes(answers),
    bassMistakes: answers.filter((answer) => answer.hasCorrectNotes && !answer.hasCorrectBass).length,
    completed: true,
    passed,
  };
}

export function getChordInversionFeedback({
  question,
  answer,
}: {
  question: ChordInversionQuestion;
  answer: ChordInversionAnswer;
}) {
  const inversion = getInversionById(question.inversionId);

  if (answer.isCorrect && question.taskType === "same_notes_different_order") {
    return "Bien: reconociste que la identidad del acorde depende de sus notas, no del orden.";
  }

  if (answer.isCorrect && question.answerOptions) {
    return `Correcto: es ${getInversionLabel(inversion?.inversionType ?? "root_position")}.`;
  }

  if (answer.isCorrect) {
    return `Correcto: ${inversion?.chordDisplayName ?? "el acorde"} en ${inversion?.inversionDisplayName ?? "esta posición"} tiene ${getDisplayPitchName(inversion?.bassNote ?? "C")} en el bajo.`;
  }

  if (answer.hasCorrectNotes && !answer.hasCorrectBass) {
    return `Las notas son correctas, pero el bajo no corresponde. La nota más grave debía ser ${getDisplayPitchName(answer.errorDetails?.expectedBassNote ?? "")}.`;
  }

  if (answer.errorDetails?.missingNotes?.length) {
    return `Faltan notas del acorde: ${answer.errorDetails.missingNotes.map(getDisplayNoteName).join(", ")}.`;
  }

  if (answer.errorDetails?.expectedInversion) {
    return `La respuesta correcta era ${getInversionLabel(answer.errorDetails.expectedInversion)}. Revisa la nota más grave.`;
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer}.`;
}

