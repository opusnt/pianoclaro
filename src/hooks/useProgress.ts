"use client";

import { useMastery } from "@/lib/masteryStore";

/**
 * Hook mantenido por retrocompatibilidad.
 * Ahora envuelve al store centralizado para compartir el mismo ProgressProvider.
 */
export function useProgress() {
  const { completedLessons, isLoaded, markLessonCompleted, isLessonCompleted } = useMastery();

  return {
    completedLessons,
    isLoaded,
    markLessonCompleted,
    isLessonCompleted,
  };
}
