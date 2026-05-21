export type RhythmExerciseType =
  | "follow_pulse"
  | "tempo_compare"
  | "pattern_tap"
  | "pattern_repeat"
  | "final_performance";

export type TimingGrade = "perfect" | "good" | "early" | "late" | "miss";

export type InputType = "touch" | "keyboard" | "midi";

export type RhythmTendency = "early" | "late" | "unstable" | "balanced";

export type RhythmExerciseState =
  | "intro"
  | "countdown"
  | "playing"
  | "paused"
  | "completed"
  | "failed";

export type RhythmPattern = {
  id: string;
  label: string;
  beats: number[];
};

export type RhythmExerciseRound = {
  bpm: number;
  totalBeats: number;
  pattern?: number[];
  label?: string;
};

export type RhythmExercise = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  bpm: number;
  totalBeats: number;
  type: RhythmExerciseType;
  pattern?: number[];
  patterns?: RhythmPattern[];
  rounds?: RhythmExerciseRound[];
  requiredAccuracy: number;
  maxMisses?: number;
  unlockedBy?: string;
};

export type RhythmModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  exercises: RhythmExercise[];
};

export type BeatEvent = {
  beatIndex: number;
  expectedTimestamp: number;
  shouldTap: boolean;
  wasEvaluated: boolean;
  bpm: number;
  roundIndex?: number;
};

export type UserHitEvent = {
  timestamp: number;
  inputType: InputType;
  key?: string;
};

export type TimingWindows = {
  perfectMs: number;
  goodMs: number;
  earlyLateMs: number;
};

export type TimingResult = {
  beatIndex: number;
  expectedTimestamp: number;
  actualTimestamp?: number;
  timingErrorMs?: number;
  grade: TimingGrade;
  points: number;
  shouldTap: boolean;
};

export type ExerciseAttempt = {
  exerciseId: string;
  startedAt: string;
  finishedAt?: string;
  bpm: number;
  results: TimingResult[];
  score: number;
  maxScore: number;
  accuracy: number;
  comboMax: number;
  misses: number;
  averageTimingErrorMs: number;
  tendency: RhythmTendency;
  completed: boolean;
  passed: boolean;
};

export type RhythmExerciseProgress = {
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestAccuracy: number;
  attempts: number;
  lastAttempt?: ExerciseAttempt;
};

export type RhythmProgress = {
  moduleId: string;
  completed: boolean;
  currentExerciseId: string;
  exercises: Record<string, RhythmExerciseProgress>;
};
