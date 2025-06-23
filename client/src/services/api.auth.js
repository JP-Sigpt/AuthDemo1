import { api } from "./api";

export const registerUser = async ({
  username,
  email,
  password,
  work,
  confirmPassword,
}) => {
  return await api.post("/auth/signup", {
    username,
    email,
    password,
    work,
    confirmPassword,
  });
};

export const loginUser = async ({ email, password, method, rememberMe }) => {
  return await api.post(
    "/auth/login",
    { email, password, method, rememberMe },
    {
      withCredentials: true,
    }
  );
};

export const authStatus = async () => {
  return await api.get("/auth/status", {
    withCredentials: true,
  });
};

export const logoutUser = async (accessToken, sessionId) => {
  return await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-session-id": sessionId,
      },
      withCredentials: true,
    }
  );
};

export const refreshAccessToken = async (refreshToken) => {
  return await api.post(
    "/auth/refresh-token",
    { refreshToken },
    {
      withCredentials: true,
    }
  );
};

export const verifyLoginOtp = async ({
  email,
  otp,
  sessionId,
  isMfa,
  accessToken,
}) => {
  return await api.post(
    "/auth/verify-login-otp",
    { email, otp, sessionId, isMfa },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    }
  );
};
