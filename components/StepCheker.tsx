import { Card, Checkbox, Text } from "react-native-paper";
import { StepWithProgression } from "../utils/types/Step.types";
import { FlatList, View } from "react-native";

interface StepCheckerProps {
  steps: StepWithProgression[];
  onCheckStepChange: (progressionId: string, isCompleted: boolean) => void;
}

const StepCheckerList = (props: StepCheckerProps) => {
  const { steps, onCheckStepChange } = props;

  return (
    <FlatList
      data={steps.sort((a, b) => a.order - b.order)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={{ margin: 8 }}>
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                status={item.completed ? "checked" : "unchecked"}
                onPress={() =>
                  onCheckStepChange(item.progressionId, !item.completed)
                }
              />
              <Text variant="titleMedium">{item.title}</Text>
            </View>
            <Text>{item.description}</Text>
            {item.completed && item.dateCompleted && (
              <Text style={{ marginTop: 4, fontStyle: "italic" }}>
                {`Complété le : ${new Date(item.dateCompleted).toLocaleDateString()}`}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}
    />
  );
};

export default StepCheckerList;
