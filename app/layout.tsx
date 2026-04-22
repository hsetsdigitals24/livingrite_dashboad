import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/schema";
// import { SanityLive } from "@/sanity/lib/live";

// const inter = Inter({ subsets: ['latin'] })

const BASE_URL = "https://livingritecare.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "LivingRite Care - Expert Home Healthcare in Nigeria",
  description:
    "Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support. Hospital-trained nurses delivering compassionate care in the comfort of your home.",
  keywords:
    "home healthcare Nigeria, post-stroke care, ICU care, physiotherapy, palliative care, nursing services Lagos, home care Lagos, elderly care, rehabilitation services",
  authors: [{ name: "LivingRite Care" }],
  creator: "LivingRite Care",
  publisher: "LivingRite Care",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LivingRite Care",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: BASE_URL,
    siteName: "LivingRite Care",
    title: "LivingRite Care - Expert Home Healthcare in Nigeria",
    description:
      "Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "LivingRite Care - Home Healthcare Services",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LivingRite Care - Expert Home Healthcare in Nigeria",
    description:
      "Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support.",
    creator: "@livingrite",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-NG": `${BASE_URL}/en-NG`,
    },
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  },
  verification: {
    google: "",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Viewport and theme color */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LivingRite Care" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={BASE_URL} />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        
        {/* Alternate links for mobile and search engines */}
        <link rel="alternate" media="only screen and (max-width: 480px)" href={BASE_URL} />
      </head>
      <body>
        <Providers>
          <Header />
          <section>{children}</section>
          <FloatingContactWidget />
          <Footer />
          {/* <SanityLive /> */}
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
        </Providers>
      </body>
    </html>
  );
}
