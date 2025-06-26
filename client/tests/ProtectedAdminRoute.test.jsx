import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "../src/components/ProtectedAdminRoute";

describe("ProtectedAdminRoute", () => {
	it("renders children if admin", () => {
		render(
			<MemoryRouter initialEntries={["/admin"]}>
				<Routes>
					<Route element={<ProtectedAdminRoute />}>
						<Route path="/admin" element={<div>Admin</div>} />
					</Route>
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText("Admin")).toBeInTheDocument();
	});
});
