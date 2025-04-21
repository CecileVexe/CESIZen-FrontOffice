import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title, Text, Card } from "react-native-paper";
import { useConntedUser } from "../../utils/ConnectedUserContext";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { handleNonConnectedUser } = useConntedUser();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(home)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleNonSignIn = () => {
    handleNonConnectedUser(true);
    router.navigate("/(home)");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Connexion</Title>

          <TextInput
            label="Adresse email"
            mode="outlined"
            value={emailAddress}
            autoCapitalize="none"
            onChangeText={setEmailAddress}
            style={styles.input}
          />

          <TextInput
            label="Mot de passe"
            mode="outlined"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={onSignInPress}
            style={styles.button}
          >
            Se connecter
          </Button>

          <View style={styles.signupContainer}>
            <Text>Pas encore de compte ?</Text>
            <Link href="/sign-up">
              <Text style={styles.signupLink}>Créer un compte</Text>
            </Link>
          </View>

          <Button mode="text" onPress={handleNonSignIn}>
            Continuer sans compte
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
  signupLink: {
    color: "#1976d2",
    marginLeft: 5,
  },
});
