import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Chip,
  ActivityIndicator,
  IconButton,
  useTheme,
  Portal,
  Dialog,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRoute } from "@react-navigation/native";
import {
  createUserJournalEntry,
  deleteUserJournalEntry,
  getUserJournalEntryByDate,
  updateUserJournalEntry,
} from "../../../services/journalEntry.service";
import { getEmotionCategories } from "../../../services/emotionCategories.service";
import { getEmotions } from "../../../services/emotions.service";
import { EmotionCategory } from "../../../utils/types/EmotionCategory";
import { Emotion } from "../../../utils/types/Emotion.types";
import { useConnectedUser } from "../../../utils/ConnectedUserContext";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

const EmotionFormScreen = () => {
  const route = useRoute();
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const entryDate = route.params?.date || null;
  const selectedCategoryFromParams = route.params?.categoryId || null;
  const { connectedUser } = useConnectedUser();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emotionId: "",
      description: "",
    },
  });

  const [emotionCategories, setEmotionCategories] = useState<EmotionCategory[]>(
    [],
  );
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedEmotionId, setSelectedEmotionId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [entryId, setEntryId] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   if (!loading && emotionCategories.length > 0) {
  //     if (route.params?.categoryId) {
  //       setSelectedCategoryId(route.params.categoryId);
  //     } else {
  //       const joyCategory = emotionCategories.find((c) => c.name === "Joie");
  //       if (joyCategory) setSelectedCategoryId(joyCategory.id);
  //     }
  //   }

  //   return () => {
  //     setSelectedCategoryId(null);
  //   };
  // }, [route.params?.categoryId, loading, emotionCategories]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setLoading(true);
        reset({
          emotionId: "",
          description: "",
        });
        setEntryId(undefined);
        setSelectedEmotionId("");
        try {
          const [categoriesRes, emotionsRes] = await Promise.all([
            getEmotionCategories(),
            getEmotions(),
          ]);

          if (!isActive) return;

          if (categoriesRes?.data && emotionsRes?.data) {
            setEmotionCategories(categoriesRes.data);
            setEmotions(emotionsRes.data);
          }

          if (connectedUser) {
            const dateToUse =
              entryDate || new Date().toISOString().split("T")[0];

            const entryRes = await getUserJournalEntryByDate(
              dateToUse,
              connectedUser.id,
            );

            if (entryRes?.data) {
              const { emotionId, description, id } = entryRes.data;
              setEntryId(id);
              setValue("emotionId", emotionId);
              setValue("description", description);
              setSelectedEmotionId(emotionId);

              const emotion = emotionsRes?.data.find((e) => e.id === emotionId);
              const category = categoriesRes?.data.find(
                (c) => c.name === emotion?.emotionCategory?.name,
              );
              if (category) setSelectedCategoryId(category.id);
            } else if (selectedCategoryFromParams) {
              setSelectedCategoryId(selectedCategoryFromParams);
            } else {
              const joyCategory = categoriesRes?.data.find(
                (c) => c.name === "Joie",
              );
              if (joyCategory) setSelectedCategoryId(joyCategory.id);
            }
          } else if (selectedCategoryFromParams) {
            setSelectedCategoryId(selectedCategoryFromParams);
          } else {
            const joyCategory = categoriesRes?.data.find(
              (c) => c.name === "Joie",
            );
            if (joyCategory) setSelectedCategoryId(joyCategory.id);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données :", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [connectedUser, entryDate, reset, selectedCategoryFromParams, setValue]),
  );

  const updateEntry = async (entryId: string, payload) => {
    const reponse = await updateUserJournalEntry(entryId, payload);
    if (reponse?.data) {
      router.navigate("/(journal)");
    } else {
      console.error(reponse);
    }
  };

  const createEntry = async (payload) => {
    const reponse = await createUserJournalEntry(payload);
    if (reponse?.data) {
      router.navigate("/(journal)");
    } else {
      console.error(reponse);
    }
  };

  const onSubmit = async (data) => {
    if (!data.emotionId) {
      setError("emotionId", {
        type: "manual",
        message: "Veuillez sélectionner une émotion.",
      });
      return;
    }

    if (connectedUser) {
      const payload = {
        ...data,
        description: data.description?.trim() === "" ? null : data.description,
        userId: connectedUser.id,
        date: entryDate ? new Date(entryDate) : new Date(),
      };
      try {
        if (entryId) {
          updateEntry(entryId, payload);
        } else {
          createEntry(payload);
        }
      } catch (error) {
        console.error("Erreur lors de la soumission :", error);
      }
    }
  };

  const renderEmotionCategories = () => (
    <View style={styles.emotionsBox}>
      <Text variant="titleSmall" style={styles.sectionTitle}>
        Comment vous sentez-vous aujourd’hui ?
      </Text>
      <View style={styles.emotionRow}>
        {emotionCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <View key={cat.id} style={styles.emotionItem}>
              <IconButton
                icon={cat.smiley}
                size={32}
                iconColor={isSelected ? cat.color : "#ccc"}
                style={{ margin: 0, padding: 0 }}
                onPress={() => {
                  setSelectedEmotionId("");
                  setValue("emotionId", "");
                  setSelectedCategoryId(cat.id);
                }}
              />
              <Text
                style={{
                  color: isSelected ? cat.color : "#ccc",
                  fontSize: 11,
                  marginTop: 4,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                {cat.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderSelectedCategoryEmotions = () => {
    if (!selectedCategoryId) return null;

    const selectedCategory = emotionCategories.find(
      (c) => c.id === selectedCategoryId,
    );
    const relatedEmotions = emotions.filter(
      (e) => e.emotionCategory?.name === selectedCategory?.name,
    );

    return (
      <View style={{ marginBottom: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          {selectedCategory?.name}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {relatedEmotions.map((emotion) => (
            <Chip
              key={emotion.id}
              selected={selectedEmotionId === emotion.id}
              onPress={() => {
                if (selectedEmotionId === emotion.id) {
                  setSelectedEmotionId("");
                  setValue("emotionId", "");
                } else {
                  setSelectedEmotionId(emotion.id);
                  setValue("emotionId", emotion.id);
                  clearErrors("emotionId");
                }
              }}
              style={{ backgroundColor: emotion.color }}
              textStyle={{ color: "white" }}
            >
              {emotion.name}
            </Chip>
          ))}
        </View>

        {errors.emotionId && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 8 }}>
            {errors.emotionId.message}
          </Text>
        )}
      </View>
    );
  };

  const handleDeleteEntry = async () => {
    if (entryId) {
      const response = await deleteUserJournalEntry(entryId);
      if (response?.statusCode === 200) {
        hideDialog();
        router.replace("(0-home)");
      } else {
        console.error(response.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        variant="titleLarge"
        style={{
          textAlign: "center",
          marginBottom: 16,
          color: colors.primary,
          fontWeight: 800,
        }}
      >
        Tracker d'émotion
      </Text>
      <View style={styles.dateView}>
        <Text variant="labelLarge">
          {entryDate
            ? new Date(entryDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                year: "numeric",
                month: "long",
                weekday: "long",
              })
            : new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                year: "numeric",
                month: "long",
                weekday: "long",
              })}
        </Text>
        {entryId && (
          <IconButton
            icon={"trash-can"}
            iconColor={colors.error}
            onPress={() => showDialog()}
            style={{ padding: 0, margin: 0 }}
          />
        )}
      </View>

      {renderEmotionCategories()}
      {renderSelectedCategoryEmotions()}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Raconte ta journée"
            multiline
            numberOfLines={5}
            mode="outlined"
            value={value}
            onChangeText={onChange}
            style={{ marginTop: 16 }}
          />
        )}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        <Button
          mode="outlined"
          onPress={() => {
            reset();
            setEntryId(undefined);
            entryId
              ? router.navigate("/(journal)")
              : router.navigate("/(0-home)");
          }}
        >
          Annuler
        </Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {entryId ? "Modifier" : "Valider"}
        </Button>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmer la suppression</Dialog.Title>
          <Dialog.Content>
            <Text>
              Es-tu sûr de vouloir supprimer cette entrée de journal ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Annuler</Button>
            <Button onPress={handleDeleteEntry}>Supprimer</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  emotionsBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: "700",
  },
  emotionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  emotionItem: {
    alignItems: "center",
    justifyContent: "space-around",
  },
  emotionLabel: {
    marginTop: -8,
    textAlign: "center",
  },
  dateView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default EmotionFormScreen;
