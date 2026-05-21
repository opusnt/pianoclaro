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
