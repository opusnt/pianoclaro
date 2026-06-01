import type {
  CurriculumStage,
  DetailedLearningModule,
  ExerciseTypeDefinition,
  ModuleBlueprint,
  SkillBranch,
} from "@/types/curriculum";
import type { PricingPlan, Route, Song } from "@/types/learning";
import type { LearningExperience } from "@/types/learning-experience";
import type { LearningExperienceTrack, LearningUnit } from "@/types/learning-path";
import type { Lesson, LessonModule } from "@/types/lesson";

export type ContentRepository = {
  getRoutes: () => Route[];
  getRouteBySlug: (slug: string) => Route | undefined;
  getLessons: () => Lesson[];
  getLessonBySlug: (slug: string) => Lesson | undefined;
  getLessonsByModule: (moduleId: string) => Lesson[];
  getLessonModules: () => LessonModule[];
  getLearningExperienceTracks: () => LearningExperienceTrack[];
  getLearningExperiences: () => LearningExperience[];
  getLearningExperienceById: (id: string) => LearningExperience | undefined;
  getLearningExperiencesByTrack: (trackId: LearningExperienceTrack["id"]) => LearningExperience[];
  getLearningExperienceByUnitId: (unitId: string) => LearningExperience | undefined;
  getLearningUnits: () => LearningUnit[];
  getLearningUnitById: (id: string) => LearningUnit | undefined;
  getLearningUnitByLessonSlug: (slug: string) => LearningUnit | undefined;
  getLearningUnitByPlayableModuleId: (moduleId: string) => LearningUnit | undefined;
  getSongs: () => Song[];
  getPlayableSongLessons: () => Lesson[];
  getPlayableSongLessonBySlug: (slug: string) => Lesson | undefined;
  getCurriculumStages: () => CurriculumStage[];
  getSkillBranches: () => SkillBranch[];
  getModuleBlueprints: () => ModuleBlueprint[];
  getModuleBlueprintById: (id: string) => ModuleBlueprint | undefined;
  getDetailedLearningModules: () => DetailedLearningModule[];
  getDetailedLearningModuleById: (id: string) => DetailedLearningModule | undefined;
  getExerciseTypes: () => ExerciseTypeDefinition[];
  getPricingPlans: () => PricingPlan[];
};
