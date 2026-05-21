import type { IntervalAttempt } from "@/types/intervals";
import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";

type IntervalAnalyticsEvent =
  | "interval_module_started"
  | "interval_exercise_started"
  | "interval_question_answered"
  | "interval_exercise_completed"
  | "interval_exercise_failed"
  | "interval_module_completed";

type IntervalAnalyticsPayload = {
  userId?: string;
  moduleId: string;
  exerciseId?: string;
  questionId?: string;
  intervalSemitones?: number;
  intervalName?: string;
  direction?: string;
  isCorrect?: boolean;
  accuracy?: number;
  score?: number;
};

export function trackIntervalEvent(
  event: IntervalAnalyticsEvent,
  payload: IntervalAnalyticsPayload,
) {
  appendLocalAnalyticsEvent({
    name: event,
    payload,
  });
}

export function trackIntervalAttempt(moduleId: string, attempt: IntervalAttempt) {
  trackIntervalEvent(
    attempt.passed ? "interval_exercise_completed" : "interval_exercise_failed",
    {
      moduleId,
      exerciseId: attempt.exerciseId,
      accuracy: attempt.accuracy,
      score: attempt.score,
    },
  );
}
