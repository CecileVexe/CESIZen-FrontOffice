const _URL = process.env.EXPO_PUBLIC_API_URL;

export const createUser = async (citizen: any) => {
  try {
    const response = await fetch(`${_URL}user/clerk`, {
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

export const getUser = async (clerkId: string) => {
  try {
    const response = await fetch(`${_URL}user/clerk/${clerkId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${_URL}user`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const updateUser = async (citizenId: string, data: any) => {
  try {
    const response = await fetch(`${_URL}user/${citizenId}`, {
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

export const updateUserCredtials = async (data: {
  oldPassword: string;
  password: string;
  clerkId: string;
}) => {
  try {
    const response = await fetch(`${_URL}user/credentials`, {
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

export const deleteUser = async (id: string) => {
  try {
    const response = await fetch(`${_URL}user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
