import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text as RNText } from "react-native";
import { Card, Divider, PaperProvider, Text, Title } from "react-native-paper";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { getUserInvite } from "../../../services/invite.service";
import { parseStringDate } from "../../../utils/functions/datesFunction";
import { Invite } from "../../../utils/types/invite.types";
import { useRouter } from "expo-router";
import InviteModal from "../../../components/InviteModal";

const InvitationsPage = () => {
  const { connectedUser } = useConntedUser();
  const [sentInvites, setSentInvites] = useState<Invite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invite[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchInvites = async () => {
      if (connectedUser) {
        const invites = await getUserInvite(connectedUser.id);
        if (invites) {
          const { data: invitesData } = invites;

          const sent = invitesData.filter(
            (invite) => invite.sender.id === connectedUser.id,
          );
          const received = invitesData.filter(
            (invite) => invite.recever.id === connectedUser.id,
          );
          setSentInvites(sent);
          setReceivedInvites(received);
        }
      }
    };

    fetchInvites();
  }, [connectedUser]);

  const onPress = (item: Invite) => {
    if (item.recever.id === connectedUser?.id) {
      setSelectedInvite(item);
      setModalVisible(true);
    }
    if (item.sender.id === connectedUser?.id) {
      router.replace(`/(ressource)/${item.ressource.id}`);
    } else {
      return;
    }
  };

  const renderInviteCard = ({ item }: { item: Invite }) => (
    <Card style={styles.card} onPress={() => onPress(item)}>
      <Card.Content style={{ paddingVertical: 6 }}>
        <Text variant="titleMedium" numberOfLines={2}>
          {item.ressource.title}
        </Text>
        <Text numberOfLines={1}>{`📅 ${parseStringDate(item.createdAt)}`}</Text>
        <Text>{item.accepte ? "✅ Acceptée" : "⏳ En attente"}</Text>
        <Text style={styles.smallText} numberOfLines={1}>
          {`👤 ${item.sender.surname} ${item.sender.name} → ${item.recever.surname} ${item.recever.name}`}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.lists}>
          <Title style={styles.title}>📥 Invitations reçues</Title>
          <FlatList
            data={receivedInvites}
            keyExtractor={(item) => item.id}
            renderItem={renderInviteCard}
            ListEmptyComponent={
              <RNText style={styles.empty}>Aucune invitation reçue</RNText>
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.lists}>
          <Title style={styles.title}>📤 Invitations envoyées</Title>
          <FlatList
            data={sentInvites}
            keyExtractor={(item) => item.id}
            renderItem={renderInviteCard}
            ListEmptyComponent={
              <RNText style={styles.empty}>Aucune invitation envoyée</RNText>
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  lists: {
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: 250,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  smallText: {
    marginTop: 6,
    fontSize: 11,
    color: "#666",
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
  horizontalList: {
    paddingBottom: 10,
  },
});

export default InvitationsPage;
