// jest.setup.js
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (e) {
    // Optional: Log the error
  }
}

jest.setTimeout(30000);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

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
