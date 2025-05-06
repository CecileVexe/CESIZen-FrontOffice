import { Ressource } from "./Article.types";

export interface Favorite {
  id: string;
  citizenId: string;
  ressource: Pick<Ressource, "id" | "title">;
}
