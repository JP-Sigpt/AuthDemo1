import {
  verifyOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
} from "./api.otp";

describe("api.otp", () => {
  it("should export verifyOtp", () => {
    expect(verifyOtp).toBeDefined();
  });
  // Add more tests for each function, mock axios if needed
});
