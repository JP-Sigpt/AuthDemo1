export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx"],
  transform: {},
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
