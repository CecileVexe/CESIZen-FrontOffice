import React, { useState } from "react";
import { ScrollView, Image, View, StyleSheet } from "react-native";
import { Text, Chip, IconButton, useTheme } from "react-native-paper";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getArticle } from "../../../services/article.service";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { addFavorite } from "../../../services/favorite.service";
import { useConnectedUser } from "../../../utils/ConnectedUserContext";
import { LogBox } from "react-native";

LogBox.ignoreLogs([/Support for defaultProps will be removed/]);

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<Record<string, string>>();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const { connectedUser } = useConnectedUser();

  const [article, setArticle] = useState<any>(null);

  const getDatas = async () => {
    const response = await getArticle(id);
    if (response) {
      setArticle(response.data);
    }
  };

  const handleAddFavorite = async () => {
    if (connectedUser && article) {
      try {
        await addFavorite({
          userId: connectedUser.id,
          articleId: article.id,
        });
      } catch (e) {
        console.error("Erreur lors de l'ajout aux favoris :", e);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      getDatas();

      return () => {
        isActive = false;
      };
    }, [id]),
  );

  return (
    article && (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {article.title}
          </Text>
          <IconButton icon="heart-plus" size={24} onPress={handleAddFavorite} />
        </View>

        <Chip style={styles.chip}>{article.category.name}</Chip>

        {article.bannerId && (
          <Image
            source={{ uri: `${BASE_URL}image/${article.bannerId}` }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Text
          variant="titleMedium"
          style={{ ...styles.readTime, color: colors.primary }}
        >{`Lecture ${article.readingTime} min`}</Text>
        <RenderHtml
          contentWidth={width}
          source={{ html: article.content }}
          baseStyle={styles.content}
        />
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    // color: "#2A8C6D",
  },
  chip: {
    alignSelf: "flex-start",
    marginVertical: 8,
    // backgroundColor: "#C3EAD9",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
  },
  readTime: {
    // color: "#6ABFAD",
    fontWeight: "500",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    // color: "#444",
    lineHeight: 22,
  },
});
