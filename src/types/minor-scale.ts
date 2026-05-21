export type MinorScaleType = "natural" | "harmonic" | "melodic_ascending";

export type MinorScaleExerciseType =
  | "major_vs_minor"
  | "discover_natural_pattern"
  | "play_a_minor_natural"
  | "build_natural_from_tonic"
  | "missing_note"
  | "natural_vs_harmonic"
  | "natural_vs_melodic"
  | "final_challenge";

export type MinorScaleQuestionMode = "visual" | "audio" | "mixed";

export type NoteDefinition = {
  midi: number;
  internalName: string;
  displayName: string;
  octave: number;
  isBlackKey: boolean;
};

export type MinorScaleDefinition = {
  id: string;
  tonic: string;
  internalName: string;
  displayName: string;
  scaleType: MinorScaleType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  notes: string[];
  midiNotes: number[];
  formula: number[];
  cumulativeSteps: number[];
};

export type MinorScaleExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: MinorScaleExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedScales: string[];
  showNoteLabels?: boolean;
  allowReplay?: boolean;
  allowHints?: boolean;
};

export type MinorScaleQuestion = {
  id: string;
  exerciseId: string;
  scaleId: string;
  tonic: string;
  scaleType: MinorScaleType;
  mode: MinorScaleQuestionMode;
  taskType: MinorScaleExerciseType;
  prompt: string;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  missingNoteIndex?: number;
  answerOptions?: string[];
  comparisonScaleId?: string;
  highlightedDifferenceIndexes?: number[];
  selectedNoteTargetMidi?: number;
  isCorrectScale?: boolean;
};

export type MinorScaleAnswer = {
  questionId: string;
  selectedNote?: string;
  playedNotes?: string[];
  selectedOption?: string;
  isCorrect: boolean;
  expectedAnswer: string | string[];
  userAnswer: string | string[];
  helpUsed: boolean;
  replayUsed: boolean;
  scaleId: string;
  scaleType: MinorScaleType;
  points: number;
  errorDetails?: {
    wrongNote?: string;
    expectedNote?: string;
    wrongStepIndex?: number;
    expectedInterval?: number;
    actualInterval?: number;
    expectedScaleType?: MinorScaleType;
    selectedScaleType?: MinorScaleType;
  };
};

export type MinorScaleAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: MinorScaleAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestScales: string[];
  weakestSteps: number[];
  weakestScaleTypes: MinorScaleType[];
  completed: boolean;
  passed: boolean;
};

export type MinorScaleExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestScales: string[];
  weakestSteps: number[];
  weakestScaleTypes: MinorScaleType[];
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: MinorScaleAttempt;
};

export type MinorScaleProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  strongestScale?: string;
  weakestScale?: string;
  masteredScales: string[];
  needsReview: string[];
  exercises: Record<string, MinorScaleExerciseProgress>;
};

export type MinorScaleModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: MinorScaleExercise[];
};
