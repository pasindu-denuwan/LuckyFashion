import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyfashion.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/our-work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/manufacturing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/quote`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const supabase = createClient();
    const [{ data: products }, { data: projects }] = await Promise.all([
      supabase.from('products').select('slug, updated_at').eq('status', 'published'),
      supabase.from('completed_orders').select('slug, updated_at').eq('status', 'published'),
    ]);

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: new Date(p.updated_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((pr) => ({
      url: `${siteUrl}/our-work/${pr.slug}`,
      lastModified: new Date(pr.updated_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}

