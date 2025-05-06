import { ApiResponse } from "../utils/types/Api.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getEmotionCategories = async (): Promise<
  ApiResponse<EmotionCategory[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}emotion-category`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
