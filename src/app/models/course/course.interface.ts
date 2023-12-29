/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { Types } from 'mongoose';
export type ITag = {
  name: string;
  isDeleted: boolean;
};
export type IDetails = {
  level: string;
  description: string;
};

export type ICourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: ITag[];
  startDate: Date;
  endDate: Date;
  durationInWeeks?: number;
  language: string;
  provider: string;
  details: IDetails;
  createdBy?: Types.ObjectId;
};

export interface CourseModel extends Model<ICourse> {
  isExistCourse(_id: Types.ObjectId | string): Promise<ICourse | null>;
}
