/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { IUserRole } from '../models/user/user.interface';
import jwt from 'jsonwebtoken'
import { User } from '../models/user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const authMiddleware = (...requiredRoles: IUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error();
      }
      const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
      const { role, _id, email, iat } = decoded;
      const user = await User.findOne({ role, _id, email }).select(
        '+passwordHistory',
      );
      if (!user) {
        throw new Error(    );
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
        throw new Error(   );
      }
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new Error( );
      }
      req.user = decoded as JwtPayload;
      next();
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: 'Unauthorized Access',
        errorMessage: "You do not have the necessary permissions to access this resource.",
        errorDetails: null,
        stack: null,
      });
    }
  };
};

export default authMiddleware;
