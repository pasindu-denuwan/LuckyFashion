import { describe, it, expect } from 'vitest';
import { generateSlug, formatQuotationReference } from '../lib/slug';
import { productSchema } from '../lib/validators/product';
import { completedOrderSchema } from '../lib/validators/completed-order';
import { quotationStep1Schema, quotationStep3ContactSchema } from '../lib/validators/quote';
import { contactMessageSchema } from '../lib/validators/contact';

describe('Quotation Reference Number Formatter', () => {
  it('formats quotation references according to LF-Q-YYYY-XXXX standard', () => {
    expect(formatQuotationReference(2026, 1)).toBe('LF-Q-2026-0001');
    expect(formatQuotationReference(2026, 42)).toBe('LF-Q-2026-0042');
    expect(formatQuotationReference(2026, 9999)).toBe('LF-Q-2026-9999');
  });
});

describe('Slug Generation', () => {
  it('generates clean URL-safe slugs', () => {
    expect(generateSlug('Classic Combed Cotton Crewneck!')).toBe('classic-combed-cotton-crewneck');
    expect(generateSlug('  Heavyweight Fleece -- 340 GSM  ')).toBe('heavyweight-fleece-340-gsm');
    expect(generateSlug('Sportswear & Activewear')).toBe('sportswear-activewear');
  });
});

describe('Product Schema Validation & Business Constraints', () => {
  it('rejects forbidden apparel items (frocks, skirts, dresses)', () => {
    const invalidFrock = {
      name: 'Summer Cotton Frock',
      slug: 'summer-cotton-frock',
      status: 'draft',
      available_colors: ['Red'],
      available_sizes: ['M'],
      is_demo: false,
      images: [],
    };
    expect(() => productSchema.parse(invalidFrock)).toThrowError(
      /Lucky Fashion does not manufacture frocks, skirts, or dresses/
    );

    const invalidSkirt = {
      name: 'Pleated Uniform Skirt',
      slug: 'pleated-uniform-skirt',
      status: 'draft',
      available_colors: ['Navy'],
      available_sizes: ['S'],
      is_demo: false,
      images: [],
    };
    expect(() => productSchema.parse(invalidSkirt)).toThrowError(
      /Lucky Fashion does not manufacture frocks, skirts, or dresses/
    );

    const invalidDress = {
      name: 'Evening Maxi Dress',
      slug: 'evening-maxi-dress',
      status: 'draft',
      available_colors: ['Black'],
      available_sizes: ['L'],
      is_demo: false,
      images: [],
    };
    expect(() => productSchema.parse(invalidDress)).toThrowError(
      /Lucky Fashion does not manufacture frocks, skirts, or dresses/
    );
  });

  it('accepts valid allowed apparel items', () => {
    const validPolo = {
      name: 'Corporate Pique Polo Shirt',
      slug: 'corporate-pique-polo-shirt',
      status: 'published',
      available_colors: ['Navy', 'White'],
      available_sizes: ['M', 'L', 'XL'],
      is_demo: true,
      images: [],
    };
    expect(productSchema.parse(validPolo)).toBeDefined();
  });
});

describe('Completed Orders (Portfolio) Customer Material Permission', () => {
  it('blocks publishing when customer material permission is not confirmed', () => {
    const unconfirmedProject = {
      title: 'Global Tech Staff Uniforms',
      slug: 'global-tech-staff-uniforms',
      status: 'published',
      has_customer_identifying_material: true,
      customer_material_permission: false,
      images: [],
      is_demo: false,
    };
    const result = completedOrderSchema.safeParse(unconfirmedProject);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message.toLowerCase()).toContain(
        'permission to publish applicable customer materials'
      );
    }
  });

  it('allows publishing when customer material permission is confirmed', () => {
    const confirmedProject = {
      title: 'Global Tech Staff Uniforms',
      slug: 'global-tech-staff-uniforms',
      status: 'published',
      has_customer_identifying_material: true,
      customer_material_permission: true,
      images: [],
      is_demo: false,
    };
    expect(completedOrderSchema.parse(confirmedProject)).toBeDefined();
  });

  it('allows draft status even without customer material permission', () => {
    const draftProject = {
      title: 'Unconfirmed Draft Project',
      slug: 'unconfirmed-draft-project',
      status: 'draft',
      has_customer_identifying_material: true,
      customer_material_permission: false,
      images: [],
      is_demo: false,
    };
    expect(completedOrderSchema.parse(draftProject)).toBeDefined();
  });
});

describe('Quotation & Contact Schemas', () => {
  it('validates quotation items with quantity and material', () => {
    const validItems = {
      items: [
        {
          item_name: 'Custom Polo Shirts',
          quantity: 250,
          material: '220 GSM Pique Cotton',
          sizes_breakdown: { M: 100, L: 100, XL: 50 },
        },
      ],
    };
    expect(quotationStep1Schema.parse(validItems)).toBeDefined();
  });

  it('rejects quotation items with non-positive quantities', () => {
    const invalidItems = {
      items: [
        {
          item_name: 'Custom Polo Shirts',
          quantity: 0,
          material: 'Cotton',
        },
      ],
    };
    expect(() => quotationStep1Schema.parse(invalidItems)).toThrow();
  });

  it('catches honeypot spam bot submissions', () => {
    const botContact = {
      name: 'Spam Bot',
      email: 'bot@example.com',
      subject: 'Buy cheap leads',
      message: 'Hello buy my SEO services here please',
      honeypot: 'filled_by_bot_value',
    };
    expect(() => contactMessageSchema.parse(botContact)).toThrowError(/Bot detected/);
  });
});
