// lib/seo-config.ts - Centralized SEO configuration

export const SEO_CONFIG = {
  siteName: 'LivingRite Care',
  siteDescription: 'Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support.',
  siteUrl: 'https://livingritecare.com',
  siteLogo: '/icon.png',
  
  social: {
    twitter: '@livingrite', 
    instagram: 'livingrite_care',
    linkedin: 'company/livingrite-care', 
  },
  
  contact: {
    phone: '+23478106834519',
    email: 'support@livingritecare.com',
    whatsapp: '+23478106834519',
  },
  
  location: {
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    countryCode: 'NG',
    address: '60/64 Allen Avenue First Bank Bus Stop, Allen Ikeja, Lagos, Nigeria',
    latitude: '6.5244',
    longitude: '3.3792',
  },
  
  businessHours: {
    weekday: { open: '08:00', close: '18:00' },
    saturday: { open: '10:00', close: '14:00' },
    sunday: 'closed',
  },

  services: [
    {
      name: 'Post-ICU Care',
      slug: 'post-icu',
      description: 'Comprehensive care and rehabilitation for patients recovering from intensive care',
    },
    {
      name: 'Physiotherapy Sessions',
      slug: 'physiotherapy-sessions',
      description: 'Professional physical therapy to improve mobility and strength',
    },
    {
      name: 'End-of-Life Care',
      slug: 'end-of-life-care',
      description: 'Compassionate palliative and end-of-life care for patients and families',
    },
  ],
};

export const generatePageMetadata = (page: {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
}) => {
  const url = page.slug ? `${SEO_CONFIG.siteUrl}/${page.slug}` : SEO_CONFIG.siteUrl;
  const image = page.image || `${SEO_CONFIG.siteUrl}/og-image.png`;

  return {
    title: `${page.title} | ${SEO_CONFIG.siteName}`,
    description: page.description,
    keywords: page.keywords?.join(', '),
    appLinks: [
      {
        app_name: 'LivingRite Care',
        app_store_id: 'xxx', // Update with actual ID
        play_app_id: 'xxx', // Update with actual ID
        app_url: url,
      },
    ],
    openGraph: {
      type: 'website',
      locale: 'en_NG',
      url,
      siteName: SEO_CONFIG.siteName,
      title: page.title,
      description: page.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      creator: SEO_CONFIG.social.twitter,
      images: [image],
    },
    robots: page.noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
};

export const generateBreadcrumbs = (items: Array<{ label: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };
};

export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    image: service.image || `${SEO_CONFIG.siteUrl}/og-image.png`,
    ...(service.price && { price: service.price }),
    ...(service.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: service.rating.toString(),
        ratingCount: service.reviewCount || 1,
      },
    }),
    provider: {
      '@type': 'LocalBusiness',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
  };
};
