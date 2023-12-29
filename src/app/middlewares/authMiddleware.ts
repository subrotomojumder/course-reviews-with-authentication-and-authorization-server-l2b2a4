/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { IUserRole } from '../models/user/user.interface';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { verifyToken } from '../models/user/user.utils';
import { User } from '../models/user/user.model';
import { JwtPayload } from 'jsonwebtoken';

const authMiddleware = (...requiredRoles: IUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }
      const decoded = verifyToken(token);
      const { role, _id, email, iat } = decoded;

      const user = await User.findOne({ role, _id, email }).select(
        '+passwordHistory',
      );
      if (!user) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'You do not have the necessary permissions to access this resource.',
        );
      }
      const lastPassUpdateTime = user.passwordHistory?.sort(
        (a, b) => b.passwordChangeAt.getTime() - a.passwordChangeAt.getTime(),
      )[0];
      if (
        lastPassUpdateTime &&
        User.isJWTIssuedBeforePasswordChanged(
          lastPassUpdateTime?.passwordChangeAt,
          iat as number,
        )
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You do not have the necessary permissions to access this resource.',
        );
      }
      req.user = decoded as JwtPayload;
      next();
    } catch (error: any) {
      res.status(error.statusCode).json({
        success: false,
        message: 'Unauthorized Access',
        errorMessage: error.message,
        errorDetails: null,
        stack: null,
      });
    }
  };
};

export default authMiddleware;
