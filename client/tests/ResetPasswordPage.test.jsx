import { render, screen } from '@testing-library/react';
import ResetPasswordPage from './ResetPasswordPage';

describe('ResetPasswordPage', () => {
	it('renders reset password form', () => {
		render(<ResetPasswordPage />);
		expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
	});
});
