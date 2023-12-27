import { z } from 'zod';

const tagValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean().default(false).optional(),
});
const detailsValidationSchema = z.object({
  level: z.string(),
  description: z.string(),
});
const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    instructor: z.string(),
    categoryId: z.string(),
    price: z.number(),
    tags: z.array(tagValidationSchema),
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    details: detailsValidationSchema,
  }),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    instructor: z.string().optional(),
    categoryId: z.string().optional(),
    price: z.number().optional(),
    tags: z.array(tagValidationSchema).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    durationInWeeks: z.any().optional(),
    language: z.string().optional(),
    provider: z.string().optional(),
    details: detailsValidationSchema.partial().optional(),
  }),
});
export const CourseValidationSchema = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
