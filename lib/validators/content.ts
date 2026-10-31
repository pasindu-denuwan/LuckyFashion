import { z } from 'zod';

export const homePageContentSchema = z.object({
  hero_title: z.string().min(5),
  hero_subtitle: z.string().min(10),
  cta_primary: z.string().default('Request a Quote'),
  cta_secondary: z.string().default('Explore Catalog'),
  about_snippet_title: z.string().optional().default(''),
  about_snippet_text: z.string().optional().default(''),
});

export const aboutPageContentSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().default(''),
  mission: z.string().optional().default(''),
  story: z.string().optional().default(''),
});

export const manufacturingPageContentSchema = z.object({
  title: z.string().min(2),
  intro: z.string().optional().default(''),
  faqs: z
    .array(
      z.object({
        question: z.string().min(3),
        answer: z.string().min(5),
      })
    )
    .default([]),
});

export const contactPageContentSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().default(''),
  form_header: z.string().default('Send Us a Message'),
});

export const websiteContentSchemaMap = {
  home: homePageContentSchema,
  about: aboutPageContentSchema,
  manufacturing: manufacturingPageContentSchema,
  contact: contactPageContentSchema,
};

