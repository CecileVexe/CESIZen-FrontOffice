import { Article } from "./Article.types";

export interface Favorite {
  id: string;
  userId: string;
  article: Pick<Article, "id" | "title">;
}
