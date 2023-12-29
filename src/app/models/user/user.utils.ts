import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const hashingPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

export const comparePassword = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const createToken = (jwtPayload: {
  _id: Types.ObjectId;
  role: string;
  email: string;
}) => {
  return jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expireIn as string,
  });
};

export const verifyToken = (token: string) => {
  jwt.verify(token, config.jwt_access_secret as string, function(err, decoded) {
    if (err) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You do not have the necessary permissions to access this resource.',
      );
    }
    return decoded as JwtPayload
  });
  // return jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
};

