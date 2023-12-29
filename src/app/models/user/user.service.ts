import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { createToken, hashingPassword } from './user.utils';
import { JwtPayload } from 'jsonwebtoken';

const registerUserInToDB = async (payload: IUser) => {
  const result = (await User.create(payload)).toJSON({
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.passwordHistory;
      return ret;
    },
  });
  return result;
};

const loginUserInToDB = async (
  payload: Pick<IUser, 'username' | 'password'>,
) => {
  const user = await User.findOne({ username: payload.username }).select(
    '+password',
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
const userChangePassword = async (
  payload: { currentPassword: string; newPassword: string },
  decodedUserData: JwtPayload,
) => {
  const user = await User.isUserExists(
    decodedUserData._id,
    '+password +passwordHistory',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  if (
    !(await User.isPasswordCorrect(payload?.currentPassword, user?.password))
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Current password is do not match!',
    );
  }
  const lastPassUpdateTimes = user.passwordHistory?.sort(
    (a, b) => b.passwordChangeAt.getTime() - a.passwordChangeAt.getTime(),
  );
  if (lastPassUpdateTimes && lastPassUpdateTimes.length) {
    for (const passAndDate of lastPassUpdateTimes.slice(0, 2)) {
      if (
        await User.isPasswordCorrect(payload.newPassword, passAndDate.value)
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${lastPassUpdateTimes[0].passwordChangeAt.toLocaleString()}).`,
        );
      }
    }
  }
  const newPasswordHash = await hashingPassword(payload.newPassword);
  const result = await User.findOneAndUpdate(
    {
      _id: decodedUserData._id,
      role: decodedUserData.role,
      email: decodedUserData.email,
    },
    {
      password: newPasswordHash,
      $push: {
        passwordHistory: {
          value: newPasswordHash,
          passwordChangeAt: new Date(),
        },
      },
    },
  );
  return result;
};
export const UserServices = {
  registerUserInToDB,
  loginUserInToDB,
  userChangePassword,
};
