import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";


export type IUserRole = keyof typeof USER_ROLE;

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: IUserRole;
}
export interface UserModel extends Model<IUser> {
  isPasswordCorrect(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}

