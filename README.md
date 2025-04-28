## 🛠 Step 1: Initialize a Node.js Project

```sh
mkdir my-app && cd my-app
npm init -y
```

This will generate a `package.json` file.

---

## 🛠 Step 2: Install Dependencies

```sh
npm install express mongoose dotenv
```

### Install TypeScript and Dev Dependencies:

```sh
npm install -D typescript ts-node nodemon @types/node @types/express @types/mongoose
```

- `typescript`: TypeScript compiler
- `ts-node`: Run TypeScript files directly
- `nodemon`: Automatically restarts server on file changes
- `@types/node`, `@types/express`, `@types/mongoose`: Type definitions for Node.js, Express, and Mongoose

---

## 🛠 Step 3: Configure TypeScript

Generate a TypeScript configuration file:

```sh
npx tsc --init
```

Now, open `tsconfig.json` and update:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

This ensures:

- Type safety
- Source files in `src/`
- Compiled files in `dist/`

---

## 🛠 Step 4: Create Folder Structure

```
my-app
│── src
│   ├── config
│   │   ├── db.ts
│   ├── models
│   │   ├── User.ts
│   ├── routes
│   │   ├── userRoutes.ts
│   ├── controllers
│   │   ├── userController.ts
│   ├── index.ts
│── .env
│── tsconfig.json
│── package.json
│── nodemon.json
```

---

## 🛠 Step 5: Setup Express Server

Create `src/index.ts`:

```ts
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 🛠 Step 6: Setup MongoDB Connection

Create `src/config/db.ts`:

```ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 🛠 Step 7: Create a Mongoose Model

Create `src/models/User.ts`:

```ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
```

---

## 🛠 Step 8: Create Express Routes

Create `src/routes/userRoutes.ts`:

```ts
import express from 'express';
import { getUsers, createUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);

export default router;
```

---

## 🛠 Step 9: Create Controllers

Create `src/controllers/userController.ts`:

```ts
import { Request, Response } from 'express';
import User from '../models/User';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

---

## 🛠 Step 10: Setup Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
```

---

## 🛠 Step 11: Setup Nodemon

Create a `nodemon.json` file:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/index.ts"
}
```

---

## 🛠 Step 12: Add Scripts to `package.json`

Modify `package.json`:

```json
"scripts": {
  "dev": "nodemon",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

---

## 🚀 Step 13: Run the App

Start the server:

```sh
npm run dev
```

If successful, the terminal should display:

```
MongoDB Connected: localhost
Server running on port 5000
```

---

## 🎯 Step 14: Test API Endpoints

Use **Postman** or **cURL** to test:
1️⃣ **Get Users**

```sh
curl -X GET http://localhost:5000/api/users
```

2️⃣ **Create User**

```sh
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "123456"}'
```

---

### 🔥 Your Express + Mongoose + TypeScript App is Ready! 🚀
