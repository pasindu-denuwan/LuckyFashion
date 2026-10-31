import { z } from 'zod';

export const businessSettingsSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  phone: z.string().optional().default(''),
  whatsapp: z.string().optional().default(''),
  email: z.string().email('Please enter a valid email').or(z.literal('')),
  address: z.string().optional().default(''),
  business_hours: z.string().optional().default(''),
  social_links: z.record(z.string(), z.string()).default({}),
  available_materials: z.array(z.string()).default([]),
});

export type BusinessSettingsFormValues = z.infer<typeof businessSettingsSchema>;

