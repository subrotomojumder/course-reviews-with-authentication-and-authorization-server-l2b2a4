import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  rating: {
    type: Number,
  },
  review: {
    type: String,
    required: true,
  },
});

export const Review = model<IReview>('Review', reviewSchema);
