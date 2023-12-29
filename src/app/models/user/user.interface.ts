/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type IUserRole = keyof typeof USER_ROLE;
export interface IPrePassword {
  value: string;
  passwordChangeAt: Date;
}
export interface IUser {
  username: string;
  email: string;
  password: string;
  passwordHistory?: IPrePassword[];
  role: IUserRole;
}
export interface UserModel extends Model<IUser> {
  isUserExists(id: string, selectFields?: string): Promise<IUser>;
  isPasswordCorrect(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
