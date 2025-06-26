import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedUserRoute from "../src/components/ProtectedUserRoute.jsx";

// Mock useSession
jest.mock("../src/contexts/SessionContext", () => ({
	useSession: () => ({
		isLogin: true,
		isVerified: true,
		loading: false,
	}),
}));

describe("ProtectedUserRoute", () => {
	it("renders children if authenticated", () => {
		render(
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route element={<ProtectedUserRoute />}>
						<Route path="/protected" element={<div>Protected Content</div>} />
					</Route>
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
	});
});
