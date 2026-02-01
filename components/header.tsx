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
  LogOut,
  User,
  User2,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide header on admin dashboard routes
  if (pathname.startsWith("/dashboard/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium group">
                Services
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/services">All Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/neurorehabilitation">
                    Neurorehabilitation Care
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/post-icu-care">Post-ICU Care</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/post-surgical-care">
                    Post-Surgical Care
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/end-of-life-care">
                    End-of-Life & Palliative Care
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/geriatric-care">Geriatric Care</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/chronic-wound-care">
                    Chronic Wound Care
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/home-medical-consultations">
                    Home Medical Consultations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/routine-laboratory-services">
                    Routine Laboratory Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/physiotherapy-services">
                    Physiotherapy Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/postpartum-care">Postpartum Care</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className="relative text-gray-700 hover:text-primary transition-colors font-medium group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/testimonials"
              className="relative text-gray-700 hover:text-primary transition-colors font-medium group"
            >
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/booking"
              className="relative text-gray-700 hover:text-primary transition-colors font-medium group"
            >
              Book Consultation
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/blogs"
              className="relative text-gray-700 hover:text-primary transition-colors font-medium group"
            >
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/faqs"
              className="relative text-gray-700 hover:text-primary transition-colors font-medium group"
            >
              FAQs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-primary transition-colors font-medium hover:scale-110"
              title="Search articles"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* CTA Button / Auth */}
          <div className="hidden md:flex items-center gap-4">
            {status === "authenticated" && session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="font-semibold rounded-full bg-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user.name?.charAt(0) ||
                        session.user.email?.charAt(0) ||
                        "U"}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      disabled
                      className="text-xs text-gray-500"
                    >
                      {session.user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/booking">
                  <Button
                    size="lg"
                    className="font-semibold rounded-full bg-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    Book Consultation
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  {/* <span className="text-primary"> */}
                    <User2 />
                  {/* </span> */}
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

              {status === "authenticated" && session?.user ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button className="w-full rounded-full font-semibold bg-primary hover:bg-primary/90">
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut({ redirect: true, callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/booking"
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
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
