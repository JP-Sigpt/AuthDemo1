// server/jest.setup.js (CommonJS-friendly)
const { config } = require("dotenv");
const path = require("path");

// Explicitly load .env.test
config({ path: path.resolve(__dirname, ".env.test") });

console.log("Loaded envs:", {
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  EMAIL_USER: process.env.EMAIL_USER,
});

const { TextEncoder, TextDecoder } = require("util");
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

if (typeof globalThis.fetch === "undefined") {
  try {
    globalThis.fetch = require("node-fetch");
  } catch (e) {
    console.warn("Failed to polyfill fetch:", e.message);
  }
}

jest.setTimeout(30000);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// // jest.setup.js (ESM-compatible)
// import { TextEncoder, TextDecoder } from "util";
// import { setTimeout } from "timers/promises";

// globalThis.TextEncoder = TextEncoder;
// globalThis.TextDecoder = TextDecoder;

// if (typeof globalThis.fetch === "undefined") {
//   try {
//     const fetch = await import("node-fetch");
//     globalThis.fetch = fetch.default;
//   } catch (e) {
//     console.warn("⚠️ Failed to polyfill fetch:", e.message);
//   }
// }

// // Jest environment config
// jest.setTimeout(30000);

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// // jest.setup.js
// const { TextEncoder, TextDecoder } = require("util");

// // Polyfill TextEncoder/TextDecoder for MongoDB and other modules
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

// // Additional polyfills that might be needed
// if (typeof global.fetch === "undefined") {
//   global.fetch = require("node-fetch");
// }

// // Set longer timeout for database operations
// jest.setTimeout(30000);
