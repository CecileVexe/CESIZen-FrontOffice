import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useClerk, useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { createUser } from "../../services/user.service";
import { TextInput, Button, Text, PaperProvider } from "react-native-paper";
import { customTheme } from "../../utils/theme/theme";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useConntedUser } from "../../utils/ConnectedUserContext";

type FormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpScreen = () => {
  const { isLoaded, signUp } = useSignUp();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const { handleNonConnectedUser } = useConntedUser();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSignUpPress = async (data: FormData) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        firstName: data.name,
        lastName: data.surname,
        emailAddress: data.email.trim(),
        password: data.password,
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
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        const clerkUserID = signUpAttempt.createdUserId;
        await createUser(clerkUserID);
        await signOut();
        router.replace("/sign-in");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleNonSignIn = () => {
    handleNonConnectedUser(true);
    router.navigate("/(home)");
  };

  if (pendingVerification) {
    return (
      <PaperProvider theme={customTheme}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: customTheme.colors.primary,
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.verificationTitle}>Vérification</Text>
          <TextInput
            label="Code de vérification"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            underlineColor="transparent"
            textColor="#000"
            theme={{ roundness: 15 }}
          />
          <Button
            mode="contained"
            onPress={onVerifyPress}
            style={styles.button}
            labelStyle={{
              color: customTheme.colors.primary,
              fontWeight: "bold",
            }}
            buttonColor="#fff"
          >
            Vérifier
          </Button>
        </View>
      </PaperProvider>
    );
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
            <Text style={styles.subtitle} variant="headlineLarge">
              Bienvenue !
            </Text>
          </View>
          <Text style={styles.formTitle}>Inscription</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Controller
              control={control}
              name="surname"
              rules={{ required: "Le nom est requis" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Nom *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
                />
              )}
            />
            {errors.surname && (
              <Text style={styles.error}>{errors.surname.message}</Text>
            )}

            <Controller
              control={control}
              name="name"
              rules={{ required: "Le prénom est requis" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Prénom *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              rules={{
                required: "L’email est requis",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Adresse email invalide",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email *"
                  autoCapitalize="none"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              rules={{ required: "Le mot de passe est requis" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Mot de passe *"
                  value={value}
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword((prev) => !prev)}
                    />
                  }
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Veuillez confirmer le mot de passe",
                validate: (value) =>
                  value === password ||
                  "Les mots de passe ne correspondent pas",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Confirmer votre mot de passe *"
                  value={value}
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSignUpPress)}
              style={styles.button}
              contentStyle={{ height: 45 }}
              labelStyle={{
                color: customTheme.colors.primary,
                fontWeight: "bold",
              }}
              buttonColor="#fff"
            >
              S’inscrire
            </Button>

            <Text style={styles.questionText}>Vous avez déjà un compte ?</Text>
            <Link href="/sign-in" asChild>
              <Button
                mode="contained"
                style={styles.secondaryButton}
                labelStyle={{
                  color: customTheme.colors.primary,
                  fontWeight: "bold",
                }}
                buttonColor="#fff"
                contentStyle={{ height: 40 }}
              >
                Se connecter
              </Button>
            </Link>

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
};

export default SignUpScreen;
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
  subtitle: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  formTitle: {
    fontSize: 18,
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 8,
    fontSize: 14,
    height: 50,
  },
  button: {
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
  },
  secondaryButton: {
    width: "60%",
    borderRadius: 10,
    marginTop: 10,
  },
  questionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 15,
  },
  later: {
    marginBottom: 30,
  },
  skipText: {
    color: "#fff",
    fontStyle: "italic",
    fontSize: 18,
    marginTop: 10,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  error: {
    color: "red",
    alignSelf: "flex-start",
  },
});
