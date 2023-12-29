import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryInDB = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategoriesInDB = async () => {
  const result = await Category.find().populate('createdBy', '-createdAt -updatedAt');
  return result;
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesInDB
};
