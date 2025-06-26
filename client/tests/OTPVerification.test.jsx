import React from "react";
import { render, screen } from "@testing-library/react";
import OTPVerification from "../src/components/OTPVerification.jsx";


// Mock the API module
jest.mock("../src/services/api.otp.js", () => ({
	verifyOtp: jest.fn(),
	verifyLoginOtp: jest.fn(),
}));

describe("OTPVerification", () => {
	it("renders OTP input", () => {
		render(<OTPVerification email="test@example.com" />);
		expect(screen.getAllByRole("textbox")).toHaveLength(6); // 6 input fields
	});
});
