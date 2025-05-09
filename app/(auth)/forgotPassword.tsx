import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, PaperProvider, Text, TextInput } from "react-native-paper";
import { customTheme } from "../../utils/theme/theme";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/(0-home)");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  // Send the password reset code to the user's email
  async function create() {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset() {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          router.replace("/(0-home)");
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={{ flex: 1 }}
    >
      <PaperProvider theme={customTheme}>
        <View
          style={[
            styles.container,
            { backgroundColor: customTheme.colors.primary },
          ]}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/logo-bg-vert.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.welcome} variant="headlineLarge">
              Mot de passe oublié ?
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              {!successfulCreation && (
                <>
                  <Text style={styles.label}>Email de compte</Text>
                  <TextInput
                    label="Email"
                    mode="flat"
                    value={email}
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor="#000"
                    theme={{ roundness: 15 }}
                  />

                  <Button
                    mode="contained"
                    onPress={create}
                    style={styles.mailButton}
                    labelStyle={{
                      color: customTheme.colors.primary,
                      fontWeight: "bold",
                    }}
                    buttonColor="#fff"
                  >
                    Envoyer un code par mail
                  </Button>
                  {error && <Text>{error}</Text>}
                </>
              )}

              {successfulCreation && (
                <>
                  <Text style={styles.label}>
                    Entrez votre nouveau mot de passe
                  </Text>
                  <TextInput
                    label="Mot de passe"
                    mode="flat"
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor="#000"
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword((prev) => !prev)}
                      />
                    }
                    theme={{ roundness: 15 }}
                  />

                  <Text style={styles.label}>
                    Enter le code de réinitialisation reçu par mail
                  </Text>
                  <TextInput
                    label="Code"
                    mode="flat"
                    value={code}
                    onChangeText={setCode}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor="#000"
                    theme={{ roundness: 15 }}
                  />

                  <Button
                    mode="contained"
                    style={styles.resetButton}
                    labelStyle={{
                      color: customTheme.colors.primary,
                      fontWeight: "bold",
                    }}
                    buttonColor="#fff"
                    onPress={reset}
                  >
                    Réinitialisation
                  </Button>
                  {error && <Text>{error}</Text>}
                </>
              )}

              {secondFactor && (
                <p>2FA is required, but this UI does not handle that</p>
              )}
            </View>
          </ScrollView>
        </View>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 30,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 50,
  },
  logo: {
    width: 200,
    height: 80,
  },
  welcome: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 15,
  },
  mailButton: {
    borderRadius: 10,
    marginTop: 10,
  },
  resetButton: {
    width: "60%",
    borderRadius: 10,
    marginBottom: 20,
  },
});
