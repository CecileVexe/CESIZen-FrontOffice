import { Card, Text } from "react-native-paper";
import { CommentType } from "../utils/types/Comment.types";
import { parseStringDate } from "../utils/functions/datesFunction";
import { StyleSheet } from "react-native";
import { useConntedUser } from "../utils/ConnectedUserContext";


interface CommentCardProps {
  comment: CommentType;
}

const CommentCard = (props: CommentCardProps) => {
  const { connectedUser } = useConntedUser();
  const { comment } = props;
  const isCurrentUser = connectedUser?.id === comment.citizen.id;
  console.log(isCurrentUser);
  console.log(comment);



  return (
    <Card key={comment.id} style={[
      styles.card,
      { backgroundColor: isCurrentUser ? '#c8bff5' : '#ffffff' }
    ]}>
      <Card.Title
        title={comment.title}
        subtitle={`Ecrit le ${parseStringDate(comment.updatedAt)} par ${comment.citizen.name} ${comment.citizen.surname}`}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.description}>{comment.description}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff', 
    borderRadius: 10, 
    elevation: 4, 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',  
  },
  subtitle: {
    fontSize: 14,
    color: '#666', 
  },
  description: {
    fontSize: 16,
    lineHeight: 24, 
    color: '#444',  
  },
});

export default CommentCard;
