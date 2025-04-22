import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  ScrollView,
} from "react-native";
import { Title, Divider, IconButton, Button } from "react-native-paper";
import { useRouter, Redirect } from "expo-router";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { getUserInvite } from "../../../services/invite.service";
import { Invite } from "../../../utils/types/invite.types";
import { SignOutButton } from "../../../components/SignOutButton";
import InviteModal from "../../../components/InviteModal";
import InviteCard from "../../../components/invitationsCard";

const UserPage = () => {
  const { userChoseToUnconnect, connectedUser } = useConntedUser();
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const router = useRouter();

  useEffect(() => {
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

    fetchInvites();
  }, [connectedUser]);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Button
          mode="contained"
          icon="star-outline"
          style={styles.button}
          onPress={() => router.push("/favoris")}
        >
          Voir mes favoris
        </Button>
      </View>

      <SignOutButton />

      {selectedInvite && connectedUser && (
        <InviteModal
          visible={modalVisible}
          hideDialog={() => setModalVisible(false)}
          selectedInvite={selectedInvite}
          connectedUser={connectedUser}
        />
      )}
    </ScrollView>
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
