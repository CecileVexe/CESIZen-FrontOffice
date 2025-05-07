import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Chip,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRoute } from "@react-navigation/native";
import { getUserJournalEntry } from "../../../services/journalEntry.service";
import { getEmotionCategories } from "../../../services/emotionCategories.service";
import { getEmotions } from "../../../services/emotions.service";
import { EmotionCategory } from "../../../utils/types/EmotionCategory";
import { Emotion } from "../../../utils/types/Emotion.types";

const EmotionFormScreen = () => {
  const route = useRoute();
  const entryId = route.params?.id || null;
  const selectedCategoryFromParams = route.params?.categoryId || null;

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
  const [selectedEmotionId, setSelectedEmotionId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!loading && emotionCategories.length > 0) {
      if (route.params?.categoryId) {
        setSelectedCategoryId(route.params.categoryId);
      } else {
        const joyCategory = emotionCategories.find((c) => c.name === "Joie");
        if (joyCategory) setSelectedCategoryId(joyCategory.id);
      }
    }

    return () => {
      setSelectedCategoryId(null);
    };
  }, [route.params?.categoryId, loading, emotionCategories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, emotionsRes] = await Promise.all([
          getEmotionCategories(),
          getEmotions(),
        ]);
        if (categoriesRes?.data && emotionsRes?.data) {
          setEmotionCategories(categoriesRes.data);
          setEmotions(emotionsRes.data);
        }

        if (entryId) {
          const entryRes = await getUserJournalEntry(entryId);
          if (entryRes) {
            const { emotionId, description } = entryRes?.data;
            setValue("emotionId", emotionId);
            setValue("description", description);
            setSelectedEmotionId(emotionId);
            const emotion = emotionsRes?.data.find((e) => e.id === emotionId);
            const category = categoriesRes?.data.find(
              (c) => c.name === emotion?.emotionCategory?.name,
            );
            if (category) setSelectedCategoryId(category.id);
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
        setLoading(false);
      }
    };
    fetchData();
  }, [entryId]);

  useEffect(() => {
    setSelectedEmotionId("");
    setValue("emotionId", "");
  }, [selectedCategoryId]);

  const onSubmit = async (data) => {
    if (!data.emotionId) {
      setError("emotionId", {
        type: "manual",
        message: "Veuillez sélectionner une émotion.",
      });
      return;
    }

    const payload = {
      ...data,
      description: data.description.trim() === "" ? null : data.description,
    };

    try {
      if (entryId) {
        console.log("Update", entryId, payload);
      } else {
        console.log("Create", payload);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  const renderEmotionCategories = () => (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
      }}
    >
      {emotionCategories.map((cat) => (
        <View key={cat.id} style={{ alignItems: "center" }}>
          <IconButton
            icon={cat.smiley}
            size={32}
            iconColor={cat.color}
            onPress={() => setSelectedCategoryId(cat.id)}
          />
          <Text style={{ color: cat.color, fontSize: 12 }}>{cat.name}</Text>
        </View>
      ))}
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
                  clearErrors("emotionId"); // on enlève l'erreur si on sélectionne une émotion
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

  const renderEmotionCategoriesIcons = () => (
    <View style={styles.emotionsBox}>
      <View style={styles.emotionRow}>
        {emotionCategories.map((cat) => (
          <View key={cat.id} style={styles.emotionItem}>
            <IconButton
              icon={cat.smiley}
              size={32}
              iconColor={cat.color}
              style={{ margin: 0, padding: 0 }}
            />
            <Text
              variant="labelSmall"
              style={[styles.emotionLabel, { color: cat.color }]}
            >
              {cat.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEmotions = () => {
    return emotionCategories.map((category) => {
      const relatedEmotions = emotions.filter(
        (e) => e.emotionCategory?.name === category.name,
      );
      return (
        <View key={category.id} style={{ marginBottom: 16 }}>
          <Text variant="titleMedium">
            {category.smiley ? `${category.smiley} ` : ""}
            {category.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            {relatedEmotions.map((emotion) => (
              <Chip
                key={emotion.id}
                selected={selectedEmotionId === emotion.id}
                onPress={() => {
                  setSelectedEmotionId(emotion.id);
                  setValue("emotionId", emotion.id);
                }}
                style={{ backgroundColor: emotion.color }}
                textStyle={{ color: "white" }}
              >
                {emotion.name}
              </Chip>
            ))}
          </View>
        </View>
      );
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text
        variant="titleLarge"
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        Tracker d'émotion
      </Text>

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
        <Button mode="outlined" onPress={() => reset()}>
          Annuler
        </Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Valider
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emotionsBox: {
    marginBottom: 24,
  },
  emotionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  emotionItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  emotionLabel: {
    marginTop: -8,
    textAlign: "center",
  },
});

export default EmotionFormScreen;
