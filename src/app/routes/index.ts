import { Router } from 'express';
import { CategoryRoutes } from '../models/category/category.route';
import { CourseRoutes } from '../models/course/course.route';
import { ReviewRoutes } from '../models/review/review.route';
import { UserRoutes } from '../models/user/user.route';

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
  {
    path: '/auth',
    routeName: UserRoutes,
  }
];
moduleRoutes.forEach((route) => router.use(route.path, route.routeName));

export default router;
