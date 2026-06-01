import type { ComponentType } from "react";
import type { PracticeSong } from "@/lib/music/song-model";
import type { LessonStep, NoteName, ScoreMock } from "@/types/lesson";

export type ActiveNotePosition = {
  measureNumber: number;
  noteIndex: number;
};

export type ScoreNoteSelection = ActiveNotePosition & {
  note: NoteName;
};

export type NotationRendererProps = {
  score: ScoreMock;
  practiceSong?: PracticeSong;
  activeNotes?: NoteName[];
  activeMeasure?: number;
  activePhrase?: LessonStep["activePhrase"];
  activeNotePosition?: ActiveNotePosition | null;
  hintNotePosition?: ScoreNoteSelection | null;
  onNoteSelect?: (selection: ScoreNoteSelection) => void;
  onNaturalKeyPress?: (note: NoteName) => void;
  onSharpKeyPress?: (note: any) => void; // Using any for SharpNoteName to avoid import issues if not exported
  isPlaying?: boolean;
};

export type NotationRenderer = ComponentType<NotationRendererProps>;
