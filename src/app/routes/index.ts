import { Router } from 'express';
import { CategoryRoutes } from '../models/category/category.route';
import { CourseRoutes } from '../models/course/course.route';
import { ReviewRoutes } from '../models/review/review.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/categories',
    routeName: CategoryRoutes,
  },
  {
    path: '/course',
    routeName: CourseRoutes.courseRouter,
  },
  {
    path: '/courses',
    routeName: CourseRoutes.coursesRouter,
  },
  {
    path: '/reviews',
    routeName: ReviewRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.routeName));

export default router;
