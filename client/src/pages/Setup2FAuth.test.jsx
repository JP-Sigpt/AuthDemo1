import { render, screen } from '@testing-library/react';
import Setup2FAuth from './Setup2FAuth';

describe('Setup2FAuth', () => {
	it('renders 2FA setup page', () => {
		render(<Setup2FAuth />);
		expect(screen.getByText(/set up two-factor/i)).toBeInTheDocument();
	});
});
