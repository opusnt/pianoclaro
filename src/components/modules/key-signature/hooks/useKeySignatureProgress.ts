"use client";

import { useEffect, useState } from "react";

import {
  applyKeySignatureAttemptToProgress,
  createInitialKeySignatureProgress,
  readKeySignatureProgress,
  writeKeySignatureProgress,
} from "@/lib/key-signature/progress";
import type {
  KeySignatureAttempt,
  KeySignatureExercise,
  KeySignatureProgress,
} from "@/types/key-signature";

export function useKeySignatureProgress(moduleId: string, exercises: KeySignatureExercise[]) {
  const [progress, setProgress] = useState<KeySignatureProgress>(() =>
    createInitialKeySignatureProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readKeySignatureProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: KeySignatureAttempt) {
    setProgress((currentProgress) => {
      const nextProgress = applyKeySignatureAttemptToProgress({
        progress: currentProgress,
        exercises,
        attempt,
      });
      writeKeySignatureProgress(nextProgress);
      return nextProgress;
    });
  }

  function resetProgress() {
    const nextProgress = createInitialKeySignatureProgress(moduleId, exercises);
    writeKeySignatureProgress(nextProgress);
    setProgress(nextProgress);
  }

  return { progress, saveAttempt, resetProgress };
}
