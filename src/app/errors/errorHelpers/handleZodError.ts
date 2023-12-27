import { ZodError, ZodIssue } from 'zod';
import { IErrorResponse } from '../../interface/error.interface';

const handlerZodError = (err: ZodError): IErrorResponse => {
  const errorMessageArray: string[] = err.issues.map(
    (issue: ZodIssue) =>
      issue.path[issue.path.length - 1] +
      ' is ' +
      issue.message.split(',')[0].toLowerCase(),
  );
  return {
    success: false,
    statusCode: 400,
    message: 'Validation Error',
    errorMessage: errorMessageArray.join('. '),
    errorDetails: { ...err },
  };
};

export default handlerZodError;
