import { Category } from "./Category.types";

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  bannerId: string | null;
  readingTime: number;
  category: Omit<Category, "description">;
}
