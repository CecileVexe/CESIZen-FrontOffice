import React from "react";
import { View } from "react-native";
import { Button, Text, Portal, Dialog } from "react-native-paper";
import { useConntedUser } from "../utils/ConnectedUserContext";
import { Ressource } from "../utils/types/Article.types";
import { initializeProgression } from "../services/progression.service";

interface SubscribeToRessourceProps {
  ressource: Ressource;
  visible: boolean;
  hideDialog: () => void;
}

const SubscribeToRessource = (props: SubscribeToRessourceProps) => {
  const { ressource, visible, hideDialog } = props;

  const { connectedUser } = useConntedUser();

  const handleSubscription = async () => {
    if (connectedUser) {
      const infos = { citizenId: connectedUser.id, ressourceId: ressource.id };
      const response = await initializeProgression(infos);
      console.log(response.message);
      hideDialog();
    }
  };

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>S'inscrire à la ressource</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {`Vous confirmer vous inscrire à la ressrouce ${ressource.title} ?`}
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button mode="outlined" onPress={hideDialog}>
              Annuler
            </Button>
            <Button mode="contained" onPress={handleSubscription}>
              Confirmer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default SubscribeToRessource;
