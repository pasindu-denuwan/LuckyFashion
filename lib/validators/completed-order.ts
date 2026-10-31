import { z } from 'zod';

export const completedOrderSchema = z
  .object({
    title: z.string().min(2, 'Project title is required'),
    slug: z.string().min(2, 'Slug is required'),
    category_id: z.string().uuid().optional().nullable(),
    client_type: z.string().optional().default(''),
    description: z.string().optional().default(''),
    specifications: z.record(z.string(), z.string()).default({}),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    featured: z.boolean().default(false),
    has_customer_identifying_material: z.boolean().default(false),
    customer_material_permission: z.boolean().default(false),
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
  })
  .refine(
    (data) => {
      if (data.status === 'published' && data.has_customer_identifying_material) {
        return data.customer_material_permission === true;
      }
      return true;
    },
    {
      message:
        'Publishing is blocked: You must confirm permission to publish applicable customer materials before publishing this project.',
      path: ['customer_material_permission'],
    }
  );

export type CompletedOrderFormValues = z.infer<typeof completedOrderSchema>;

