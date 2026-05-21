export type PentatonicType = "major" | "minor";

export type PentatonicExerciseType =
  | "discover_five_notes"
  | "play_c_major_pentatonic"
  | "build_major_pentatonic"
  | "minor_pentatonic"
  | "relative_pentatonics"
  | "missing_note"
  | "guided_improvisation"
  | "final_challenge";

export type PentatonicQuestionMode = "visual" | "audio" | "mixed" | "improvisation";

export type NoteDefinition = {
  midi: number;
  internalName: string;
  displayName: string;
  octave: number;
  isBlackKey: boolean;
};

export type PentatonicScaleDefinition = {
  id: string;
  tonic: string;
  internalName: string;
  displayName: string;
  type: PentatonicType;
  relativeScaleId?: string;
  notes: string[];
  midiNotes: number[];
  formula: number[];
  intervals: number[];
  difficulty: 1 | 2 | 3;
};

export type PentatonicExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: PentatonicExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedScales: string[];
  allowHints?: boolean;
  allowReplay?: boolean;
  showNoteLabels?: boolean;
};

export type PentatonicQuestion = {
  id: string;
  exerciseId: string;
  scaleId: string;
  taskType: PentatonicExerciseType;
  mode: PentatonicQuestionMode;
  prompt: string;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  missingNoteIndex?: number;
  answerOptions?: string[];
  comparisonScaleId?: string;
  expectedAnswer?: string | string[];
};

export type PentatonicAnswer = {
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
  pentatonicType: PentatonicType;
  points: number;
  improvisationMetrics?: {
    notesPlayed: number;
    uniqueNotesUsed: number;
    outsideNotes: number;
  };
  errorDetails?: {
    wrongNote?: string;
    expectedNote?: string;
    wrongStepIndex?: number;
    expectedRelativeScale?: string;
    selectedRelativeScale?: string;
  };
};

export type PentatonicAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: PentatonicAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestScales: string[];
  completed: boolean;
  passed: boolean;
};

export type PentatonicExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestScales: string[];
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: PentatonicAttempt;
};

export type PentatonicProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  weakestScale?: string;
  masteredScales: string[];
  needsReview: string[];
  exercises: Record<string, PentatonicExerciseProgress>;
};

export type PentatonicModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: PentatonicExercise[];
};
