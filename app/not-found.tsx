"use client";

import { ArrowLeft } from "lucide-react";
import notFoundImage from "@/public/undraw_page-not-found_6wni (1).svg";
 

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="mt-10 text-sm text-gray-500 h-64 w-full bg-contain bg-center" style={{backgroundImage: `url('${notFoundImage.src}')`}}>   </div>
      {/* <h1 className="text-4xl font-bold">404</h1> */}
    
      <p className="text-2xl mt-4 text-accent">Page not found</p>

      <button
        onClick={() => window.history.back()}
        className="mt-6 text-primary underline flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Go back home
      </button>



    </div>
  )
}
