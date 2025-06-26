import React from "react";
import { render, screen } from "@testing-library/react";
import TwoFactorSetup from "../src/components/TwoFactorSetup.jsx";

describe("TwoFactorSetup", () => {
	it("renders 2FA setup instructions", () => {
		render(<TwoFactorSetup />);

		// Title
		expect(
			screen.getByText(/turn on 2-step verification/i)
		).toBeInTheDocument();

		// Subtitle
		expect(
			screen.getByText(/open authenticator app and choose to scan qr code/i)
		).toBeInTheDocument();

		// Error message
		expect(screen.getByText(/failed to load qr code/i)).toBeInTheDocument();

		// Manual code entry label
		expect(screen.getByText(/or enter the code manually/i)).toBeInTheDocument();

		// Input field for secret code
		expect(screen.getByRole("textbox")).toBeInTheDocument();

		// Continue button
		const button = screen.getByRole("button", {
			name: /continue to verification/i,
		});
		expect(button).toBeInTheDocument();
		expect(button).toBeDisabled(); // Because it's disabled by default
	});
});
