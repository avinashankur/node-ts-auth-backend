### Middleware

#### `verifyJWT` (default export)

- File: `src/middlewares/auth.middleware.ts`
- Type: `RequestHandler`
- Behavior: Reads `accessToken` from cookie `accessToken` or header `Authorization: Bearer <token>`. Verifies using `ACCESS_TOKEN_SECRET`, loads the user, and assigns `req.user`.
- Throws `ApiError(401)` if no/invalid token; `ApiError(500)` if secret is not configured.

Usage:
```ts
import verifyJWT from '@/middlewares/auth.middleware';
router.get('/me', verifyJWT, getCurrentUser);
```

#### `errorHandler` (default export)

- File: `src/middlewares/errorHandler.ts`
- Type: `ErrorRequestHandler`
- Behavior: Sends `{ success: false, message }` with `statusCode` from error (defaults to 500).

Usage:
```ts
import errorHandler from '@/middlewares/errorHandler';
app.use(errorHandler);
```