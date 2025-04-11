import { ApiResponse } from "../utils/types/Api.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getCommentByRessource = async (
  ressourceId: string
): Promise<ApiResponse<any> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
