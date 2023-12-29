import { z } from 'zod';
import { USER_ROLE_ENUM } from './user.constant';

const passwordValidationSchema = z
  .string({ required_error: 'Password is required!' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[0-9]/, {
    message: 'Password must contain at least one digit',
  })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character',
  });
const userRegistrationValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username is required!' }),
    email: z.string({ required_error: 'Email is required!' }).email(),
    password: passwordValidationSchema,
    role: z.enum(USER_ROLE_ENUM as [string, ...string[]]).optional(),
  }),
});
const userLoginUserValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username is required!' }),
    password: z
      .string({ required_error: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
  }),
});
const passwordChangeValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required!',
    }),
    newPassword: passwordValidationSchema,
  }),
});
export const UserValidations = {
  userRegistrationValidationSchema,
  userLoginUserValidationSchema,
  passwordChangeValidationSchema
};
