import {
  getDisplayNoteName,
  getScaleTypeLabel,
  getWeakestScaleSteps,
  minorScaleDefinitions,
} from "@/lib/minor-scale/theory";
import type {
  MinorScaleAnswer,
  MinorScaleAttempt,
  MinorScaleExercise,
  MinorScaleQuestion,
  MinorScaleType,
} from "@/types/minor-scale";

export function pointsForMinorScaleAnswer({
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

export function scoreMinorScaleAnswers(answers: MinorScaleAnswer[], totalUnits: number) {
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

export function buildMinorScaleAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: MinorScaleExercise;
  startedAt: string;
  answers: MinorScaleAnswer[];
  totalUnits: number;
}): MinorScaleAttempt {
  const scoring = scoreMinorScaleAnswers(answers, totalUnits);
  const weakestScales = getWeakestScales(answers);
  const weakestSteps = getWeakestScaleSteps(answers);
  const weakestScaleTypes = getWeakestScaleTypes(answers);
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
    weakestScaleTypes,
    completed: true,
    passed,
  };
}

export function getWeakestScales(answers: MinorScaleAnswer[]) {
  const counts = answers.reduce<Record<string, number>>((acc, answer) => {
    if (answer.isCorrect) return acc;

    acc[answer.scaleId] = (acc[answer.scaleId] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(
      ([scaleId]) =>
        minorScaleDefinitions.find((scale) => scale.id === scaleId)?.displayName ?? scaleId,
    );
}

export function getWeakestScaleTypes(answers: MinorScaleAnswer[]): MinorScaleType[] {
  const counts = answers.reduce<Record<MinorScaleType, number>>(
    (acc, answer) => {
      if (answer.isCorrect) return acc;

      acc[answer.scaleType] = (acc[answer.scaleType] ?? 0) + 1;
      return acc;
    },
    {} as Record<MinorScaleType, number>,
  );

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count >= 2)
    .map(([scaleType]) => scaleType as MinorScaleType);
}

export function getMinorScaleFeedback({
  question,
  answer,
}: {
  question: MinorScaleQuestion;
  answer: MinorScaleAnswer;
}) {
  if (answer.isCorrect && question.taskType === "natural_vs_harmonic") {
    return "Exacto: en la menor armónica sube el séptimo grado.";
  }

  if (answer.isCorrect && question.taskType === "natural_vs_melodic") {
    return "Exacto: en la menor melódica ascendente suben sexto y séptimo grado.";
  }

  if (answer.isCorrect && question.expectedNotes) {
    return question.scaleType === "natural"
      ? "Correcto: avanzaste dentro del patrón menor natural."
      : `Correcto: esa nota pertenece a la ${getScaleTypeLabel(question.scaleType)}.`;
  }

  if (answer.isCorrect) {
    return "Correcto: escuchaste la diferencia de color.";
  }

  const error = answer.errorDetails;

  if (error?.wrongNote && error.expectedNote) {
    return `Tocaste ${getDisplayNoteName(error.wrongNote)}, pero aquí necesitabas ${getDisplayNoteName(error.expectedNote)}.`;
  }

  if (typeof error?.actualInterval === "number" && typeof error.expectedInterval === "number") {
    return `Avanzaste ${error.actualInterval} semitonos, pero este paso era de ${error.expectedInterval}.`;
  }

  if (question.taskType === "natural_vs_harmonic") {
    return "En la menor armónica, revisa el séptimo grado: es la nota que sube.";
  }

  if (question.taskType === "natural_vs_melodic") {
    return "En la menor melódica ascendente cambian dos notas: sexto y séptimo grado.";
  }

  if (question.taskType === "major_vs_minor") {
    return "Escucha la tercera nota: ahí aparece gran parte de la diferencia entre mayor y menor.";
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer}.`;
}
