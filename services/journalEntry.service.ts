import { ApiResponse } from "../utils/types/Api.types";
import { Journal, JournalEntry } from "../utils/types/JournalEntry.typeps";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserJournalEntry = async (
  entryId: string,
): Promise<ApiResponse<JournalEntry> | undefined> => {
  try {
    const response = await fetch(`${_URL}journal-entry/${entryId}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
