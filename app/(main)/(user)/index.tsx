import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Divider,
  useTheme,
  PaperProvider,
  Dialog,
  Portal,
  IconButton,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { customTheme } from "../../../utils/theme/theme";

import { useConntedUser } from "../../../utils/ConnectedUserContext";
import { useFocusEffect, useRouter } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "../../../components/SignOutButton";
import * as Linking from "expo-linking";
import {
  deleteUser,
  updateUser,
  updateUserCredtials,
} from "../../../services/user.service";

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
  const { user } = useUser();
  const { connectedUser, handleNonConnectedUser, refreshConnectedUser } =
    useConntedUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: connectedUser?.name || "",
      surname: connectedUser?.surname || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const refresh = async () => {
        await refreshConnectedUser();
      };

      refresh();

      return () => {
        isActive = false;
      };
    }, [refreshConnectedUser]),
  );

  useEffect(() => {
    if (connectedUser) {
      reset({
        name: connectedUser.name || "",
        surname: connectedUser.surname || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [connectedUser, reset]);

  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false); // état pour gérer la visibilité de la modale

  const onSubmitInfo = async (data: FormData) => {
    const dataToSend = {
      name: data.name,
      surname: data.surname,
      clerkId: user?.id,
    };
    if (connectedUser) {
      const response = await updateUser(connectedUser.id, dataToSend);
      if (response.data) {
        reset();
        router.back();
      }
    }
  };

  const onSubmitPassword = async (data: FormData) => {
    if (user) {
      const dataToSend = {
        clerkId: user.id,
        oldPassword: data.oldPassword,
        password: data.newPassword,
      };
      const response = await updateUserCredtials(dataToSend);
      console.log(response);
      if (response.status === 200) {
        reset();
        router.back();
      } else if (response.error) {
        return setError("oldPassword", {
          type: "manual",
          message: "Mot de passe actuel incorrect.",
        });
      }
    }
  };

  const { signOut } = useClerk();

  const handleDeleteUser = async () => {
    if (connectedUser) {
      const response = await deleteUser(connectedUser.id);
      console.log(response);
      if (!response.error) {
        try {
          await signOut();
          handleNonConnectedUser(false);
          Linking.openURL(Linking.createURL("/(home)"));
        } catch (err) {
          console.error(JSON.stringify(err, null, 2));
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={{ flex: 1 }}
    >
      <PaperProvider theme={customTheme}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {`${connectedUser?.name ?? "Utilisateur"} ${connectedUser?.surname ?? "Inconnu"}`}
          </Text>

          <Text style={styles.title}>Informations personnelles</Text>

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
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
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
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
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

          <Text style={styles.title}>Modifier le mot de passe</Text>

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
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
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
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
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
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  textColor="#000"
                  theme={{ roundness: 15 }}
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
            onPress={() => setDeleteDialogVisible(true)}
          >
            Supprimer mon compte
          </Button>

          <Portal>
            <Dialog
              visible={isDeleteDialogVisible}
              onDismiss={() => setDeleteDialogVisible(false)}
            >
              <Dialog.Title>Confirmer la suppression</Dialog.Title>
              <Dialog.Content>
                <Text>
                  Cette action supprimera définitivement votre compte et toutes
                  vos données. Êtes-vous sûr(e) ?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDeleteDialogVisible(false)}>
                  Annuler
                </Button>
                <Button onPress={handleDeleteUser}>Supprimer</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Divider style={styles.divider} />

          <View style={styles.linkRow}>
            <Button
              onPress={() => router.push("/(legal)/cgu")}
              icon="open-in-new"
              contentStyle={styles.linkButton}
            >
              <Text style={styles.textButton}>
                Conditions Générales d’Utilisation
              </Text>
            </Button>
          </View>

          <View style={styles.linkRow}>
            <Button
              onPress={() => router.push("/(legal)/rgpd")}
              icon="open-in-new"
              contentStyle={styles.linkButton}
            >
              <Text style={styles.textButton}>
                Règlement général sur la protection des données
              </Text>
            </Button>
          </View>
        </ScrollView>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#014b3e",
    marginBottom: 20,
    textAlign: "left",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  button: {
    marginVertical: 10,
    borderRadius: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 30,
  },
  textButton: {
    alignSelf: "center",
    textDecorationLine: "underline",
    fontSize: 12,
    color: "#52B788",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  linkIcon: {
    marginLeft: 0,
    color: "#52B788",
  },
  linkButton: {
    flexDirection: "row-reverse",
  },
});

export default AccountSettings;
