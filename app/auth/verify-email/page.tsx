"use client";

import { Suspense } from "react";
 
export default function VerifyEmailPage() {
   
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
