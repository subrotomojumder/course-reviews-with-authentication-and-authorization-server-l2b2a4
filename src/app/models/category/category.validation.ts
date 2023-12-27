import { z } from 'zod';

const categoryValidationSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const CategoryValidations = {
  categoryValidationSchema,
};
