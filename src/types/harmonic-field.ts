export type HarmonicFieldChordQuality = "major" | "minor" | "diminished";

export type ScaleDegree = "I" | "ii" | "iii" | "IV" | "V" | "vi" | "vii°";

export type FunctionalRole = "tonic" | "subdominant" | "dominant" | "other";

export type HarmonicFieldExerciseType =
  | "scale_to_chords"
  | "build_c_major_field"
  | "identify_chord_quality"
  | "roman_numerals"
  | "play_pop_progression"
  | "transpose_progression"
  | "basic_functions"
  | "analyze_progression"
  | "final_challenge";

export type HarmonicFieldQuestionMode = "visual" | "audio" | "mixed" | "progression";

export type HarmonicFieldChord = {
  degree: ScaleDegree;
  root: string;
  quality: HarmonicFieldChordQuality;
  notes: string[];
  midiNotes: number[];
  displayName: string;
  functionRole: FunctionalRole;
};

export type HarmonicFieldDefinition = {
  id: string;
  keyId: string;
  internalName: string;
  displayName: string;
  scaleNotes: string[];
  scaleMidiNotes: number[];
  chords: HarmonicFieldChord[];
  difficulty: 1 | 2 | 3 | 4;
};

export type HarmonicFieldExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: HarmonicFieldExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedFields: string[];
  allowHints?: boolean;
  allowReplay?: boolean;
  showNoteLabels?: boolean;
};

export type HarmonicFieldQuestion = {
  id: string;
  exerciseId: string;
  fieldId: string;
  taskType: HarmonicFieldExerciseType;
  degree?: ScaleDegree;
  chordRoot?: string;
  chordQuality?: HarmonicFieldChordQuality;
  expectedNotes?: string[];
  expectedMidiNotes?: number[];
  expectedDegree?: ScaleDegree;
  expectedFunction?: FunctionalRole;
  progression?: ScaleDegree[];
  progressionId?: string;
  expectedChordSequence?: string[];
  prompt: string;
  mode: HarmonicFieldQuestionMode;
  answerOptions?: string[];
  expectedAnswer?: string | string[];
};

export type HarmonicFieldAnswer = {
  questionId: string;
  selectedOption?: string;
  selectedNotes?: string[];
  selectedDegree?: ScaleDegree;
  playedChordSequence?: string[][];
  isCorrect: boolean;
  expectedAnswer: string | string[];
  userAnswer: string | string[];
  correctNotesCount?: number;
  helpUsed: boolean;
  replayUsed: boolean;
  fieldId: string;
  keyId: string;
  degree?: ScaleDegree;
  chordQuality?: HarmonicFieldChordQuality;
  functionRole?: FunctionalRole;
  progressionId?: string;
  points: number;
  errorDetails?: {
    expectedDegree?: ScaleDegree;
    selectedDegree?: ScaleDegree;
    expectedNotes?: string[];
    selectedNotes?: string[];
    expectedQuality?: HarmonicFieldChordQuality;
    selectedQuality?: HarmonicFieldChordQuality;
    expectedFunction?: FunctionalRole;
    selectedFunction?: FunctionalRole;
  };
};

export type HarmonicFieldAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: HarmonicFieldAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestKeys: string[];
  weakestDegrees: ScaleDegree[];
  weakestChordQualities: HarmonicFieldChordQuality[];
  weakestProgressions: string[];
  completed: boolean;
  passed: boolean;
};

export type HarmonicFieldExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestKeys: string[];
  weakestDegrees: ScaleDegree[];
  weakestChordQualities: HarmonicFieldChordQuality[];
  weakestProgressions: string[];
  helpUsedCount: number;
  replayUsedCount: number;
  lastAttempt?: HarmonicFieldAttempt;
};

export type HarmonicFieldProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  totalAccuracy: number;
  weakestKey?: string;
  weakestDegree?: ScaleDegree;
  weakestChordQuality?: HarmonicFieldChordQuality;
  needsReview: string[];
  exercises: Record<string, HarmonicFieldExerciseProgress>;
};

export type HarmonicFieldModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: HarmonicFieldExercise[];
};
