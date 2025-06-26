// jest.config.cjs
const path = require("path");

module.exports = {
  // Global setup files that run once before all tests
  setupFiles: ["<rootDir>/jest.setup.js"],

  // Root directory for tests and modules
  rootDir: process.cwd(),

  projects: [
    {
      displayName: "client",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
      testPathIgnorePatterns: [
        "node_modules",
        "selenium\\..*\\.test\\.js$", // Use proper regex escaping
      ],
      transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
      },
      setupFilesAfterEnv: ["@testing-library/jest-dom"],
      moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
    },
    {
      displayName: "e2e",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/**/selenium.*.test.js"],
      setupFiles: ["<rootDir>/jest.setup.js"],
      transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
      },
      transformIgnorePatterns: [
        "/node_modules/(?!(bson|mongodb|whatwg-url|tr46|webidl-conversions)/)",
      ],
      moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
      // Only skip e2e tests in CI if Chrome is not available
      testPathIgnorePatterns:
        process.env.CI === "true" && !process.env.CHROME_BIN
          ? ["selenium\\..*\\.test\\.js$"]
          : [],
    },
  ],
};
