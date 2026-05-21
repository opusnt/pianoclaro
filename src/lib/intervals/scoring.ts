import { getIntervalName } from "@/lib/intervals/theory";
import type {
  IntervalAnswer,
  IntervalAttempt,
  IntervalExercise,
  IntervalQuestion,
} from "@/types/intervals";

export function pointsForIntervalAnswer({
  isCorrect,
  usedHint,
}: {
  isCorrect: boolean;
  usedHint: boolean;
}) {
  if (!isCorrect) {
    return 0;
  }

  return usedHint ? 60 : 100;
}

export function scoreIntervalAnswers(answers: IntervalAnswer[], totalQuestions: number) {
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
    const multiplier = Math.min(2, 1 + Math.floor(combo / 5) * 0.1);
    score += Math.round(answer.points * multiplier);
  });

  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const mistakes = answers.length - correctAnswers;

  return {
    score,
    accuracy: totalQuestions > 0 ? correctAnswers / totalQuestions : 0,
    combo,
    comboMax,
    mistakes,
  };
}

export function getWeakestIntervals(answers: IntervalAnswer[]) {
  const errorCounts = answers.reduce<Record<string, number>>((counts, answer) => {
    if (answer.isCorrect) {
      return counts;
    }

    counts[answer.intervalName] = (counts[answer.intervalName] ?? 0) + 1;
    return counts;
  }, {});

  return Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([intervalName]) => intervalName);
}

export function buildIntervalAttempt({
  exercise,
  startedAt,
  answers,
  totalQuestions,
}: {
  exercise: IntervalExercise;
  startedAt: string;
  answers: IntervalAnswer[];
  totalQuestions: number;
}): IntervalAttempt {
  const scoring = scoreIntervalAnswers(answers, totalQuestions);
  const weakestIntervals = getWeakestIntervals(answers);
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
    weakestIntervals,
    completed: true,
    passed,
  };
}

export function getIntervalFeedback({
  question,
  answer,
}: {
  question: IntervalQuestion;
  answer: IntervalAnswer;
}) {
  if (answer.isCorrect) {
    return `Correcto: esa distancia es ${getIntervalName(question.intervalSemitones)}.`;
  }

  if (typeof answer.intervalError === "number") {
    return `Tocaste ${Math.abs(answer.intervalError)} semitonos, pero necesitabas ${question.intervalSemitones}.`;
  }

  return `La respuesta correcta era ${answer.expectedAnswer}.`;
}
