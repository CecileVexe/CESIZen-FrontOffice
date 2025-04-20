import { ApiResponse } from "../utils/types/Api.types";
import { Progression } from "../utils/types/Progression.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const initializeProgression = async (infos: {
  citizenId: string;
  ressourceId: string;
}) => {
  try {
    const response = await fetch(`${_URL}progression`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infos),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getProgressionFromUser = async (
  userId: string
): Promise<ApiResponse<Progression[]> | undefined> => {
  try {
    const response = await fetch(`${_URL}progression?citizenId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const CompleteProgression = async (
  progressionId: string,
  infos: { completed: boolean; dateCompleted: Date | null }
) => {
  try {
    const response = await fetch(`${_URL}progression/${progressionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infos),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
