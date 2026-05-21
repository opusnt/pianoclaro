import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";
import type { KeySignatureAttempt } from "@/types/key-signature";

export function trackKeySignatureEvent(
  eventName:
    | "key_signature_module_started"
    | "key_signature_exercise_started"
    | "key_signature_question_answered"
    | "key_signature_exercise_completed"
    | "key_signature_exercise_failed"
    | "key_signature_module_completed",
  payload: Record<string, unknown>,
) {
  appendLocalAnalyticsEvent({
    name: eventName,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
    },
  });
}

export function trackKeySignatureAttempt(moduleId: string, attempt: KeySignatureAttempt) {
  trackKeySignatureEvent(
    attempt.passed ? "key_signature_exercise_completed" : "key_signature_exercise_failed",
    {
      moduleId,
      exerciseId: attempt.exerciseId,
      score: attempt.score,
      accuracy: attempt.accuracy,
      weakestKeys: attempt.weakestKeys,
      weakestAccidentals: attempt.weakestAccidentals,
      weakestRelativePairs: attempt.weakestRelativePairs,
    },
  );
}
