export type MajorScaleExerciseType =
  | "discover_pattern"
  | "play_c_major"
  | "ascending_descending"
  | "missing_note"
  | "build_from_tonic"
  | "audio_recognition"
  | "final_challenge";

export type ScaleQuestionMode = "visual" | "audio" | "mixed";

export type NoteDefinition = {
  midi: number;
  internalName: string;
  displayName: string;
  octave: number;
  isBlackKey: boolean;
};

export type ScaleDefinition = {
  id: string;
  tonic: string;
  internalName: string;
  displayName: string;
  difficulty: 1 | 2 | 3 | 4;
  notes: string[];
  midiNotes: number[];
  formula: number[];
  cumulativeSteps: number[];
};

export type MajorScaleExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: MajorScaleExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedScales: string[];
  showNoteLabels?: boolean;
  allowReplay?: boolean;
  allowHints?: boolean;
};

export type ScaleQuestion = {
  id: string;
  exerciseId: string;
  scaleId: string;
  tonic: string;
  mode: ScaleQuestionMode;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  missingNoteIndex?: number;
  answerOptions?: string[];
  alteredNoteIndex?: number;
  isCorrectScale?: boolean;
  prompt: string;
  taskType: MajorScaleExerciseType;
};

export type ScaleAnswer = {
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
  errorDetails?: {
    wrongNote?: string;
    expectedNote?: string;
    wrongStepIndex?: number;
    expectedInterval?: number;
    actualInterval?: number;
  };
  points: number;
};

export type MajorScaleAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: ScaleAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestScales: string[];
  weakestSteps: number[];
  completed: boolean;
  passed: boolean;
};

export type MajorScaleExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestScales: string[];
  weakestSteps: number[];
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: MajorScaleAttempt;
};

export type MajorScaleProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  strongestScale?: string;
  weakestScale?: string;
  masteredScales: string[];
  needsReview: string[];
  exercises: Record<string, MajorScaleExerciseProgress>;
};

export type MajorScaleModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: MajorScaleExercise[];
};
