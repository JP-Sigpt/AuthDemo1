import { render } from '@testing-library/react';
import ProtectedUserRoute from './ProtectedUserRoute';

describe('ProtectedUserRoute', () => {
	it('renders children if authenticated', () => {
		// Mock context/provider as needed
		const { getByText } = render(<ProtectedUserRoute><div>Protected</div></ProtectedUserRoute>);
		expect(getByText('Protected')).toBeInTheDocument();
	});
});
