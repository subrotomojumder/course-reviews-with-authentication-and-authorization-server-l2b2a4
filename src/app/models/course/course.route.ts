import { Router } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { CourseValidationSchema } from './course.validation';
import { CourseControllers } from './course.controller';
import authMiddleware from '../../middlewares/authMiddleware';

const coursesRouter = Router();
const courseRouter = Router();

coursesRouter.post(
  '/',
  authMiddleware('admin'),
  validationMiddleware(CourseValidationSchema.createCourseValidationSchema),
  CourseControllers.createCourse,
);
coursesRouter.get('/', CourseControllers.getAllCourse);
coursesRouter.get('/:courseId/reviews', CourseControllers.getCourseWithReview);
coursesRouter.put(
  '/:courseId',
  authMiddleware('admin'),
  validationMiddleware(CourseValidationSchema.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

courseRouter.get('/best', CourseControllers.getBestCourse);

export const CourseRoutes = {
  courseRouter,
  coursesRouter,
};
