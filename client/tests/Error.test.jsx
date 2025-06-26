import React from "react";
import { render, screen } from '@testing-library/react';
import Error from '../src/pages/Error.jsx';

describe('Error', () => {
	it('renders error message', () => {
		render(<Error />);
		expect(screen.getByText(/error/i)).toBeInTheDocument();
	});
});
