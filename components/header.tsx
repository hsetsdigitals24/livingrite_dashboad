"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleAwareUserMenu } from "./RoleAwareUserMenu";
import { BookingLink } from "@/components/BookingLink";
// import { AdminNav } from "./nav/AdminNav";
// import { CombinedNav } from "./nav/CombinedNav";
// import { MobileCombinedNav } from "./nav/MobileCombinedNav";

// Shared public-facing link data — used by BOTH the desktop and mobile menus so
// the two can never drift out of sync.
const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Neurorehabilitation Care", href: "/services/neurorehabilitation" },
  { label: "Post-ICU Care", href: "/services/post-icu-care" },
  { label: "Post-Surgical Care", href: "/services/post-surgical-care" },
  { label: "End-of-Life & Palliative Care", href: "/services/end-of-life-care" },
  { label: "Geriatric Care", href: "/services/geriatric-care" },
  { label: "Chronic Wound Care", href: "/services/chronic-wound-care" },
  { label: "Home Medical Consultations", href: "/services/home-medical-consultations" },
  { label: "Routine Laboratory Services", href: "/services/routine-laboratory-services" },
  { label: "Physiotherapy Services", href: "/services/physiotherapy-services" },
  { label: "Postpartum Care", href: "/services/postpartum-care" },
];

const publicLinks = [
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
];

const whoWeAreLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "FAQs", href: "/faqs" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { role, isAuthenticated, isLoading } = useUserRole();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header on admin dashboard routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group w-fit">
            {/* <div className="w-fit border border-gray-300 rounded-lg flex items-center justify-start group-hover:scale-110 transition-transform duration-300"> */}
              <Image src={logo} className="w-100 h-auto " alt="LivingRite Care Logo" />
            {/* </div>  */}
          </Link>

          {/* Desktop Navigation - Role Aware */}
          <div className="hidden md:flex items-center gap-8">
              <Link 
                    href='/'
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors font-bold ${
                      role && role !== "ADMIN"
                        ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        : "text-gray-700 relative hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-teal-500 after:to-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
                    }`}
                  > 
                    <span>Home</span>
                  </Link>
             <DropdownMenu>
              <DropdownMenuTrigger className="text-sm flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-bold group">
                Services
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {serviceLinks.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
              {publicLinks.map((item, index) => {
                return (
                  <Link
                  key={index}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-[600] transition-colors ${
                      role && role !== "ADMIN"
                        ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        : "text-gray-700 relative hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-teal-500 after:to-cyan-500 after:transition-all after:duration-300 hover:after:w-full"
                    }`}
                  >
                    {/* {role && role !== "ADMIN" && <Icon className="h-4 w-4" />} */}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
                 <DropdownMenu>
              <DropdownMenuTrigger className="text-sm flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-bold group">
                Who We Are
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {whoWeAreLinks.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          

          {/* CTA Button / Auth - Role Aware */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && !isLoading ? (
              <RoleAwareUserMenu />
            ) : (
              <>
                <BookingLink>
                  <Button
                    size="lg"
                    className="font-semibold rounded-full bg-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    Book Consultation
                  </Button>
                </BookingLink>
                <Link href="/auth/signin">
                     <button
                    //  variant="outline"
                    // size="lg"
                    className="px-6 py-2 cursor-pointer font-semibold rounded-full bg-white border border-primary text-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                  >
                   sigin 
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slide-up bg-white/98 backdrop-blur-sm border-t border-gray-200 py-4">
              {/* Public mobile menu — mirrors the desktop public links */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5">
                    Services
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 ml-4">
                    {serviceLinks.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {publicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5">
                    Who We Are
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 ml-4">
                    {whoWeAreLinks.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  href="/search"
                  className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  Search
                </Link>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <BookingLink
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full rounded-full font-semibold bg-primary hover:bg-primary/90">
                      Book Consultation
                    </Button>
                  </BookingLink>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            
          </div>
        )}
      </nav>
      <div className="bg-primary w-full">
        {/* inner wrapper */}
        {role &&
        <div className="text-white">
          {/* <CombinedNav role={role} /> */}
        </div>
        }
      </div>
    </header>
  );
}
