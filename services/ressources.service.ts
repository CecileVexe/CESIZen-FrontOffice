import { ApiResponse } from "../utils/types/Api.types";
import { Ressource } from "../utils/types/Ressources.types";

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const getRessources = async (
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<Ressource[]> | undefined> => {
  try {
    const response = await fetch(
      `${_URL}ressource?page=${page}&perPage=${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getRessource = async (
  id: string
): Promise<ApiResponse<Ressource> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource/${id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getUserRessource = async (
  citizenId: string
): Promise<ApiResponse<Ressource> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource/citizen/${citizenId}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const createRessource = async (
  data: any
): Promise<ApiResponse<Ressource> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource`, {
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

export const updateRessource = async (
  ressourceId: string,
  data: any
): Promise<ApiResponse<Ressource> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource/${ressourceId}`, {
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

export const deleteRessource = async (
  ressourceId: string
): Promise<ApiResponse<Ressource> | undefined> => {
  try {
    const response = await fetch(`${_URL}ressource/${ressourceId}`, {
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
