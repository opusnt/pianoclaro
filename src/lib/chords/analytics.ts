import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";
import type { ChordAttempt } from "@/types/chords";

export type ChordAnalyticsEvent =
  | "chord_module_started"
  | "chord_exercise_started"
  | "chord_question_answered"
  | "chord_exercise_completed"
  | "chord_module_completed";

export function trackChordEvent(event: ChordAnalyticsEvent, payload: Record<string, unknown> = {}) {
  appendLocalAnalyticsEvent({
    name: event,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
    },
  });
}

export function trackChordAttempt(moduleId: string, attempt: ChordAttempt) {
  trackChordEvent("chord_exercise_completed", {
    moduleId,
    exerciseId: attempt.exerciseId,
    score: attempt.score,
    accuracy: attempt.accuracy,
    weakestChords: attempt.weakestChords,
    weakestQualities: attempt.weakestQualities,
    passed: attempt.passed,
  });
}
