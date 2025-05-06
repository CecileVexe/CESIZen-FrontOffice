import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { Text, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { getArticles } from "../../../services/article.service";
import { getUserFavorite } from "../../../services/favorite.service";
import { useFocusEffect, useRouter } from "expo-router";
import { SignInButton } from "../../../components/SignInButton";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const HomeScreen = () => {
  const { connectedUser } = useConntedUser();

  const router = useRouter();

  const [latestArticle, setLatestArticle] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const articlesRes = await getArticles(1, 1);
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

  const emotions = [
    { label: "Joie", emoji: "😊" },
    { label: "Colère", emoji: "😠" },
    { label: "Peur", emoji: "😨" },
    { label: "Tristesse", emoji: "😢" },
    { label: "Surprise", emoji: "😲" },
    { label: "Dégoût", emoji: "🤢" },
  ];

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Bonjour {connectedUser?.name ?? ""} !</Text>

      <View style={styles.emotionsBox}>
        <Text style={styles.sectionTitle}>
          Comment vous sentez-vous aujourd’hui ?
        </Text>
        <View style={styles.emotionRow}>
          {emotions.map((emo) => (
            <View key={emo.label} style={styles.emotionItem}>
              <Text style={{ fontSize: 24 }}>{emo.emoji}</Text>
              <Text style={styles.emotionLabel}>{emo.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Notre dernière actualité</Text>
      {latestArticle && (
        <Card
          style={styles.articleCard}
          onPress={() => router.push(`(articles)/${latestArticle.id}`)}
        >
          <Card.Content>
            <Text style={styles.articleTitle}>{latestArticle.title}</Text>
            <Text style={styles.articleSubtitle}>
              {latestArticle.description}
            </Text>
            <Chip style={styles.articleChip}>
              {latestArticle.category.name}
            </Chip>
          </Card.Content>
        </Card>
      )}

      <Text style={styles.sectionTitle}>Vos favoris</Text>
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
                <Text style={styles.favoriteTitle}>{item.article.title}</Text>
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
    backgroundColor: "#f5f5f5",
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
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
  },
  emotionLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  articleCard: {
    backgroundColor: "#E0F2E9",
    borderRadius: 16,
    marginBottom: 30,
  },
  articleTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  articleSubtitle: {
    color: "#444",
    marginBottom: 10,
  },
  articleChip: {
    alignSelf: "flex-start",
    backgroundColor: "#B2DFDB",
  },
  favoriteList: {
    paddingBottom: 50,
  },
  favoriteCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 16,
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
