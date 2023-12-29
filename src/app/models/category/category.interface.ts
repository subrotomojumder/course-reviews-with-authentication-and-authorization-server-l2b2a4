/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type ICategory = {
  name: string;
  createdBy?: Types.ObjectId;
};
export interface CategoryModel extends Model<ICategory> {
  isExistCategory(_id: Types.ObjectId | string): Promise<ICategory | null>;
}
