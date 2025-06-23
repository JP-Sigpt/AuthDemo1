// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);
// const nodemailer = require("nodemailer");

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;

import { createRequire } from "node:module";
import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST
dotenv.config({ path: path.resolve(".env") });

const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");

console.log("=== NODEMAILER CONFIG DEBUG ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("================================");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
