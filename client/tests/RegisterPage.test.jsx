import React from "react";
import { render, screen } from "@testing-library/react";
import RegisterPage from "../src/pages/RegisterPage.jsx";

// ✅ Mock the analytics hook to avoid `import.meta.env` issues
jest.mock("../src/hooks/useAnalytics.js", () => ({
	useAnalytics: () => ({
		trackAuth: jest.fn(),
		trackFormSubmit: jest.fn(),
		trackError: jest.fn(),
	}),
}));

// Wrap with MemoryRouter to support useNavigate in nested components
import { MemoryRouter } from "react-router-dom";

describe("RegisterPage", () => {
	it("renders register form", () => {
		render(
			<MemoryRouter>
				<RegisterPage />
			</MemoryRouter>
		);

		// You can use getByPlaceholderText because labels lack htmlFor
		expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
	});
});
