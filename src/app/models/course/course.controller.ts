import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';
import sendResponseFunc from '../../utils/sendResponseFunc';
import httpStatus from 'http-status';

const createCourse = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await CourseServices.createCourseInDB({
    ...req.body,
    createdBy: _id,
  });
  sendResponseFunc(res, {
    statusCode: 201,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});
const getAllCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourseInDB(req.query);
  sendResponseFunc(res, {
    statusCode: 201,
    success: true,
    message: 'Courses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getCourseWithReview = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getCourseWithReviewsInDB(courseId);

  sendResponseFunc(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.updateCourseInDB(courseId, req.body);

  sendResponseFunc(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const getBestCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getBestCourseInDB();
  sendResponseFunc(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Best course retrieved successfully',
    data: result,
  });
});
export const CourseControllers = {
  createCourse,
  getAllCourse,
  updateCourse,
  getCourseWithReview,
  getBestCourse,
};
