import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../types/schema";
import { loginUser } from "../services/api.auth";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import VerifyModal from "./VerifyModal";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onSuccess, accessToken }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(null);
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("otp");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (showPassword) {
      const timer = setTimeout(() => setShowPassword(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPassword]);

  const onSubmit = async (userData) => {
    try {
      const { data } = await loginUser({ ...userData, method: selectedMethod });
      if (data.success) {
        setEmail(userData.email);
        setSessionId(data.sessionId || null);

        if (selectedMethod === "app" && data.mfaSetup) {
          // User needs to set up MFA (show QR code)
          navigate("/setup-2fa", {
            state: {
              email: userData.email,
              qrImageUrl: data.qrImageUrl,
              secret: data.secret,
              sessionId: data.sessionId,
              method: "app",
            },
          });
        } else if (selectedMethod === "app" && data.mfaRequired) {
          // User already has MFA active, go directly to OTP verification
          navigate("/verify", {
            state: {
              email: userData.email,
              method: "app",
              sessionId: data.sessionId,
            },
          });
        } else if (selectedMethod === "otp") {
          // Email OTP flow
          setMfaRequired(false);
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed.");
    }
  };

  const handleOtpVerify = async (data) => {
    if (data.message === "Login successful") {
      onSuccess(data);
      setMfaRequired(null);
    } else {
      setErrorMessage("Invalid OTP");
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-4 justify-center items-start mx-auto text-black p-10 text-base"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <label>Email</label>
          <input
            type="email"
            placeholder="Your email"
            autoComplete="false"
            id="email"
            {...register("email")}
            className="w-full block rounded-lg bg-slate-50 p-2 border-2 border-gray-200"
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="relative w-full">
          <label>Password</label>
          <input
            autoComplete="false"
            placeholder="••••••••••"
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            className="w-full block rounded-lg bg-slate-50 p-2 border-2 border-gray-200"
          />
          <div
            className="absolute top-9 right-5 cursor-pointer p-1 rounded-md hover:bg-slate-200"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
          {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
          {/* <div className="text-right mt-1">
            <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">Forgot Password?</Link>
          </div> */}
        </div>

        <div className="w-full">
          <label>Verification Method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full block rounded-lg bg-slate-50 p-2 border-2 border-gray-200"
          >
            <option value="otp">Email OTP</option>
            <option value="app">MFA App</option>
          </select>
        </div>

        <div className="w-full flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            {...register("rememberMe")}
            className="mr-2"
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        {errorMessage && (
          <motion.p
            className="text-red-500 mt-2 bg-red-100 p-2 text-center rounded font-bold mx-auto w-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", duration: 0.2 }}
          >
            {errorMessage}
          </motion.p>
        )}

        <button
          type="submit"
          className="w-full p-2 mt-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loading /> : "Login"}
        </button>

        <p className="text-center text-sm mx-auto">
          Don't have an account?{" "}
          <Link to="/register" className="ml-1 text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>

      {mfaRequired === false && (
        <VerifyModal
          handleClose={() => setMfaRequired(null)}
          email={email}
          method="otp"
          onVerify={handleOtpVerify}
          accessToken={accessToken}
        />
      )}
    </>
  );
};

export default LoginForm;