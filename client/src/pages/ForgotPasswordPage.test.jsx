import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './ForgotPasswordPage';

describe('ForgotPasswordPage', () => {
	it('renders forgot password form', () => {
		render(<ForgotPasswordPage />);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
	});
});
