import { api } from "./api.js";

export const verifyOtp = async (data) => {
  return await api.post("/auth/verify-otp", data);
};

export const verifyLoginOtp = async ({ email, otp, userAgent, ipAddress }) => {
  return await api.post("/auth/verify-login-otp", {
    email,
    otp,
    userAgent,
    ipAddress,
  });
};

export const forgotPassword = async (email) => {
  return await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (data) => {
  return await api.post("/auth/reset-password", data);
};
