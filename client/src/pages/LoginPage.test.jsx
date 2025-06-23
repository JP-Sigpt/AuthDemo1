import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
	it('renders login form', () => {
		render(<LoginPage />);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
	});
});
