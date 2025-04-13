import { CreateComment } from "../utils/types/Comment.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const leaveAComment = async (comment: CreateComment) => {
  try {
    const response = await fetch(`${_URL}comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
