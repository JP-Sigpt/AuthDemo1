import User from "../models/User.js";
import Otp from "../models/Otp.js";
import UserActivity from "../models/UserActivity.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

import transporter from "../config/mailer.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { comparePassword, encryptPassword } from "../utils/encryption.js";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

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

    user.isVerified = true; // Initial email verification
    await user.save();
    await Otp.deleteOne({ _id: otpRecord._id });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
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
  const { email, password, method, rememberMe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
      work: user.work,
      permissions: user.permissions,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: rememberMe ? "30d" : "2d",
    });
    const sessionId = crypto.randomUUID();
    // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    //   expiresIn: rememberMe ? "15s" : "15s",
    // });
    // const sessionId = crypto.randomUUID();

    console.log("User MFA status - isMfaActive:", user.isMfaActive); // Debug log

    if (method === "app" && !user.isMfaActive) {
      // Always use the existing secret if present, otherwise generate a new one
      let secretBase32 = user.twoFactorSecret;
      if (!secretBase32) {
        const secret = speakeasy.generateSecret({
          name: `YourApp:${user.email}`,
        });
        secretBase32 = secret.base32;
        user.twoFactorSecret = secretBase32;
        await user.save();
      }

      const otpauthUrl = speakeasy.otpauthURL({
        secret: secretBase32,
        label: user.email,
        issuer: "YourApp",
        encoding: "base32",
      });

      const qrImageUrl = await qrcode.toDataURL(otpauthUrl);

      return res.json({
        success: true,
        message: "MFA setup required",
        mfaSetup: true,
        qrImageUrl,
        secret: secretBase32,
        sessionId,
      });
    }

    // if (method === "app" && !user.isMfaActive) {
    //   const secret = speakeasy.generateSecret({
    //     name: `YourApp:${user.email}`,
    //   });
    //   user.twoFactorSecret = secret.base32;
    //   await user.save();

    //   const otpauthUrl = speakeasy.otpauthURL({
    //     secret: secret.base32,
    //     label: user.email,
    //     issuer: "YourApp",
    //     encoding: "base32",
    //   });

    //   const qrImageUrl = await qrcode.toDataURL(otpauthUrl);

    //   return res.json({
    //     success: true,
    //     message: "MFA setup required",
    //     mfaSetup: true,
    //     qrImageUrl,
    //     secret: secret.base32,
    //     sessionId,
    //   });
    else if (method === "app" && user.isMfaActive) {
      // MFA is active, proceed to verification
      return res.json({
        success: true,
        message: "MFA required",
        mfaRequired: true,
        sessionId,
        user: { ...user.toJSON(), isVerified: false }, // Temporary state in response
      });
    } else if (method === "otp") {
      // Email OTP flow
      const otp = generateOTP();
      await Otp.create({ userId: user._id, otp, createdAt: new Date() });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Login OTP",
        text: `Your login OTP is: ${otp}`,
      });
      return res.json({
        success: true,
        message: "OTP sent to email",
        mfaRequired: false,
        sessionId,
        user: { ...user.toJSON(), isVerified: false }, // Temporary state in response
      });
    }

    // User is fully verified
    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      sessionId,
      user: { ...user.toJSON(), isVerified: true },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const verifyLoginOtp = async (req, res) => {
  const { email, otp, sessionId, isMfa } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let otpRecord;
    if (isMfa) {
      return res.status(400).json({ error: "Use MFA verification endpoint" });
    } else {
      otpRecord = await Otp.findOneAndDelete({ userId: user._id, otp });
    }

    if (!otpRecord)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    user.isVerified = true;
    await user.save();

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

    const sessionIdFromHeader =
      req.headers["x-session-id"] || crypto.randomUUID();

    await UserActivity.create({
      userId: user._id,
      action: "login",
      ipAddress: req.ip || "Unknown",
      userAgent: req.get("User-Agent") || "Unknown",
      sessionId: sessionIdFromHeader,
      location: { city: "Unknown", country: "Unknown" },
    });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      sessionId: sessionIdFromHeader,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        work: user.work,
        permissions: user.permissions,
        _id: user._id,
        isVerified: true,
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
