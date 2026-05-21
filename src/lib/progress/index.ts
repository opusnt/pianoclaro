import { localStorageLessonProgressRepository } from "@/lib/progress/local-storage-progress-repository";

// TODO: reemplazar este adaptador por una implementación remota cuando exista autenticación.
export const lessonProgressRepository = localStorageLessonProgressRepository;

export type {
  LessonProgressDraft,
  LessonProgressRepository,
  LessonProgressStore,
  StoredLessonProgress,
} from "@/lib/progress/types";
