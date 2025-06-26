import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPasswordPage from "../src/pages/ResetPasswordPage.jsx";

describe("ResetPasswordPage", () => {
	it("renders reset password form", () => {
		render(
			<MemoryRouter initialEntries={["/reset-password?id=mock-id&token=mock-token"]}>
				<Routes>
					<Route path="/reset-password" element={<ResetPasswordPage />} />
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Confirm new password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
	});
});
