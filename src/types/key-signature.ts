export type TonalityMode = "major" | "minor";

export type AccidentalType = "sharp" | "flat" | "none";

export type KeySignatureExerciseType =
  | "find_tonic"
  | "global_accidental_rule"
  | "identify_accidentals"
  | "build_scale_with_signature"
  | "relative_keys_compare"
  | "find_relative_key"
  | "sharp_flat_none"
  | "final_challenge";

export type KeySignatureQuestionMode = "visual" | "audio" | "mixed";

export type NoteDefinition = {
  midi: number;
  internalName: string;
  displayName: string;
  octave: number;
  isBlackKey: boolean;
};

export type KeySignatureDefinition = {
  id: string;
  internalName: string;
  displayName: string;
  tonic: string;
  mode: TonalityMode;
  accidentals: string[];
  accidentalType: AccidentalType;
  relativeKeyId: string;
  scaleNotes: string[];
  midiNotes: number[];
  difficulty: 1 | 2 | 3 | 4;
};

export type KeySignatureExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: KeySignatureExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedKeys: string[];
  allowHints?: boolean;
  allowReplay?: boolean;
  showNoteLabels?: boolean;
};

export type KeySignatureQuestion = {
  id: string;
  exerciseId: string;
  keyId: string;
  mode: KeySignatureQuestionMode;
  taskType: KeySignatureExerciseType;
  prompt: string;
  expectedAnswer: string | string[];
  answerOptions?: string[];
  comparisonKeyId?: string;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  selectedNoteTargetMidi?: number;
};

export type KeySignatureAnswer = {
  questionId: string;
  selectedOption?: string;
  selectedOptions?: string[];
  selectedNote?: string;
  playedNotes?: string[];
  isCorrect: boolean;
  expectedAnswer: string | string[];
  userAnswer: string | string[];
  helpUsed: boolean;
  replayUsed: boolean;
  keyId: string;
  points: number;
  errorDetails?: {
    expectedAccidentals?: string[];
    selectedAccidentals?: string[];
    expectedRelativeKey?: string;
    selectedRelativeKey?: string;
    wrongNote?: string;
    expectedNote?: string;
    wrongStepIndex?: number;
  };
};

export type KeySignatureAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: KeySignatureAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestKeys: string[];
  weakestAccidentals: string[];
  weakestRelativePairs: string[];
  completed: boolean;
  passed: boolean;
};

export type KeySignatureExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestKeys: string[];
  weakestAccidentals: string[];
  weakestRelativePairs: string[];
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: KeySignatureAttempt;
};

export type KeySignatureProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  weakestKey?: string;
  masteredKeys: string[];
  needsReview: string[];
  exercises: Record<string, KeySignatureExerciseProgress>;
};

export type KeySignatureModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: KeySignatureExercise[];
};
