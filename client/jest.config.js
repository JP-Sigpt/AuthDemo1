export default {
  projects: [
    {
      displayName: "client",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
      transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
      },
      setupFilesAfterEnv: ["@testing-library/jest-dom"],
    },
    {
      displayName: "e2e",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/**/selenium.*.test.js"],
      transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
      },
      transformIgnorePatterns: ["/node_modules/(?!bson|mongodb)/"],
      setupFiles: ["<rootDir>/jest.e2e.setup.js"],
    },
  ],
};

// export default {
//   testEnvironment: "jsdom",
//   moduleFileExtensions: ["js", "jsx"],
//   transform: {
//     "^.+\\.(js|jsx)$": "babel-jest",
//   },
//   setupFilesAfterEnv: ["@testing-library/jest-dom"],
//   testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
// };
