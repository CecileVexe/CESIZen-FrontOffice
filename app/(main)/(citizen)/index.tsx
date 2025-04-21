import {
  Button,
  Divider,
  Text,
  Title,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { Redirect, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

const UserPage = () => {
  const { userChoseToUnconnect, connectedUser } = useConntedUser();
  const router = useRouter();

  if (userChoseToUnconnect || !connectedUser) {
    return <Redirect href="/unConnectedUserPage" />;
  }

  return (
    <View style={styles.container}>
      {/* Section Bonjour + engrenage */}
      <View style={styles.headerRow}>
        <Title style={styles.greeting}>Bonjour {connectedUser.name} 👋</Title>
        <IconButton
          icon="cog-outline"
          size={24}
          onPress={() => router.push("/accountSettings")}
        />
      </View>

      <Divider />

      {/* Section Navigation rapide */}
      <View style={styles.section}>
        <Button
          mode="contained"
          icon="email-outline"
          style={styles.button}
          onPress={() => router.push("/invitations")}
        >
          Voir mes invitations
        </Button>
        <Button
          mode="contained"
          icon="star-outline"
          style={styles.button}
          onPress={() => router.push("/favoris")}
        >
          Voir mes favoris
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  button: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default UserPage;
