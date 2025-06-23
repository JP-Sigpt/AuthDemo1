import { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken } from "../services/api.auth";
import { reset2Fa } from "../services/api.mfauth";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false); // New state for MFA requirement

  const SESSION_DURATION = 3600000; // 1 hour

  // const SESSION_DURATION = 120; // 120 seconds


  const isSessionExpired = async () => {
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

        setUser(updatedUser);
        setIsLogin(true);
        setIsVerified(!!updatedUser.isVerified);
        setMfaRequired(!updatedUser.isVerified && updatedUser.mfaEnabled);


        return false; // Not expired
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("expiration");
        setIsLogin(false);
        setIsVerified(false);
        setMfaRequired(false);
        setUser(null);
        return true; // Still expired
      }
    }

    return false; // Not expired
  };

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const expiration = localStorage.getItem("expiration");

      if (storedUser && expiration) {
        const expired = await isSessionExpired();

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
      // Debug log
      // console.log("[SessionContext] checkSession, user:", storedUser);
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

    // Debug log
    // console.log("[SessionContext] login() called with user:", fullUser);

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
        isSessionExpired,
        accessToken: user?.accessToken,
        // Computed properties for easier use
        isAuthenticated: isLogin && isVerified,
        needsMFA: isLogin && !isVerified && mfaRequired,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
