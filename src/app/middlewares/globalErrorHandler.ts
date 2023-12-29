/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import AppError from '../errors/AppError';
import { ZodError } from 'zod';
import config from '../config';
import { IErrorResponse } from '../interface/error.interface';
import handlerZodError from '../errors/errorHelpers/handleZodError';
import mongoose from 'mongoose';
import handleValidationError from '../errors/errorHelpers/handlerValidationError';
import handlerCastError from '../errors/errorHelpers/handlerCastError';
import handlerDuplicateError from '../errors/errorHelpers/handleDuplicateError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let errorInfo: IErrorResponse = {
    success: false,
    statusCode: 400,
    message: 'Invalid Request',
    errorMessage: '',
    errorDetails: {
      path: null,
      value: null,
    },
  };
  if (error instanceof ZodError) {
    errorInfo = handlerZodError(error);
  } else if (error.name === mongoose.Error.ValidationError) {
    errorInfo = handleValidationError(error);
  } else if (error instanceof mongoose.Error.CastError) {
    errorInfo = handlerCastError(error);
  } else if (error?.code === 11000) {
    errorInfo = handlerDuplicateError(error);
  } else if (error instanceof AppError) {
    errorInfo.statusCode = error.statusCode;
    errorInfo.errorMessage = error.message;
  } else if (error instanceof Error) {
    errorInfo.errorMessage = error.message;
  }
  return res.status(500).json({
    success: errorInfo.success,
    message: errorInfo.message,
    errorMessage: errorInfo.errorMessage,
    errorDetails: errorInfo.errorDetails,
    stack: config.node_env === 'development' ? error?.stack : null,
  });
};

export default globalErrorHandler;
