import React from 'react';

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
  url = window.location.href,
  type = 'website',
}) => {
  const siteTitle = 'Managed Capture';
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
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
