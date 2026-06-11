"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";
import { ClickToCallButton } from "./ClickToCallButton";
import { BusinessHoursIndicator } from "./BusinessHoursIndicator";

interface FloatingContactWidgetProps {
  whatsappPhone?: string;
  callPhone?: string;
  timezone?: string;
  responseTime?: string;
  whatsappMessage?: string;
  show?: boolean;
}
 
export function FloatingContactWidget({
  whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+1234567890",
  callPhone = process.env.NEXT_PUBLIC_CALL_PHONE || "+1234567890",
  timezone = process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE || "Africa/Lagos",
  responseTime = "15 minutes",
  whatsappMessage = "Hi! I'd like to inquire about your services.",
  show = true,
}: FloatingContactWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Expanded Contact Panel */}
      {isExpanded && (
        <div className="mb-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          {/* Close Button */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Get in Touch</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded p-1 hover:bg-gray-100"
              aria-label="Close contact widget"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Business Hours Indicator */}
          <div className="mb-3">
            <BusinessHoursIndicator timezone={timezone} />
          </div>

          {/* Contact Buttons */}
          <div className="mb-3 flex flex-col gap-2">
            <WhatsAppButton
              phoneNumber={whatsappPhone}
              message={whatsappMessage}
              className="w-full justify-center"
            />
            <ClickToCallButton
              phoneNumber={callPhone}
              className="w-full justify-center"
            />
          </div>

          {/* Response Time Trust Message */}
          <div className="border-t border-gray-100 pt-3 text-center text-xs text-gray-600">
            <p className="font-medium text-gray-700">
              ✓ Typical response time: {responseTime}
            </p>
            <p className="mt-1 text-gray-500">
              Available during business hours
            </p>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-95 ${
          isExpanded
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
        }`}
        aria-label="Open contact options"
        title="Contact us"
      >
        {isExpanded ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Subtle Pulse Animation for Unopened Widget */}
      {!isExpanded && (
        <style jsx>{`
          @keyframes pulse-ring {
            0% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
          button:hover {
            animation: pulse-ring 2s infinite;
          }
        `}</style>
      )}
    </div>
  );
}

export default FloatingContactWidget;
