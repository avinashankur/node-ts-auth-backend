import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  incomingRefreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IRegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface ILoginFormData {
  identifier: string;
  password: string;
}

export interface IUpdatePasswordFormData {
  currentPassword: string;
  newPassword: string;
}
