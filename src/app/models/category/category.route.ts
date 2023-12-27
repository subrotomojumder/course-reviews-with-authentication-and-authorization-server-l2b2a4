import { Router } from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { CategoryControllers } from './category.controller';
import { CategoryValidations } from './category.validation';

const router = Router();

router.post(
  '/',
  validationMiddleware(CategoryValidations.categoryValidationSchema),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategory);
export const CategoryRoutes = router;
