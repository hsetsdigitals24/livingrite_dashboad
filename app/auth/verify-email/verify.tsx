"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Failed to verify email");
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully!");
        setEmail(data.email);

        // Redirect to signin after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Verifying your email...
              </h1>
              <p className="mt-2 text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Email Verified!
              </h1>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-4 text-sm text-gray-500">
                Email:{" "}
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
              <p className="mt-6 text-sm text-gray-600">
                Redirecting to login page in 3 seconds...
              </p>
              <Link
                href="/auth/signin"
                className="mt-8 inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">
                Verification Failed
              </h1>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-8 space-y-3">
                <p className="text-sm text-gray-600">
                  Please try the following:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>
                    • Check if the link is still valid (expires in 24 hours)
                  </li>
                  <li>• Request a new verification email</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
              <div className="mt-8 space-y-3">
                <Link
                  href="/auth/signup"
                  className="block w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
                >
                  Sign Up Again
                </Link>
                <Link
                  href="/auth/signin"
                  className="block w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
