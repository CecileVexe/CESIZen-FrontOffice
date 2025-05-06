import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { useConnectedUser } from "../utils/ConnectedUserContext";
import { sendInvite } from "../services/invite.service";

interface InviteFormProps {
  ressourceId: string;
  visible: boolean;
  hideDialog: () => void;
}

const InviteForm = (props: InviteFormProps) => {
  const { ressourceId, visible, hideDialog } = props;
  const { connectedUser } = useConnectedUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    if (connectedUser) {
      const inviteData = {
        ressourceId: ressourceId,
        senderId: connectedUser.id,
        receverEmail: data.email,
      };
      try {
        await sendInvite(inviteData);
        hideDialog();
        reset();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Envoyez une invitation à cette ressource</Dialog.Title>
          <Dialog.Content>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Le mail est requis",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Adresse mail invalide",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.email}
                />
              )}
            />
            {errors.email && (
              <Text style={{ color: "red", marginBottom: 8 }}>
                {errors.email.message}
              </Text>
            )}
          </Dialog.Content>

          <Dialog.Actions>
            <Button mode="outlined" onPress={hideDialog}>
              Annuler
            </Button>
            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
              Confirmer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default InviteForm;
