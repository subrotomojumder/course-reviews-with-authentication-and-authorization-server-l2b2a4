import bcrypt from 'bcrypt';
import config from '../../config';

export const hashingPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

export const comparePassword = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
