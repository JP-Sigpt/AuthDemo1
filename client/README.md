# AuthDemo1 Frontend (client)

This is the React frontend for the AuthDemo1 MFA demo app.

## Features

- Modern React (18+) with Vite
- Tailwind CSS for styling
- Multi-factor authentication UI (OTP, Authenticator App)
- Plausible Analytics integration
- Unit and E2E tests (Jest, React Testing Library, Selenium)

## Setup

1. `npm ci` (install dependencies)
2. Create a `.env` file in this directory and configure as below:

## Example .env

```env
VITE_API_BASE_URL=http://localhost:7001/api
VITE_PLAUSIBLE_DOMAIN=your-domain.com
VITE_PLAUSIBLE_URL=https://plausible.io/js/script.js
VITE_ANALYTICS_ENABLED=true
VITE_APP_NAME=MF Auth App
VITE_APP_VERSION=1.0.0
```

## Scripts

- `npm run dev` — Start dev server (http://localhost:3001)
- `npm run build` — Build for production
- `npm run lint` — Lint code
- `npm run test:unit` — Run unit tests
- `npm run test:e2e` — Run Selenium E2E tests
- `npm run test:coverage` — Run unit tests with coverage

## Analytics

- Plausible Analytics is integrated. See `PLAUSIBLE_SETUP.md` for setup.
- Analytics events are only sent in production by default.
- For local analytics, use a self-hosted Plausible Docker container.

## Testing

- Unit tests: Jest + React Testing Library (`tests/`)
- E2E: Selenium WebDriver (`npm run test:e2e`)
- Coverage: `npm run test:coverage`

## Troubleshooting

- If analytics events do not appear, check your `.env` and Plausible setup.
- For E2E tests, ensure both client and server are running.

## License

MIT
