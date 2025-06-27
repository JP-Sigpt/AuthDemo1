# AuthDemo1

A full-stack multi-factor authentication (MFA) demo app with React (frontend) and Node.js/Express (backend).

## Features

- User registration and login with email/username and password
- Email verification and admin approval
- Multi-factor authentication (MFA): Email OTP or Authenticator App
- Password reset via email
- Session management with JWT
- Logging and analytics (Plausible integration)
- Modular, testable codebase

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Testing:** Jest, React Testing Library, Selenium, Supertest
- **CI/CD:** GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Setup

1. Clone the repo: `git clone <repo-url>`
2. Install dependencies:
   - `cd client && npm ci`
   - `cd ../server && npm ci`
3. Configure environment variables in both `client/.env` and `server/.env` (see respective READMEs).

### Running Locally

- Start backend: `cd server && npm run dev`
- Start frontend: `cd client && npm run dev`
- App runs at http://localhost:3001 (client) and http://localhost:7001 (server)

### Testing

- Run all tests: See `client/README.md` and `server/README.md` for details.
- CI runs tests and lint on every push/PR.

