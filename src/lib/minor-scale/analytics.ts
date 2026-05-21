import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";
import type { MinorScaleAttempt, MinorScaleType } from "@/types/minor-scale";

type MinorScaleAnalyticsEvent =
  | "minor_scale_module_started"
  | "minor_scale_exercise_started"
  | "minor_scale_question_answered"
  | "minor_scale_completed"
  | "minor_scale_exercise_failed"
  | "minor_scale_module_completed";

type MinorScaleAnalyticsPayload = {
  userId?: string;
  moduleId: string;
  exerciseId?: string;
  questionId?: string;
  scaleId?: string;
  tonic?: string;
  scaleType?: MinorScaleType;
  exerciseType?: string;
  isCorrect?: boolean;
  score?: number;
  accuracy?: number;
  helpUsed?: boolean;
  replayUsed?: boolean;
  weakestSteps?: number[];
  weakestScaleTypes?: MinorScaleType[];
};

export function trackMinorScaleEvent(
  name: MinorScaleAnalyticsEvent,
  payload: MinorScaleAnalyticsPayload,
) {
  appendLocalAnalyticsEvent({ name, payload });
}

export function trackMinorScaleAttempt(moduleId: string, attempt: MinorScaleAttempt) {
  trackMinorScaleEvent(attempt.passed ? "minor_scale_completed" : "minor_scale_exercise_failed", {
    moduleId,
    exerciseId: attempt.exerciseId,
    score: attempt.score,
    accuracy: attempt.accuracy,
    weakestSteps: attempt.weakestSteps,
    weakestScaleTypes: attempt.weakestScaleTypes,
  });
}
