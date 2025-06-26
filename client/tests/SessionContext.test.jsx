import React from "react";
import { render, screen } from '@testing-library/react';
import { SessionProvider } from '../src/contexts/SessionContext.jsx';

describe('SessionContext', () => {
	it('provides session context', () => {
		render(
			<SessionProvider>
				<div>Test</div>
			</SessionProvider>
		);
		expect(screen.getByText('Test')).toBeInTheDocument();
	});
	// Add more tests for context value, login/logout, etc.
});
