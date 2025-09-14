### Configuration

#### Environment variables

Required by various modules (see `getEnvVariable` usage):

- `PORT` (default: `5001`)
- `MONGO_URI` (MongoDB connection string)
- `CORS_ORIGIN` (string or array in production via code change)
- `ACCESS_TOKEN_SECRET` (JWT secret for access tokens)
- `ACCESS_TOKEN_EXPIRY` (e.g., `1h`)
- `REFRESH_TOKEN_SECRET` (JWT secret for refresh tokens)
- `REFRESH_TOKEN_EXPIRY` (e.g., `1d`)
- `NODE_ENV` (`development` | `production`)

Notes:

- Cookies are set with `httpOnly`, `secure`, and `sameSite: 'none'`. In local development over HTTP, consider toggling `secure` if needed.
- The server base path is `/api/v1/` in `src/app.ts`.

#### tsconfig highlights (`tsconfig.json`)

- `rootDir`: `src`
- `outDir`: `dist`
- `strict`: `true`
- `esModuleInterop`: `true`
- `noUnusedLocals` and `noUnusedParameters`: `true`

#### CORS

Configured in `src/app.ts` using `cors` middleware:

- `origin`: `process.env.CORS_ORIGIN`
- `credentials`: `true`

Ensure `CORS_ORIGIN` matches your client origin when using credentials.