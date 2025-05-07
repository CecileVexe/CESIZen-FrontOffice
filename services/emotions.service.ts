import { ApiResponse } from "../utils/types/Api.types";
import { Emotion } from "../utils/types/Emotion.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getEmotions = async (): Promise<
  ApiResponse<Emotion[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}emotion`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
