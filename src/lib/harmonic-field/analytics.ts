import type { HarmonicFieldAttempt } from "@/types/harmonic-field";

type HarmonicFieldEventName =
  | "harmonic_field_module_started"
  | "harmonic_field_exercise_started"
  | "harmonic_field_question_answered"
  | "harmonic_field_progression_played"
  | "harmonic_field_exercise_completed"
  | "harmonic_field_exercise_failed"
  | "harmonic_field_module_completed";

type HarmonicFieldEventPayload = Record<string, unknown> & {
  moduleId?: string;
  exerciseId?: string;
};

export function trackHarmonicFieldEvent(name: HarmonicFieldEventName, payload: HarmonicFieldEventPayload = {}) {
  const event = {
    name,
    ...payload,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("piano-claro:analytics", { detail: event }));
  }

  if (process.env.NODE_ENV === "development") {
    // Local analytics stub. Replace with backend analytics when user accounts are persistent.
    console.debug("[analytics]", event);
  }
}

export function trackHarmonicFieldAttempt(moduleId: string, attempt: HarmonicFieldAttempt) {
  trackHarmonicFieldEvent(
    attempt.passed ? "harmonic_field_exercise_completed" : "harmonic_field_exercise_failed",
    {
      moduleId,
      exerciseId: attempt.exerciseId,
      score: attempt.score,
      accuracy: attempt.accuracy,
      weakestKeys: attempt.weakestKeys,
      weakestDegrees: attempt.weakestDegrees,
      weakestChordQualities: attempt.weakestChordQualities,
      weakestProgressions: attempt.weakestProgressions,
    },
  );
}
