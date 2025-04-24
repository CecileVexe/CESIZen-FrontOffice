const _URL = process.env.EXPO_PUBLIC_API_URL;

export const createCitizen = async (citizen: any) => {
  try {
    const response = await fetch(`${_URL}citizen/clerk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId: citizen }),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getCitizen = async (clerkId: string) => {
  try {
    const response = await fetch(`${_URL}citizen/clerk/${clerkId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const updateCitizen = async (citizenId: string, data: any) => {
  try {
    const response = await fetch(`${_URL}citizen/${citizenId}`, {
      method: "PATCH",
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

export const updateCitizenCredtials = async (data: {
  oldPassword: string;
  password: string;
  clerkId: string;
}) => {
  try {
    const response = await fetch(`${_URL}citizen/credentials`, {
      method: "PATCH",
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
