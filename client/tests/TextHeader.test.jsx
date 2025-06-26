import React from "react";
import { render, screen } from '@testing-library/react';
import TextHeader from '../src/components/TextHeader.jsx';
import VerifyModal from "../src/components/VerifyModal.jsx";

describe('TextHeader', () => {
	it('renders text header', () => {
		render(<TextHeader title="Test Header" />);
		expect(screen.getByText(/test header/i)).toBeInTheDocument();
	});
});

describe("VerifyModal", () => {
	it("renders modal", () => {
		render(
			<VerifyModal
				open={true}
				email="test@example.com"
				method="totp"
				sessionId="123"
				handleClose={() => { }}
				onVerify={() => { }}
			/>
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
	// Add more tests for modal actions, close, etc.
});
