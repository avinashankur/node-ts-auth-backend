### Types

Exports from `src/types/index.d.ts`:

- `IUser` (from `src/types/user.d.ts`)
  - Fields: `name`, `username`, `email`, `password`, optional `refreshToken`, optional `incomingRefreshToken`
  - Methods: `isPasswordCorrect(password)`, `generateAccessToken()`, `generateRefreshToken()`

- `IRegisterFormData`
  - `name`, `username`, `email`, `password`

- `ILoginFormData`
  - `identifier`, `password`

- `IUpdatePasswordFormData`
  - `currentPassword`, `newPassword`

Global augmentation (`src/types/express.d.ts`):

- `Express.Request` has optional `user?: IUser`