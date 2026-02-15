import React from 'react';
import { Industry, IndustryConfig } from '@/types';
import { ShoppingBag, Box, Scan, Globe } from 'lucide-react';

export const NAV_ITEMS = [
  {
    label: 'Industries',
    path: '/industries',
    children: [
      { label: 'Restaurants', path: '/industries/restaurants' },
      { label: 'Museums', path: '/industries/museums' },
      { label: 'E-commerce', path: '/industries/ecommerce' },
    ],
  },
  { label: 'Gallery', path: '/gallery' },
  { label: 'How it Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
];

export const INDUSTRIES: Record<string, IndustryConfig> = {
  restaurants: {
    id: 'restaurants',
    title: 'Turn your signature items into interactive 3D',
    subtitle: 'Managed capture by employees + web/AR-ready delivery for menus and marketing.',
    heroImage: 'https://picsum.photos/seed/restaurant_hero/1200/600',
    demoImage: 'https://picsum.photos/seed/burger_3d/800/600',
    outcomes: [
      'Increase appetite appeal with realistic 3D food models',
      'Integrate directly into digital menus and delivery apps',
      'Generate QR codes for table-side AR experiences',
    ],
    permissions: [
      'Edit title/description/tags',
      'Create/revoke share links',
      'Generate QR codes',
      'Download delivered bundles',
    ],
  },
  museums: {
    id: 'museums',
    title: 'Digitize collections with managed capture',
    subtitle: 'Expert handling, access controls, and dedicated staff for sensitive artifacts.',
    heroImage: 'https://picsum.photos/seed/museum_hero/1200/600',
    demoImage: 'https://picsum.photos/seed/vase_3d/800/600',
    outcomes: [
      'Preserve fragile artifacts digitally',
      'Expand accessibility to global audiences',
      'Strict access controls (Public, Unlisted, Restricted)',
    ],
    permissions: [
      'Edit metadata (Accession ID)',
      'Approve/reject with comments',
      'Share links with password/expiry',
      'Downloads OFF by default',
    ],
  },
  ecommerce: {
    id: 'ecommerce',
    title: 'Managed 3D capture for high-conversion product pages',
    subtitle: 'Fast-loading 3D models that reduce returns and increase engagement.',
    heroImage: 'https://picsum.photos/seed/shoe_hero/1200/600',
    demoImage: 'https://picsum.photos/seed/sneaker_3d/800/600',
    outcomes: [
      'Boost conversion rates by up to 40%',
      'Reduce return rates with accurate visualization',
      'AR-ready formats for iOS and Android',
    ],
    permissions: [
      'Edit SKU/Metadata',
      'Download exports (GLB/USDZ)',
      'Configure embeds',
      'Campaign QR codes',
    ],
  },
};

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Intake',
    desc: 'Submit your request details and logistics preferences.',
    icon: <Box className="w-6 h-6" />,
  },
  {
    title: 'Employee Capture',
    desc: 'Our trained experts arrive on-site or receive your shipment.',
    icon: <Scan className="w-6 h-6" />,
  },
  {
    title: 'Processing & QA',
    desc: 'Assets are processed into optimized 3D web formats.',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: 'Review & Publish',
    desc: 'Approve assets in the portal and publish instantly.',
    icon: <ShoppingBag className="w-6 h-6" />,
  },
];
