import type {
  MeasureEvent,
  NoteDuration,
  NoteName,
  SolfegeName,
} from "@/types/music";

export type { NoteName, SolfegeName } from "@/types/music";

export type PracticeMode = {
  id: string;
  label: string;
  description: string;
};

export type LessonPhase = {
  id: "observe" | "understand" | "play" | "confirm";
  label: string;
  description: string;
};

export type LessonModule = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessonSlugs: string[];
  nextModuleHint?: string;
};

export type MeasureMock = {
  number: number;
  notes: NoteName[];
  solfege: SolfegeName[];
  rhythm: NoteDuration[];
  events?: MeasureEvent[];
  phrase?: "A" | "B";
};

export type ScoreMock = {
  title: string;
  timeSignature: string;
  keySignature: string;
  clef: "treble" | "bass";
  measures: MeasureMock[];
};

export type LessonStep = {
  id: string;
  title: string;
  description: string;
  instruction: string;
  activeNotes?: NoteName[];
  activeMeasure?: number;
  activePhrase?: "A" | "B";
  conceptTitle?: string;
  conceptExplanation?: string;
  melodyDirection?: "up" | "down" | "repeat" | "mixed";
};

export type Lesson = {
  slug: string;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  level: string;
  estimatedMinutes: number;
  tempoBpm: number;
  objective: string;
  pedagogy: LessonPhase[];
  concepts: string[];
  notes: NoteName[];
  score: ScoreMock;
  practiceModes: PracticeMode[];
  steps: LessonStep[];
};
