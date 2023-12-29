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
import { metaData } from '../../queryHelpers/metaData';
import { User } from '../user/user.model';
import { Category } from '../category/category.model';

const createCourseInDB = async (payload: ICourse) => {
  const isExistsCategory = await Category.isExistCategory(payload.categoryId);
  if (!isExistsCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category is not exists!');
  }
  const result = await Course.create(payload);
  return result;
};
const getAllCourseInDB = async (query: Record<string, unknown>) => {
  const searchQuery = search(Course.find(), query, searchableFields);
  const filterQuery = filter(searchQuery, query);
  const sortQuery = sort(filterQuery, query);
  const paginationQuery = pagination(sortQuery, query);
  const result = await selectFields(paginationQuery, query)
    .populate('createdBy', '-createdAt -updatedAt')
    .lean();
  const metaResult = await metaData(paginationQuery, query);
  return {
    meta: metaResult,
    data: result,
  };
};
const getCourseWithReviewsInDB = async (id: string) => {
  const course = await Course.findById(id).populate(
    'createdBy',
    '-createdAt -updatedAt',
  );
  if (!course) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course is not exists!');
  }
  const reviews = await Review.find({ courseId: id }).populate(
    'createdBy',
    '-createdAt -updatedAt',
  );
  return {
    course,
    reviews,
  };
};
const updateCourseInDB = async (id: string, payload: Partial<ICourse>) => {
  const isExistsCourse = await Course.isExistCourse(id);
  if (!isExistsCourse) {
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
    const result = await Course.findById(id).populate(
      'createdBy',
      '-createdAt -updatedAt',
    );
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
        as: 'course',
      },
    },
    {
      $unwind: '$course', // Unwind the array created by the $lookup
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  if (result[0]?.course) {
    const userId = result[0]?.course?.createdBy;
    const user = await User.findById(userId).select('-createdAt -updatedAt');
    result[0].course.createdBy = user;
    return result[0];
  } else {
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }
};
export const CourseServices = {
  createCourseInDB,
  getAllCourseInDB,
  getCourseWithReviewsInDB,
  updateCourseInDB,
  getBestCourseInDB,
};
