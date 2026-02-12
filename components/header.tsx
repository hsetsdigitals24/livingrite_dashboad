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
import {
  Menu,
  X,
  ChevronDown,
  Search,
  User2,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleAwareUserMenu } from "./RoleAwareUserMenu";
import { AdminNav } from "./nav/AdminNav";
import { CaregiverNav } from "./nav/CaregiverNav";
import { ClientNav } from "./nav/ClientNav";
import { PublicNav } from "./nav/PublicNav";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { role, isAuthenticated, isLoading } = useUserRole();
  const pathname = usePathname();

  // Hide header on admin dashboard routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-35 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image src={logo} alt="LivingRite Care Logo" />
            </div>
            {/* <span className="font-bold text-xl bg-primary bg-clip-text text-transparent">
              LivingRite<span className="text-primary">Care</span>
            </span> */}
          </Link>

          {/* Desktop Navigation - Role Aware */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && !isLoading ? (
              <>
                {role === "ADMIN" && <AdminNav />}
                {role === "CAREGIVER" && <CaregiverNav />}
                {role === "CLIENT" && <ClientNav />}
              </>
            ) : (
              <PublicNav />
            )}
          </div>

          {/* CTA Button / Auth - Role Aware */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && !isLoading ? (
              <RoleAwareUserMenu />
            ) : (
              <>
                <Link href="/portal/booking">
                  <Button
                    size="lg"
                    className="font-semibold rounded-full bg-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    Book Consultation
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <User2 />
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
            <div className="flex flex-col gap-2">
              {isAuthenticated && !isLoading ? (
                <>
                  {/* Role-specific mobile nav items */}
                  <div className="px-4 py-2">
                    {role === "ADMIN" && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Admin Dashboard</p>
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Dashboard</Link>
                        <Link href="/admin?section=patients" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Patients</Link>
                        <Link href="/admin?section=caregivers" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Caregivers</Link>
                        <Link href="/admin?section=clients" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Clients</Link>
                        <Link href="/admin?section=revenue" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Revenue</Link>
                      </div>
                    )}
                    {role === "CAREGIVER" && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Caregiver</p>
                        <Link href="/caregiver" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Dashboard</Link>
                        <Link href="/caregiver/patients" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">My Patients</Link>
                        <Link href="/caregiver/schedule" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Schedule</Link>
                        <Link href="/caregiver/messages" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Messages</Link>
                      </div>
                    )}
                    {role === "CLIENT" && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Family Portal</p>
                        <Link href="/client" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Dashboard</Link>
                        <Link href="/client/patients" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">My Family</Link>
                        <Link href="/client/booking" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Book Service</Link>
                        <Link href="/client/messages" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-primary/5 text-gray-700">Messages</Link>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <RoleAwareUserMenu />
                  </div>
                </>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5">
                      Services
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 ml-4">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/neurorehabilitation"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Neurorehabilitation Care
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/post-icu-care"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Post-ICU Care
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/post-surgical-care"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Post-Surgical Care
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/end-of-life-care"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          End-of-Life & Palliative Care
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/geriatric-care"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Geriatric Care
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/chronic-wound-care"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Chronic Wound Care
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/home-medical-consultations"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Home Medical Consultations
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/routine-laboratory-services"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Routine Laboratory Services
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/physiotherapy-services"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Physiotherapy Services
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/services/postpartum-care"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Postpartum Care
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/blogs"
                    className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/search"
                    className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-primary/5 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Link>

                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      href="/portal/booking"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button className="w-full rounded-full font-semibold bg-primary hover:bg-primary/90">
                        Book Consultation
                      </Button>
                    </Link>
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
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
