import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    courseId: z.string(),
    rating: z.number().min(1).max(5).nullable(),
    review: z.string().min(3),
  }),
});

export const ReviewValidationSchema = {
  createReviewSchema,
};
