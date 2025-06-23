import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
	it('renders homepage content', () => {
		render(<HomePage />);
		expect(screen.getByText(/home/i)).toBeInTheDocument();
	});
});
