import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";
import { Button, useTheme } from "react-native-paper";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const { handleNonConnectedUser } = useConntedUser();
  const theme = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      handleNonConnectedUser(false);
      Linking.openURL(Linking.createURL("/(home)"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button mode="contained" style={styles.button} onPress={handleSignOut}>
      Me déconnecter
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
  divider: {
    marginVertical: 25,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
});
