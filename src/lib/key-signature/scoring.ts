import {
  getDisplayNoteName,
  getDisplayPitchName,
  getKeySignatureById,
  getWeakestAccidentals,
  getWeakestKeys,
  getWeakestRelativePairs,
} from "@/lib/key-signature/theory";
import type {
  KeySignatureAnswer,
  KeySignatureAttempt,
  KeySignatureExercise,
  KeySignatureQuestion,
} from "@/types/key-signature";

export function pointsForKeySignatureAnswer({
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

export function scoreKeySignatureAnswers(answers: KeySignatureAnswer[], totalUnits: number) {
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

export function buildKeySignatureAttempt({
  exercise,
  startedAt,
  answers,
  totalUnits,
}: {
  exercise: KeySignatureExercise;
  startedAt: string;
  answers: KeySignatureAnswer[];
  totalUnits: number;
}): KeySignatureAttempt {
  const scoring = scoreKeySignatureAnswers(answers, totalUnits);
  const weakestKeys = getWeakestKeys(answers);
  const weakestAccidentals = getWeakestAccidentals(answers);
  const weakestRelativePairs = getWeakestRelativePairs(answers);
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
    weakestKeys,
    weakestAccidentals,
    weakestRelativePairs,
    completed: true,
    passed,
  };
}

export function getKeySignatureFeedback({
  question,
  answer,
}: {
  question: KeySignatureQuestion;
  answer: KeySignatureAnswer;
}) {
  const key = getKeySignatureById(question.keyId);

  if (answer.isCorrect && question.taskType === "global_accidental_rule") {
    return `Correcto: en ${key?.displayName ?? "esta tonalidad"}, esa nota queda alterada por la armadura.`;
  }

  if (answer.isCorrect && question.taskType === "relative_keys_compare") {
    return "Exacto: las relativas comparten notas y armadura, aunque tienen distinta tónica.";
  }

  if (answer.isCorrect) {
    return "Correcto: estás leyendo la tonalidad como una familia de notas.";
  }

  const error = answer.errorDetails;

  if (error?.wrongNote && error.expectedNote) {
    return `Tocaste ${getDisplayNoteName(error.wrongNote)}, pero aquí necesitabas ${getDisplayNoteName(error.expectedNote)}.`;
  }

  if (error?.expectedAccidentals?.length) {
    return `${key?.displayName ?? "Esta tonalidad"} usa ${error.expectedAccidentals.map(getDisplayPitchName).join(" y ")}.`;
  }

  if (error?.expectedRelativeKey) {
    return `Esta no es la relativa. La relativa correcta es ${error.expectedRelativeKey}.`;
  }

  if (question.taskType === "sharp_flat_none") {
    return `Esta tonalidad ${String(answer.expectedAnswer).toLowerCase()}.`;
  }

  return `La respuesta correcta era ${Array.isArray(answer.expectedAnswer) ? answer.expectedAnswer.join(" · ") : answer.expectedAnswer}.`;
}
