import { appendLocalAnalyticsEvent } from "@/lib/analytics/local-analytics";
import type { PentatonicAttempt, PentatonicType } from "@/types/pentatonic";

type PentatonicAnalyticsEvent =
  | "pentatonic_module_started"
  | "pentatonic_exercise_started"
  | "pentatonic_question_answered"
  | "pentatonic_improvisation_started"
  | "pentatonic_improvisation_completed"
  | "pentatonic_exercise_completed"
  | "pentatonic_module_completed";

type PentatonicPayload = {
  userId?: string;
  moduleId: string;
  exerciseId?: string;
  questionId?: string;
  scaleId?: string;
  pentatonicType?: PentatonicType;
  isCorrect?: boolean;
  score?: number;
  accuracy?: number;
  notesPlayed?: number;
  uniqueNotesUsed?: number;
  helpUsed?: boolean;
  replayUsed?: boolean;
  timestamp?: string;
};

export function trackPentatonicEvent(name: PentatonicAnalyticsEvent, payload: PentatonicPayload) {
  appendLocalAnalyticsEvent({
    name,
    payload: { ...payload, timestamp: payload.timestamp ?? new Date().toISOString() },
  });
}

export function trackPentatonicAttempt(moduleId: string, attempt: PentatonicAttempt) {
  trackPentatonicEvent("pentatonic_exercise_completed", {
    moduleId,
    exerciseId: attempt.exerciseId,
    score: attempt.score,
    accuracy: attempt.accuracy,
  });
}
