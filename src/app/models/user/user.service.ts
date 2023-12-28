import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { createToken } from './user.utils';

const registerUserInToDB = async (payload: IUser) => {
  const result = (await User.create(payload)).toJSON({
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  });
  return result;
};

const loginUserInToDB = async (
  payload: Pick<IUser, 'username' | 'password'>,
) => {
  const user = await User.findOne({ username: payload.username }).select(
    '+password -createdAt -updatedAt',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  if (!(await User.isPasswordCorrect(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match!');
  }
  const jwtPayloadData = {
    _id: user._id,
    role: user.role,
    email: user.email,
  };
  const token = createToken(jwtPayloadData);
  return {
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
    },
    token,
  };
};
const userChangePassword = async (payload: {currentPassword: string, newPassword: string}) => {
  console.log(payload);
  // const result = (await User.create(payload))
  // return result;
};
export const UserServices = {
  registerUserInToDB,
  loginUserInToDB,
  userChangePassword
};
