import User from "../models/User.js";
import Otp from "../models/Otp.js";
import UserActivity from "../models/UserActivity.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

import transporter from "../config/mailer.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { comparePassword, encryptPassword } from "../utils/encryption.js";

import crypto from "crypto";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { username, email, work, password, role, permissions } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    user = new User({
      username,
      email,
      work,
      password,
      role,
      permissions,
    });
    await user.save();

    const otp = generateOTP();
    await new Otp({ userId: user._id, otp }).save();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account",
      text: `Your OTP is: ${otp}`,
    });

    return res
      .status(201)
      .json({ message: "Signup successful, please verify OTP" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const otpRecord = await Otp.findOne({ userId: user._id, otp });
    if (!otpRecord)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: otpRecord._id });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );
    res.json({ message: "Account verified", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified)
      return res.status(403).json({ error: "Account not verified" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const otp = generateOTP();
    await Otp.create({ userId: user._id, otp, createdAt: new Date() });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login Verification",
      text: `Your login OTP is: ${otp}`,
    });

    return res.json({ message: "OTP sent for login verification" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyLoginOtp = async (req, res) => {
  const { email, otp, ipAddress, userAgent } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpRecord = await Otp.findOneAndDelete({ userId: user._id, otp });
    if (!otpRecord)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        work: user.work,
        permissions: user.permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        work: user.work,
        permissions: user.permissions,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    const sessionId = crypto.randomUUID();

    await UserActivity.create({
      userId: user._id,
      action: "login",
      ipAddress: ipAddress || req.ip || "Unknown",
      userAgent: userAgent || req.get("User-Agent") || "Unknown",
      sessionId,
      location: { city: "Unknown", country: "Unknown" },
    });

    // Send full user object here
    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      sessionId,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        work: user.work,
        permissions: user.permissions,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token required" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logout = async (req, res) => {
  try {
    const user = req.user;
    const ipAddress = req.ip;
    const userAgent = req.get("User-Agent") || "Unknown";
    const sessionId = req.headers["x-session-id"] || null;

    await UserActivity.create({
      userId: user._id,
      action: "logout",
      ipAddress,
      userAgent,
      location: { city: "Unknown", country: "Unknown" },
      sessionId,
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed. Try again." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent",
      });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);
    await PasswordResetToken.findOneAndUpdate(
      { userId: user._id },
      { token, expiresAt },
      { upsert: true }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${user._id}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token, newPassword } = req.body;
  try {
    const resetToken = await PasswordResetToken.findOne({
      userId,
      token,
    });

    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (resetToken.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return res.status(400).json({ error: "Token has expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;
    await user.save();
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Changed Successfully",
      text: "Your password has been successfully updated.",
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
