import React from "react";
import { render, screen } from '@testing-library/react';
import Loading from '../src/components/Loading.jsx';

describe('Loading', () => {
	it('renders loading spinner', () => {
		render(<Loading />);
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});
});
