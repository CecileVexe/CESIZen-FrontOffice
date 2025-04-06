import { ApiResponse } from "../utils/types/Api.types";
import { Ressource } from "../utils/types/Ressources.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getRessources = async (): Promise<
  ApiResponse<Ressource[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}ressource`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
