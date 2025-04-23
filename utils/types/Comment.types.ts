import { CitizenType } from "./citizen.types";

export interface CommentType {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  citizen: Pick<CitizenType, "email" | "id" | "name" | "surname">;
  ressourceId: string | undefined; 
}

export interface CreateComment
  extends Omit<CommentType, "id" | "updatedAt" | "citizen"> {
  citizenId: string;
}
