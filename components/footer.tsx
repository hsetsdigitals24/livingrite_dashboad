"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

const footerLinks = {
  services: [
    { name: "Post-Stroke Care", href: "#" },
    { name: "Post-ICU Care", href: "#" },
    { name: "Physiotherapy", href: "#" },
    { name: "Palliative Care", href: "#" },
    { name: "Live-in Nursing", href: "#" },
    { name: "Rehabilitation", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Team", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  resources: [
    { name: "Care Guides", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#" },
    { name: "Contact", href: "#" },
  ],
};

export function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/client") ||
    pathname.startsWith("/caregiver")
  ) {
    return null;
  }

  return (
    <footer className="bg-linear-to-b from-gray-100 to-gray-200 text-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 animate-slide-up animation-delay-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                LivingRite Care
              </span>
            </div>
            <p className="text-gray-900 mb-6 leading-relaxed max-w-sm">
              Healing Happens Best Where You Are Most Loved.{" "}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                <span className="text-gray-900">
                  60/64 Allen Avenue First Bank Bus Stop, Allen Ikeja, Lagos,
                  Nigeria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-gray-900">+234 810 683 4519</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-gray-900">livingritecare@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div className="animate-slide-up animation-delay-200">
            <h3 className="font-semibold text-lg mb-4 text-black">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-900 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="animate-slide-up animation-delay-300">
            <h3 className="font-semibold text-lg mb-4 text-black">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-900 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="animate-slide-up animation-delay-400">
            <h3 className="font-semibold text-lg mb-4 text-black">
              Newsletter
            </h3>
            <p className="text-gray-900 text-sm mb-4">
              Get weekly healthcare tips and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary"
              />
              <Button
                size="sm"
                className="bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-gray-800 animate-slide-up animation-delay-500">
          <div className="flex items-center gap-4">
            <Link
              href={`https://www.facebook.com/livingritecare/${process.env.NEXT_PUBLIC_FACEBOOK}`}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300 text-gray-400"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href={`https://www.x.com/livingritecare/${process.env.NEXT_PUBLIC_TWITTER}`}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300 text-gray-400"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href={`https://www.linkedin.com/company/${process.env.NEXT_PUBLIC_LINKEDIN}`}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300 text-gray-400"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-900">
            © {new Date().getFullYear()} LivingRite Care. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <Link
              href="#"
              className="text-gray-900 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-900 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
