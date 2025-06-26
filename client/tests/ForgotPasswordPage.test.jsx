import React from "react";
import { render, screen } from "@testing-library/react";
import ForgotPasswordPage from "../src/pages/ForgotPasswordPage";

describe("ForgotPasswordPage", () => {
	it("renders forgot password form", () => {
		render(<ForgotPasswordPage />);
		expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
	});
});
