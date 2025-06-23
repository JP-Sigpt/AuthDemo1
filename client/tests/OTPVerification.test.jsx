import { render, screen } from '@testing-library/react';
import OTPVerification from './OTPVerification';

describe('OTPVerification', () => {
	it('renders OTP input', () => {
		render(<OTPVerification />);
		expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
	});
	// Add more tests for OTP submission, error, etc.
});
