"use client";

import { useEffect, useState } from "react";

import { lessonProgressRepository } from "@/lib/progress";

type UseLessonProgressOptions = {
  lessonSlug: string;
  stepCount: number;
};

export function useLessonProgress({ lessonSlug, stepCount }: UseLessonProgressOptions) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  useEffect(() => {
    setHasLoadedProgress(false);

    const storedProgress = lessonProgressRepository.getByLessonSlug(lessonSlug);

    if (storedProgress) {
      setCompletedStepIds(storedProgress.completedStepIds);
      setActiveStepIndex(Math.min(storedProgress.lastStepIndex, stepCount - 1));
      setIsLessonCompleted(storedProgress.completed);
    } else {
      setCompletedStepIds([]);
      setActiveStepIndex(0);
      setIsLessonCompleted(false);
    }

    setHasLoadedProgress(true);
  }, [lessonSlug, stepCount]);

  useEffect(() => {
    if (!hasLoadedProgress) {
      return;
    }

    lessonProgressRepository.save(lessonSlug, {
      completed: isLessonCompleted,
      completedStepIds,
      lastStepIndex: activeStepIndex,
    });
  }, [activeStepIndex, completedStepIds, hasLoadedProgress, isLessonCompleted, lessonSlug]);

  return {
    activeStepIndex,
    setActiveStepIndex,
    isLessonCompleted,
    setIsLessonCompleted,
    completedStepIds,
    setCompletedStepIds,
  };
}
