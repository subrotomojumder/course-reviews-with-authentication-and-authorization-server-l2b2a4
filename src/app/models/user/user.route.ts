import { Router } from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { UserControllers } from "./user.controller";
import { UserValidations } from "./user.zod.validation";
import authMiddleware from "../../middlewares/authMiddleware";

const router = Router();

router.post(
  '/register',
  validationMiddleware(UserValidations.userRegistrationValidationSchema),
  UserControllers.registerUser,
);
router.post(
  '/login',
  validationMiddleware(UserValidations.userLoginUserValidationSchema),
  UserControllers.loginUser,
);
router.post(
  '/change-password',
  authMiddleware("admin","user"),
  validationMiddleware(UserValidations.passwordChangeValidationSchema),
  UserControllers.userChangePassword,
);

export const UserRoutes = router;
