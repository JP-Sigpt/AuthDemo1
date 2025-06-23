import speakeasy from "speakeasy";
import qrcode from "qrcode";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const setupMfa = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: "User not found" });

    let secretBase32 = user.twoFactorSecret;
    if (!secretBase32 || user.isMfaActive) {
      // Only generate a new secret if none exists or MFA is already active
      const secret = speakeasy.generateSecret({
        name: `YourApp:${user.email}`,
      });
      secretBase32 = secret.base32;
      user.twoFactorSecret = secretBase32;
      user.isMfaActive = false;
      await user.save();
    }

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secretBase32,
      label: user.email,
      issuer: "YourApp",
      encoding: "base32",
    });

    const qrImageUrl = await qrcode.toDataURL(otpauthUrl);

    res.json({
      qrImageUrl,
      secret: secretBase32,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyMfaOtp = async (req, res) => {
  try {
    const { email, otp, sessionId } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.twoFactorSecret) {
      return res.status(404).json({ error: "User or secret not found" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ error: "Invalid token" });
    }

    user.isMfaActive = true;
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

    res.status(200).json({
      message: "MFA verification successful",
      accessToken,
      refreshToken,
      sessionId: crypto.randomUUID(),
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

export const resetMfa = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    user.twoFactorSecret = null;
    user.isMfaActive = false;
    await user.save();

    res.status(200).json({ message: "MFA reset successful" });
  } catch (error) {
    res.status(500).json({
      error: "Error while resetting MFA",
      message: error.message,
    });
  }
};
