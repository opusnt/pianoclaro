import type { ExerciseAttempt, RhythmTendency } from "@/types/rhythm";
import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";

export type RhythmAnalyticsEventName =
  | "rhythm_module_started"
  | "rhythm_exercise_started"
  | "rhythm_hit_evaluated"
  | "rhythm_exercise_completed"
  | "rhythm_exercise_failed"
  | "rhythm_module_completed";

type RhythmAnalyticsPayload = {
  userId?: string;
  moduleId: string;
  exerciseId?: string;
  bpm?: number;
  score?: number;
  accuracy?: number;
  averageTimingErrorMs?: number;
  tendency?: RhythmTendency;
  timestamp?: string;
  [key: string]: unknown;
};

export function trackEvent(name: RhythmAnalyticsEventName, payload: RhythmAnalyticsPayload) {
  appendLocalAnalyticsEvent({
    name,
    payload,
    maxEvents: 250,
  });
}

export function trackAttempt(moduleId: string, attempt: ExerciseAttempt) {
  trackEvent(attempt.passed ? "rhythm_exercise_completed" : "rhythm_exercise_failed", {
    moduleId,
    exerciseId: attempt.exerciseId,
    bpm: attempt.bpm,
    score: attempt.score,
    accuracy: attempt.accuracy,
    averageTimingErrorMs: attempt.averageTimingErrorMs,
    tendency: attempt.tendency,
  });
}
