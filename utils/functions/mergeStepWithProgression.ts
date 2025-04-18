import { Progression } from "../types/Progression.types";
import { Step, StepWithProgression } from "../types/Step.types";

export const mergeStepsWithProgressions = (
  steps: Step[],
  progressions: Progression[]
): StepWithProgression[] => {
  return steps
    .map((step) => {
      const progression = progressions.find(
        (p) => p.step.id === step.id && p.ressourceId === step.ressourceId
      );
      if (progression) {
        return {
          ...step,
          completed: progression.completed ?? false,
          dateCompleted: progression.dateCompleted ?? null,
          progressionId: progression.id,
        };
      }
      return undefined;
    })
    .filter((s): s is StepWithProgression => s !== undefined);
};
