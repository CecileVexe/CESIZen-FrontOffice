import { ApiResponse } from "../utils/types/Api.types";
import { Article } from "../utils/types/Article.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getArticles = async (
  page: number = 1,
  pageSize: number = 50,
  categoryId?: string,
): Promise<ApiResponse<Article[]> | undefined> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: pageSize.toString(),
    });

    if (categoryId) {
      params.append("categoryId", categoryId);
    }

    const response = await fetch(`${_URL}article?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getArticle = async (
  id: string,
): Promise<ApiResponse<Article> | undefined> => {
  try {
    const response = await fetch(`${_URL}article/${id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
