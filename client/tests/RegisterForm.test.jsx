import React from "react";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../src/hooks/useAnalytics.js', () => ({
	useAnalytics: () => ({
		trackAuth: jest.fn(),
		trackFormSubmit: jest.fn(),
		trackError: jest.fn()
	})
}));

import RegisterForm from '../src/components/RegisterForm.jsx';

describe('RegisterForm', () => {
	it('renders registration fields', () => {
		render(
			<MemoryRouter>
				<RegisterForm />
			</MemoryRouter>
		);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});
});
