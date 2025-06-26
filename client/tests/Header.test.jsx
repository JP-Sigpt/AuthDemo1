import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../src/components/Header.jsx";
import { MemoryRouter } from "react-router-dom";

// Mock the session context
jest.mock("../src/contexts/SessionContext", () => ({
	useSession: () => ({
		user: null,
		logout: jest.fn(),
		isSessionExpired: jest.fn().mockResolvedValue(false),
	}),
}));

test("renders Header component", () => {
	render(
		<MemoryRouter>
			<Header />
		</MemoryRouter>
	);

	expect(screen.getByRole("banner")).toBeInTheDocument();
});
