import React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TwoFactorSetup from "../components/TwoFactorSetup";
import useBackToRoot from "../hooks/useBackToRoot";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useSession } from "../contexts/SessionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { setup2Fa } from "../services/api.mfauth";

const Setup2FAuth = () => {
  const { accessToken } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const backToLogin = useBackToRoot("/login");
  const { email, method, qrImageUrl, secret, sessionId } = location.state || {};
  const [loading, setLoading] = useState(!qrImageUrl); // Only load if no QR data
  const [response, setResponse] = useState({ qrImageUrl, secret });
  const [isSetupConfirmed, setIsSetupConfirmed] = useState(false);
  const [error, setError] = useState(null); // Error state for debugging

  useEffect(() => {
    if (!location.state) {
      console.error("No state data received in /setup-2fa");
      setError("No state data available");
    } else if (method === "otp") {
      navigate("/verify", { state: { email, method: "otp", accessToken } });
    } else if (method === "app" && !qrImageUrl) {
      fetchQRCode();
    } else {
      setLoading(false);
    }
  }, [accessToken, method, qrImageUrl, navigate, email, sessionId, location.state]);

  useEffect(() => {
    const handleSessionUpdate = () => {
      if (method === "app" && !qrImageUrl) {
        fetchQRCode();
      }
    };
    window.addEventListener("sessionUpdate", handleSessionUpdate);
    return () => window.removeEventListener("sessionUpdate", handleSessionUpdate);
  }, [method, qrImageUrl]);

  const fetchQRCode = async () => {
    if (!accessToken) {
      console.error("No access token available");
      setLoading(false);
      return;
    }
    try {
      const { data } = await setup2Fa(accessToken);
      setResponse(data);
      setLoading(false);
    } catch (error) {
      console.error("MFA Setup Error:", error); // Debug log
      setError(error.message);
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/verify", {
      state: {
        email,
        method: "app",
        sessionId,
      },
    });
  };

  const handleConfirmSetup = () => {
    setIsSetupConfirmed(true);
  };

  if (method !== "app") return null; // Only render for app method

  return (
    <div className="flex w-screen min-h-[100vh] overflow-x-hidden">
      <motion.div
        className="flex-1 flex flex-col justify-center items-center"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <div className="shadow-2xl rounded-md border-2 border-slate-50 bg-gradient-to-b from-blue-300/30 via-white to-gray-100 bg-opacity-70 m-2 py-5">
          <div className="mx-4 z-100">
            <button onClick={backToLogin}>
              <FaArrowCircleLeft />
            </button>
          </div>
          {error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : (
            <TwoFactorSetup
              qrImageUrl={response.qrImageUrl || qrImageUrl}
              secret={response.secret || secret}
              onContinue={handleContinue}
              onConfirm={handleConfirmSetup}
              loading={loading}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Setup2FAuth;