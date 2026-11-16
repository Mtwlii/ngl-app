# NGL App — Anonymous Messaging REST API

![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-cache-DC382D?logo=redis&logoColor=white)

A backend for an NGL-style anonymous messaging app: users sign up, verify their email with an OTP, and receive messages from other people — either anonymously or from a logged-in sender.

Built with a layered architecture (**routes → controller → service → repository**), schema validation with Zod, cookie-based JWT auth, Redis caching and rate limiting.

## Features

- **Authentication** — register with email OTP verification, login, resend OTP, reset password with OTP, and **Sign in with Google** (ID token verified server-side).
- **Messaging** — send anonymous messages (no account needed) or authenticated messages; read your inbox (newest first).
- **User profile** — upload a profile picture (JPEG/PNG) and a CV (PDF).
- **Security**
  - Passwords hashed with `bcrypt`; the hash is never serialized in API responses.
  - JWT stored in an `httpOnly` cookie (1 hour), `SameSite=Lax`, `Secure` in production.
  - Rate limiting on login, OTP and anonymous-message endpoints.
  - Request bodies and environment variables validated with Zod (the app refuses to start on a bad `.env`).
  - Uploads validated by **magic number** (`file-type`), size-limited to 5 MB while streaming, and stored under random UUID names.
- **Reliability & observability**
  - Central `AppError` + global error handler (known Mongoose/Multer errors become proper `4xx` responses).
  - `X-Correlation-ID` on every response and in every error log.
  - Redis-backed response cache and opt-in **idempotency** (`Idempotency-Key` header); cache errors are logged and never take an endpoint down.
  - Graceful shutdown on `SIGINT` / `SIGTERM`.

## Tech stack

| Area | Tools |
| --- | --- |
| Runtime / framework | Node.js (ES modules), Express 5 |
| Database | MongoDB with Mongoose |
| Cache | Redis (`ioredis`) |
| Auth | `jsonwebtoken`, `bcrypt`, `google-auth-library` |
| Validation | Zod |
| Email | Mailjet (`node-mailjet`) |
| Uploads | Multer, `file-type` |
| Protection | `express-rate-limit`, `cors` |

## Project structure

```
src/
├── server.js            # entry point: DB connection, HTTP server, graceful shutdown
├── app.js               # Express app (middlewares, routes, 404, error handler)
├── route.js             # mounts /auth, /user, /message
├── app/                 # feature modules
│   ├── auth/            # routes, controller, service, repository, dto, model (OTP), utils
│   ├── user/
│   └── message/
├── lib/                 # app-level building blocks
│   ├── auth/            # authGuard, cookie options
│   ├── cache/           # Redis cache middleware
│   ├── config/          # env validation (Zod)
│   ├── error/           # AppError + global error handler
│   ├── idempotency/
│   ├── middlewares/     # rate limiters
│   └── validation/
└── pkg/                 # replaceable infrastructure
    ├── cache/           # Redis provider
    ├── email/           # Mailjet provider
    ├── logger/          # JSON logger
    ├── media/           # multer + file validation
    └── utils/
```

## Getting started

### Prerequisites

