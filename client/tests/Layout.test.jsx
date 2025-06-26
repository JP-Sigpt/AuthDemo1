import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "../src/components/Layout.jsx";

// Mock useAnalytics to avoid import.meta errors
jest.mock("../src/hooks/useAnalytics.js", () => ({
	useAnalytics: () => { },
}));

jest.useFakeTimers();

describe("Layout", () => {
	it("renders children after loading", async () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<Routes>
					<Route element={<Layout />}>
						<Route index element={<div>Child</div>} />
					</Route>
				</Routes>
			</MemoryRouter>
		);

		// Skip the 200ms loading delay
		act(() => {
			jest.advanceTimersByTime(250);
		});

		expect(screen.getByText("Child")).toBeInTheDocument();
	});
});
