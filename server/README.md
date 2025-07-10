# AuthDemo1 Backend (server)

This is the Node.js/Express backend for the AuthDemo1 MFA demo app.

## Features

- User registration, login, and admin approval
- Multi-factor authentication (MFA): Email OTP or Authenticator App
- JWT-based session management
- Password reset via email
- Logging with Winston (daily rotation, Logstash support)
- MongoDB with Mongoose
- Unit and E2E tests (Jest, Supertest, Selenium)

## Setup

1. `npm ci` (install dependencies)
2. Create a `.env` file in this directory and configure as below:

## Example .env

```env
MONGO_DB_URL=mongodb://localhost:27017/mfa-auth-db
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
PORT=7001
```

## Running

- `npm run dev` — Start in development mode
- `npm start` — Start in production
- Server runs on http://localhost:7001 by default

## API

- All endpoints are under `/api/auth/`
- See `controllers/` and `routes/` for details
- JWT required for protected routes

## Logging

- Logs are written to `server/logs/` (rotated daily)
- Error logs and access logs are separated
- Logstash transport available for advanced setups

## Testing

- `npm test` — Run all backend tests
- E2E: Selenium WebDriver (see `tests/selenium.e2e.test.js`)
- Coverage: (not enabled by default; can be added)

## Security Notes

- Passwords are hashed with bcrypt
- JWTs are used for session management
- CSRF and brute-force protection: To be added in advanced version


