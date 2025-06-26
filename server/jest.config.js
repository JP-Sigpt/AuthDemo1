import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["<rootDir>/tests/**/*.(test|spec).[jt]s?(x)"],
  globals: {},
};
