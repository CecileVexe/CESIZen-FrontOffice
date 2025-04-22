import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { createCitizen } from "../../services/citizen.service";
import { TextInput, Button, Title, Text, Card } from "react-native-paper";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        firstName: name,
        lastName: surname,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const clerkUserID = signUpAttempt.createdUserId;

        try {
          await createCitizen(clerkUserID);
          router.replace("/");
        } catch (error) {
          console.log(error);
        }
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Vérification</Title>
            <TextInput
              label="Code de vérification"
              mode="outlined"
              value={code}
              onChangeText={setCode}
              style={styles.input}
            />
            <Button mode="contained" onPress={onVerifyPress} style={styles.button}>
              Vérifier
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Créer un compte</Title>

          <TextInput
            label="Prénom"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            label="Nom"
            mode="outlined"
            value={surname}
            onChangeText={setSurname}
            style={styles.input}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Mot de passe"
            mode="outlined"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword((prev) => !prev)}
              />
            }
          />

          <Button mode="contained" onPress={onSignUpPress} style={styles.button}>
            Continuer
          </Button>

          <View style={styles.signinContainer}>
            <Text>Déjà un compte ?</Text>
            <Link href="/sign-in">
              <Text style={styles.signinLink}>Se connecter</Text>
            </Link>
          </View>
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
  signinContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  signinLink: {
    color: "#1976d2",
    marginLeft: 5,
  },
});

