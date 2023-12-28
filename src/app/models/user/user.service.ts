import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

const registerUserInToDB = async (payload: IUser) => {
  const result = (await User.create(payload)).toJSON({
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  });
  return result;
};

const loginUserInToDB = async (payload: Pick<IUser, "username" | "password">) => {
  const user = await User.findOne({username: payload.username}).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  if (!(await User.isPasswordCorrect(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match!');
  }
  // const jwtPayload = {
  //   userId: user.id,
  //   role: user.role,
  // };
  // const accessToken = createToken(
  //   jwtPayload,
  //   config.jwt_access_secret as string,
  //   config.jwt_access_expireIn as string,
  // );
  return {
    // accessToken,
    user
  };
};

export const UserServices = {
  registerUserInToDB,
  loginUserInToDB,
};
