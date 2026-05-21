"use client";

import { useEffect, useState } from "react";

import {
  applyChordAttemptToProgress,
  createInitialChordProgress,
  readChordProgress,
  writeChordProgress,
} from "@/lib/chords/progress";
import type { ChordAttempt, ChordExercise, ChordProgress } from "@/types/chords";

export function useChordProgress(moduleId: string, exercises: ChordExercise[]) {
  const [progress, setProgress] = useState<ChordProgress>(() =>
    createInitialChordProgress(moduleId, exercises),
  );

  useEffect(() => {
    setProgress(readChordProgress(moduleId, exercises));
  }, [exercises, moduleId]);

  function saveAttempt(attempt: ChordAttempt) {
    setProgress((current) => {
      const next = applyChordAttemptToProgress({ progress: current, exercises, attempt });
      writeChordProgress(next);
      return next;
    });
  }

  function resetProgress() {
    const next = createInitialChordProgress(moduleId, exercises);
    writeChordProgress(next);
    setProgress(next);
  }

  return { progress, saveAttempt, resetProgress };
}
