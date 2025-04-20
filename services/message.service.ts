import { ApiResponse } from "../utils/types/Api.types";
import { Message } from "../utils/types/Message.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getRessourcesMessages = async (
  ressourceId: string,
): Promise<ApiResponse<Message[]> | undefined> => {
  try {
    const response = await fetch(`${_URL}message?id=${ressourceId}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const sendMessageToRessource = async (data: any) => {
  try {
    const response = await fetch(`${_URL}message?`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
