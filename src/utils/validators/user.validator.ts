import { z, ZodError } from 'zod';
import {
  IRegisterFormData,
  ILoginFormData,
  IUpdatePasswordFormData,
} from '../../types';

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name should contain atleasst three characters!' }),
  username: z
    .string()
    .min(3, { message: 'Username should contain atleasst three characters!' }),
  email: z.string().email('Enter a valid email address!'),
  password: z
    .string()
    .min(8, { message: 'Password should be atleast 8 characters long!' }),
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or Email is requried!'),
  password: z.string().min(1, 'Password is required!'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current Password is required!'),
  newPassword: z
    .string()
    .min(8, 'New password should be atleast 8 characters long!'),
});

function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: T
): { error: string | null } {
  try {
    schema.parse(data);
    return { error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Unknown validation error' };
  }
}

const validateRegister = (data: IRegisterFormData) =>
  validateSchema(registerSchema, data);

const validateLogin = (data: ILoginFormData) =>
  validateSchema(loginSchema, data);

const validateUpdatePassword = (data: IUpdatePasswordFormData) =>
  validateSchema(updatePasswordSchema, data);

export { validateRegister, validateLogin, validateUpdatePassword };
