import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View, StyleSheet } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import { Link } from "expo-router";

import { Ressource } from "../../../utils/types/Ressources.types";
import { getRessources } from "../../../services/ressources.service";
import { SignOutButton } from "../../../components/SignOutButton";

const renderItem = ({ item }: { item: Ressource }) => {
  const progress = item.nbParticipant / item.maxParticipant;
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
              <Text variant="bodyMedium" style={styles.Participant}>
                {item.nbParticipant} / {item.maxParticipant}
              </Text>
               <ProgressBar
                progress={progress}
                color="#74a5dd"
                style={styles.progressBar}
                />
            </View>
            
            <View style={styles.badgeContainer}>
              <View style={[styles.categoryBadge]}>
                <Text style={styles.badgeText}>{item.category.name}</Text>
              </View>
            </View>

            <Text variant="bodyMedium">
              {new Date(item.deadLine).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>
      </Card>
    </Link>
  );
};

export default function Page() {
  const [ressources, setRessources] = useState<Ressource[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const getDatas = useCallback(async () => {
    setLoading(true);

    const response = await getRessources();
    if (response) {
      const validatedRessources = response.data.filter(
        (ressource) => ressource.isValidate
      );
      setRessources(validatedRessources);
    }
    setLoading(false);
  }, []);

  const onRefresh = useCallback(() => {
    getDatas();
  }, [getDatas]);

  useEffect(() => {
    getDatas();
  }, [getDatas]);

  return (
    <View>
      <SignOutButton />
      {ressources ? (
        <FlatList
          data={ressources}
          keyExtractor={(item) => `${item.title}_card`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.emptyText}>Aucune ressource disponible !</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 12,
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
    width: 150,
    height: 150,
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  progressBar: {
    height: 15,
    borderRadius: 3,
    flex: 1,
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
    backgroundColor: "#74a5dd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
