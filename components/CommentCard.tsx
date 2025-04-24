import { Card, Text } from "react-native-paper";
import { CommentType } from "../utils/types/Comment.types";
import { parseStringDate } from "../utils/functions/datesFunction";
import { StyleSheet } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";

interface CommentCardProps {
  comment: CommentType;
}

const CommentCard = (props: CommentCardProps) => {
  const { connectedUser } = useConntedUser();
  const { comment } = props;
  const isCurrentUser = connectedUser?.id === comment.citizen.id;
  return (
    <Card
      key={comment.id}
      style={[
        styles.card,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
      ]}
    >
      <Card.Title
        title={comment.title}
        subtitle={`Ecrit le ${parseStringDate(comment.updatedAt)} par ${comment.citizen.name} ${comment.citizen.surname}`}
        titleStyle={[styles.title, isCurrentUser && styles.currentUserText]}
        subtitleStyle={[
          styles.subtitle,
          isCurrentUser && styles.currentUserText,
        ]}
      />
      <Card.Content>
        <Text
          variant="bodyMedium"
          style={[styles.description, isCurrentUser && styles.currentUserText]}
        >
          {comment.description}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  otherUserBubble: {
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 0,
  },
  currentUserBubble: {
    backgroundColor: "#f9921e",
    borderTopRightRadius: 0,
  },
  currentUserText: {
    color: "#ffffff",
  },
});

export default CommentCard;
