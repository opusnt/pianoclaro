export type SkillBranchId =
  | "keyboard"
  | "rhythm"
  | "ear"
  | "reading"
  | "scales"
  | "chords"
  | "harmony"
  | "songs"
  | "improvisation"
  | "composition";

export type CurriculumStageId =
  | "stage-1-foundations"
  | "stage-2-tonality"
  | "stage-3-harmony-chords"
  | "stage-4-real-music"
  | "stage-5-expression-creation";

export type DifficultyBand = "inicial" | "base" | "intermedio" | "avanzado";

export type MasteryLevel = "locked" | "seen" | "practicing" | "stable" | "mastered";

export type ExerciseTypeId =
  | "play-indicated-note"
  | "recognize-heard-note"
  | "find-interval"
  | "complete-scale"
  | "build-chord"
  | "identify-chord"
  | "play-progression"
  | "follow-rhythm"
  | "improvise-backing-track"
  | "analyze-progression"
  | "reharmonize-simple-phrase";

export type ExerciseInputMode =
  | "virtual-keyboard"
  | "computer-keyboard"
  | "web-midi"
  | "audio-choice"
  | "multiple-choice"
  | "drag-and-drop"
  | "tap-rhythm"
  | "free-play";

export type FeedbackChannel = "visual" | "audio" | "timing" | "theory" | "hint" | "reflection";

export type UnlockRule =
  | {
      type: "module-completed";
      moduleId: string;
    }
  | {
      type: "skill-minimum";
      skillId: SkillBranchId;
      mastery: Exclude<MasteryLevel, "locked">;
    }
  | {
      type: "score-threshold";
      moduleId: string;
      metric: "accuracy" | "consistency" | "tempoControl";
      value: number;
    };

export type SkillBranch = {
  id: SkillBranchId;
  name: string;
  description: string;
  productRole: string;
};

export type StageExerciseGuidance = {
  recommended: ExerciseTypeId[];
  feedback: FeedbackChannel[];
  pianoRelation: string;
};

export type CurriculumStage = {
  id: CurriculumStageId;
  order: number;
  name: string;
  objective: string;
  requiredPriorKnowledge: string[];
  skillsToMaster: SkillBranchId[];
  expectedOutcome: string;
  exerciseGuidance: StageExerciseGuidance;
  gamification: string[];
  approvalCriteria: string[];
  commonErrorsToDetect: string[];
};

export type ModuleBlueprint = {
  id: string;
  stageId: CurriculumStageId;
  order: number;
  name: string;
  objective: string;
  mainConcepts: string[];
  practicalSkill: string;
  keyboardVisualization: string;
  auditoryExercises: ExerciseTypeId[];
  executionExercises: ExerciseTypeId[];
  recognitionExercises: ExerciseTypeId[];
  creativeMiniChallenge: string;
  finalAssessment: string;
  unlockCriteria: UnlockRule[];
  contributesToSkills: Partial<Record<SkillBranchId, number>>;
  estimatedMinutes: number;
  difficulty: DifficultyBand;
  prerequisites: string[];
};

export type ExerciseTypeDefinition = {
  id: ExerciseTypeId;
  name: string;
  purpose: string;
  expectedInput: ExerciseInputMode[];
  feedback: FeedbackChannel[];
  evaluation: string[];
  difficultyVariables: string[];
};

export type SkillProgress = {
  skillId: SkillBranchId;
  mastery: MasteryLevel;
  xp: number;
  accuracy: number;
  consistency: number;
  lastPracticedAt?: string;
};

export type ModuleProgress = {
  moduleId: string;
  status: "locked" | "available" | "in-progress" | "completed" | "review";
  completedLessonIds: string[];
  completedExerciseIds: string[];
  accuracy: number;
  speed: number;
  consistency: number;
  tempoControl: number;
  frequentErrors: string[];
  lastPracticedAt?: string;
  nextReviewAt?: string;
};

export type UserLearningProgress = {
  userId: string;
  completedModuleIds: string[];
  skills: SkillProgress[];
  modules: ModuleProgress[];
  weakSkillIds: SkillBranchId[];
  masteredSkillIds: SkillBranchId[];
  recommendations: {
    type: "next-module" | "review" | "repair-skill" | "creative-challenge";
    targetId: string;
    reason: string;
  }[];
};

export type KeyboardLabelMode = "always" | "fade" | "on-hint" | "hidden";

export type InteractionPattern =
  | "tap-key"
  | "listen-and-choose"
  | "pattern-scan"
  | "speed-round"
  | "memory-recall"
  | "creative-play";

export type MicroLessonSpec = {
  id: string;
  name: string;
  objective: string;
  idealMinutes: number;
  mainConcept: string;
  briefExplanation: string;
  visualExample: string;
  suggestedInteraction: string;
  exerciseType: ExerciseTypeId;
  successCriteria: string[];
};

export type ModuleExerciseSpec = {
  id: string;
  name: string;
  objective: string;
  mechanic: string;
  interactionPattern: InteractionPattern;
  expectedInput: ExerciseInputMode[];
  feedback: string[];
  difficulty: DifficultyBand;
  variants: string[];
  evaluationCriteria: string[];
  difficultyVariables: string[];
};

export type ModuleAchievement = {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  condition: string;
};

export type ModuleUxSpec = {
  entryExperience: string;
  firstScreen: string;
  conceptDelivery: string;
  animationMoments: string[];
  audioMoments: string[];
  cognitiveLoadRules: string[];
  progressFeeling: string[];
  visualFeedback: string[];
  soundFeedback: string[];
  celebrations: string[];
  errorHandling: string[];
  smartHints: string[];
};

export type ModuleKeyboardSpec = {
  visibleOctaves: {
    mobile: number;
    desktop: number;
  };
  horizontalScroll: "mobile-only" | "always" | "never";
  labelMode: KeyboardLabelMode;
  illumination: string[];
  animations: string[];
  colorSystem: {
    naturalKey: string;
    blackKey: string;
    target: string;
    correct: string;
    error: string;
    hint: string;
  };
  mobileBehavior: string[];
  desktopBehavior: string[];
  correctState: string;
  errorState: string;
  guidanceState: string;
};

export type ModuleAudioSpec = {
  pianoSound: string;
  successSound: string;
  errorSound: string;
  guidedVoice: string;
  earTraining: string[];
  spatialSoundLearning: string[];
};

export type ModuleAdaptivitySpec = {
  frustrationSignals: string[];
  lowerDifficultyActions: string[];
  raiseDifficultyActions: string[];
  repetitionRules: string[];
  unlockRules: string[];
};

export type ModuleFinalChallengeSpec = {
  name: string;
  setup: string;
  tasks: string[];
  passCriteria: string[];
  celebration: string;
  summary: string[];
  nextModuleTeaser: string;
};

export type DetailedLearningModule = ModuleBlueprint & {
  subtitle: string;
  shortDescription: string;
  expectedResult: string;
  laterUnlockedSkills: string[];
  microLessons: MicroLessonSpec[];
  ux: ModuleUxSpec;
  keyboard: ModuleKeyboardSpec;
  exercises: ModuleExerciseSpec[];
  achievements: ModuleAchievement[];
  audio: ModuleAudioSpec;
  adaptivity: ModuleAdaptivitySpec;
  commonErrors: {
    id: string;
    error: string;
    detection: string;
    correction: string;
  }[];
  pedagogyRationale: string[];
  finalChallenge: ModuleFinalChallengeSpec;
};
