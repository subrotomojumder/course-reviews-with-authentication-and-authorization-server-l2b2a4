import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { CategoryServices } from './category.service';
import sendResponseFunc from '../../utils/sendResponseFunc';

const createCategory = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await CategoryServices.createCategoryInDB({
    ...req.body,
    createdBy: _id,
  });
  sendResponseFunc(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});
const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesInDB();
  sendResponseFunc(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategory,
};
