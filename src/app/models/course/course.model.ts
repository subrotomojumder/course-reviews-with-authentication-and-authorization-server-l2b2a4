import { Schema, model } from 'mongoose';
import { CourseModel, ICourse, IDetails, ITag } from './course.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);
const detailsSchema = new Schema<IDetails>(
  {
    level: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);
const courseSchema = new Schema<ICourse, CourseModel>(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    instructor: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    price: {
      type: Number,
      required: true,
    },
    tags: [tagSchema],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    language: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
    },
    durationInWeeks: {
      type: Number,
    },
    details: detailsSchema,
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
courseSchema.pre('save', async function (next) {
  if (this.startDate.getTime() > this.endDate.getTime()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'EndDate can not be less than StartDate!',
    );
  } else {
    const start = this?.startDate?.getTime();
    const end = this?.endDate?.getTime();
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    this.durationInWeeks = Math.ceil((end - start) / millisecondsInWeek);
    next();
  }
});
courseSchema.statics.isExistCourse = async function (_id: Schema.Types.ObjectId) {
  const existCourse = Course.findById(_id);
  return existCourse;
};
export const Course = model<ICourse, CourseModel>('Course', courseSchema);
