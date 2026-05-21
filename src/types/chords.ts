export type ChordQuality = "major" | "minor" | "diminished" | "augmented";

export type ChordExerciseType =
  | "single_note_vs_chord"
  | "build_c_major"
  | "major_vs_minor_audio"
  | "build_major_chords"
  | "build_minor_chords"
  | "missing_chord_note"
  | "diminished_augmented_intro"
  | "final_challenge";

export type ChordQuestionMode = "visual" | "audio" | "mixed";

export type ChordDefinition = {
  id: string;
  tonic: string;
  internalName: string;
  displayName: string;
  quality: ChordQuality;
  notes: string[];
  midiNotes: number[];
  formula: number[];
  difficulty: 1 | 2 | 3;
};

export type ChordExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: ChordExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedChords: string[];
  allowHints?: boolean;
  allowReplay?: boolean;
  showNoteLabels?: boolean;
};

export type ChordQuestion = {
  id: string;
  exerciseId: string;
  chordId: string;
  taskType: ChordExerciseType;
  mode: ChordQuestionMode;
  prompt: string;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  missingNoteIndex?: number;
  answerOptions?: string[];
  expectedAnswer?: string | string[];
  comparisonChordId?: string;
};

export type ChordAnswer = {
  questionId: string;
  selectedOption?: string;
  selectedNotes?: string[];
  isCorrect: boolean;
  expectedAnswer: string | string[];
  userAnswer: string | string[];
  correctNotesCount?: number;
  helpUsed: boolean;
  replayUsed: boolean;
  chordId: string;
  chordQuality: ChordQuality;
  points: number;
  errorDetails?: {
    wrongNote?: string;
    expectedNote?: string;
    missingNotes?: string[];
    selectedQuality?: ChordQuality;
    expectedQuality?: ChordQuality;
  };
};

export type ChordAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: ChordAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestChords: string[];
  weakestQualities: ChordQuality[];
  completed: boolean;
  passed: boolean;
};

export type ChordExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestChords: string[];
  weakestQualities: ChordQuality[];
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: ChordAttempt;
};

export type ChordProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  weakestChord?: string;
  weakestQuality?: ChordQuality;
  masteredChords: string[];
  needsReview: string[];
  exercises: Record<string, ChordExerciseProgress>;
};

export type ChordModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: ChordExercise[];
};
