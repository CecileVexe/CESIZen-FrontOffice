import { ApiResponse } from "../utils/types/Api.types";
import { Category } from "../utils/types/Category.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getCategories = async (): Promise<
  ApiResponse<Category[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}article-category`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
