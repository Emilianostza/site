import React from 'react';
import { Industry, IndustryConfig } from '@/types';
import { Box, Scan, Globe, ShoppingBag } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Restaurants', path: '/industries/restaurants' },
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
    samples: [
      { name: 'Signature Burger', thumb: 'https://picsum.photos/seed/burger/600/500', tag: 'Food' },
      { name: 'Truffle Pasta', thumb: 'https://picsum.photos/seed/pasta/600/500', tag: 'Food' },
      {
        name: 'Espresso Machine',
        thumb: 'https://picsum.photos/seed/espresso/600/500',
        tag: 'Product',
      },
      { name: 'Dessert Platter', thumb: 'https://picsum.photos/seed/dessert/600/500', tag: 'Food' },
      {
        name: 'Wine Bottle',
        thumb: 'https://picsum.photos/seed/winebottle/600/500',
        tag: 'Product',
      },
      {
        name: 'Table Setting',
        thumb: 'https://picsum.photos/seed/tablesetting/600/500',
        tag: 'Scene',
      },
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
