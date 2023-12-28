import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { USER_ROLE_ENUM } from './user.constant';
import bcrypt from 'bcrypt';
import { hashingPassword } from './user.utils';

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
    role: {
      type: String,
      enum: USER_ROLE_ENUM,
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await hashingPassword(user.password);
  next();
});

userSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};


export const User = model<IUser, UserModel>('User', userSchema);
