import { getClerkInstance } from "@clerk/clerk-expo";

export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const clerkInstance = getClerkInstance();
  // Use `getToken()` to get the current session token
  const token = await clerkInstance.session?.getToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
