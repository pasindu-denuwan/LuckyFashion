import { z } from 'zod';

const FORBIDDEN_WORDS = ['frock', 'frocks', 'skirt', 'skirts', 'dress', 'dresses'];

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .refine(
      (name) => !FORBIDDEN_WORDS.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(name)),
      'Invalid category: Lucky Fashion does not manufacture frocks, skirts, or dresses.'
    ),
  slug: z.string().min(2, 'Valid slug is required'),
  description: z.string().optional().default(''),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  is_demo: z.boolean().default(false),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

