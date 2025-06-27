// client/jest.config.cjs
const path = require("path");

module.exports = {
  // Root directory for resolving all paths
  rootDir: process.cwd(),

  // Global setup file that runs before all tests
  setupFiles: ["<rootDir>/jest.setup.js"],

  // Define separate configurations for client and E2E
  projects: [
    {
      displayName: "client",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
      testPathIgnorePatterns: ["node_modules", "selenium\\..*\\.test\\.js$"],
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
      testPathIgnorePatterns:
        process.env.CI === "true" && !process.env.CHROME_BIN
          ? ["selenium\\..*\\.test\\.js$"]
          : [],
    },
  ],
};
