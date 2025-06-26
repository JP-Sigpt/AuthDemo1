import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../src/pages/HomePage";
import { MemoryRouter } from "react-router-dom";

// Mock useSession to avoid user undefined errors
jest.mock("../src/contexts/SessionContext", () => ({
	useSession: () => ({
		user: { username: "JohnDoe" },
		logout: jest.fn(),
		isSessionExpired: jest.fn(() => false),
	}),
}));

describe("HomePage", () => {
	it("renders homepage content", () => {
		render(
			<MemoryRouter>
				<HomePage />
			</MemoryRouter>
		);
		expect(screen.getByText(/Welcome , JohnDoe/i)).toBeInTheDocument();
	});
});
