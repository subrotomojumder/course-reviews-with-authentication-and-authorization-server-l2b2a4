import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Course } from '../course/course.model';
import { IReview } from './review.interface';
import { Review } from './review.model';

const createReviewInDB = async (payload: IReview) => {
  if (!(await Course.isExistCourse(payload.courseId)) ) {
    throw new AppError(httpStatus.NOT_FOUND, "Course is not found!")
  }
  const result = (await Review.create(payload)).populate('createdBy', '-createdAt -updatedAt');
  return result;
};

export const ReviewServices = {
    createReviewInDB
};
