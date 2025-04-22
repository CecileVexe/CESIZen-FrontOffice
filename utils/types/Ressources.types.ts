import { CommentType } from "./Comment.types";
import { Step } from "./Step.types";

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
  comment: CommentType[];
}
