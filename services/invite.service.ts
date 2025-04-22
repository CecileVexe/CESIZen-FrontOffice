import { CreateInvite } from "../utils/types/invite.types";

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
