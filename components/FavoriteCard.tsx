import { StyleSheet } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { Favorite } from "../utils/types/Favorite.types";

interface Props {
  favorite: Favorite;
  onPress: () => void;
  onDelete: () => void;
}

const FavoriteCard = ({ favorite, onPress, onDelete }: Props) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={3} style={styles.title}>
          {favorite.ressource.title}
        </Text>
        <IconButton
          icon="delete"
          size={30}
          iconColor="#d32f2f"
          onPress={onDelete}
          style={styles.deleteButton}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  content: {
    paddingVertical: 6,
    position: "relative",
    minHeight: 80,
    justifyContent: "center",
  },
  title: {
    paddingRight: 40,
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default FavoriteCard;
