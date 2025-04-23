import { Checkbox, Divider, Text, TouchableRipple } from "react-native-paper";
import { StepWithProgression } from "../utils/types/Step.types";
import { View, StyleSheet } from "react-native";

interface StepCheckerProps {
  step: StepWithProgression;
  onCheckStepChange: (progressionId: string, isCompleted: boolean) => void;
}

const StepCheckerList = ({ step, onCheckStepChange }: StepCheckerProps) => {
  const isCompleted = step.completed;

  const handlePress = () => {
    onCheckStepChange(step.progressionId, !isCompleted);
  };

  return (
    <View>
      <TouchableRipple onPress={handlePress} rippleColor="rgba(0, 0, 0, .1)">
        <View style={styles.stepContainer}>
          <Checkbox
            status={isCompleted ? "checked" : "unchecked"}
            onPress={handlePress}
          />

          <View style={styles.textContainer}>
            <Text
              variant="titleSmall"
              style={[styles.title, isCompleted && styles.completedTitle]}
            >
              {step.title}
            </Text>
            <Text style={styles.description}>{step.description}</Text>
            {isCompleted && step.dateCompleted && (
              <Text style={styles.date}>
                Complété le : {new Date(step.dateCompleted).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableRipple>
      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  title: {
    fontWeight: "600",
    marginBottom: 2,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  description: {
    color: "#555",
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 12,
  },
});

export default StepCheckerList;
