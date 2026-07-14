"use client";

import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useRouter } from "next/navigation";
import { BOOKING_LINK } from "@/lib/booking-link";

// Extract the invitee UUID from a Calendly invitee URI, e.g.
// https://api.calendly.com/scheduled_events/XXX/invitees/<UUID>
function getInviteeId(uri?: string): string | null {
  if (!uri) return null;
  const parts = uri.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

export default function Booking() {
  const router = useRouter();

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const bookingId = getInviteeId(e.data.payload.invitee?.uri);
      if (bookingId) {
        router.push(`/client/booking/intake?bookingId=${bookingId}`);
      }
    },
  });

  return (
    <InlineWidget
      url={BOOKING_LINK}
      styles={{ width: "100%", height: "100%", minHeight: "700px" }}
    />
  );
}
