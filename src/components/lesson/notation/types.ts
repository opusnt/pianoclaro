import type { LessonStep, NoteName, ScoreMock } from "@/types/lesson";
import type { PracticeSong } from "@/lib/music/song-model";
import type { ComponentType } from "react";

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
};

export type NotationRenderer = ComponentType<NotationRendererProps>;
