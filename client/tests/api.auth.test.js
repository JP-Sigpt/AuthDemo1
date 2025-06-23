import {
  registerUser,
  loginUser,
  authStatus,
  logoutUser,
  refreshAccessToken,
  verifyLoginOtp,
} from "./api.auth";

describe("api.auth", () => {
  it("should export registerUser", () => {
    expect(registerUser).toBeDefined();
  });
  it("should export loginUser", () => {
    expect(loginUser).toBeDefined();
  });
  it("should export authStatus", () => {
    expect(authStatus).toBeDefined();
  });
  it("should export logoutUser", () => {
    expect(logoutUser).toBeDefined();
  });
  it("should export refreshAccessToken", () => {
    expect(refreshAccessToken).toBeDefined();
  });
  it("should export verifyLoginOtp", () => {
    expect(verifyLoginOtp).toBeDefined();
  });
  // Add more tests for each function, mock axios if needed
});
