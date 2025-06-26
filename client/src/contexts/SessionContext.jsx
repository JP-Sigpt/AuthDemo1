import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken } from "../services/api.auth";
import { reset2Fa } from "../services/api.mfauth";
import { SESSION_DURATION, isSessionExpired as checkSessionExpired } from "./sessionUtils";

const SessionContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false); // New state for MFA requirement

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const expiration = localStorage.getItem("expiration");

      if (storedUser && expiration) {
        const expired = await checkSessionExpired();

        if (!expired) {
          setIsLogin(true);
          setIsVerified(!!storedUser.isVerified);
          setMfaRequired(!storedUser.isVerified && storedUser.mfaEnabled);
          setUser(storedUser);
        } else {
          setIsLogin(false);
          setIsVerified(false);
          setMfaRequired(false);
          setUser(null);
        }
      } else {
        setIsLogin(false);
        setIsVerified(false);
        setMfaRequired(false);
        setUser(null);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  // Updated login function to handle MFA states
  const login = (accessToken, refreshToken, sessionId, userData, mfaSetup = false) => {
    const expirationTime = Date.now() + SESSION_DURATION;

    // Ensure isVerified is true if accessToken is present (i.e., after verification)
    const fullUser = {
      ...userData,
      isVerified: userData.isVerified || !!accessToken, // force true if accessToken exists
      accessToken,
      refreshToken,
      sessionId,
    };

    setIsLogin(true);
    setIsVerified(!!fullUser.isVerified);
    setMfaRequired(mfaSetup || (!fullUser.isVerified && fullUser.mfaEnabled));
    setUser(fullUser);

    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("expiration", expirationTime);

    window.dispatchEvent(new Event("sessionUpdate"));
  };

  // Function to complete MFA verification
  const completeMFA = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData,
      isVerified: true,
    };

    setIsVerified(true);
    setMfaRequired(false);
    setUser(updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setIsLogin(false);
    setIsVerified(false);
    setMfaRequired(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("expiration");
  };

  const handleResetMfa = async () => {
    try {
      await reset2Fa(user?.accessToken);
      alert("MFA has been reset. Please log in again to set up a new device.");
      // Optionally, log the user out or redirect to login/setup
    } catch (err) {
      alert("Failed to reset MFA: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <SessionContext.Provider
      value={{
        isLogin,
        isVerified,
        mfaRequired,
        user,
        loading,
        login,
        logout,
        completeMFA,
        isSessionExpired: checkSessionExpired,
        accessToken: user?.accessToken,
        isAuthenticated: isLogin && isVerified,
        needsMFA: isLogin && !isVerified && mfaRequired,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
