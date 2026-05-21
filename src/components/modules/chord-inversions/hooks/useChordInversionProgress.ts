"use client";

import { useEffect, useState } from "react";

import {
  applyChordInversionAttemptToProgress,
  createInitialChordInversionProgress,
  readChordInversionProgress,
  writeChordInversionProgress,
} from "@/lib/chord-inversions/progress";
import type {
  ChordInversionAttempt,
  ChordInversionExercise,
  ChordInversionProgress,
} from "@/types/chord-inversions";

export function useChordInversionProgress(moduleId: string, exercises: ChordInversionExercise[]) {
  const [progress, setProgress] = useState<ChordInversionProgress>(() =>
    createInitialChordInversionProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readChordInversionProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: ChordInversionAttempt) {
    setProgress((current) => {
      const next = applyChordInversionAttemptToProgress({ progress: current, exercises, attempt });
      writeChordInversionProgress(next);
      return next;
    });
  }

  function resetProgress() {
    const next = createInitialChordInversionProgress(moduleId, exercises);
    writeChordInversionProgress(next);
    setProgress(next);
  }

  return { progress, saveAttempt, resetProgress };
}

