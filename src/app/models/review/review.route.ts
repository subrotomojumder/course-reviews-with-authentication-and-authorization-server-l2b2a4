import { Router } from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import { ReviewValidationSchema } from "./review.validation";
import { ReviewControllers } from "./review.controller";

const router = Router();

router.post(
  '/',
  validationMiddleware(ReviewValidationSchema.createReviewSchema),
  ReviewControllers.createReview,
);
// router.get('/', CourseControllers.getAllCourse);

export const ReviewRoutes = router;