import { Router } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { CourseValidationSchema } from './course.validation';
import { CourseControllers } from './course.controller';

const courseRouter = Router();
const coursesRouter = Router();
// course route
courseRouter.post(
  '/',
  validationMiddleware(CourseValidationSchema.createCourseValidationSchema),
  CourseControllers.createCourse,
);
courseRouter.get('/best', CourseControllers.getBestCourse);

// courses route
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
