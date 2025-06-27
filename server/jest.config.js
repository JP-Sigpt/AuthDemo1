import dotenv from "dotenv";

// Load test-specific environment variables
dotenv.config({ path: ".env.test" });

export default {
  // Use Node test environment for backend tests
  testEnvironment: "node",

  // File extensions Jest should handle
  moduleFileExtensions: ["js", "json"],

  // Transform JS using Babel
  transform: {
    "^.+\\.js$": "babel-jest",
  },

  // Match test files
  testMatch: ["<rootDir>/tests/**/*.(test|spec).js"],

  // Setup files if needed (e.g., for global setup like DB mocks)
  setupFiles: [],

  // Set timeout globally
  testTimeout: 30000,

  // Mock setup
  setupFilesAfterEnv: [],

  // Clear mocks automatically
  clearMocks: true,

  // Collect coverage
  collectCoverage: false,

  // Coverage directory
  coverageDirectory: "coverage",

  // Coverage reporters
  coverageReporters: ["text", "lcov", "clover"],

  // Handle E2E tests in CI
  testPathIgnorePatterns:
    process.env.CI === "true" ? ["<rootDir>/tests/selenium.e2e.test.js"] : [],
};

// import dotenv from "dotenv";
// dotenv.config({ path: ".env.test" });

// export default {
//   testEnvironment: "node",
//   moduleFileExtensions: ["js"],
//   transform: {
//     "^.+\\.js$": "babel-jest",
//   },
//   testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
//   globals: {},
// };
