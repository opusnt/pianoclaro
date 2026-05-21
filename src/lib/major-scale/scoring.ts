import {
  getDisplayNoteName,
  getWeakestScaleSteps,
  scaleDefinitions,
} from "@/lib/major-scale/theory";
import type {
  MajorScaleAttempt,
  MajorScaleExercise,
  ScaleAnswer,
  ScaleQuestion,
} from "@/types/major-scale";

export function pointsForScaleAnswer({
  isCorrect,
  helpUsed,
  replayUsed,
}: {
  isCorrect: boolean;
  helpUsed: boolean;
  replayUsed: boolean;
}) {
  if (!isCorrect) {
    return 0;
  }

  if (helpUsed) {
    return 60;
  }

  if (replayUsed) {
    return 75;
  }

  return 100;
}

export function scoreScaleAnswers(answers: ScaleAnswer[], totalUnits: number) {
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

  return {
    score,
    accuracy: totalUnits > 0 ? Math.min(1, correctAnswers / totalUnits) : 0,
    combo,
    comboMax,
    mistakes: answers.filter((answer) => !answer.isCorrect).length,
  };
}

export function buildMajorScaleAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: MajorScaleExercise;
  startedAt: string;
  answers: ScaleAnswer[];
  totalUnits: number;
}): MajorScaleAttempt {
  const scoring = scoreScaleAnswers(answers, totalUnits);
  const weakestScales = getWeakestScales(answers);
  const weakestSteps = getWeakestScaleSteps(answers);
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
    weakestSteps,
    completed: true,
    passed,
  };
}

export function getWeakestScales(answers: ScaleAnswer[]) {
  const counts = answers.reduce<Record<string, number>>((acc, answer) => {
    if (answer.isCorrect) {
      return acc;
    }

    acc[answer.scaleId] = (acc[answer.scaleId] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([scaleId]) => scaleDefinitions.find((scale) => scale.id === scaleId)?.displayName ?? scaleId);
}

export function getScaleFeedback({
  question,
  answer,
}: {
  question: ScaleQuestion;
  answer: ScaleAnswer;
}) {
  if (answer.isCorrect && question.taskType === "discover_pattern") {
    return "Correcto: avanzaste según el patrón mayor.";
  }

  if (answer.isCorrect) {
    return "Correcto: esa nota pertenece al patrón de la escala mayor.";
  }

  const error = answer.errorDetails;

  if (error?.wrongNote && error.expectedNote) {
    return `Tocaste ${getDisplayNoteName(error.wrongNote)}, pero aquí necesitabas ${getDisplayNoteName(error.expectedNote)}.`;
  }

  if (typeof error?.actualInterval === "number" && typeof error.expectedInterval === "number") {
    return `Avanzaste ${error.actualInterval} semitonos, pero este paso era de ${error.expectedInterval}.`;
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer}.`;
}
