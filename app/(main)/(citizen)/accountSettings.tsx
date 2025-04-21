import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Divider, useTheme } from "react-native-paper";
import { useForm, Controller, useWatch } from "react-hook-form";

type FormData = {
  name: string;
  surname: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const AccountSettings = () => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      surname: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({ control, name: "newPassword" });

  const onSubmitInfo = (data: FormData) => {
    console.log("Infos mises à jour :", data.name, data.surname);
    // Appelle API update user
  };

  const onSubmitPassword = (data: FormData) => {
    console.log(
      "Mot de passe mis à jour :",
      data.oldPassword,
      data.newPassword,
    );
    // Appelle API update password
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Partie 1 - Infos perso */}
      <Text style={styles.title}>Modifier mes informations</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: "Le prénom est requis" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Prénom"
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
            style={styles.input}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="surname"
        rules={{ required: "Le nom est requis" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nom"
            value={value}
            onChangeText={onChange}
            error={!!errors.surname}
            style={styles.input}
          />
        )}
      />
      {errors.surname && (
        <Text style={styles.error}>{errors.surname.message}</Text>
      )}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleSubmit(onSubmitInfo)}
      >
        Enregistrer les modifications
      </Button>

      <Divider style={styles.divider} />

      {/* Partie 2 - Mot de passe */}
      <Text style={styles.title}>Changer mon mot de passe</Text>

      <Controller
        control={control}
        name="oldPassword"
        rules={{ required: "L'ancien mot de passe est requis" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Ancien mot de passe"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={!!errors.oldPassword}
            style={styles.input}
          />
        )}
      />
      {errors.oldPassword && (
        <Text style={styles.error}>{errors.oldPassword.message}</Text>
      )}

      <Controller
        control={control}
        name="newPassword"
        rules={{ required: "Le nouveau mot de passe est requis" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nouveau mot de passe"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={!!errors.newPassword}
            style={styles.input}
          />
        )}
      />
      {errors.newPassword && (
        <Text style={styles.error}>{errors.newPassword.message}</Text>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirmation du mot de passe requise",
          validate: (val) =>
            val === newPassword || "Les mots de passe ne correspondent pas",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Confirmer le nouveau mot de passe"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={!!errors.confirmPassword}
            style={styles.input}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleSubmit(onSubmitPassword)}
      >
        Mettre à jour le mot de passe
      </Button>

      <Divider style={styles.divider} />

      {/* Partie 3 - Danger Zone */}
      <Text style={styles.title}>Compte</Text>
      <Button
        mode="outlined"
        textColor={theme.colors.error}
        style={styles.button}
        onPress={() => console.log("Suspendre")}
      >
        Suspendre mon compte
      </Button>
      <Button
        mode="text"
        textColor={theme.colors.error}
        style={styles.button}
        onPress={() => console.log("Supprimer")}
      >
        Supprimer mon compte
      </Button>
    </ScrollView>
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
