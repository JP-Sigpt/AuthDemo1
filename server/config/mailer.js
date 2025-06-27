import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST
dotenv.config({ path: path.resolve(".env") });

console.log("=== NODEMAILER CONFIG DEBUG ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("================================");

let transporter;

if (process.env.CI === "true" || process.env.NODE_ENV === "test") {
  // Mock transport for CI/test: does not send real emails, just logs
  transporter = {
    sendMail: async (options) => {
      console.log("Mock sendMail called with:", options);
      return { messageId: "mocked" };
    },
  };
} else {
  // Real transport for dev/prod
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export default transporter;
