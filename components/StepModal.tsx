import React, { useState } from "react";
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

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (steps: StepCreate[]) => void;
  existingSteps: StepCreate[];
};

const StepModal: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  existingSteps,
}) => {
  const [steps, setSteps] = useState<StepCreate[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [editingStep, setEditingStep] = useState<StepCreate | null>(null);

  const addStep = () => {
    if (!title || !description || !order) return;
    const parsedOrder = parseInt(order);
    if (isNaN(parsedOrder)) return;

    const newStep = { title, description, order: parsedOrder };
    if (editingStep) {
      // Modifier l'étape existante
      setSteps((prev) =>
        prev.map((step) => (step.order === editingStep.order ? newStep : step)),
      );
      setEditingStep(null); // Réinitialiser l'édition
    } else {
      // Ajouter une nouvelle étape
      setSteps((prev) => [...prev, newStep]);
    }
    setTitle("");
    setDescription("");
    setOrder("");
  };

  const handleSave = () => {
    onSave(steps);
    resetAndClose();
  };

  const resetAndClose = () => {
    setSteps([]);
    setTitle("");
    setDescription("");
    setOrder("");
    setEditingStep(null); // Réinitialiser l'édition
    onClose();
  };

  const handleEditStep = (stepToEdit: StepCreate) => {
    setEditingStep(stepToEdit);
    setTitle(stepToEdit.title);
    setDescription(stepToEdit.description);
    setOrder(stepToEdit.order.toString());
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

        <TextInput
          label="Titre"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          style={styles.input}
        />
        <TextInput
          label="Ordre"
          value={order}
          onChangeText={setOrder}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <Button onPress={addStep} mode="outlined" style={styles.input}>
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
