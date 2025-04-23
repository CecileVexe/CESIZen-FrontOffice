import { View, Text, StyleSheet } from "react-native";
import { Message } from "../utils/types/Message.types";
import { useConntedUser } from "../utils/ConnectedUserContext";
import {
  parseStringDate,
  parseStringHour,
} from "../utils/functions/datesFunction";

interface MessageCardProps {
  message: Message;
}

const MessageCard = ({ message }: MessageCardProps) => {
  const { connectedUser } = useConntedUser();
  const isCurrentUser = connectedUser?.id === message.citizen.id;
  
  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.rightAlign : styles.leftAlign,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[styles.username, isCurrentUser && styles.currentUserText]}
        >
          {`${message.citizen.name} ${message.citizen.surname}`}
        </Text>

        <Text
          style={[styles.messageText, isCurrentUser && styles.currentUserText]}
        >
          {message.message}
        </Text>
        <Text
          style={isCurrentUser ? styles.currentUsertimestamp : styles.timestamp}
        >
          {parseStringDate(message.updatedAt)} à{" "}
          {parseStringHour(message.updatedAt)}
        </Text>
      </View>
    </View>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  leftAlign: {
    justifyContent: "flex-start",
  },
  rightAlign: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  otherUserBubble: {
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 0,
  },
  currentUserBubble: {
    backgroundColor: "#4A90E2",
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  currentUserText: {
    color: "#fff",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    color: "#888",
    alignSelf: "flex-end",
    fontStyle: "italic",
  },

  currentUsertimestamp: {
    fontSize: 11,
    marginTop: 4,
    color: "#fff",
    alignSelf: "flex-end",
    fontStyle: "italic",
  },
});
