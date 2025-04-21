import { CommentType } from "./Comment.types";

export interface Ressource {
  id: string;
  deadLine: string;
  description: string;
  file: File;
  isValidate: boolean;
  maxParticipant: number;
  nbParticipant: number;
  status: string;
  title: string;
  category: {
    id: string;
    name: string;
  };   
  comment: CommentType[];
}
