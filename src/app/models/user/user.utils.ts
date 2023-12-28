import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Types } from 'mongoose';

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
  return jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
};
