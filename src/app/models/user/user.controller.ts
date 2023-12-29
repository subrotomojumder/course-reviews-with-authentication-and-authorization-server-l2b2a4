/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponseFunc from '../../utils/sendResponseFunc';
import { UserServices } from './user.service';
import {  RequestHandler } from 'express';

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserInToDB(req.body);
  sendResponseFunc(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully!',
    data: result,
  });
});
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUserInToDB(req.body);
  sendResponseFunc(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successful!',
    data: result,
  });
});
const userChangePassword: RequestHandler = async (req, res) => {
  try {
    const result = await UserServices.userChangePassword(req.body, req.user);
    sendResponseFunc(res , {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password changed successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      data: null,
    });
  }
 
};

export const UserControllers = {
  registerUser,
  loginUser,
  userChangePassword,
};
