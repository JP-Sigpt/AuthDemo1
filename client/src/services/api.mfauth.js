import { api } from "./api";

export const setup2Fa = async (accessToken) => {
  return await api.post(
    "/auth/mfa/setup",
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    }
  );
};

export const verify2Fa = async ({ email, otp, isMfa, sessionId }) => {
  const endpoint = isMfa ? "/auth/mfa/verify" : "/auth/verify-login-otp";
  return await api.post(
    endpoint,
    { email, otp, sessionId },
    { withCredentials: true }
  );
};

export const reset2Fa = async (accessToken) => {
  return await api.post(
    "/auth/mfa/reset",
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    }
  );
};
