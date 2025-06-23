import { render, screen } from '@testing-library/react';
import RegisterForm from './RegisterForm';

describe('RegisterForm', () => {
	it('renders registration fields', () => {
		render(<RegisterForm />);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});
	// Add more tests for form submission, validation, etc.
});
