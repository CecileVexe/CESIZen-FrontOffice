import { ApiResponse } from "../utils/types/Api.types";
import { CreateInvite, Invite } from "../utils/types/invite.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const sendInvite = async (invite: CreateInvite) => {
  try {
    const response = await fetch(`${_URL}invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invite),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const acceptInvite = async (data: {
  inviteId: string;
  citizenId: string;
}) => {
  try {
    const response = await fetch(`${_URL}invite/accept`, {
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

export const getUserInvite = async (
  userId: string,
): Promise<ApiResponse<Invite[]> | undefined> => {
  try {
    const response = await fetch(`${_URL}invite/citizen/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
