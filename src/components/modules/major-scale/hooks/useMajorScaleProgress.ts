"use client";

import { useEffect, useState } from "react";

import {
  applyMajorScaleAttemptToProgress,
  createInitialMajorScaleProgress,
  readMajorScaleProgress,
  writeMajorScaleProgress,
} from "@/lib/major-scale/progress";
import type {
  MajorScaleAttempt,
  MajorScaleExercise,
  MajorScaleProgress,
} from "@/types/major-scale";

export function useMajorScaleProgress(moduleId: string, exercises: MajorScaleExercise[]) {
  const [progress, setProgress] = useState<MajorScaleProgress>(() =>
    createInitialMajorScaleProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readMajorScaleProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: MajorScaleAttempt) {
    setProgress((currentProgress) => {
      const nextProgress = applyMajorScaleAttemptToProgress({
        progress: currentProgress,
        exercises,
        attempt,
      });
      writeMajorScaleProgress(nextProgress);
      return nextProgress;
    });
  }

  function resetProgress() {
    const nextProgress = createInitialMajorScaleProgress(moduleId, exercises);
    writeMajorScaleProgress(nextProgress);
    setProgress(nextProgress);
  }

  return {
    progress,
    saveAttempt,
    resetProgress,
  };
}
