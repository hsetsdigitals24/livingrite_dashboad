"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Payment is no longer handled online. Admin generates invoices manually
// and clients pay via bank transfer. Redirect to invoices page.
export default function PaymentRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/client/invoices");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin inline-block w-7 h-7 border-4 border-teal-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-gray-500 text-sm">Redirecting to invoices...</p>
      </div>
    </div>
  );
}
