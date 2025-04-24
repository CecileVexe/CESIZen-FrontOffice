import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  ScrollView,
} from "react-native";
import {
  Title,
  Divider,
  IconButton,
  Text,
  PaperProvider,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter, Redirect, useFocusEffect } from "expo-router";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { getUserInvite } from "../../../services/invite.service";
import { Invite } from "../../../utils/types/invite.types";
import { SignOutButton } from "../../../components/SignOutButton";
import InviteModal from "../../../components/InviteModal";
import InviteCard from "../../../components/invitationsCard";
import {
  deleteFavorite,
  getUserFavorite,
} from "../../../services/favorite.service";
import { Favorite } from "../../../utils/types/Favorite.types";
import FavoriteCard from "../../../components/FavoriteCard";
import FavoriteDeleteModal from "../../../components/FavoriteDeleteModal";
import RessourceCard from "../../../components/RessourceCard";
import {
  deleteRessource,
  getUserRessource,
  updateRessource,
} from "../../../services/ressources.service";
import { customTheme } from "../../../utils/theme/theme";

const UserPage = () => {
  const { userChoseToUnconnect, connectedUser, refreshConnectedUser } =
    useConntedUser();
  const [isLoading, setIsLoading] = useState(true);
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);
  const [userRessources, setUserRessources] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const [favoriteToDelete, setFavoriteToDelete] = useState<Favorite | null>(
    null,
  );
  const [isFavoriteDialogVisible, setIsFavoriteDialogVisible] = useState(false);

  const router = useRouter();
  const fetchInvites = async () => {
    if (!connectedUser) return;

    const invites = await getUserInvite(connectedUser.id);
    if (invites) {
      const { data: invitesData } = invites;

      setSentInvites(
        invitesData.filter((i: Invite) => i.sender.id === connectedUser.id),
      );
      setReceivedInvites(
        invitesData.filter((i: Invite) => i.recever.id === connectedUser.id),
      );
    }
  };

  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const fetchFavorites = useCallback(async () => {
    if (connectedUser) {
      const res = await getUserFavorite(connectedUser.id);
      if (res?.data) setFavorites(res.data);
    }
  }, [connectedUser]);

  const fetchUserRessource = useCallback(async () => {
    if (connectedUser) {
      const res = await getUserRessource(connectedUser.id);
      if (res?.data) setUserRessources(res.data);
    }
  }, [connectedUser]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAll = async () => {
        setIsLoading(true);
        await refreshConnectedUser();
        if (connectedUser) {
          const invites = await getUserInvite(connectedUser.id);
          const favorites = await getUserFavorite(connectedUser.id);
          const ressources = await getUserRessource(connectedUser.id);

          if (isActive) {
            if (invites?.data) {
              setSentInvites(
                invites.data.filter((i) => i.sender.id === connectedUser.id),
              );
              setReceivedInvites(
                invites.data.filter((i) => i.recever.id === connectedUser.id),
              );
            }
            if (favorites?.data) setFavorites(favorites.data);
            if (ressources?.data) setUserRessources(ressources.data);
            setIsLoading(false);
          }
        }
      };

      fetchAll();

      return () => {
        isActive = false;
      };
    }, [refreshConnectedUser]),
  );

  const handleDeleteFavorite = (favorite: Favorite) => {
    setFavoriteToDelete(favorite);
    setIsFavoriteDialogVisible(true);
  };

  const confirmDeleteFavorite = async () => {
    if (favoriteToDelete) {
      await deleteFavorite(favoriteToDelete.id);
      await fetchFavorites();
      setFavoriteToDelete(null);
      setIsFavoriteDialogVisible(false);
    }
  };

  const cancelDeleteFavorite = () => {
    setIsFavoriteDialogVisible(false);
    setFavoriteToDelete(null);
  };

  if (userChoseToUnconnect || !connectedUser) {
    return <Redirect href="/unConnectedUserPage" />;
  }

  const onPressInvite = (invite: Invite) => {
    if (invite.recever.id === connectedUser.id) {
      setSelectedInvite(invite);
      setModalVisible(true);
    } else if (invite.sender.id === connectedUser.id) {
      router.replace(`/(ressource)/${invite.ressource.id}`);
    }
  };

  const renderList = (title: string, data: Invite[], emptyMessage: string) => (
    <View style={styles.lists}>
      <Title style={styles.title}>{title}</Title>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InviteCard invite={item} onPress={onPressInvite} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <RNText style={styles.empty}>{emptyMessage}</RNText>
        }
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const handleGoToRessource = (ressourceId: string) => {
    router.push(`/(ressource)/${ressourceId}`);
  };

  const handleEditRessource = (ressourceId: string) => {
    router.push(`/updateRessource/?editId=${ressourceId}`);
  };

  const handleLaunchRessource = async (ressourceId: string) => {
    const response = await updateRessource(ressourceId, { status: "En cours" });
    if (response && response.data) {
      router.push(`/(ressource)/${ressourceId}`);
    }
  };

  const handleDeleteRessource = async (ressourceId: string) => {
    const response = await deleteRessource(ressourceId);
    if (response && response.data) {
      fetchUserRessource();
    }
  };

  if (isLoading) {
    return (
      <PaperProvider theme={customTheme}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating size="large" />
          <Text style={{ marginTop: 10 }}>Chargement en cours...</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={customTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <FavoriteDeleteModal
          visible={isFavoriteDialogVisible}
          favorite={favoriteToDelete}
          onConfirm={confirmDeleteFavorite}
          onCancel={cancelDeleteFavorite}
        />
        <View style={styles.headerRow}>
          <Title style={styles.greeting}>Bonjour {connectedUser.name} 👋</Title>
          <IconButton
            icon="cog-outline"
            size={24}
            onPress={() => router.push("/accountSettings")}
          />
        </View>

        <Divider />

        {renderList(
          "📥 Invitations reçues",
          receivedInvites,
          "Aucune invitation reçue",
        )}
        <Divider style={styles.divider} />
        {renderList(
          "📤 Invitations envoyées",
          sentInvites,
          "Aucune invitation envoyée",
        )}

        <View style={styles.section}>
          <View style={styles.section}>
            <Title style={styles.title}>⭐ Favoris</Title>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FavoriteCard
                  favorite={item}
                  onPress={() => handleGoToRessource(item.ressource.id)}
                  onDelete={() => handleDeleteFavorite(item)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ListEmptyComponent={
                <Text style={styles.empty}>Aucun favori enregistré</Text>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Title style={styles.title}>📚 Mes ressources</Title>
          <FlatList
            data={userRessources}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RessourceCard
                ressource={item}
                onPress={() => handleGoToRessource(item.id)}
                onEdit={() => handleEditRessource(item.id)}
                onLaunch={() => handleLaunchRessource(item.id)}
                onDelete={() => handleDeleteRessource(item.id)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ListEmptyComponent={
              <Text style={styles.empty}>Aucune ressource disponible</Text>
            }
          />
        </View>

        {selectedInvite && connectedUser && (
          <InviteModal
            visible={modalVisible}
            hideDialog={() => setModalVisible(false)}
            selectedInvite={selectedInvite}
            connectedUser={connectedUser}
          />
        )}
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  lists: {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  horizontalList: {
    paddingBottom: 10,
    paddingRight: 10,
  },
  divider: {
    marginVertical: 20,
  },
  empty: {
    fontStyle: "italic",
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 10,
  },
  section: {
    paddingVertical: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default UserPage;
