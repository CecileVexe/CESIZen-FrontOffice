import { authFetch } from "../utils/authFetch";
import { ApiResponse } from "../utils/types/Api.types";
import { JournalEntry } from "../utils/types/JournalEntry.typeps";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserJournalEntry = async (
  entryId: string,
): Promise<ApiResponse<JournalEntry> | undefined> => {
  try {
    const response = await authFetch(`${_URL}journal-entry/${entryId}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getUserJournalEntryByDate = async (
  entryDate: string,
  userId: string,
): Promise<ApiResponse<JournalEntry> | undefined> => {
  try {
    const response = await authFetch(
      `${_URL}journal-entry/date/${entryDate}?userId=${userId}`,
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

export const updateUserJournalEntry = async (
  entryId: string,
  data: { description: string | null; emotionId: string; userId: string },
): Promise<ApiResponse<JournalEntry> | undefined> => {
  try {
    const response = await authFetch(`${_URL}journal-entry/${entryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },

      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const deleteUserJournalEntry = async (entryId: string) => {
  try {
    const response = await authFetch(`${_URL}journal-entry/${entryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const createUserJournalEntry = async (data: {
  description: string | null;
  emotionId: string;
  userId: string;
}): Promise<ApiResponse<JournalEntry> | undefined> => {
  try {
    const response = await authFetch(`${_URL}journal-entry/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },

      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
