"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getBusinessStatus, formatTime } from "@/lib/business-hours";

interface BusinessHoursIndicatorProps {
  timezone?: string;
  className?: string;
}

/**
 * Business Hours Status Indicator
 * Shows current status (open/closed) and next opening time
 */
export function BusinessHoursIndicator({
  timezone = "Africa/Lagos",
  className = "",
}: BusinessHoursIndicatorProps) {
  const [status, setStatus] = useState(getBusinessStatus(timezone));
  const [mounted, setMounted] = useState(false);

  // Update business status on mount and every minute
  useEffect(() => {
    setMounted(true);
    
    const updateStatus = () => {
      setStatus(getBusinessStatus(timezone));
    };

    updateStatus();

    // Update every minute to reflect time changes
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600">Business Hours</p>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                status.isOpen ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className={`text-sm font-semibold ${
              status.isOpen ? "text-green-600" : "text-gray-600"
            }`}>
              {status.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>
      </div>

      {status.todayHours && status.todayHours !== "CLOSED" && (
        <div className="text-xs text-gray-600">
          <p className="font-medium">Today: {status.todayHours}</p>
        </div>
      )}

      {!status.isOpen && status.nextOpeningTime && (
        <div className="border-t border-gray-100 pt-2 text-xs text-gray-600">
          <p>Opens at {formatTime(status.nextOpeningTime)}</p>
        </div>
      )}
    </div>
  );
}

export default BusinessHoursIndicator;
