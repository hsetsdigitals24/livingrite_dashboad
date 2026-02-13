import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { Footer } from "@/components/footer";
// import { SanityLive } from "@/sanity/lib/live";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LivingRite Care - Expert Home Healthcare in Nigeria",
  description:
    "Professional home healthcare services for post-stroke recovery, ICU care, physiotherapy, and palliative support. Hospital-trained nurses delivering compassionate care in the comfort of your home.",
  keywords:
    "home healthcare Nigeria, post-stroke care, ICU care, physiotherapy, palliative care, nursing services Lagos",
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
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <section>{children}</section>
          <FloatingContactWidget />
          <Footer />
          {/* <SanityLive /> */}
        </Providers>
      </body>
    </html>
  );
}
