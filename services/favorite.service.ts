import { ApiResponse } from "../utils/types/Api.types";
import { Favorite } from "../utils/types/Favorite.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const addFavorite = async (data: {
  articleId: string;
  userId: string;
}) => {
  try {
    const response = await fetch(`${_URL}favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const deleteFavorite = async (favoriteId: string) => {
  try {
    const response = await fetch(`${_URL}favorites/${favoriteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getUserFavorite = async (
  userId: string,
): Promise<ApiResponse<Favorite[]> | undefined> => {
  try {
    const response = await fetch(`${_URL}favorites/citizen/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
