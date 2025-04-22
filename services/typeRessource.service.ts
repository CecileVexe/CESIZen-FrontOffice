import { ApiResponse } from "../utils/types/Api.types";
import { TypeRessource } from "../utils/types/TypeRessource.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getTypeRessource = async (): Promise<
  ApiResponse<TypeRessource[]> | undefined
> => {
  try {
    const response = await fetch(`${_URL}ressource-type`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
