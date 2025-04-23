import React, { useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  PaperProvider,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { getCategory } from "../../../services/category.service";
import { getTypeRessource } from "../../../services/typeRessource.service";
import { Picker } from "@react-native-picker/picker";
import StepModal from "../../../components/StepModal";
import { createRessource } from "../../../services/ressources.service";
import { useRouter } from "expo-router";
import { StepCreate } from "../../../utils/types/Step.types";

type FormData = {
  title: string;
  description: string;
  maxParticipant: string;
  deadLine: string;
  categoryId: string;
  typeRessourceId: string;
};

const RessourceForm = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      maxParticipant: "",
      deadLine: "",
      categoryId: "",
      typeRessourceId: "",
    },
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      step: steps,
    };

    console.log(payload);

    const response = await createRessource(payload);
    if (response && response.data) {
      reset();
      router.push(`/(ressource)/${response?.data.id}`);
    }
  };

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [types, setTypes] = useState<{ id: string; name: string }[]>([]);

  const getCategoryOption = useCallback(async () => {
    const result = await getCategory();
    if (result?.data) {
      setCategories(result?.data);
    }
  }, []);

  const getTypeRessourceOption = useCallback(async () => {
    const result = await getTypeRessource();
    if (result?.data) {
      setTypes(result?.data);
    }
  }, []);

  useEffect(() => {
    getCategoryOption();
    getTypeRessourceOption();
  }, [getCategoryOption, getTypeRessourceOption]);

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
  const typeOptions = types.map((type) => ({
    label: type.name,
    value: type.id,
  }));

  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [steps, setSteps] = useState<StepCreate[]>([]);

  const handleStepsSave = (newSteps: typeof steps) => {
    setSteps((prevSteps) => [...prevSteps, ...newSteps]);
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <StepModal
          visible={stepModalVisible}
          onClose={() => setStepModalVisible(false)}
          onSave={handleStepsSave}
          existingSteps={steps}
        />
        <Text variant="titleLarge" style={styles.title}>
          Créer une ressource
        </Text>

        <Controller
          control={control}
          name="title"
          rules={{ required: "Titre requis" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Titre"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={!!errors.title}
              style={styles.input}
            />
          )}
        />
        <HelperText type="error" visible={!!errors.title}>
          {errors.title?.message}
        </HelperText>

        <Controller
          control={control}
          name="description"
          rules={{ required: "Description requise" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Description"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              multiline
              error={!!errors.description}
              style={styles.input}
            />
          )}
        />
        <HelperText type="error" visible={!!errors.description}>
          {errors.description?.message}
        </HelperText>

        <Controller
          control={control}
          name="maxParticipant"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Participants max"
              value={value?.toString()}
              onChangeText={(v) => onChange(parseInt(v) || undefined)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />
          )}
        />
        <Text>Date limite</Text>
        <Controller
          control={control}
          name="deadLine"
          rules={{ required: "Date requis" }}
          render={({ field: { value } }) => (
            <>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                {value
                  ? new Date(value).toLocaleDateString()
                  : "Choisir une date limite"}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setValue("deadLine", selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          rules={{ required: "Catégorie requise" }}
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Catégorie</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Picker.Item label="Sélectionnez une catégorie..." value="" />
                  {categoryOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
              <HelperText type="error" visible={!!errors.categoryId}>
                {errors.categoryId?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          name="typeRessourceId"
          rules={{ required: "Type requis" }}
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Type de ressource</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Picker.Item label="Sélectionnez un type..." value="" />
                  {typeOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
              <HelperText type="error" visible={!!errors.typeRessourceId}>
                {errors.typeRessourceId?.message}
              </HelperText>
            </>
          )}
        />
        <Button
          mode="outlined"
          onPress={() => setStepModalVisible(true)}
          style={styles.button}
        >
          Ajouter des étapes
        </Button>

        {steps.length > 0 && (
          <View style={styles.stepListContainer}>
            <Text variant="titleMedium" style={styles.stepListTitle}>
              Étapes ajoutées :
            </Text>
            {steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <Text style={styles.stepOrder}>{step.order}.</Text>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                  <Button
                    onPress={() => {
                      setSteps((prev) => prev.filter((_, i) => i !== index));
                    }}
                    mode="text"
                    textColor="red"
                  >
                    Supprimer
                  </Button>
                </View>
              ))}
          </View>
        )}

        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Créer
        </Button>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
  divider: {
    marginVertical: 25,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
  },
  stepListContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  stepListTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  stepOrder: {
    fontWeight: "bold",
    marginRight: 8,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  stepDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default RessourceForm;
