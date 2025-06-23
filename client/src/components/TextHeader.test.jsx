import { render, screen } from '@testing-library/react';
import TextHeader from './TextHeader';

describe('TextHeader', () => {
	it('renders text header', () => {
		render(<TextHeader text="Test Header" />);
		expect(screen.getByText(/test header/i)).toBeInTheDocument();
	});
});
