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
  description = 'Professional 3D capture for restaurants. We photograph your dishes and deliver web-ready 3D & AR assets with QR codes.',
  image,
  url,
  type = 'website',
}) => {
  const { pathname } = useLocation();
  const canonical = url ?? `${SITE_ORIGIN}${pathname}`;
  const siteTitle = 'Managed Capture';
  const fullTitle = `${title} | ${siteTitle}`;
  const fullImage = image ? (image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`) : undefined;

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
      {fullImage && <meta property="og:image" content={fullImage} />}
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content={fullImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {fullImage && <meta name="twitter:image" content={fullImage} />}
    </>
  );
};
