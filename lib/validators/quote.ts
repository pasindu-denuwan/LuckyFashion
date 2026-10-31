import { z } from 'zod';

export const quotationItemSchema = z.object({
  id: z.string().optional(),
  item_name: z.string().min(2, 'Item name must be at least 2 characters'),
  product_id: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  material: z.string().min(1, 'Please select or enter a material specification'),
  sizes_breakdown: z.record(z.string(), z.number().int().nonnegative()).default({}),
  customization_details: z.string().optional().default(''),
});

export const quotationStep1Schema = z.object({
  items: z.array(quotationItemSchema).min(1, 'At least one item must be added to the quotation'),
});

export const quotationStep2Schema = z.object({
  delivery_timeline: z.string().min(1, 'Please specify your expected delivery timeline'),
  delivery_address: z.string().optional().default(''),
  additional_notes: z.string().optional().default(''),
});

export const quotationStep3ContactSchema = z.object({
  contact_name: z.string().min(2, 'Contact name is required'),
  company_name: z.string().optional().default(''),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  turnstile_token: z.string().optional(),
  honeypot: z.string().max(0, 'Bot detected').optional().default(''),
});

export const fullQuotationSubmissionSchema = quotationStep1Schema
  .merge(quotationStep2Schema)
  .merge(quotationStep3ContactSchema)
  .extend({
    attachments: z
      .array(
        z.object({
          file_path: z.string().min(1),
          file_name: z.string().min(1),
          file_size: z.number().int().positive(),
          mime_type: z.string().min(1),
        })
      )
      .default([]),
  });

export type QuotationItem = z.infer<typeof quotationItemSchema>;
export type FullQuotationSubmission = z.infer<typeof fullQuotationSubmissionSchema>;

