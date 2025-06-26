import { refreshAccessToken } from "../services/api.auth";

export const SESSION_DURATION = 3600000; // 1 hour

export const isSessionExpired = async () => {
  const expiration = localStorage.getItem("expiration");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!expiration || !storedUser) return true;

  const expired = Date.now() > parseInt(expiration, 10);

  if (expired) {
    try {
      const response = await refreshAccessToken(storedUser.refreshToken);
      const newAccessToken = response.data.accessToken;
      const newExpiration = Date.now() + SESSION_DURATION;
      const updatedUser = {
        ...storedUser,
        accessToken: newAccessToken,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("expiration", newExpiration);
      return false; // Not expired
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("expiration");
      return true; // Still expired
    }
  }
  return false; // Not expired
};
