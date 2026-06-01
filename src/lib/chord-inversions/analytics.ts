import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";
import type { ChordInversionAttempt } from "@/types/chord-inversions";

export type ChordInversionAnalyticsEvent =
  | "chord_inversion_module_started"
  | "chord_inversion_exercise_started"
  | "chord_inversion_question_answered"
  | "chord_inversion_exercise_completed"
  | "chord_inversion_module_completed";

export function trackChordInversionEvent(
  event: ChordInversionAnalyticsEvent,
  payload: Record<string, unknown> = {},
) {
  appendLocalAnalyticsEvent({
    name: event,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
    },
  });
}

export function trackChordInversionAttempt(moduleId: string, attempt: ChordInversionAttempt) {
  trackChordInversionEvent("chord_inversion_exercise_completed", {
    moduleId,
    exerciseId: attempt.exerciseId,
    score: attempt.score,
    accuracy: attempt.accuracy,
    weakestChords: attempt.weakestChords,
    weakestInversions: attempt.weakestInversions,
    bassMistakes: attempt.bassMistakes,
    passed: attempt.passed,
  });
}
