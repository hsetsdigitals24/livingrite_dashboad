import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LivingRite Care - Expert Home Healthcare in Nigeria',
    short_name: 'LivingRite Care',
    description: 'Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00b2ec',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['healthcare', 'medical'],
    shortcuts: [
      {
        name: 'Book a Consultation',
        short_name: 'Book',
        description: 'Book a consultation with our healthcare experts',
        url: '/contact?type=consultation',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'View Services',
        short_name: 'Services',
        description: 'View our healthcare services',
        url: '/services',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}
