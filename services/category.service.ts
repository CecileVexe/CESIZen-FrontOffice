import { ApiResponse } from "../utils/types/Api.types";
import { Category } from "../utils/types/Category.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getCategory = async (): Promise<
  ApiResponse<Category[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}category`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
