"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

/**
 * WhatsApp Click-to-Chat Button
 * Opens WhatsApp Web with pre-filled message
 */
export function WhatsAppButton({
  phoneNumber,
  message = "Hi! I'd like to inquire about your services.",
  className = "",
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    // Remove any non-digit characters from phone number
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    
    // Construct WhatsApp URL with message
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Open in new window
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-600 active:scale-95 ${className}`}
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-4 w-4" />
      <span>WhatsApp</span>
    </button>
  );
}

export default WhatsAppButton;
