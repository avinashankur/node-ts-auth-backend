### Auth Module

Exports from `src/controllers/auth.controller.ts`:

- `generateAccessAndRefreshToken(userId)` → Promise<{ accessToken, refreshToken }>
  - Finds the user, generates tokens via model instance methods, persists `refreshToken` on the user, and returns both tokens.

- `refreshAccessToken(req, res)` (Express handler)
  - Reads `incomingRefreshToken` from cookies or body.
  - Verifies with `REFRESH_TOKEN_SECRET`, loads user, compares the token, then issues new `accessToken` and `refreshToken` cookies.

Notes:

- Route is mounted at `POST /api/v1/users/refresh-token` and, per `routes/user.route.ts`, is guarded by `verifyJWT`.
- Cookies are set with `{ httpOnly: true, secure: true, sameSite: 'none' }` in both auth and user controllers.

Example usage (programmatic):
```ts
import { generateAccessAndRefreshToken } from '@/controllers/auth.controller';

const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userId);
```

Example request (handler):
```bash
curl -X POST http://localhost:5001/api/v1/users/refresh-token -b cookies.txt -c cookies.txt
```

Environment variables required: see `docs/configuration.md`.