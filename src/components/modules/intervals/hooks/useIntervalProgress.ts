"use client";

import { useEffect, useState } from "react";

import {
  applyIntervalAttemptToProgress,
  createInitialIntervalProgress,
  readIntervalProgress,
  writeIntervalProgress,
} from "@/lib/intervals/progress";
import type { IntervalAttempt, IntervalExercise, IntervalProgress } from "@/types/intervals";

export function useIntervalProgress(moduleId: string, exercises: IntervalExercise[]) {
  const [progress, setProgress] = useState<IntervalProgress>(() =>
    createInitialIntervalProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readIntervalProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: IntervalAttempt) {
    setProgress((currentProgress) => {
      const nextProgress = applyIntervalAttemptToProgress({
        progress: currentProgress,
        exercises,
        attempt,
      });
      writeIntervalProgress(nextProgress);
      return nextProgress;
    });
  }

  function resetProgress() {
    const nextProgress = createInitialIntervalProgress(moduleId, exercises);
    writeIntervalProgress(nextProgress);
    setProgress(nextProgress);
  }

  return {
    progress,
    saveAttempt,
    resetProgress,
  };
}
