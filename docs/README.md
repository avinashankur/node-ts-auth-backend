### API Documentation

This project is an Express + TypeScript + Mongoose REST API. This documentation covers all public endpoints, exported functions, middleware, models, utilities, and types.

- Base URL: `http://localhost:PORT/api/v1`
- Version: v1

#### Authentication

- Auth is based on JWTs set as httpOnly cookies: `accessToken` and `refreshToken`.
- Many endpoints require a valid `accessToken` and use the `verifyJWT` middleware.
- Token refresh is exposed at `POST /users/refresh-token` and accepts an `incomingRefreshToken` via cookie or request body. Note that in this codebase the refresh route also requires authentication.

#### Contents

- Endpoints: see [`docs/api/users.md`](./api/users.md)
- Auth module: [`docs/auth.md`](./auth.md)
- Middleware: [`docs/middleware.md`](./middleware.md)
- Models: [`docs/models/user.md`](./models/user.md)
- Utilities: [`docs/utils.md`](./utils.md)
- Types: [`docs/types.md`](./types.md)
- Configuration: [`docs/configuration.md`](./configuration.md)

#### Quick Start

1) Start the server (ensure env is configured). The app listens on `PORT` (default `5001`).
2) Use the registration or login endpoints to obtain cookies. See endpoint docs for cURL examples.
3) Call authenticated routes with a cookie jar (`curl -c cookies.txt -b cookies.txt ...`).