export type OfficialProgressStatus = "started" | "completed" | "review";

export type ProgressMutationInput = {
  moduleId: string;
  exerciseId: string;
  score: number;
  accuracy: number;
  status: OfficialProgressStatus;
};

export type ProgressRecord = ProgressMutationInput & {
  id: string;
  ownerUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProgressRepository = {
  getById(id: string): Promise<ProgressRecord | null>;
  saveAttempt(ownerUserId: string, input: ProgressMutationInput): Promise<ProgressRecord>;
};
