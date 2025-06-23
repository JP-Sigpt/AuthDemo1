import { render } from '@testing-library/react';
import ProtectedAdminRoute from './ProtectedAdminRoute';

describe('ProtectedAdminRoute', () => {
	it('renders children if admin', () => {
		// Mock context/provider as needed
		const { getByText } = render(<ProtectedAdminRoute><div>Admin</div></ProtectedAdminRoute>);
		expect(getByText('Admin')).toBeInTheDocument();
	});
});
