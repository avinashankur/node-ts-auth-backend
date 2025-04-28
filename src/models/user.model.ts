import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getEnvVariable } from '@/utils/helpers/getEnvVariable';

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre<IUser>('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Instance method to compare entered password with hashed password
userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Instance method to generate an access token
userSchema.methods.generateAccessToken = function (): string {
  const accessTokenSecret: string = getEnvVariable('ACCESS_TOKEN_SECRET');

  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      username: this.username,
    },
    accessTokenSecret,
    {
      expiresIn: getEnvVariable('ACCESS_TOKEN_EXPIRY') || '1h',
    } as jwt.SignOptions
  );
};

// Instance method to generate a refresh token
userSchema.methods.generateRefreshToken = function (): string {
  const refreshTokenSecret: string = getEnvVariable('REFRESH_TOKEN_SECRET');

  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: getEnvVariable('REFRESH_TOKEN_EXPIRY') || '1d',
    } as jwt.SignOptions
  );
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
