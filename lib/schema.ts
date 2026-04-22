// lib/schema.ts - Schema.org structured data generators

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LivingRite Care',
    url: 'https://livingritecare.com',
    logo: 'https://livingritecare.com/icon.png',
    description: 'Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support.',
    foundingDate: '2020',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      telephone: '+23478106834519',
      email: 'support@livingritecare.com',
    },
    sameAs: [
      'https://www.facebook.com/livingrite',
      'https://www.twitter.com/livingrite',
      'https://www.linkedin.com/company/livingrite',
      'https://www.instagram.com/livingrite',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '60/64 Allen Avenue First Bank Bus Stop, Allen Ikeja, Lagos, Nigeria',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos State',
      postalCode: 'XXXX',
      addressCountry: 'NG',
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Lagos',
      },
    ],
  };
}

export function generateHealthcareServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'LivingRite Care',
    url: 'https://livingritecare.com',
    description: 'Professional home healthcare services',
    medicalSpecialty: [
      'CardiacCare',
      'Geriatric',
      'Palliative',
      'Physiotherapy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: ['en'],
      teleService: ['TelephoneDelivery'],
    },
    hasOfferingChannel: {
      '@type': 'MedicalWebsiteOrApp',
      name: 'LivingRite Online',
      appDownloadUrl: '#',
      applicationCategory: 'MedicalApplication',
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://livingritecare.com',
    name: 'LivingRite Care',
    image: 'https://livingritecare.com/icon.png',
    description: 'Home healthcare professionals in Lagos, Nigeria',
    telephone: '+23478106834519',
    email: 'support@livingritecare.com',
    url: 'https://livingritecare.com',
    priceRange: '₦₦₦',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '14:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Address',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.5244',
      longitude: '3.3792',
    },
    areaServed: 'NG',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };
}

export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does LivingRite Care provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide professional home healthcare services including post-stroke recovery, ICU care, physiotherapy, and palliative support.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is LivingRite Care available 24/7?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer flexible scheduling. Contact us to discuss your specific needs.',
        },
      },
    ],
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  publishDate: string;
  modifiedDate?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image || 'https://livingritecare.com/icon.png',
    author: {
      '@type': 'Person',
      name: article.author || 'LivingRite Care',
    },
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: 'LivingRite Care',
      logo: {
        '@type': 'ImageObject',
        url: 'https://livingritecare.com/icon.png',
      },
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Service',
    name: product.name,
    description: product.description,
    image: product.image || 'https://livingritecare.com/icon.png',
    url: product.url,
    ...(product.price && { price: product.price }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        ratingCount: product.reviewCount || 1,
      },
    }),
  };
}
