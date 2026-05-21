import {
  getDisplayNoteName,
  getPentatonicScaleById,
  getWeakestPentatonicScales,
} from "@/lib/pentatonic/theory";
import type {
  PentatonicAnswer,
  PentatonicAttempt,
  PentatonicExercise,
  PentatonicQuestion,
} from "@/types/pentatonic";

export function pointsForPentatonicAnswer({
  isCorrect,
  helpUsed,
  replayUsed,
}: {
  isCorrect: boolean;
  helpUsed: boolean;
  replayUsed: boolean;
}) {
  if (!isCorrect) return 0;
  if (helpUsed) return 60;
  if (replayUsed) return 75;
  return 100;
}

export function pointsForImprovisation({
  notesPlayed,
  uniqueNotesUsed,
  outsideNotes,
}: {
  notesPlayed: number;
  uniqueNotesUsed: number;
  outsideNotes: number;
}) {
  if (outsideNotes > 0) return 0;
  const notePoints = notesPlayed * 20;
  const varietyBonus = uniqueNotesUsed >= 3 ? 180 : 0;
  const completionBonus = notesPlayed >= 12 ? 180 : 0;
  return notePoints + varietyBonus + completionBonus;
}

export function scorePentatonicAnswers(answers: PentatonicAnswer[], totalUnits: number) {
  let combo = 0;
  let comboMax = 0;
  let score = 0;

  answers.forEach((answer) => {
    if (!answer.isCorrect) {
      combo = 0;
      return;
    }

    combo += 1;
    comboMax = Math.max(comboMax, combo);
    const multiplier = answer.improvisationMetrics ? 1 : Math.min(2, 1 + Math.floor(combo / 5) * 0.1);
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

export function buildPentatonicAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: PentatonicExercise;
  startedAt: string;
  answers: PentatonicAnswer[];
  totalUnits: number;
}): PentatonicAttempt {
  const scoring = scorePentatonicAnswers(answers, totalUnits);
  const weakestScales = getWeakestPentatonicScales(answers);
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
    weakestScales,
    completed: true,
    passed,
  };
}

export function getPentatonicFeedback({
  question,
  answer,
}: {
  question: PentatonicQuestion;
  answer: PentatonicAnswer;
}) {
  if (answer.improvisationMetrics) {
    const { notesPlayed, uniqueNotesUsed, outsideNotes } = answer.improvisationMetrics;

    if (outsideNotes > 0) return "Esa nota no pertenece a esta pentatónica.";
    if (notesPlayed < 12) return "Prueba tocar más notas para completar una frase.";
    if (uniqueNotesUsed < 3) return "Buena base. Prueba usar al menos 3 notas distintas.";
    return `Buena frase: usaste ${uniqueNotesUsed} notas distintas y te mantuviste dentro de la escala.`;
  }

  if (answer.isCorrect && question.taskType === "relative_pentatonics") {
    return "Exacto: esas pentatónicas comparten las mismas notas con distinta tónica.";
  }

  if (answer.isCorrect) {
    return "Correcto: esa nota pertenece a la pentatónica.";
  }

  const scale = getPentatonicScaleById(question.scaleId);
  const error = answer.errorDetails;

  if (error?.wrongNote && error.expectedNote) {
    return `Tocaste ${getDisplayNoteName(error.wrongNote)}, pero aquí necesitabas ${getDisplayNoteName(error.expectedNote)}.`;
  }

  if (error?.expectedRelativeScale) {
    return `Esta escala comparte algunas notas, pero no es relativa. La relativa correcta es ${error.expectedRelativeScale}.`;
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer} para ${scale?.displayName ?? "esta pentatónica"}.`;
}
