import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
	it('renders email and password fields', () => {
		render(<LoginForm />);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	it('calls onSubmit with valid data', () => {
		const mockSubmit = jest.fn();
		render(<LoginForm onSubmit={mockSubmit} />);
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
		fireEvent.click(screen.getByRole('button', { name: /login/i }));
		expect(mockSubmit).toHaveBeenCalled();
	});

	// Add more tests for error display, loading state, etc.
});
