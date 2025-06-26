import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock('../src/hooks/useAnalytics.js', () => ({
	useAnalytics: () => ({
		trackAuth: jest.fn(),
		trackFormSubmit: jest.fn(),
		trackError: jest.fn(),
	}),
}));

//  Mock loginUser to simulate success
jest.mock('../src/services/api.auth.js', () => ({
	loginUser: jest.fn(() =>
		Promise.resolve({
			data: { success: true, sessionId: "123", mfaRequired: false },
		})
	),
}));

import LoginForm from "../src/components/LoginForm.jsx";

describe("LoginForm", () => {
	it("renders email and password fields", () => {
		render(
			<MemoryRouter>
				<LoginForm onSuccess={jest.fn()} accessToken="dummy" />
			</MemoryRouter>
		);

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	it("submits form with valid data and shows VerifyModal", async () => {
		const onSuccessMock = jest.fn();

		render(
			<MemoryRouter>
				<LoginForm onSuccess={onSuccessMock} accessToken="dummy" />
			</MemoryRouter>
		);

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "user@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "Password123!" },
		});

		fireEvent.click(screen.getByRole("button"));

		await waitFor(() => {
			expect(screen.getByText(/verify your token/i)).toBeInTheDocument();
		});

		// onSuccessMock is NOT expected to be called yet!
	});

});
