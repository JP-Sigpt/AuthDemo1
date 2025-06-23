import { render } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
	it('renders children', () => {
		const { getByText } = render(<Layout><div>Child</div></Layout>);
		expect(getByText('Child')).toBeInTheDocument();
	});
});
