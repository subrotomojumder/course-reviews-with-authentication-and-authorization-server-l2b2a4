import { IReview } from './review.interface';
import { Review } from './review.model';

const createReviewInDB = async (payload: IReview) => {
  const result = await Review.create(payload);
  return result;
};

export const ReviewServices = {
    createReviewInDB
};
