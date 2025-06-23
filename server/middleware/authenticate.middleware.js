// middleware/authenticate.middleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (user && user.isVerified) {
        req.user = user; // valid user → set req.user
      } else {
        req.user = null; // user not valid → soft fail
      }
    } catch (error) {
      req.user = null; // token invalid or expired → soft fail
    }
  } else {
    req.user = null; // no token → soft fail
  }

  next(); // always call next
};
