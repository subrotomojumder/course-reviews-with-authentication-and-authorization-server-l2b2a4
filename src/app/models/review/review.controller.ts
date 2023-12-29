import catchAsync from '../../utils/catchAsync';
import sendResponseFunc from '../../utils/sendResponseFunc';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const result = await ReviewServices.createReviewInDB({
    ...req.body,
    createdBy: _id,
  });
  sendResponseFunc(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
};
