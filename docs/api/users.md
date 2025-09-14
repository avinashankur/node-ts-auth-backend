### Users API

Base path: `/api/v1/users`

All responses use the `ApiResponse` shape: `{ statusCode, data, message, success }`.

---

#### POST /register

- Auth: None
- Body (JSON):
  - `name` (string, min 3)
  - `username` (string, min 3)
  - `email` (string, email)
  - `password` (string, min 8)
- Sets Cookies: `accessToken`, `refreshToken` (httpOnly, secure)
- 201 Created → data: created user (without password)

Example:
```bash
curl -X POST http://localhost:5001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"name":"Alice","username":"alice","email":"alice@example.com","password":"Password123!"}'
```

---

#### POST /login

- Auth: None
- Body (JSON):
  - `identifier` (string; username or email)
  - `password` (string)
- Sets Cookies: `accessToken`, `refreshToken`
- 200 OK → data: `{ user, accessToken, refreshToken }`

Example:
```bash
curl -X POST http://localhost:5001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"identifier":"alice","password":"Password123!"}'
```

---

#### GET /me

- Auth: `verifyJWT` required
- 200 OK → data: current user (no refreshToken)

Example:
```bash
curl http://localhost:5001/api/v1/users/me -b cookies.txt
```

---

#### GET /all

- Auth: `verifyJWT` required
- 200 OK → data: array of users (no refreshToken)

Example:
```bash
curl http://localhost:5001/api/v1/users/all -b cookies.txt
```

---

#### PUT /update-password

- Auth: `verifyJWT` required
- Body (JSON):
  - `currentPassword` (string)
  - `newPassword` (string, min 8)
- 200 OK → data: user

Example:
```bash
curl -X PUT http://localhost:5001/api/v1/users/update-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"currentPassword":"Password123!","newPassword":"NewPass123!"}'
```

---

#### POST /refresh-token

- Auth: `verifyJWT` required (per routing)
- Accepts refresh token as either:
  - Cookie: `incomingRefreshToken`, or
  - Body (JSON): `{ "incomingRefreshToken": "..." }`
- Sets Cookies: new `accessToken`, `refreshToken`
- 200 OK → data: `{ accessToken, refreshToken }`

Example (cookie-based):
```bash
curl -X POST http://localhost:5001/api/v1/users/refresh-token \
  -b cookies.txt -c cookies.txt
```

Example (body-based):
```bash
curl -X POST http://localhost:5001/api/v1/users/refresh-token \
  -H "Content-Type: application/json" \
  -b cookies.txt -c cookies.txt \
  -d '{"incomingRefreshToken":"<value-from-server>"}'
```

---

#### PATCH /update

- Auth: `verifyJWT` required
- Body (JSON): any of `name`, `username`, `email`
- Conflict checks for unique `email`/`username`
- 200 OK → data: updated user (no password/refreshToken)

Example:
```bash
curl -X PATCH http://localhost:5001/api/v1/users/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Alice L."}'
```

---

#### POST /logout

- Auth: `verifyJWT` required
- Clears `accessToken` and `refreshToken` cookies
- 200 OK → data: user with cleared `refreshToken`

Example:
```bash
curl -X POST http://localhost:5001/api/v1/users/logout -b cookies.txt -c cookies.txt
```

---

#### GET /search-user

- Auth: `verifyJWT` required
- Query params: `q` (string)
- 200 OK → data: `{ users: [...] }` (max 5)

Example:
```bash
curl "http://localhost:5001/api/v1/users/search-user?q=ali" -b cookies.txt
```

---

#### GET /:username

- Auth: None
- 200 OK → data: user (no password/refreshToken)

Example:
```bash
curl http://localhost:5001/api/v1/users/alice
```