import {
  curriculumStages,
  exerciseTypes,
  getModuleBlueprintById,
  moduleBlueprints,
  skillBranches,
} from "@/data/curriculum";
import {
  getLearningExperienceById,
  getLearningExperienceByUnitId,
  getLearningExperiencesByTrack,
  learningExperiences,
} from "@/data/learning-experiences";
import {
  getLearningUnitById,
  getLearningUnitByLessonSlug,
  getLearningUnitByPlayableModuleId,
  learningExperienceTracks,
  learningUnits,
} from "@/data/learning-path";
import { lessonModules } from "@/data/lesson-modules";
import { getLessonBySlug, getLessonsByModule, lessons } from "@/data/lessons";
import { detailedLearningModules, getDetailedLearningModuleById } from "@/data/modules";
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
  getLearningExperienceTracks: () => learningExperienceTracks,
  getLearningExperiences: () => learningExperiences,
  getLearningExperienceById,
  getLearningExperiencesByTrack,
  getLearningExperienceByUnitId,
  getLearningUnits: () => learningUnits,
  getLearningUnitById,
  getLearningUnitByLessonSlug,
  getLearningUnitByPlayableModuleId,
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
