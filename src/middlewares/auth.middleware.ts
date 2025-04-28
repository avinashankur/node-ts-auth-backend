// auth.middleware.ts

import ApiError from '../utils/helpers/ApiErrors';
import asyncHandler from '../utils/helpers/AsyncHandler';
import { NextFunction, Response, Request, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import { IUser } from '../types';

interface CustomRequest extends Request {
  user?: IUser;
}

interface JwtPayloadWithId extends JwtPayload {
  _id: string;
}

const verifyJWT: RequestHandler = asyncHandler(
  async (
    req: CustomRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token: string =
      req.cookies?.accessToken || req.header('Authorization')?.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Unauthorized!');
    }

    const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new ApiError(500, 'Access token secret not configured!');
    }

    const decoded = jwt.verify(token, secret) as JwtPayloadWithId;

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token!');
    }

    req.user = user;
    next();
  }
);

export default verifyJWT;
