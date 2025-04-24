import { useCallback, useEffect, useState, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Card,
  Text,
  PaperProvider,
  useTheme,
  Chip,
  Title,
  Button,
} from "react-native-paper";
import { Link } from "expo-router";
import { Ressource } from "../../../utils/types/Ressources.types";
import { getRessources } from "../../../services/ressources.service";
import { getCategory } from "../../../services/category.service";
import { customTheme } from "../../../utils/theme/theme";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { ActivityIndicator } from "react-native-paper";

const RenderItem = ({ item }: { item: Ressource }) => {
  const { colors } = useTheme();

  return (
    <Link href={`/(ressource)/${item.id}`} asChild>
      <Card style={styles.card} mode="elevated">
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            {item.file ? (
              <Card.Cover
                source={{ uri: `${item.file}` }}
                style={styles.cover}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Image</Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text variant="titleLarge" style={styles.title}>
              {item.title}
            </Text>

            <View style={styles.Participant_progress}>
              <Chip icon="account-group" style={styles.badge}>
                {item.nbParticipant} / {item.maxParticipant} participants
              </Chip>
            </View>

            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.badgeText}>{item.category.name}</Text>
              </View>
            </View>

            <Text variant="bodyMedium">
              Deadline : {new Date(item.deadLine).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>
      </Card>
    </Link>
  );
};

export default function Page() {
  const { connectedUser } = useConntedUser();
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const flatListRef = useRef<FlatList>(null);

  const getDatas = useCallback(async () => {
    setLoading(true);
    const [resRessources, resCategories] = await Promise.all([
      getRessources(page, pageSize), // Passe les paramètres page et pageSize
      getCategory(),
    ]);
    if (resRessources && resCategories) {
      const validated = resRessources.data.filter((r) => r.isValidate);
      setRessources(validated);
      setCategories(resCategories.data);
      if (resRessources.total) {
        setTotalPages(Math.ceil(resRessources.total / pageSize));
      } // Calcul du nombre de pages
    }
    setLoading(false);
  }, [page, pageSize]);

  const filteredRessources = selectedCategory
    ? ressources.filter((r) => r.category.id === selectedCategory)
    : ressources;

  useEffect(() => {
    getDatas();
  }, [getDatas, page]); // Mise à jour des données quand la page change

  // Fonctions de pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Passe à la page suivante
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Revenir en haut
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1); // Passe à la page précédente
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Revenir en haut
    }
  };

  // Fonction pour changer de catégorie et revenir en haut
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 }); // Revenir en haut
  };

  return (
    <PaperProvider theme={customTheme}>
      <View style={styles.container}>
        <Title style={styles.greeting}>Bienvenue dans VivActive !</Title>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <Chip
            style={styles.chip}
            selected={!selectedCategory}
            onPress={() => handleCategoryChange(null)}
          >
            <Text style={styles.badgeText}>Toutes</Text>
          </Chip>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              style={styles.chip}
              selected={selectedCategory === cat.id}
              onPress={() => handleCategoryChange(cat.id)}
            >
              <Text style={styles.badgeText}>{cat.name}</Text>
            </Chip>
          ))}
        </ScrollView>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : filteredRessources.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={filteredRessources}
            keyExtractor={(item) => `${item.title}_card`}
            renderItem={({ item }) => <RenderItem item={item} />}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={getDatas} />
            }
          />
        ) : (
          <Text style={styles.emptyText}>Aucune ressource disponible !</Text>
        )}

        <View style={styles.paginationContainer}>
          <Button onPress={handlePrevPage} disabled={page === 1}>
            Précédent
          </Button>
          <Text>{`Page ${page} sur ${totalPages}`}</Text>
          <Button onPress={handleNextPage} disabled={page === totalPages}>
            Suivant
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 12,
  },
  titleContainer: {
    flex: 0,
    marginBottom: 16,
  },
  filterScroll: {
    marginBottom: 12,
    height: 50,
  },
  chip: {
    color: "#f4f6f8",
    backgroundColor: "#4BA8B4",
    marginRight: 8,
    height: 30,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  imageContainer: {
    width: 115,
    height: 115,
    marginRight: 12,
  },
  cover: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 16,
  },
  Participant: {
    color: "#555",
    marginRight: 8,
  },
  Participant_progress: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#e3f2fd",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
