import type {
  LessonProgressDraft,
  LessonProgressRepository,
  LessonProgressStore,
} from "@/lib/progress/types";

const STORAGE_KEY = "piano-claro.lesson-progress";

function readAll(): LessonProgressStore {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as LessonProgressStore) : {};
  } catch {
    return {};
  }
}

function getByLessonSlug(slug: string) {
  return readAll()[slug];
}

function save(slug: string, progress: LessonProgressDraft) {
  if (typeof window === "undefined") {
    return;
  }

  const store = readAll();
  store[slug] = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export const localStorageLessonProgressRepository: LessonProgressRepository = {
  readAll,
  getByLessonSlug,
  save,
};
