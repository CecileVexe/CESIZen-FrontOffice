import { Card, Checkbox, Text } from "react-native-paper";
import { StepWithProgression } from "../utils/types/Step.types";
import { View } from "react-native";

interface StepCheckerProps {
  step: StepWithProgression;
  onCheckStepChange: (progressionId: string, isCompleted: boolean) => void;
}

const StepCheckerList = (props: StepCheckerProps) => {
  const { step, onCheckStepChange } = props;

  return (
    <Card
      style={{ margin: 8 }}
      onPress={() => onCheckStepChange(step.progressionId, !step.completed)}
    >
      <Card.Content>
        <View style={{ flexDirection: "row" }}>
          <Checkbox
            status={step.completed ? "checked" : "unchecked"}
            onPress={() =>
              onCheckStepChange(step.progressionId, !step.completed)
            }
          />
          <Text variant="titleMedium">{step.title}</Text>
        </View>
        <Text>{step.description}</Text>

        {step.completed && step.dateCompleted && (
          <Text style={{ marginTop: 4, fontStyle: "italic" }}>
            {`Complété le : ${new Date(step.dateCompleted).toLocaleDateString()}`}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

export default StepCheckerList;
