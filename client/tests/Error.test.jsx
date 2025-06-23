import { render, screen } from '@testing-library/react';
import Error from './Error';

describe('Error', () => {
	it('renders error message', () => {
		render(<Error />);
		expect(screen.getByText(/error/i)).toBeInTheDocument();
	});
});
