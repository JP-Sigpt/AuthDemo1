import React from "react";
import { render, screen } from "@testing-library/react";
import Setup2FAuth from "../src/pages/Setup2FAuth.jsx";

// Mock useSession to return a fake accessToken
jest.mock("../src/contexts/SessionContext", () => ({
	useSession: () => ({
		accessToken: "mock-access-token",
	}),
}));

// Mock useNavigate and useLocation from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
	useLocation: () => ({
		state: {
			email: "test@example.com",
			method: "app",
			qrImageUrl: "mock-qr-url",
			secret: "mock-secret",
			sessionId: "mock-session-id",
		},
	}),
}));

// Mock api.mfauth to not affect test (won't be called in this case)
jest.mock("../src/services/api.mfauth", () => ({
	setup2Fa: jest.fn(),
}));

describe("Setup2FAuth", () => {
	it("renders 2FA setup page with mock secret", async () => {
		render(<Setup2FAuth />);

		// ✅ We are rendering the `TwoFactorSetup` child component,
		// so we need to query inside what it renders

		// Check if QR image renders
		expect(
			await screen.findByAltText(/qr code/i)
		).toBeInTheDocument();

		// Check if secret is shown in readonly input
		expect(
			screen.getByDisplayValue(/mock-secret/i)
		).toBeInTheDocument();

		// Continue button check
		expect(
			screen.getByRole("button", { name: /continue/i })
		).toBeInTheDocument();
	});
});
