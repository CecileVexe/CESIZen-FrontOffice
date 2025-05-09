import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, PaperProvider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useConnectedUser } from "../../utils/ConnectedUserContext";
import { customTheme } from "../../utils/theme/theme";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { handleNonConnectedUser } = useConnectedUser();
  const [showPassword, setShowPassword] = React.useState(false);
  const [apiError, setApiError] = React.useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInPress = async (data: { email: string; password: string }) => {
    if (!isLoaded) return;
    setApiError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email.trim(),
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(0-home)");
      } else {
        setApiError("Échec de la connexion. Veuillez réessayer.");
      }
    } catch (err: any) {
      const clerkError = err?.errors?.[0]?.message || "Erreur de connexion.";
      setApiError(clerkError);
    }
  };

  const handleNonSignIn = () => {
    handleNonConnectedUser(true);
    router.navigate("/(0-home)");
  };

  const handleForgotPassword = () => {
    router.navigate("/forgotPassword");
  };

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
          <View style={{ justifyContent: "flex-start", alignItems: "center" }}>
            <Image
              source={require("../../assets/logo-bg-vert.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcome} variant="headlineLarge">
              Ravis de vous revoir !
            </Text>
          </View>

          <Text style={styles.label}>Connexion</Text>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              <Controller
                control={control}
                rules={{
                  required: "Email requis",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Format d'email invalide",
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Email"
                    mode="flat"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor="#000"
                    cursorColor={customTheme.colors.primary}
                    theme={{ roundness: 15 }}
                    error={!!errors.email}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={{ color: "red", alignSelf: "flex-start" }}>
                  {errors.email.message}
                </Text>
              )}

              <Controller
                control={control}
                rules={{
                  required: "Mot de passe requis",
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    label="Mot de passe"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor="#000"
                    cursorColor={customTheme.colors.primary}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword((prev) => !prev)}
                      />
                    }
                    theme={{ roundness: 15 }}
                    error={!!errors.password}
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={{ color: "red", alignSelf: "flex-start" }}>
                  {errors.password.message}
                </Text>
              )}

              <Button
                mode="text"
                onPress={handleForgotPassword}
                labelStyle={styles.forgotPassword}
              >
                J'ai oublié mon mot de passe
              </Button>

              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSignInPress)}
                  style={styles.loginButton}
                  labelStyle={{
                    color: customTheme.colors.primary,
                    fontWeight: "bold",
                  }}
                  buttonColor="#fff"
                >
                  Valider
                </Button>
                {apiError !== "" && (
                  <Text style={{ color: "red", marginVertical: 10 }}>
                    {apiError}
                  </Text>
                )}
              </View>

              <Text style={styles.signupText}>Vous n’avez pas de compte ?</Text>

              <Link href="/sign-up" asChild>
                <Button
                  mode="contained"
                  style={styles.signupButton}
                  labelStyle={{
                    color: customTheme.colors.primary,
                    fontWeight: "bold",
                  }}
                  buttonColor="#fff"
                >
                  S’inscrire
                </Button>
              </Link>
            </View>

            <View style={styles.later}>
              <Button
                mode="text"
                onPress={handleNonSignIn}
                labelStyle={styles.skipText}
              >
                Je veux m’inscrire plus tard
              </Button>
            </View>
          </ScrollView>
        </View>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
}

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
  label: {
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 15,
  },
  loginButton: {
    width: "50%",
    borderRadius: 10,
    marginTop: 10,
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 15,
  },
  signupButton: {
    width: "60%",
    borderRadius: 10,
    marginBottom: 20,
  },
  skipText: {
    color: "#fff",
    fontStyle: "italic",
    fontSize: 18,
    marginTop: 10,
  },
  later: {
    marginBottom: 30,
  },
  forgotPassword: {
    color: "#fff",
    fontStyle: "italic",
    textAlign: "right",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