- Node.js 18+
- A running MongoDB instance
- A running Redis instance
- A [Mailjet](https://www.mailjet.com/) account (API key + a verified sender address)
- A Google OAuth client ID (only needed for Sign in with Google)

### Installation

```bash
git clone https://github.com/Mtwlii/ngl-app.git
cd ngl-app
npm install
```

Create a `.env` file from the template and fill in your values:

```bash
cp .env.example .env        # Windows (cmd): copy .env.example .env
```

Run the server:

```bash
npm start                   # node src/server.js
npm run start:watch         # restarts on file changes (node --watch)
```

The API is served at `http://localhost:3000/api` (uploaded files at `/uploads/<file>`).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no (default `3000`) | HTTP port |
| `NODE_ENV` | no | Set to `production` to mark the auth cookie `Secure` |
| `CLIENT_ORIGIN` | no | Frontend origin allowed by CORS (enables credentials). If unset, CORS is open without credentials |
| `MONGO_URL` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret used to sign tokens (at least 10 characters — use a long random value) |
| `JWT_EXPIRES_IN` | yes | Currently unused (token lifetime is fixed at 1 hour); the variable is still required by the env schema |
| `GOOGLE_OAUTH_CLIENT_ID` | yes | Audience used to verify Google ID tokens |
| `REDIS_HOST`, `REDIS_PORT` | yes | Redis connection |
| `REDIS_PASSWORD` | no | Redis password |
| `MAILJET_API_KEY`, `MAILJET_API_SECRET` | yes | Mailjet credentials |
| `MAILJET_FROM_EMAIL`, `MAILJET_FROM_NAME` | yes | Sender used for OTP emails |
| `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT` | yes | Legacy SMTP settings, still required by the env schema |

> Never commit your `.env`. It is already listed in `.gitignore`.

## API reference

Base URL: `http://localhost:3000/api`

Protected endpoints read the JWT from the `access_token` cookie that `login` / `login-with-google` set, so send requests with cookies enabled (e.g. `credentials: "include"` in `fetch`, or `-b cookies.txt` in cURL).

Errors always have the shape `{ "success": false, "message": "..." }`.

### Auth — `/auth`

| Method | Endpoint | Auth | Body | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | — | `name` (3–20), `email`, `password` (8–64), `dob?`, `gender?` | Creates the account and emails a 6-digit OTP (valid 5 min) |
| `PATCH` | `/auth/verify-account` | — | `email`, `otpCode` | Rate limited: 5 requests / 5 min |
| `POST` | `/auth/login` | — | `email`, `password` | Sets the `access_token` cookie. Rate limited: 10 requests / 15 min |
| `POST` | `/auth/send-otp` | — | `email` | Sends a new OTP (valid 3 min). Rate limited: 5 requests / 5 min |
| `PATCH` | `/auth/reset-password` | — | `email`, `otpCode`, `newPassword` | Supports an optional `Idempotency-Key` header. Rate limited: 5 requests / 5 min |
| `POST` | `/auth/login-with-google` | — | `idToken` | Creates a verified account on first login. Sets the `access_token` cookie |

### Users — `/user`

| Method | Endpoint | Auth | Body | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/user/get-all-users` | cookie | — | Verified users (`_id`, `name`), cached for 60 s |
| `POST` | `/user/upload-profile-pic` | cookie | `multipart/form-data`, field `profilePic` | JPEG or PNG, max 5 MB |
| `POST` | `/user/upload-cv` | cookie | `multipart/form-data`, field `cv` | PDF, max 5 MB |

### Messages — `/message`

| Method | Endpoint | Auth | Body | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/message/send` | cookie | `receiver` (user id), `content` (1–200) | Sender is stored from the token |
| `POST` | `/message/send/anonymous` | — | `receiver` (user id), `content` (1–200) | Rate limited: 10 requests / min |
| `GET` | `/message/all-messages` | cookie | — | Your inbox, newest first (`sender` is `null` for anonymous messages) |

### Example

```bash
# 1) register, then verify with the OTP that arrives by email
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed","email":"user@example.com","password":"password123"}'

curl -X PATCH http://localhost:3000/api/auth/verify-account \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otpCode":"123456"}'

# 2) login (stores the cookie)
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 3) anyone can send you an anonymous message
curl -X POST http://localhost:3000/api/message/send/anonymous \
  -H "Content-Type: application/json" \
  -d '{"receiver":"<your-user-id>","content":"Hello!"}'

# 4) read your inbox
curl -b cookies.txt http://localhost:3000/api/message/all-messages
```

A ready-to-run collection is also available in [`requests.http`](requests.http) (VS Code REST Client).

## Roadmap

- Automated tests (Jest + Supertest) and a CI workflow
- Docker Compose setup for the API, MongoDB and Redis
- OpenAPI / Swagger documentation
- Deployed demo

## Author

**Metwally** — [GitHub](https://github.com/Mtwlii) · [LinkedIn](https://linkedin.com/in/mtwlii)

## License

ISC
