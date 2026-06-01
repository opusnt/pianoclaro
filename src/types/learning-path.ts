import type { CurriculumStageId, SkillBranchId } from "@/types/curriculum";

export type LearningUnitStatus = "active" | "planned";

export type LearningExperienceTrackId = "music-theory" | "piano-lessons";

export type LearningExperienceTrack = {
  id: LearningExperienceTrackId;
  title: string;
  shortLabel: string;
  description: string;
  href: string;
  primaryActionLabel: string;
  outcome: string;
  experienceRules: string[];
};

export type PedagogicalMomentId = "observe" | "understand" | "practice" | "listen" | "apply";

export type PedagogicalMoment = {
  id: PedagogicalMomentId;
  label: string;
  productRule: string;
};

export type LearningPracticeStep = {
  label: string;
  action: string;
  successSignal: string;
};

export type LearningDiagnosticRule = {
  symptom: string;
  likelyCause: string;
  intervention: string;
};

export type LearningMasteryRubricLevelId = "exploring" | "practicing" | "ready";

export type LearningMasteryRubricLevel = {
  id: LearningMasteryRubricLevelId;
  label: string;
  observableBehavior: string;
};

export type LearningPracticeContract = {
  essentialQuestion: string;
  practicePlan: LearningPracticeStep[];
  selfCheck: string[];
  transferChallenge: string;
  diagnosticRules: LearningDiagnosticRule[];
  masteryRubric: LearningMasteryRubricLevel[];
};

export type LearningUnit = {
  id: string;
  order: number;
  status: LearningUnitStatus;
  stageId: CurriculumStageId;
  title: string;
  shortGoal: string;
  userOutcome: string;
  routeSlug: string;
  lessonModuleId?: string;
  lessonSlugs: string[];
  playableModuleId?: string;
  primarySkillIds: SkillBranchId[];
  prerequisiteUnitIds: string[];
  masteryCriteria: string[];
  evidence: string[];
  remediation: string[];
  practiceContract: LearningPracticeContract;
  nextUnitId?: string;
};
