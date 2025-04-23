import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, IconButton, Button } from "react-native-paper";

type Ressource = {
  id: string;
  title: string;
  isValidate: string;
  status: string;
};

type Props = {
  ressource: Ressource;
  onPress: () => void;
  onEdit: () => void;
  onLaunch: () => void;
  onDelete: () => void;
};

const RessourceCard: React.FC<Props> = ({
  ressource,
  onPress,
  onEdit,
  onLaunch,
  onDelete,
}) => {
  const { title, isValidate, status } = ressource;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{title}</Text>
          <Text>Validée : {isValidate ? "Oui" : "Non"}</Text>
          <Text>Statut : {status}</Text>
        </Card.Content>
        <Card.Actions>
          {status === "En attente" && (
            <IconButton icon="pencil" onPress={onEdit} />
          )}
          {status === "Validé" && (
            <Button onPress={onLaunch}>Lancer l'activité</Button>
          )}
          {status !== "En cours" && (
            <IconButton icon="delete" onPress={onDelete} />
          )}
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width: 250,
  },
});

export default RessourceCard;
