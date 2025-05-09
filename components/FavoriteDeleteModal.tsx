import React from "react";
import { Portal, Dialog, Button, Text } from "react-native-paper";
import { Favorite } from "../utils/types/Favorite.types";

interface Props {
  visible: boolean;
  favorite: Favorite | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const FavoriteDeleteModal = ({
  visible,
  favorite,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>Supprimer ce favori ?</Dialog.Title>
        <Dialog.Content>
          <Text>
            Es-tu sûr de vouloir supprimer{" "}
            <Text style={{ fontWeight: "bold" }}>
              {favorite?.article.title}
            </Text>{" "}
            de tes favoris ?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Annuler</Button>
          <Button onPress={onConfirm} textColor="#d32f2f">
            Supprimer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default FavoriteDeleteModal;
