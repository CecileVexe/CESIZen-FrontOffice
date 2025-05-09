import { authFetch } from "../utils/authFetch";
import { ApiResponse } from "../utils/types/Api.types";
import { Journal } from "../utils/types/JournalEntry.typeps";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserJournal = async (
  userId: string,
  period: string,
  targetDate: string,
): Promise<ApiResponse<Journal> | undefined> => {
  try {
    const response = await authFetch(
      `${_URL}journal/${userId}?period=${period}&targetDate=${targetDate}`,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
