"use client";

import { redirect, usePathname } from "next/navigation";
import logo from "../../../public/logo.png";
import { Bell, Search, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";


const Header = () => {
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
           <div className="flex items-center justify-between px-8 py-4">
             <div className="flex items-center gap-8">
               <div>
                 <h1 className="text-xl font-bold text-gray-700">
                   LivingRite Care Admin
                 </h1>
                 <div
                   className="bg-contain bg-no-repeat w-full h-full"
                   style={{ backgroundImage: `url('${logo.src}')` }}
                 ></div>
               </div>
   
               <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                 <input
                   type="text"
                   placeholder="Search..."
                   className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
               </div>
             </div>
   
             <div className="flex items-center gap-6">
               {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
               </button> */}
               <div className="relative group">
                 <div className="flex items-center gap-3 cursor-pointer">
                   <div className="text-right">
                     <p className="text-sm font-medium text-gray-900">
                       {session?.user.name}
                     </p>
                     <p className="text-xs text-gray-500">Administrator</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                     {session?.user.name?.charAt(0).toUpperCase()}
                   </div>
                 </div>
                 
                 {/* Dropdown Menu */}
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <button
                     onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })}
                     className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition"
                   >
                     <LogOut className="w-4 h-4" />
                     Logout
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </header>
  );
}

export default Header;