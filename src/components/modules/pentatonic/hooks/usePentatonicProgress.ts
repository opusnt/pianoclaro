"use client";

import { useEffect, useState } from "react";

import {
  applyPentatonicAttemptToProgress,
  createInitialPentatonicProgress,
  readPentatonicProgress,
  writePentatonicProgress,
} from "@/lib/pentatonic/progress";
import type {
  PentatonicAttempt,
  PentatonicExercise,
  PentatonicProgress,
} from "@/types/pentatonic";

export function usePentatonicProgress(moduleId: string, exercises: PentatonicExercise[]) {
  const [progress, setProgress] = useState<PentatonicProgress>(() =>
    createInitialPentatonicProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readPentatonicProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: PentatonicAttempt) {
    setProgress((currentProgress) => {
      const nextProgress = applyPentatonicAttemptToProgress({
        progress: currentProgress,
        exercises,
        attempt,
      });
      writePentatonicProgress(nextProgress);
      return nextProgress;
    });
  }

  function resetProgress() {
    const nextProgress = createInitialPentatonicProgress(moduleId, exercises);
    writePentatonicProgress(nextProgress);
    setProgress(nextProgress);
  }

  return { progress, saveAttempt, resetProgress };
}
