import type { keyboardNotesLessonSlug } from "@/data/learning-slugs";
import type { SharpNoteName } from "@/lib/music/notes";
import type { NoteName } from "@/types/music";

export type KeyboardNotesStage = "pattern" | "find-c" | "complete";

export type KeyboardNotesFeedbackState = "idle" | "correct" | "error";

export type KeyboardNotesWhiteKey = {
  id: string;
  note: NoteName;
  octave: number;
  label: string;
  frequency: number;
};

export type KeyboardNotesBlackKey = {
  id: string;
  note: SharpNoteName;
  octave: number;
  label: string;
  groupType: 2 | 3;
  groupIndex: number;
  leftPercent: number;
  frequency: number;
};

export type KeyboardNotesProgress = {
  moduleId: typeof keyboardNotesLessonSlug;
  completed: boolean;
  stage: KeyboardNotesStage;
  xp: number;
  comboMax: number;
  attempts: number;
  correct: number;
  patternHits: number;
  cHits: number;
  bestAccuracy: number;
  updatedAt?: string;
};
