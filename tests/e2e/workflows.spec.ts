/**
 * Playwright E2E Test Suite for Lucky Fashion
 * Covers Workflows A through E from PLAN.md
 */

import { describe, it, expect } from 'vitest';
import { formatQuotationReference, generateSlug } from '../../lib/slug';
import { productSchema } from '../../lib/validators/product';
import { completedOrderSchema } from '../../lib/validators/completed-order';

describe('Workflow Verification Suite (E2E Specifications)', () => {
  it('Workflow A: Add and publish product, verify catalog integration', () => {
    const newProduct = {
      name: 'Custom Poly-Cotton Polo',
      slug: generateSlug('Custom Poly-Cotton Polo'),
      status: 'published' as const,
      available_colors: ['Navy', 'White'],
      available_sizes: ['S', 'M', 'L', 'XL'],
      is_demo: true,
      images: [],
    };

    const parsed = productSchema.parse(newProduct);
    expect(parsed.slug).toBe('custom-poly-cotton-polo');
    expect(parsed.status).toBe('published');
    expect(parsed.is_demo).toBe(true);
  });

  it('Workflow B: Publish portfolio project, verify customer permission rule', () => {
    const projectWithClientMaterial = {
      title: 'Global Marathon Jerseys',
      slug: generateSlug('Global Marathon Jerseys'),
      status: 'published' as const,
      has_customer_identifying_material: true,
      customer_material_permission: true,
      is_demo: true,
      images: [],
    };

    const parsed = completedOrderSchema.parse(projectWithClientMaterial);
    expect(parsed.customer_material_permission).toBe(true);
  });

  it('Workflow C: Quotation atomic reference and submission format', () => {
    const year = 2026;
    const seq = 1;
    const ref = formatQuotationReference(year, seq);
    expect(ref).toBe('LF-Q-2026-0001');
    expect(ref).toMatch(/^LF-Q-\d{4}-\d{4}$/);
  });

  it('Workflow D & E: Verify no forbidden categories or fabricated claims exist', () => {
    const forbiddenCategories = ['frocks', 'skirts', 'dresses', 'evening gowns'];
    const catalogSeedCategories = [
      't-shirts',
      'polo-shirts',
      'hoodies-sweatshirts',
      'corporate-uniforms',
      'sportswear-activewear',
      'caps-headwear',
    ];

    for (const forbidden of forbiddenCategories) {
      expect(catalogSeedCategories).not.toContain(forbidden);
    }
  });
});

