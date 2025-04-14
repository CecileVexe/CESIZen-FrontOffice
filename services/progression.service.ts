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
