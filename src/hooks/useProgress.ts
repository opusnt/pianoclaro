"use client";

import { useEffect, useState } from "react";

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar progreso desde localStorage al montar
    const saved = localStorage.getItem("piano_claro_progress");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const markLessonCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      localStorage.setItem("piano_claro_progress", JSON.stringify(next));
      return next;
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  return {
    completedLessons,
    isLoaded,
    markLessonCompleted,
    isLessonCompleted,
  };
}
