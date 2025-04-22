import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Divider,
  useTheme,
  HelperText,
} from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Menu } from "react-native-paper";
import { useEffect, useState } from "react";
import { getCategory } from "../../../services/category.service";
import { getTypeRessource } from "../../../services/typeRessource.service";
import { Picker } from "@react-native-picker/picker";

type FormData = {
  title: string;
  description: string;
  maxParticipant: string;
  deadLine: string;
  categoryId: string;
  typeRessourceId: string;
};

const RessourceForm = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [types, setTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text>Date limite (optionnel)</Text>
      <Controller
        control={control}
        name="deadLine"
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

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Créer
      </Button>
    </ScrollView>
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
});

export default RessourceForm;
