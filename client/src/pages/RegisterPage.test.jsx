import { render, screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
	it('renders register form', () => {
		render(<RegisterPage />);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
	});
});
