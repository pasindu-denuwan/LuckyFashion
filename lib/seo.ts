import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export function constructMetadata({
  title = 'Lucky Fashion | Custom Apparel Manufacturer',
  description = 'B2B custom apparel manufacturing, uniform fabrication, and garment solutions for brands and institutions.',
  image = '/og-image.jpg',
  path = '',
}: SEOProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyfashion.com';
  const url = `${siteUrl}${path}`;

  return {
    title: {
      default: title,
      template: '%s | Lucky Fashion',
    },
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Lucky Fashion',
      images: [
        {
          url: image.startsWith('http') ? image : `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${siteUrl}${image}`],
    },
    metadataBase: new URL(siteUrl),
  };
}

