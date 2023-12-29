import { Schema, model } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
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
categorySchema.statics.isExistCategory = async function (_id: Schema.Types.ObjectId) {
  const existCategory = Category.findById(_id);
  return existCategory;
};
export const Category = model<ICategory , CategoryModel>('Category', categorySchema);
