import { CookieOptions, Request, Response } from 'express';
import asyncHandler from '@/utils/helpers/AsyncHandler';
import ApiError from '@/utils/helpers/ApiErrors';
import ApiResponse from '@/utils/helpers/ApiResponse';
import {
  validateLogin,
  validateRegister,
  validateUpdatePassword,
} from '@/utils/validators/user.validator';
import User from '@/models/user.model';
import { generateAccessAndRefreshToken } from './auth.controller';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
};

const register = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { error } = validateRegister(req.body);
    if (error) {
      throw new ApiError(400, error);
    }

    const { name, username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      // Status code 409 is for conflict
      throw new ApiError(409, 'Email already exists!');
    }

    if (existingUsername) {
      throw new ApiError(409, 'Username already exists!');
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select('-password');

    if (!createdUser) {
      throw new ApiError(500, 'Something went wrong while creating user!');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      createdUser._id
    );

    return res
      .status(201)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .cookie('accessToken', accessToken, cookieOptions)
      .json(new ApiResponse(201, createdUser, 'User created successfully'));
  }
);

const login = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { error } = validateLogin(req.body);

    if (error) {
      throw new ApiError(400, error);
    }

    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new ApiError(400, 'Username/Email and Password are required!');
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      throw new ApiError(404, 'User not found!');
    }

    const isPasswordMatch: boolean = await user.isPasswordCorrect(password);

    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid Password!');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      '-password -refreshToken'
    );

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .cookie('accessToken', accessToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          'User logged in successfully'
        )
      );
  }
);

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id).select('-refreshToken');

  if (!user) {
    throw new ApiError(401, 'User not authenticated!');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Current User Fetched.'));
});

const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().select('-refreshToken');

  if (!users) {
    throw new ApiError(404, 'No users found!');
  }

  return res.status(200).json(new ApiResponse(200, users, 'Users Fetched.'));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User not authenticated!');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: '' },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('refreshToken', cookieOptions)
    .clearCookie('accessToken', cookieOptions)
    .json(new ApiResponse(200, user, 'User logged out successfully'));
});

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { error } = validateUpdatePassword(req.body);

  if (error) {
    throw new ApiError(400, error);
  }

  if (!req.user) {
    throw new ApiError(401, 'User not authenticated!');
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('-refreshToken');

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  const isPasswordMatch: boolean =
    await user.isPasswordCorrect(currentPassword);

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid current password!');
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Password changed successfully'));
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'User not authenticated!');
  }

  const { name, username, email } = req.body;

  if (!name && !username && !email) {
    throw new ApiError(400, 'No valid fields provided for update!');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(409, 'Email already in use!');
    }
    user.email = email;
  }

  if (username && username !== user.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError(409, 'Username already in use!');
    }
    user.username = username;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  const updatedUser = await User.findById(userId).select(
    '-password -refreshToken'
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});

const searchUser = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    throw new ApiError(400, 'Search query is required!');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  })
    .select('-password -refreshToken')
    .limit(5);

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, 'Users fetched successfully'));
});

const getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, 'Username paramerter is required!');
  }

  const user = await User.findOne({ username }).select(
    '-password -refreshToken'
  );

  if (!user) {
    throw new ApiError(404, 'User not found!');
  }

  console.log(user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

export {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  updatePassword,
  logout,
  updateUser,
  searchUser,
  getUserByUsername,
};
