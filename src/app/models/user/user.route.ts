import { Router } from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { UserControllers } from "./user.controller";
import { UserValidations } from "./user.zod.validation";

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

export const UserRoutes = router;
