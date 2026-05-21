export type IntervalExerciseType =
  | "semitone_distance"
  | "find_interval"
  | "direction_recognition"
  | "melodic_vs_harmonic"
  | "audio_distance"
  | "final_challenge";

export type IntervalDirection = "ascending" | "descending" | "same";

export type IntervalQuestionMode = "visual" | "audio" | "mixed";

export type IntervalPlaybackType = "melodic" | "harmonic";

export type IntervalModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  exercises: IntervalExercise[];
};

export type IntervalDefinition = {
  id: string;
  name: string;
  semitones: number;
  shortLabel: string;
  difficulty: 1 | 2 | 3;
};

export type IntervalExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: IntervalExerciseType;
  totalRounds: number;
  requiredAccuracy: number;
  maxMistakes?: number;
  unlockedBy?: string;
  allowedIntervals: string[];
};

export type IntervalQuestion = {
  id: string;
  exerciseId: string;
  baseNote: string;
  targetNote?: string;
  intervalSemitones: number;
  direction: IntervalDirection;
  mode: IntervalQuestionMode;
  answerOptions?: string[];
  taskType?: IntervalExerciseType;
  playbackType?: IntervalPlaybackType;
  prompt: string;
  expectedOption?: string;
};

export type IntervalAnswer = {
  questionId: string;
  selectedNote?: string;
  selectedOption?: string;
  isCorrect: boolean;
  expectedAnswer: string;
  userAnswer: string;
  intervalError?: number;
  intervalSemitones: number;
  intervalName: string;
  points: number;
  usedHint: boolean;
};

export type IntervalAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  answers: IntervalAnswer[];
  score: number;
  accuracy: number;
  comboMax: number;
  mistakes: number;
  weakestIntervals: string[];
  completed: boolean;
  passed: boolean;
};

export type IntervalExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  weakestIntervals: string[];
  lastAttempt?: IntervalAttempt;
};

export type IntervalProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  exercises: Record<string, IntervalExerciseProgress>;
};
