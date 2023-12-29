import { Schema, model } from 'mongoose';
import { IPrePassword, IUser, UserModel } from './user.interface';
import { USER_ROLE_ENUM } from './user.constant';
import bcrypt from 'bcrypt';
import { hashingPassword } from './user.utils';

const prePasswordSchema = new Schema<IPrePassword>(
  {
    value: String,
    passwordChangeAt: Date,
  },
  {
    _id: false,
  },
);
const userSchema = new Schema<IUser, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required!'],
      select: 0,
    },
    passwordHistory: {
      type: [prePasswordSchema],
      default: [],
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: USER_ROLE_ENUM,
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
userSchema.pre('save', async function (next) {
  const password = await hashingPassword(this.password);
  const passwordHistory = [{ passwordChangeAt: new Date(), value: password }];
  this.password = password;
  this.passwordHistory = passwordHistory;
  next();
});
userSchema.statics.isUserExists = async function (
  id: string,
  selectFields: string = '',
) {
  return await User.findById(id).select(selectFields);
};
userSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>('User', userSchema);
