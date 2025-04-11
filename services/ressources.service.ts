import { ApiResponse } from "../utils/types/Api.types";
import { Ressource } from "../utils/types/Ressources.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getRessources = async (): Promise<
  ApiResponse<Ressource[]> | undefined
> => {
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

export const getRessource = async (
  id: string
): Promise<ApiResponse<Ressource> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource/${id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
