import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock useAnalytics hook
jest.mock("../src/hooks/useAnalytics", () => ({
	useAnalytics: () => ({
		trackEvent: jest.fn(),
		trackPageView: jest.fn(),
		trackAuth: jest.fn(),
		trackFormSubmit: jest.fn(),
		trackError: jest.fn(),
	}),
}));

// Mock useSession from SessionContext
jest.mock("../src/contexts/SessionContext", () => ({
	useSession: () => ({
		login: jest.fn(),
		accessToken: "mockAccessToken",
	}),
}));

// Import LoginPage after mocks
import LoginPage from "../src/pages/LoginPage.jsx";

describe("LoginPage", () => {
	it("renders login form", () => {
		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>
		);

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
	});
});
