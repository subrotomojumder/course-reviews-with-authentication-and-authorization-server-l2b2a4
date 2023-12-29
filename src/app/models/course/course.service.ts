import { Course } from './course.model';
import { ICourse } from './course.interface';
import mongoose from 'mongoose';
import { search } from '../../queryHelpers/search';
import { searchableFields } from './course.constant';
import { filter } from '../../queryHelpers/filter';
import { sort } from '../../queryHelpers/sort';
import { pagination } from '../../queryHelpers/pagination';
import { selectFields } from '../../queryHelpers/selectFields';
import { Review } from '../review/review.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseInDB = async (payload: ICourse) => {
  const result = await Course.create(payload);
  return result;
};
const getAllCourseInDB = async (query: Record<string, unknown>) => {
  const searchQuery = search(Course.find(), query, searchableFields);
  const filterQuery = filter(searchQuery, query);
  const sortQuery = sort(filterQuery, query);
  const paginationQuery = pagination(sortQuery, query);
  const result = await selectFields(paginationQuery, query).lean();
  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.page) || 10,
      total: await Course.countDocuments({}),
    },
    data: result,
  };
};
const getCourseWithReviewsInDB = async (id: string) => {
  if (!(await Course.isExistCourse(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course is not exists!');
  }
  const reviewsResult = await Course.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $project: {
        course: {
          $mergeObjects: ['$$ROOT', { reviews: [] }],
        },
        reviews: 1,
        _id: 0,
      },
    },
    {
      $unset: 'course.reviews',
    },
  ]);
  // const reviewsResult = await Review.aggregate([
  //   { $match: { courseId: new mongoose.Types.ObjectId(id) } },
  //   { $project: { courseId: 1, rating: 1, review: 1, _id: 0 } },
  // ]);
  return reviewsResult[0];
};
const updateCourseInDB = async (id: string, payload: Partial<ICourse>) => {
  if (!(await Course.isExistCourse(id))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course is not exists!');
  }
  const {
    tags,
    details,
    durationInWeeks,
    startDate,
    endDate,
    ...basicRemainingData
  } = payload;
  if (durationInWeeks) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Course duration week can't be update!",
    );
  }
  const newUpdatedData: Record<string, unknown> = { ...basicRemainingData };
  //object type property update
  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      newUpdatedData[`details.${key}`] = value;
    }
  }
  // date update condition
  if ((startDate && !endDate) || (!startDate && endDate)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'StartDate and endDate both need to be updated!',
    );
  } else if (startDate && endDate) {
    if (new Date(startDate).getTime() < new Date(endDate).getTime()) {
      const start = new Date(startDate)?.getTime();
      const end = new Date(endDate)?.getTime();
      const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
      newUpdatedData.durationInWeeks = Math.ceil(
        (end - start) / millisecondsInWeek,
      );
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'EndDate can not be less than StartDate!',
      );
    }
  }
  // course tag updating functionality
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const basicUpdatedData = await Course.findByIdAndUpdate(
      id,
      newUpdatedData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!basicUpdatedData) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
    if (tags && tags.length > 0) {
      const tagsForDelete = tags
        .filter((tag) => tag.name && tag.isDeleted)
        .map((tag) => tag.name);
      const tagsDeletedData = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: { name: { $in: tagsForDelete } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!tagsDeletedData) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
      const tagsForIncluding = tags?.filter(
        (tag) => tag.name && !tag.isDeleted,
      );
      const tagIncludedData = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: tagsForIncluding } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!tagIncludedData) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    const result = await Course.findById(id);
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
  }
};
const getBestCourseInDB = async () => {
  const result = await Review.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $sort: { averageRating: -1, reviewCount: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'courses',
      },
    },
    {
      $project: {
        course: { $arrayElemAt: ['$courses', 0] },
        reviewCount: 1,
        averageRating: 1,
        _id: 0,
      },
    },
  ]);
  return result[0];
};
export const CourseServices = {
  createCourseInDB,
  getAllCourseInDB,
  getCourseWithReviewsInDB,
  updateCourseInDB,
  getBestCourseInDB,
};
