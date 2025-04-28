import { Request, Response, CookieOptions } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import asyncHandler from '../utils/helpers/AsyncHandler';
import ApiError from '../utils/helpers/ApiErrors';
import ApiResponse from '../utils/helpers/ApiResponse';

interface JwtPayloadWithId extends JwtPayload {
  _id: string;
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (
  userId: any
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found!');
    }

    const accessToken: string = user.generateAccessToken();
    const refreshToken: string = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens!');
  }
};

const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const incomingRefreshToken: string | undefined =
      req.cookies?.incomingRefreshToken || req.body.incomingRefreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Unauthorized!');
    }

    const secret: string | undefined = process.env.REFRESH_TOKEN_SECRET;

    if (!secret) {
      throw new ApiError(500, 'Refresh token secret not configured!');
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      secret
    ) as JwtPayloadWithId;

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh Token!');
    }

    if (incomingRefreshToken !== user.incomingRefreshToken) {
      throw new ApiError(401, 'Refresh Token is expired or used!');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: refreshToken },
          'Access token refreshed'
        )
      );
  }
);

export { generateAccessAndRefreshToken, refreshAccessToken };
