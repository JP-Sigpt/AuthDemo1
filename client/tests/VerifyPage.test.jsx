import React from "react";
import { render, screen } from "@testing-library/react";
import VerifyPage from "../src/pages/VerifyPage.jsx";
import { MemoryRouter } from "react-router-dom";

// Mock useSession
jest.mock("../src/contexts/SessionContext.jsx", () => ({
	useSession: () => ({
		login: jest.fn(),
	}),
}));

// Mock useLocation and useNavigate
jest.mock("react-router-dom", () => {
	const actual = jest.requireActual("react-router-dom");
	return {
		...actual,
		useLocation: () => ({
			state: {
				email: "test@example.com",
				method: "totp",
				sessionId: "123",
			},
		}),
		useNavigate: () => jest.fn(),
	};
});

describe("VerifyPage", () => {
	it("renders verify page", () => {
		render(
			<MemoryRouter>
				<VerifyPage />
			</MemoryRouter>
		);

		expect(screen.getByText(/verify your token/i)).toBeInTheDocument();
		expect(
			screen.getByText(/enter the 6-digit otp sent to your email/i)
		).toBeInTheDocument();
	});
});
