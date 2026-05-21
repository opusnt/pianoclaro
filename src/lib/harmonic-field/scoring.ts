import type {
  HarmonicFieldAnswer,
  HarmonicFieldAttempt,
  HarmonicFieldExercise,
  HarmonicFieldQuestion,
} from "@/types/harmonic-field";
import {
  getChordByDegree,
  getDisplayNoteName,
  getFunctionLabel,
  getQualityLabel,
  getWeakestChordQualities,
  getWeakestDegrees,
  getWeakestKeys,
  getWeakestProgressions,
  requireField,
} from "./theory";

export function pointsForHarmonicFieldAnswer({
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
  if (isCorrect) {
    if (helpUsed) return 60;
    if (replayUsed) return 75;
    return 100;
  }
  if (typeof correctNotesCount === "number" && correctNotesCount >= 2) return 50;
  return 0;
}

export function scoreHarmonicFieldAnswers(answers: HarmonicFieldAnswer[], totalUnits: number) {
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

export function buildHarmonicFieldAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: HarmonicFieldExercise;
  startedAt: string;
  answers: HarmonicFieldAnswer[];
  totalUnits: number;
}): HarmonicFieldAttempt {
  const scoring = scoreHarmonicFieldAnswers(answers, totalUnits);
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
    weakestKeys: getWeakestKeys(answers),
    weakestDegrees: getWeakestDegrees(answers),
    weakestChordQualities: getWeakestChordQualities(answers),
    weakestProgressions: getWeakestProgressions(answers),
    completed: true,
    passed,
  };
}

export function getHarmonicFieldFeedback({
  question,
  answer,
}: {
  question: HarmonicFieldQuestion;
  answer: HarmonicFieldAnswer;
}) {
  const field = requireField(question.fieldId);
  const chord = question.degree ? getChordByDegree(field, question.degree) : undefined;

  if (answer.isCorrect && question.answerOptions && question.taskType === "identify_chord_quality") {
    return `Correcto: el ${question.degree} grado en ${field.displayName} es ${getQualityLabel(chord?.quality ?? "major")}.`;
  }

  if (answer.isCorrect && question.taskType === "basic_functions") {
    return `Exacto: ${question.degree} se siente como ${getFunctionLabel(chord?.functionRole ?? "other")}.`;
  }

  if (answer.isCorrect && question.answerOptions) {
    return `Correcto: ${chord?.displayName ?? "ese acorde"} corresponde a ${answer.expectedAnswer}.`;
  }

  if (answer.isCorrect && chord) {
    return `Correcto: el ${chord.degree} grado en ${field.displayName} es ${chord.displayName}.`;
  }

  if (answer.correctNotesCount === 2 && chord) {
    return `Casi: tienes 2 notas correctas. ${chord.displayName} usa ${chord.notes.map(getDisplayNoteName).join(", ")}.`;
  }

  if (question.taskType === "identify_chord_quality" && chord) {
    return `La cualidad correcta era ${getQualityLabel(chord.quality)}. Recuerda: mayor, menor, menor, mayor, mayor, menor, disminuido.`;
  }

  if (question.taskType === "basic_functions" && chord) {
    return `La función correcta era ${getFunctionLabel(chord.functionRole)}. I es casa, IV prepara y V genera tensión.`;
  }

  if (chord) {
    return `La respuesta correcta era ${chord.displayName}: ${chord.notes.map(getDisplayNoteName).join(", ")}.`;
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" - ") : answer.expectedAnswer}.`;
}
