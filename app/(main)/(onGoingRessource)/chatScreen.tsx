import { useLocalSearchParams } from "expo-router";
import { IconButton, TextInput } from "react-native-paper";
import {
  getRessourcesMessages,
  sendMessageToRessource,
} from "../../../services/message.service";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MessageCard from "../../../components/MessageCard";
import { Message } from "../../../utils/types/Message.types";
import { useConntedUser } from "../../../utils/ConnectedUserContext";

const ChatScreen = () => {
  const { ressourceId } = useLocalSearchParams();
  const [ressourceMessages, setRessourceMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const { connectedUser } = useConntedUser();

  const getMessages = useCallback(async () => {
    if (ressourceId) {
      const response = await getRessourcesMessages(ressourceId as string);
      if (response?.data) {
        const sortedMessages = response.data.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        setRessourceMessages(sortedMessages);
      }
    }
  }, [ressourceId]);

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => {
      console.log("Message refresh");
      getMessages();
    }, 30000);

    return () => clearInterval(interval);
  }, [getMessages]);

  const sendMessage = async () => {
    if (messageInput.trim() && ressourceId) {
      const newMessage = await sendMessageToRessource({
        ressourceId: ressourceId as string,
        message: messageInput,
        citizenId: connectedUser?.id,
      });

      if (newMessage?.data) {
        setMessageInput("");
        await getMessages();
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.innerContainer}>
        <FlatList
          ref={flatListRef}
          data={ressourceMessages}
          keyExtractor={(item) => `${item.id}_card`}
          renderItem={({ item }) => <MessageCard message={item} />}
          contentContainerStyle={styles.messagesContainer}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrivez un message..."
            value={messageInput}
            onChangeText={setMessageInput}
          />
          <IconButton
            icon="send"
            size={24}
            onPress={sendMessage}
            disabled={messageInput.trim().length === 0}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },
});
