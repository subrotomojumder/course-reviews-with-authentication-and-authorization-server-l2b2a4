import catchAsync from "../../utils/catchAsync";
import sendResponseFunc from "../../utils/sendResponseFunc";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
    const result = await ReviewServices.createReviewInDB(req.body);
    sendResponseFunc(res, {
      statusCode: 201,
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  });

  export const ReviewControllers = {
    createReview
  }