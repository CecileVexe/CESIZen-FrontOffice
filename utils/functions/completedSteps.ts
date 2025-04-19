import { StepWithProgression } from "../types/Step.types";

export const completedStep = (steps: StepWithProgression[]): number => {
  return steps.filter((step) => step.completed === true).length;
};
