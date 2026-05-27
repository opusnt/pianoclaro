import { keyboardNotesModuleId } from "@/lib/keyboard-notes/theory";
import { readModuleProgress, writeModuleProgress } from "@/lib/modules/sequential-progress";
import type { KeyboardNotesProgress, KeyboardNotesStage } from "@/types/keyboard-notes";

const progressKey = "piano-claro.keyboard-notes-progress";

export function createInitialKeyboardNotesProgress(): KeyboardNotesProgress {
  return {
    moduleId: keyboardNotesModuleId,
    completed: false,
    stage: "pattern",
    xp: 0,
    comboMax: 0,
    attempts: 0,
    correct: 0,
    patternHits: 0,
    cHits: 0,
    bestAccuracy: 100,
  };
}

export function readKeyboardNotesProgress() {
  return readModuleProgress<KeyboardNotesProgress>({
    storageKey: progressKey,
    moduleId: keyboardNotesModuleId,
    createInitial: createInitialKeyboardNotesProgress,
  });
}

export function writeKeyboardNotesProgress(progress: KeyboardNotesProgress) {
  writeModuleProgress({
    storageKey: progressKey,
    progress: {
      ...progress,
      updatedAt: new Date().toISOString(),
    },
  });
}

export function buildKeyboardNotesProgressSnapshot({
  stage,
  xp,
  combo,
  comboMax,
  attempts,
  correct,
  patternHits,
  cHits,
  accuracy,
}: {
  stage: KeyboardNotesStage;
  xp: number;
  combo: number;
  comboMax: number;
  attempts: number;
  correct: number;
  patternHits: number;
  cHits: number;
  accuracy: number;
}): KeyboardNotesProgress {
  return {
    moduleId: keyboardNotesModuleId,
    completed: stage === "complete",
    stage,
    xp,
    comboMax: Math.max(comboMax, combo),
    attempts,
    correct,
    patternHits,
    cHits,
    bestAccuracy: accuracy,
  };
}
