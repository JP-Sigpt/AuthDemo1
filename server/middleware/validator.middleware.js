import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const validator = require("validator");

export const validateSignup = (req, res, next) => {
  const { username, email, work, password } = req.body;

  if (!username || username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters" });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!work || work.trim().length === 0) {
    return res.status(400).json({ error: "Work field is required" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  next();
};
