"use client";

import { redirect, usePathname } from "next/navigation";
import logo from "../../../public/logo.png";
import { Bell, Search, LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-4 sm:gap-8 flex-1">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Logo/Title */}
          <div className="flex-1 sm:flex-none">
            <h1 className="text-lg sm:text-xl font-bold text-gray-700 whitespace-nowrap">
              Admin Center
            </h1>
            <div
              className="bg-contain bg-no-repeat w-full h-full hidden"
              style={{ backgroundImage: `url('${logo.src}')` }}
            />
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Search className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative group">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {session?.user.name}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
                {session?.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;