import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  Button,
  Chip,
  Divider,
  PaperProvider,
  Text,
  Card,
  IconButton,
} from "react-native-paper";
import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Ressource } from "../../../utils/types/Ressources.types";
import { getRessource } from "../../../services/ressources.service";
import CommentCard from "../../../components/CommentCard";
import { parseStringDate } from "../../../utils/functions/datesFunction";
import { SignedIn, useAuth } from "@clerk/clerk-expo";
import CommentForm from "../../../components/CommentForm";
import { useForm } from "react-hook-form";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { leaveAComment } from "../../../services/comment.service";
import SubscribeToRessource from "../../../components/SubscribeToRessource";
import InviteForm from "../../../components/InviteForm";
import { customTheme } from "../../../utils/theme/theme";
import { addFavorite } from "../../../services/favorite.service";

const RessourceDetails = () => {
  const { isSignedIn } = useAuth();
  const { connectedUser } = useConntedUser();

  const [commentFormVisible, setCommentFormVisible] = useState(false);
  const [subscribeVisible, setSubscribeVisible] = useState(false);
  const [inviteFormVisible, setInviteFormVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const showCommentFormDialog = () => setCommentFormVisible(true);
  const hideCommentFormDialog = () => {
    reset();
    setCommentFormVisible(false);
  };

  const showSubscribeDialog = () => setSubscribeVisible(true);
  const hideSubscribeDialog = () => {
    reset();
    setSubscribeVisible(false);
  };

  const showInviteFormDialog = () => setInviteFormVisible(true);
  const hideInviteFormDialog = () => {
    reset();
    setInviteFormVisible(false);
  };

  const { id } = useLocalSearchParams<Record<string, string>>();

  const [ressource, setRessource] = useState<Ressource | undefined>(undefined);

  const getDatas = async () => {
    const response = await getRessource(id);
    if (response) {
      setRessource(response.data);
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

  const onSubmit = async (data: { title: string; description: string }) => {
    if (connectedUser) {
      const comment = {
        ...data,
        citizenId: connectedUser?.id,
        ressourceId: id,
      };
      try {
        await leaveAComment(comment);
        reset();
        setCommentFormVisible(false);
        getDatas();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getStatusChipStyle = (status: string) => {
    switch (status) {
      case "En cours":
        return { backgroundColor: "#74a5dd" };
      case "Expirée":
        return { backgroundColor: "#6c757d" };
      case "En attente":
        return { backgroundColor: "#ff9800" };
      case "Validée":
        return { backgroundColor: "#4caf50" };
      default:
        return { backgroundColor: "#ccc" };
    }
  };

  const handleAddFavorite = async () => {
    if (connectedUser && ressource) {
      try {
        await addFavorite({
          citizenId: connectedUser.id,
          ressourceId: ressource.id,
        });
      } catch (e) {
        console.error("Erreur lors de l'ajout aux favoris :", e);
      }
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      {ressource && (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.titleContainer}>
                <Text variant="titleLarge" style={styles.title}>
                  {ressource.title}
                </Text>
                <IconButton
                  icon="star-plus"
                  size={24}
                  onPress={handleAddFavorite}
                  style={styles.favoriteButton}
                />
              </View>

              {isSignedIn && (
                <Button
                  mode="contained"
                  onPress={showInviteFormDialog}
                  style={[styles.button, { marginBottom: 10 }]}
                  icon="account-plus"
                >
                  Inviter
                </Button>
              )}

              <Text variant="labelMedium" style={styles.label}>
                {`Date limite : ${parseStringDate(ressource.deadLine)}`}
              </Text>

              <Text variant="labelMedium" style={styles.label}>
                Participants : {ressource.nbParticipant} /{" "}
                {ressource.maxParticipant}
              </Text>

              <View style={styles.badgeContainer}>
                <Chip
                  icon="information"
                  style={[
                    styles.statusChip,
                    getStatusChipStyle(ressource.status),
                  ]}
                >
                  {ressource.status}
                </Chip>

                <Chip icon="tag" style={styles.categoryChip}>
                  {ressource.category.name}
                </Chip>
              </View>

              <Divider style={styles.divider} />

              <Button
                mode="contained"
                onPress={showSubscribeDialog}
                disabled={
                  ressource.nbParticipant === ressource.maxParticipant ||
                  !ressource.isValidate ||
                  ressource.status === "En cours" ||
                  ressource.status === "Expiré" ||
                  connectedUser === undefined
                }
                style={styles.button}
              >
                {!isSignedIn
                  ? "Créez un compte pour vous inscrire"
                  : "S'inscrire"}
              </Button>

              <Text variant="bodyLarge" style={styles.description}>
                {ressource.description}
              </Text>
            </Card.Content>
          </Card>

          <CommentForm
            visible={commentFormVisible}
            hideDialog={hideCommentFormDialog}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
          />

          <InviteForm
            visible={inviteFormVisible}
            hideDialog={hideInviteFormDialog}
            ressourceId={ressource.id}
          />

          <SubscribeToRessource
            visible={subscribeVisible}
            hideDialog={hideSubscribeDialog}
            ressource={ressource}
          />

          <View style={styles.commentHeader}>
            <Text variant="titleMedium" style={styles.commentSectionTitle}>
              Espace commentaire
            </Text>
            {isSignedIn && (
              <Button
                mode="contained"
                onPress={showCommentFormDialog}
                style={styles.commentButton}
                icon="plus"
              >
                Commentaire
              </Button>
            )}
          </View>

          {ressource.comment && (
            <FlatList
              data={ressource.comment}
              keyExtractor={(item) => `${item.title}_card`}
              renderItem={({ item }) => <CommentCard comment={item} />}
              style={styles.commentList}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </View>
      )}
    </PaperProvider>
  );
};

export default RessourceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  title: {
    marginBottom: 8,
    maxWidth: 250,
  },
  label: {
    marginBottom: 4,
    color: "#555",
  },
  divider: {
    marginVertical: 12,
  },
  button: {
    marginTop: 0,
  },
  description: {
    marginTop: 16,
    lineHeight: 20,
    color: "#333",
  },
  commentList: {
    marginTop: 20,
  },
  commentSectionTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  commentButton: {
    borderRadius: 8,
    elevation: 2,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: "flex-start",
    marginRight: 8,
    color: "#fff",
  },
  categoryChip: {
    backgroundColor: "#e3f2fd",
    alignSelf: "flex-start",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  favoriteButton: {
    margin: 0,
    padding: 0,
    alignSelf: "center",
  },
});
