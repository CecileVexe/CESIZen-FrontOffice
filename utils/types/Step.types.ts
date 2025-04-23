export interface Step {
  id: string;
  title: string;
  description: string;
  order: number;
  ressourceId: string;
}

export type StepWithProgression = Step & {
  completed: boolean;
  dateCompleted: string | null;
  progressionId: string;
};

export type StepCreate = Omit<Step, "id" | "ressourceId">;
