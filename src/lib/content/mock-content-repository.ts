import { lessonModules } from "@/data/lesson-modules";
import { getLessonBySlug, getLessonsByModule, lessons } from "@/data/lessons";
import {
  detailedLearningModules,
  getDetailedLearningModuleById,
} from "@/data/modules";
import {
  curriculumStages,
  exerciseTypes,
  getModuleBlueprintById,
  moduleBlueprints,
  skillBranches,
} from "@/data/curriculum";
import { pricingPlans } from "@/data/pricing";
import { getRouteBySlug, learningRoutes } from "@/data/routes";
import { getPlayableSongLessonBySlug, playableSongLessons } from "@/data/song-lessons";
import { songs } from "@/data/songs";
import type { ContentRepository } from "@/lib/content/types";

export const mockContentRepository: ContentRepository = {
  getRoutes: () => learningRoutes,
  getRouteBySlug,
  getLessons: () => lessons,
  getLessonBySlug,
  getLessonsByModule,
  getLessonModules: () => lessonModules,
  getSongs: () => songs,
  getPlayableSongLessons: () => playableSongLessons,
  getPlayableSongLessonBySlug,
  getCurriculumStages: () => curriculumStages,
  getSkillBranches: () => skillBranches,
  getModuleBlueprints: () => moduleBlueprints,
  getModuleBlueprintById,
  getDetailedLearningModules: () => detailedLearningModules,
  getDetailedLearningModuleById,
  getExerciseTypes: () => exerciseTypes,
  getPricingPlans: () => pricingPlans,
};
