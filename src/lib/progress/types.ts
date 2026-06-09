export type StoredLessonProgress = {
  completed: boolean;
  completedStepIds: string[];
  lastStepIndex: number;
  updatedAt: string;
};

export type LessonProgressStore = Record<string, StoredLessonProgress>;

export type LessonProgressDraft = Omit<StoredLessonProgress, "updatedAt">;

export type LessonProgressRepository = {
  readAll: () => LessonProgressStore;
  getByLessonSlug: (slug: string) => StoredLessonProgress | undefined;
  save: (slug: string, progress: LessonProgressDraft) => void;
};

export type ModuleMastery = {
  notes: number;
  trebleClef: number;
  rhythm: number;
  measures: number;
  ties: number;
  dottedNotes: number;
  chords: number;
  earTraining: number;
  scales: number;
};

export type UserStats = {
  totalXP: number;
  practiceTimeSecs: number;
  sessionsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string | null;
  practiceHistory?: string[]; // Array of YYYY-MM-DD
  unlockedSongs?: string[]; // IDs de canciones desbloqueadas
};

export type ProgressState = {
  mastery: ModuleMastery;
  stats: UserStats;
  badges: string[];
  completedLessons: string[];
};

export interface IProgressProvider {
  loadState(): Promise<ProgressState | null>;
  saveState(state: ProgressState): Promise<void>;
}
