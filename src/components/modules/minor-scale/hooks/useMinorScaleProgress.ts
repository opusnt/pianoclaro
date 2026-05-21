"use client";

import { useEffect, useState } from "react";

import {
  applyMinorScaleAttemptToProgress,
  createInitialMinorScaleProgress,
  readMinorScaleProgress,
  writeMinorScaleProgress,
} from "@/lib/minor-scale/progress";
import type {
  MinorScaleAttempt,
  MinorScaleExercise,
  MinorScaleProgress,
} from "@/types/minor-scale";

export function useMinorScaleProgress(moduleId: string, exercises: MinorScaleExercise[]) {
  const [progress, setProgress] = useState<MinorScaleProgress>(() =>
    createInitialMinorScaleProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readMinorScaleProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: MinorScaleAttempt) {
    setProgress((currentProgress) => {
      const nextProgress = applyMinorScaleAttemptToProgress({
        progress: currentProgress,
        exercises,
        attempt,
      });
      writeMinorScaleProgress(nextProgress);
      return nextProgress;
    });
  }

  function resetProgress() {
    const nextProgress = createInitialMinorScaleProgress(moduleId, exercises);
    writeMinorScaleProgress(nextProgress);
    setProgress(nextProgress);
  }

  return { progress, saveAttempt, resetProgress };
}
