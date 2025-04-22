import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Invite } from "../utils/types/invite.types";
import { parseStringDate } from "../utils/functions/datesFunction";

interface Props {
  invite: Invite;
  onPress: (invite: Invite) => void;
}

const InviteCard = ({ invite, onPress }: Props) => {
  return (
    <Card style={styles.card} onPress={() => onPress(invite)}>
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" numberOfLines={2}>
          {invite.ressource.title}
        </Text>
        <Text numberOfLines={1}>📅 {parseStringDate(invite.createdAt)}</Text>
        <Text>{invite.accepte ? "✅ Acceptée" : "⏳ En attente"}</Text>
        <Text style={styles.smallText} numberOfLines={1}>
          👤 {invite.sender.surname} {invite.sender.name} →{" "}
          {invite.recever.surname} {invite.recever.name}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  cardContent: {
    paddingVertical: 6,
  },
  smallText: {
    marginTop: 6,
    fontSize: 11,
    color: "#666",
  },
});

export default InviteCard;
