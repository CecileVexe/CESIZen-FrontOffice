import { useCallback, useEffect, useState, useRef } from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import {
  Card,
  Text,
  Title,
  Chip,
  Button,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { getArticles } from "../../../services/article.service";
import { Link } from "expo-router";
import { Article } from "../../../utils/types/Article.types";
import { Category } from "../../../utils/types/Category.types";
import { getCategories } from "../../../services/category.service";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function InfoPage() {
  const { colors } = useTheme();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const flatListRef = useRef<FlatList>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const res = await getArticles(
      page,
      pageSize,
      selectedCategory || undefined,
    );
    if (res?.data) {
      setArticles(res.data);
      setTotalPages(Math.ceil(res.total / pageSize));
    }
    setLoading(false);
  }, [page, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    const res = await getCategories();
    if (res) {
      setCategories(res.data);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const RenderArticle = ({ item }: { item: Article }) => {
    return (
      <Link href={`/${item.id}`} asChild>
        <Card style={styles.card} theme={{ roundness: 15 }} mode="elevated">
          {item.bannerId && (
            <Card.Cover
              source={{ uri: `${BASE_URL}image/${item.bannerId}` }}
              style={styles.cover}
            />
          )}
          <Card.Content>
            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
            <View style={styles.footer}>
              <Chip textStyle={{ fontSize: 10 }}>{item.category.name}</Chip>
              <Text
                variant="titleMedium"
                style={{ ...styles.readTime, color: colors.primary }}
              >{`Lecture ${item.readingTime} min`}</Text>
            </View>
          </Card.Content>
        </Card>
      </Link>
    );
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Title style={styles.header}>Informations</Title>

      <FlatList
        data={[{ id: null, name: "Toutes" }, ...categories]}
        horizontal
        keyExtractor={(item) => item.id ?? "all"}
        contentContainerStyle={styles.categoryList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item.id}
            onPress={() => handleCategoryChange(item.id)}
            style={[
              styles.categoryChipItem,
              selectedCategory === item.id
                ? { backgroundColor: colors.tertiaryContainer }
                : {},
            ]}
          >
            {item.name}
          </Chip>
        )}
      />

      {loading ? (
        <ActivityIndicator animating size="large" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RenderArticle item={item} />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchArticles} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.pagination}>
        <Button
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Précédent
        </Button>
        <Text>{`Page ${page} / ${totalPages}`}</Text>
        <Button
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  listContent: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 15,
  },
  cover: {
    height: 150,
  },
  placeholder: {
    height: 150,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
  },
  title: {
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  readTime: {
    fontStyle: "italic",
    fontSize: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryChipItem: {
    marginRight: 8,
    height: 30,
  },
});
