export type ChordInversionQuality = "major" | "minor";

export type ChordInversionType = "root_position" | "first_inversion" | "second_inversion";

export type ChordInversionExerciseType =
  | "same_notes_different_order"
  | "build_first_inversion"
  | "build_second_inversion"
  | "identify_inversion"
  | "build_multiple_inversions"
  | "audio_recognition"
  | "smooth_chord_movement"
  | "final_challenge";

export type ChordInversionQuestionMode = "visual" | "audio" | "mixed" | "progression";

export type ChordInversionDefinition = {
  id: string;
  chordId: string;
  chordDisplayName: string;
  quality: ChordInversionQuality;
  inversionType: ChordInversionType;
  inversionDisplayName: string;
  root: string;
  bassNote: string;
  notes: string[];
  midiNotes: number[];
  slashNotation?: string;
  difficulty: 1 | 2 | 3;
};

export type ChordInversionExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: ChordInversionExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedInversions: string[];
  allowHints?: boolean;
  allowReplay?: boolean;
  showNoteLabels?: boolean;
};

export type ChordInversionQuestion = {
  id: string;
  exerciseId: string;
  inversionId: string;
  taskType: ChordInversionExerciseType;
  mode: ChordInversionQuestionMode;
  prompt: string;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  expectedBassNote?: string;
  answerOptions?: string[];
  expectedAnswer?: string | string[];
  comparisonNotes?: string[];
  progressionId?: string;
};

export type ChordInversionAnswer = {
  questionId: string;
  selectedOption?: string;
  selectedNotes?: string[];
  bassNote?: string;
  isCorrect: boolean;
  hasCorrectNotes: boolean;
  hasCorrectBass: boolean;
  expectedAnswer: string | string[];
  userAnswer: string | string[];
  correctNotesCount?: number;
  helpUsed: boolean;
  replayUsed: boolean;
  inversionId: string;
  chordId: string;
  inversionType: ChordInversionType;
  points: number;
  errorDetails?: {
    expectedBassNote?: string;
    userBassNote?: string;
    missingNotes?: string[];
    extraNotes?: string[];
    selectedInversion?: ChordInversionType;
    expectedInversion?: ChordInversionType;
  };
};

export type ChordInversionAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: ChordInversionAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestChords: string[];
  weakestInversions: ChordInversionType[];
  bassMistakes: number;
  completed: boolean;
  passed: boolean;
};

export type ChordInversionExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestChords: string[];
  weakestInversions: ChordInversionType[];
  bassMistakes: number;
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: ChordInversionAttempt;
};

export type ChordInversionProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  weakestChord?: string;
  weakestInversion?: ChordInversionType;
  bassMistakes: number;
  masteredInversions: string[];
  needsReview: string[];
  exercises: Record<string, ChordInversionExerciseProgress>;
};

export type ChordInversionModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: ChordInversionExercise[];
};
