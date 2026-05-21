"use client";

import { useEffect, useState } from "react";

import {
  applyRhythmAttemptToProgress,
  createInitialRhythmProgress,
  readRhythmProgress,
  writeRhythmProgress,
} from "@/lib/rhythm/progress";
import type { ExerciseAttempt, RhythmExercise, RhythmProgress } from "@/types/rhythm";

export function useExerciseProgress(moduleId: string, exercises: RhythmExercise[]) {
  const [progress, setProgress] = useState<RhythmProgress>(() =>
    createInitialRhythmProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readRhythmProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: ExerciseAttempt) {
    setProgress((current) => {
      const nextProgress = applyRhythmAttemptToProgress({
        progress: current,
        exercises,
        attempt,
      });
      writeRhythmProgress(nextProgress);
      return nextProgress;
    });
  }

  function resetProgress() {
    const initialProgress = createInitialRhythmProgress(moduleId, exercises);
    writeRhythmProgress(initialProgress);
    setProgress(initialProgress);
  }

  return {
    progress,
    saveAttempt,
    resetProgress,
  };
}
