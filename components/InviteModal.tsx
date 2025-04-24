import React from "react";
import { View } from "react-native";
import { Button, Text, Portal, Dialog } from "react-native-paper";

import { Invite } from "../utils/types/invite.types";
import { acceptInvite } from "../services/invite.service";
import { useRouter } from "expo-router";
import { CitizenType } from "../utils/types/citizen.types";

interface InviteModalProps {
  selectedInvite: Invite;
  connectedUser: CitizenType;
  visible: boolean;
  hideDialog: () => void;
}

const InviteModal = (props: InviteModalProps) => {
  const { selectedInvite, connectedUser, visible, hideDialog } = props;
  const router = useRouter();

  const handleDecline = () => {
    hideDialog();
  };

  const handleAccept = async () => {
    const response = await acceptInvite({
      inviteId: selectedInvite.id,
      citizenId: connectedUser.id,
    });

    if (response.data) {
      router.replace(`/(ressource)/${response.data.ressourceId}`);
    } else {
      console.error(response.message);
    }
  };

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Accepter l'invitation</Dialog.Title>
          <Dialog.Content>
            <Text>
              Souhaitez-vous vous inscrire à la ressource :{" "}
              {selectedInvite?.ressource.title} ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDecline}>Refuser</Button>
            <Button onPress={handleAccept}>Accepter</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default InviteModal;
