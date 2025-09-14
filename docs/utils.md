### Utilities

#### `ApiError`

- File: `src/utils/helpers/ApiErrors.ts`
- Usage: Throw HTTP-aware errors inside async handlers.
- Shape: `{ statusCode, message, success=false, errors=[], data=null }`

Example:
```ts
import ApiError from '@/utils/helpers/ApiErrors';
throw new ApiError(400, 'Bad request');
```

#### `ApiResponse<T>`

- File: `src/utils/helpers/ApiResponse.ts`
- Usage: Consistent success response envelope.
- Fields: `statusCode`, `data`, `message`, `success`

Example:
```ts
import ApiResponse from '@/utils/helpers/ApiResponse';
res.status(200).json(new ApiResponse(200, payload, 'OK'));
```

#### `asyncHandler`

- File: `src/utils/helpers/AsyncHandler.ts`
- Usage: Wrap async Express handlers to forward errors to `next`.

Example:
```ts
import asyncHandler from '@/utils/helpers/AsyncHandler';

const route = asyncHandler(async (req, res) => {
  const data = await doWork();
  res.json(data);
});
```

#### `getEnvVariable(name)`

- File: `src/utils/helpers/getEnvVariable.ts`
- Usage: Read required environment variables; throws if missing.

Example:
```ts
import { getEnvVariable } from '@/utils/helpers/getEnvVariable';
const mongoUri = getEnvVariable('MONGO_URI');
```

#### `logger`

- File: `src/utils/helpers/logger.ts`
- Library: winston
- Behavior: Writes to `logs/error.log` (errors) and `logs/combined.log` (all). Logs to console in non-production.

Example:
```ts
import logger from '@/utils/helpers/logger';
logger.info('Server started');
logger.error('Something failed', err);
```