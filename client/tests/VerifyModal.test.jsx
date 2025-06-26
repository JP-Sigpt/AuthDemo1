import React from "react";
import { render, screen } from "@testing-library/react";
import VerifyModal from "../src/components/VerifyModal.jsx";

describe("VerifyModal", () => {
	it("renders modal", () => {
		render(
			<VerifyModal
				handleClose={() => { }}
				email="test@example.com"
				method="email"
				sessionId="abc123"
				onVerify={jest.fn()}
			/>
		);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText(/verify your token/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/enter code/i)).toBeInTheDocument();
	});
});
