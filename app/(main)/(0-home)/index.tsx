import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useConnectedUser } from "../../../utils/ConnectedUserContext";
import { getArticles } from "../../../services/article.service";
import { getUserFavorite } from "../../../services/favorite.service";
import { useFocusEffect, useRouter } from "expo-router";
import { SignInButton } from "../../../components/SignInButton";
import { getEmotionCategories } from "../../../services/emotionCategories.service";
import { EmotionCategory } from "../../../utils/types/EmotionCategory";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const HomeScreen = () => {
  const { colors } = useTheme();
  const { connectedUser } = useConnectedUser();

  const router = useRouter();

  const [latestArticle, setLatestArticle] = useState<any>(null);
  const [emotionCategories, setEmotionCategories] = useState<EmotionCategory[]>(
    [],
  );
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const articlesRes = await getArticles(1, 1);
        const emotionRes = await getEmotionCategories();
        if (emotionRes?.data) {
          setEmotionCategories(emotionRes.data);
        }

        if (articlesRes?.data?.length) {
          setLatestArticle(articlesRes.data[0]);
        }

        if (connectedUser?.id) {
          const favoritesRes = await getUserFavorite(connectedUser.id);

          if (favoritesRes?.data) {
            setFavorites(favoritesRes.data);
          }
        }

        setLoading(false);
      };

      fetchData();
    }, [connectedUser?.id]),
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Bonjour {connectedUser?.name ?? ""} !</Text>

      <View style={styles.emotionsBox}>
        <Text variant="titleSmall" style={styles.sectionTitle}>
          Comment vous sentez-vous aujourd’hui ?
        </Text>
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

      <Text
        variant="titleMedium"
        style={{ ...styles.sectionTitle, color: colors.primary }}
      >
        Notre dernière actualité
      </Text>
      {latestArticle && (
        <Card
          style={{ ...styles.articleCard, backgroundColor: colors.primary }}
          contentStyle={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            justifyContent: "space-evenly",
          }}
          onPress={() => router.push(`(articles)/${latestArticle.id}`)}
        >
          <Card.Cover
            source={require("../../../assets/inspire-idea.png")}
            style={{
              height: 90,
              width: 90,
              backgroundColor: colors.primary,
            }}
          />
          <Card.Content style={{ width: "70%", padding: 8 }}>
            <Text
              variant="labelMedium"
              style={{ ...styles.articleTitle, color: colors.onPrimary }}
            >
              {latestArticle.title}
            </Text>
            <Text
              variant="bodySmall"
              style={{ ...styles.articleSubtitle, color: colors.onPrimary }}
            >
              {latestArticle.description}
            </Text>
            <Chip
              style={{
                ...styles.articleChip,
                backgroundColor: colors.onPrimary,
              }}
              textStyle={{ color: colors.primary, fontSize: 8 }}
            >
              {latestArticle.category.name}
            </Chip>
          </Card.Content>
        </Card>
      )}

      <Text
        variant="titleMedium"
        style={{ ...styles.sectionTitle, color: colors.primary }}
      >
        Vos favoris
      </Text>
      {connectedUser ? (
        <FlatList
          data={favorites}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.favoriteList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              style={styles.favoriteCard}
              onPress={() => router.push(`(articles)/${item.article.id}`)}
            >
              {item.article.bannerId && (
                <Card.Cover
                  source={{ uri: `${BASE_URL}image/${item.article.bannerId}` }}
                  style={{ height: 150 }}
                />
              )}
              <Card.Content>
                <Text
                  style={{ ...styles.favoriteTitle, color: colors.primary }}
                >
                  {item.article.title}
                </Text>
                <Text style={styles.favoriteDescription} numberOfLines={3}>
                  {item.article.description}
                </Text>
                <Text style={styles.readTime}>
                  {`Lecture ${item.article.readingTime} min`}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <View>
          <Text>Veuillez vous connecter pour ajouter des favoris</Text>
          <SignInButton />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dateText: {
    textAlign: "center",
    marginBottom: 10,
    color: "#444",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontWeight: "700",
  },
  emotionsBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
    fontSize: 11,
    marginTop: 4,
    fontWeight: "700",
    textAlign: "center",
  },
  articleCard: {
    borderRadius: 16,
    marginBottom: 30,
  },
  articleTitle: {
    marginBottom: 4,
  },
  articleSubtitle: {
    marginBottom: 10,
  },
  articleChip: {
    alignSelf: "flex-start",
  },
  favoriteList: {
    paddingBottom: 50,
  },
  favoriteCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "space-evenly",
  },
  favoriteTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 10,
  },
  favoriteDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  readTime: {
    fontSize: 12,
    marginTop: 8,
    color: "#009688",
  },
});

export default HomeScreen;
