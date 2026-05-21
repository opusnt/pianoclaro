import type { LessonModule, Lesson } from "@/types/lesson";
import type { PricingPlan, Route, Song } from "@/types/learning";
import type {
  CurriculumStage,
  DetailedLearningModule,
  ExerciseTypeDefinition,
  ModuleBlueprint,
  SkillBranch,
} from "@/types/curriculum";

export type ContentRepository = {
  getRoutes: () => Route[];
  getRouteBySlug: (slug: string) => Route | undefined;
  getLessons: () => Lesson[];
  getLessonBySlug: (slug: string) => Lesson | undefined;
  getLessonsByModule: (moduleId: string) => Lesson[];
  getLessonModules: () => LessonModule[];
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
