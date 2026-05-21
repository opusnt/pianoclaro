import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";
import type { MajorScaleAttempt } from "@/types/major-scale";

type MajorScaleAnalyticsEvent =
  | "major_scale_module_started"
  | "major_scale_exercise_started"
  | "major_scale_question_answered"
  | "major_scale_completed"
  | "major_scale_exercise_failed"
  | "major_scale_module_completed";

type MajorScaleAnalyticsPayload = {
  userId?: string;
  moduleId: string;
  exerciseId?: string;
  questionId?: string;
  scaleId?: string;
  tonic?: string;
  exerciseType?: string;
  isCorrect?: boolean;
  score?: number;
  accuracy?: number;
  helpUsed?: boolean;
  replayUsed?: boolean;
  weakestSteps?: number[];
};

export function trackMajorScaleEvent(
  name: MajorScaleAnalyticsEvent,
  payload: MajorScaleAnalyticsPayload,
) {
  appendLocalAnalyticsEvent({
    name,
    payload,
  });
}

export function trackMajorScaleAttempt(moduleId: string, attempt: MajorScaleAttempt) {
  trackMajorScaleEvent(attempt.passed ? "major_scale_completed" : "major_scale_exercise_failed", {
    moduleId,
    exerciseId: attempt.exerciseId,
    score: attempt.score,
    accuracy: attempt.accuracy,
    weakestSteps: attempt.weakestSteps,
  });
}
