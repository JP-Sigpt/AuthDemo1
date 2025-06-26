import {
  verifyOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
} from "../src/services/api.otp.js";

describe("api.otp", () => {
  it("should export verifyOtp", () => {
    expect(verifyOtp).toBeDefined();
  });
  // Add more tests for each function, mock axios if needed
});
