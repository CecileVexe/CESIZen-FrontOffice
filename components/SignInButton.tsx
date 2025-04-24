import { StyleSheet } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";
import { useRouter } from "expo-router";
import { Button, PaperProvider } from "react-native-paper";
import { customTheme } from "../utils/theme/theme";

export const SignInButton = () => {
  const { handleNonConnectedUser } = useConntedUser();
  const router = useRouter();

  const handleSignIn = async () => {
    handleNonConnectedUser(false);
    router.navigate("/sign-in");
  };

  return (
    <PaperProvider theme={customTheme}>
      <Button mode="contained" style={styles.button} onPress={handleSignIn}>
        Me connecter
      </Button>
    </PaperProvider>
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
