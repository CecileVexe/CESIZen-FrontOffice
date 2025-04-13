import { Card, Text } from "react-native-paper";
import { CommentType } from "../utils/types/Comment.types";
import { parseStringDate } from "../utils/functions/datesFunction";

interface CommentCardProps {
  comment: CommentType;
}

const CommentCard = (props: CommentCardProps) => {
  const { comment } = props;
  return (
    <Card key={comment.id}>
      <Card.Title
        title={comment.title}
        subtitle={`Ecrit le ${parseStringDate(comment.updatedAt)} par ${comment.citizen.name} ${comment.citizen.surname}`}
      />
      <Card.Content>
        <Text variant="bodyMedium">{comment.description}</Text>
      </Card.Content>
    </Card>
  );
};

export default CommentCard;
