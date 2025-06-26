export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
  globals: {},
};
