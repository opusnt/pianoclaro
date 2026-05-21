"use client";

import { useEffect, useState } from "react";

import {
  applyHarmonicFieldAttemptToProgress,
  createInitialHarmonicFieldProgress,
  readHarmonicFieldProgress,
  writeHarmonicFieldProgress,
} from "@/lib/harmonic-field/progress";
import type {
  HarmonicFieldAttempt,
  HarmonicFieldExercise,
  HarmonicFieldProgress,
} from "@/types/harmonic-field";

export function useHarmonicFieldProgress(moduleId: string, exercises: HarmonicFieldExercise[]) {
  const [progress, setProgress] = useState<HarmonicFieldProgress>(() =>
    createInitialHarmonicFieldProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readHarmonicFieldProgress(moduleId, exercises));
  }, [moduleId, exercises]);

  function saveAttempt(attempt: HarmonicFieldAttempt) {
    setProgress((current) => {
      const next = applyHarmonicFieldAttemptToProgress({ progress: current, exercises, attempt });
      writeHarmonicFieldProgress(next);
      return next;
    });
  }

  function resetProgress() {
    const next = createInitialHarmonicFieldProgress(moduleId, exercises);
    writeHarmonicFieldProgress(next);
    setProgress(next);
  }

  return { progress, saveAttempt, resetProgress };
}
