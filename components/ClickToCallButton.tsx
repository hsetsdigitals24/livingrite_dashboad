"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface ClickToCallButtonProps {
  phoneNumber: string;
  className?: string;
}

/**
 * Click-to-Call Button
 * Mobile: Opens phone dialer via tel: link
 * Desktop: Shows copy-to-clipboard functionality with fallback message
 */
export function ClickToCallButton({
  phoneNumber,
  className = "",
}: ClickToCallButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect mobile on client side only
  useEffect(() => {
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  const handleCallClick = () => {
    if (isMobile) {
      // Mobile: use tel: link
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // Desktop: copy to clipboard
      navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCallClick}
      className={`flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 active:scale-95 ${className}`}
      title={isMobile ? "Call" : "Copy phone number"}
      aria-label={isMobile ? "Call" : "Copy phone number"}
    >
      <Phone className="h-4 w-4" />
      <span>{copied ? "Copied!" : isMobile ? "Call" : "Phone"}</span>
    </button>
  );
}

export default ClickToCallButton;
