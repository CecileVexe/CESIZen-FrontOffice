import React, { useEffect, useState } from "react";
import {
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  IconButton,
} from "react-native-paper";
import { View, StyleSheet, FlatList } from "react-native";
import { StepCreate } from "../utils/types/Step.types";
import { useForm, Controller } from "react-hook-form";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (steps: StepCreate[]) => void;
  existingSteps: StepCreate[];
};

type StepForm = {
  title: string;
  description: string;
  order: string;
};

const StepModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  existingSteps,
}) => {
  const [steps, setSteps] = useState<StepCreate[]>([]);
  const [editingStep, setEditingStep] = useState<StepCreate | null>(null);

  const { control, handleSubmit, reset, setValue } = useForm<StepForm>({
    defaultValues: {
      title: "",
      description: "",
      order: "",
    },
  });

  useEffect(() => {
    if (editingStep) {
      setValue("title", editingStep.title);
      setValue("description", editingStep.description);
      setValue("order", editingStep.order.toString());
    }
  }, [editingStep, setValue]);

  const onAddStep = (data: StepForm) => {
    if (!data.title || !data.description || !data.order) return;
    const parsedOrder = parseInt(data.order);
    if (isNaN(parsedOrder)) return;

    const newStep = {
      title: data.title,
      description: data.description,
      order: parsedOrder,
    };

    if (editingStep) {
      setSteps((prev) =>
        prev.map((step) => (step.order === editingStep.order ? newStep : step)),
      );
      setEditingStep(null);
    } else {
      setSteps((prev) => [...prev, newStep]);
    }

    reset();
  };

  const handleSave = () => {
    onSave(steps);
    resetAndClose();
  };

  const resetAndClose = () => {
    reset();
    setSteps([]);
    setEditingStep(null);
    onClose();
  };

  const handleEditStep = (stepToEdit: StepCreate) => {
    setEditingStep(stepToEdit);
  };

  const combinedSteps = [...existingSteps, ...steps].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={resetAndClose}
        contentContainerStyle={styles.modal}
      >
        <Text variant="titleMedium" style={styles.title}>
          Ajouter des étapes
        </Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Titre"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Description"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              multiline
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="order"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Ordre"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />
          )}
        />

        <Button
          onPress={handleSubmit(onAddStep)}
          mode="outlined"
          style={styles.input}
        >
          {editingStep ? "Modifier l'étape" : "Ajouter l'étape"}
        </Button>

        <Text variant="titleSmall" style={{ marginBottom: 8 }}>
          Étapes ajoutées :
        </Text>

        <FlatList
          data={combinedSteps}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.stepItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {item.order}. {item.title}
                </Text>
                <Text>{item.description}</Text>
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <IconButton
                  icon="pencil"
                  onPress={() => handleEditStep(item)}
                />
              </View>
            </View>
          )}
        />

        <View style={styles.actions}>
          <Button onPress={resetAndClose} mode="outlined" style={styles.button}>
            Annuler
          </Button>
          <Button onPress={handleSave} mode="contained" style={styles.button}>
            Valider les étapes
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 10,
  },
  input: {
    marginVertical: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
});

export default StepModal;
