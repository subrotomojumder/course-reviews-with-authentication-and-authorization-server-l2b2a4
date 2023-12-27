import mongoose from 'mongoose';
import { IErrorResponse } from '../../interface/error.interface';

const handlerDuplicateError = (
  err: mongoose.Error.ValidationError,
): IErrorResponse => {
  const regex = /"(.*?)"/;
  const matches = err.message.match(regex);
  return {
    success: false,
    statusCode: 409,
    message: 'Duplicate Error',
    errorMessage: `${matches![1]} is already exists!`,
    errorDetails: { err },
  };
};

export default handlerDuplicateError;
