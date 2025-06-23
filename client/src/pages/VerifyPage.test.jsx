import { render, screen } from '@testing-library/react';
import VerifyPage from './VerifyPage';

describe('VerifyPage', () => {
	it('renders verify page', () => {
		render(<VerifyPage />);
		expect(screen.getByText(/verify/i)).toBeInTheDocument();
	});
});
