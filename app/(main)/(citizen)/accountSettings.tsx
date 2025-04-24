import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Divider,
  useTheme,
  PaperProvider,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { customTheme } from "../../../utils/theme/theme";
import {
  updateCitizen,
  updateCitizenCredtials,
} from "../../../services/citizen.service";
import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "../../../components/SignOutButton";

type FormData = {
  name: string;
  surname: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const AccountSettings = () => {
  const theme = useTheme();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      surname: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { user } = useUser();
  const { connectedUser } = useConntedUser();

  const onSubmitInfo = async (data: FormData) => {
    const dataToSend = {
      name: data.name,
      surname: data.surname,
      clerkId: user?.id,
    };
    if (connectedUser) {
      const response = await updateCitizen(connectedUser.id, dataToSend);
      if (response.data) {
        router.back();
      }
    }
  };

  const onSubmitPassword = async (data: FormData) => {
    console.log(
      "Mot de passe mis à jour :",
      data.oldPassword,
      data.newPassword,
    );
    if (user) {
      const dataToSend = {
        clerkId: user.id,
        oldPassword: data.oldPassword,
        password: data.newPassword,
      };
      const response = await updateCitizenCredtials(dataToSend);

      if (response.data) {
        router.back();
      } else if (response.error) {
        return setError("oldPassword", {
          type: "manual",
          message: "Mot de passe actuel incorrect.",
        });
      }
    }
  };

  return (
    <PaperProvider theme={customTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Modifier mes informations</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                label="Prénom"
                value={value}
                onChangeText={onChange}
                error={!!errors.name}
                style={styles.input}
              />
              {errors.name && (
                <Text style={styles.error}>{errors.name.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="surname"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                label="Nom"
                value={value}
                onChangeText={onChange}
                error={!!errors.surname}
                style={styles.input}
              />
              {errors.surname && (
                <Text style={styles.error}>{errors.surname.message}</Text>
              )}
            </>
          )}
        />

        <Button
          mode="contained"
          style={styles.button}
          onPress={handleSubmit(onSubmitInfo)}
        >
          Enregistrer les modifications
        </Button>

        <Divider style={styles.divider} />

        <Text style={styles.title}>Changer mon mot de passe</Text>

        <Controller
          name="oldPassword"
          control={control}
          rules={{
            validate: (value, formValues) => {
              if (formValues.newPassword || value) {
                return value ? true : "Ancien mot de passe requis";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <TextInput
                label="Ancien mot de passe"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.oldPassword}
                style={styles.input}
              />
              {errors.oldPassword && (
                <Text style={styles.error}>{errors.oldPassword.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          rules={{
            validate: (value, formValues) => {
              if (formValues.oldPassword || value) {
                return value ? true : "Nouveau mot de passe requis";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <TextInput
                label="Nouveau mot de passe"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.newPassword}
                style={styles.input}
              />
              {errors.newPassword && (
                <Text style={styles.error}>{errors.newPassword.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            validate: (value) => {
              const newPassword = watch("newPassword");
              if (newPassword || value) {
                if (!value) return "Confirmation requise";
                if (value !== newPassword)
                  return "Les mots de passe ne correspondent pas";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <TextInput
                label="Confirmer le mot de passe"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.confirmPassword}
                style={styles.input}
              />
              {errors.confirmPassword && (
                <Text style={styles.error}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </>
          )}
        />

        <Button
          mode="contained"
          style={styles.button}
          onPress={handleSubmit(onSubmitPassword)}
        >
          Mettre à jour le mot de passe
        </Button>

        <Divider style={styles.divider} />

        <Text style={styles.title}>Compte</Text>
        <SignOutButton />
        <Button
          mode="text"
          textColor={theme.colors.error}
          style={styles.button}
          onPress={() => console.log("Supprimer")}
        >
          Supprimer mon compte
        </Button>
      </ScrollView>
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

export default AccountSettings;
