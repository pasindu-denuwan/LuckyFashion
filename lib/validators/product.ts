import { z } from 'zod';

const FORBIDDEN_WORDS = ['frock', 'frocks', 'skirt', 'skirts', 'dress', 'dresses'];

function containsForbiddenApparel(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name is required')
    .refine(
      (name) => !containsForbiddenApparel(name),
      'Invalid product: Lucky Fashion does not manufacture frocks, skirts, or dresses.'
    ),
  slug: z.string().min(2, 'Valid slug is required'),
  category_id: z.string().uuid().optional().nullable(),
  description: z.string().optional().default(''),
  fabric_details: z.string().optional().default(''),
  available_colors: z.array(z.string()).default([]),
  available_sizes: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  cover_image_url: z.string().url().optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt_text: z.string().optional().default(''),
        sort_order: z.number().int().default(0),
      })
    )
    .default([]),
  is_demo: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;

