import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponseFunc from "../../utils/sendResponseFunc";
import { UserServices } from "./user.service";


const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserInToDB(
    req.body,
  );
  sendResponseFunc(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully!',
    data: result,
  });
});
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUserInToDB(
    req.body,
  );
  sendResponseFunc(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successful!',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  loginUser
};
