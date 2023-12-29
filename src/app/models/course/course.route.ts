import { Router } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { CourseValidationSchema } from './course.validation';
import { CourseControllers } from './course.controller';
import authMiddleware from '../../middlewares/authMiddleware';

const courseRouter = Router();
const coursesRouter = Router();
coursesRouter.post(
  '/',
  authMiddleware("admin"),
  validationMiddleware(CourseValidationSchema.createCourseValidationSchema),
  CourseControllers.createCourse,
);
courseRouter.get('/best', CourseControllers.getBestCourse);
coursesRouter.get('/', CourseControllers.getAllCourse);
coursesRouter.get('/:courseId/reviews', CourseControllers.getCourseWithReview);
coursesRouter.put(
  '/:courseId',
  validationMiddleware(CourseValidationSchema.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

export const CourseRoutes = {
  courseRouter,
  coursesRouter,
};
