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
  category: {
    id: string;
    name: string;
  };
  typeRessource: {
    id: string;
    name: string;
  };
  title: string;
  comment: CommentType[];
  step: Step[];
}

export interface createRessource
  extends Omit<
    Ressource,
    | "id"
    | "file"
    | "banner"
    | "status"
    | "nbParticipant"
    | "comment"
    | "isValidate"
    | "category"
    | "typeRessource"
  > {
  step: Omit<Step[], "id">;
}
