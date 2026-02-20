import React from 'react';
import { useLocation } from 'react-router-dom';

const SITE_ORIGIN = 'https://managed3d.com';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

// React 19 supports rendering <title> and <meta> directly from components —
// they are automatically hoisted to <head> without a provider.
export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Managed Capture 3D Platform - Create and share immersive AR experiences.',
  image = '/og-image.jpg',
  url,
  type = 'website',
}) => {
  const { pathname } = useLocation();
  const canonical = url ?? `${SITE_ORIGIN}${pathname}`;
  const siteTitle = 'Managed Capture';
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
};
