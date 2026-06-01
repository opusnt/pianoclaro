import type { LearningExperienceTrackId } from "@/types/learning-path";

export type LearningExperienceStatus = "draft" | "active";

export type LearningPageKind =
  | "intro"
  | "discover"
  | "guided-practice"
  | "challenge"
  | "checkpoint"
  | "repair"
  | "application";

export type LearningActivityType =
  | "observe_pattern"
  | "listen_compare"
  | "tap_notes"
  | "tap_rhythm"
  | "build_pattern"
  | "choose_answer"
  | "play_sequence"
  | "confirm_chord"
  | "guided_improvisation"
  | "self_check"
  | "repair_drill"
  | "transfer_challenge";

export type LearningActivityInputMode =
  | "none"
  | "virtual-keyboard"
  | "computer-keyboard"
  | "audio-choice"
  | "multiple-choice"
  | "tap-rhythm"
  | "free-play";

export type LearningActivityFeedbackMode =
  | "visual"
  | "audio"
  | "timing"
  | "answer-check"
  | "hint"
  | "reflection";

export type LearningActivity = {
  id: string;
  type: LearningActivityType;
  title: string;
  prompt: string;
  userAction: string;
  inputModes: LearningActivityInputMode[];
  feedbackModes: LearningActivityFeedbackMode[];
  successCriteria: string[];
  repairHint?: string;
  estimatedSeconds?: number;
};

export type LearningPage = {
  id: string;
  order: number;
  kind: LearningPageKind;
  title: string;
  goal: string;
  activities: LearningActivity[];
  unlocksNextWhen: string[];
};

export type LearningExperience = {
  id: string;
  unitId: string;
  trackId: LearningExperienceTrackId;
  status: LearningExperienceStatus;
  title: string;
  entryRoute: string;
  summary: string;
  pages: LearningPage[];
};
