import { Router } from "express";
import {
  signup,
  verifyOtp,
  login,
  verifyLoginOtp,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controllers.js";
import {
  setupMfa,
  verifyMfaOtp,
  resetMfa,
} from "../controllers/mfa.controllers.js";
import { getUsers, updateAdminUser } from "../controllers/admin.controllers.js";
import { getUserActivityLogs } from "../controllers/userActivity.controllers.js";
import { validateSignup } from "../middleware/validator.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = Router();

// Public auth
router.post("/signup", validateSignup, signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/logout", authenticate, logout);
router.post("/refresh-token", refreshToken);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// MFA routes (protected)
router.post("/mfa/setup", protect, setupMfa); // Requires authentication
router.post("/mfa/verify", verifyMfaOtp); // Requires authentication
router.post("/mfa/reset", protect, resetMfa); // Requires authentication

// Admin
router.get("/admin/users", protect, getUsers);
router.patch("/admin/update/:id", protect, updateAdminUser);
router.get("/admin/activity-logs", protect, getUserActivityLogs);

router.get("/profile", protect, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

export default router;
