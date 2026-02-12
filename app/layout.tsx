import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LivingRite Care Booking & Client Care Management",
  description: "Professional care services booking and management platform",
};

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
        </Providers>
      </body>
    </html>
  );
}
