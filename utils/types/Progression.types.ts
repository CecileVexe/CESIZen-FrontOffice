import { Step } from "./Step.types";

export interface Progression {
  id: string;
  completed: boolean;
  dateCompleted: string | null;
  step: Step;
  ressourceId: string;
  createdAt: string;
  updatedAt: string;
}
