import type {
  BeatEvent,
  ExerciseAttempt,
  RhythmExercise,
  RhythmTendency,
  TimingGrade,
  TimingResult,
} from "@/types/rhythm";

export function isSuccessfulGrade(grade: TimingGrade) {
  return grade === "perfect" || grade === "good";
}

export function scoreRhythmResults(results: TimingResult[], expectedHitCount: number) {
  let combo = 0;
  let comboMax = 0;
  let score = 0;

  results.forEach((result) => {
    if (isSuccessfulGrade(result.grade)) {
      combo += 1;
      comboMax = Math.max(comboMax, combo);
      const multiplier = Math.min(2, 1 + Math.floor(combo / 5) * 0.1);
      score += Math.round(result.points * multiplier);
      return;
    }

    score += result.points;
    combo = 0;
  });

  const successfulHits = results.filter((result) => isSuccessfulGrade(result.grade)).length;
  const misses = results.filter((result) => result.grade === "miss" && result.shouldTap).length;

  return {
    score,
    maxScore: expectedHitCount * 200,
    accuracy: expectedHitCount > 0 ? successfulHits / expectedHitCount : 0,
    combo,
    comboMax,
    misses,
  };
}

export function getAverageTimingErrorMs(results: TimingResult[]) {
  const timedResults = results.filter(
    (result): result is TimingResult & { timingErrorMs: number } =>
      typeof result.timingErrorMs === "number" && result.shouldTap,
  );

  if (timedResults.length === 0) {
    return 0;
  }

  return Math.round(
    timedResults.reduce((total, result) => total + result.timingErrorMs, 0) / timedResults.length,
  );
}

export function getRhythmTendency(results: TimingResult[]): RhythmTendency {
  const average = getAverageTimingErrorMs(results);
  const misses = results.filter((result) => result.grade === "miss").length;

  if (misses >= 4) {
    return "unstable";
  }

  if (average < -70) {
    return "early";
  }

  if (average > 70) {
    return "late";
  }

  return "balanced";
}

export function buildExerciseAttempt({
  exercise,
  startedAt,
  finishedAt,
  results,
  beatEvents,
}: {
  exercise: RhythmExercise;
  startedAt: string;
  finishedAt: string;
  results: TimingResult[];
  beatEvents: BeatEvent[];
}): ExerciseAttempt {
  const expectedHitCount = beatEvents.filter((beat) => beat.shouldTap).length;
  const scoring = scoreRhythmResults(results, expectedHitCount);
  const averageTimingErrorMs = getAverageTimingErrorMs(results);
  const tendency = getRhythmTendency(results);
  const passed =
    scoring.accuracy >= exercise.requiredAccuracy &&
    (typeof exercise.maxMisses !== "number" || scoring.misses <= exercise.maxMisses);

  return {
    exerciseId: exercise.id,
    startedAt,
    finishedAt,
    bpm: exercise.bpm,
    results,
    score: scoring.score,
    maxScore: scoring.maxScore,
    accuracy: scoring.accuracy,
    comboMax: scoring.comboMax,
    misses: scoring.misses,
    averageTimingErrorMs,
    tendency,
    completed: true,
    passed,
  };
}

export function getAdaptiveHint(attempt?: ExerciseAttempt) {
  if (!attempt) {
    return "Mira el anillo: toca cuando llegue al centro.";
  }

  if (attempt.tendency === "early") {
    return "Estás tocando un poco antes del pulso. Espera a que el anillo llegue al centro.";
  }

  if (attempt.tendency === "late") {
    return "Estás tocando un poco después del pulso. Prepara la mano durante la caída del anillo.";
  }

  if (attempt.misses > 5) {
    return "Hay muchos misses. Repite con tempo más lento y escucha el click.";
  }

  return "Buen pulso. Intenta mantener la misma sensación en cada beat.";
}
