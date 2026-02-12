"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyApp() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#00b2ec" },
          dark: { "cal-brand": "#00b2ec" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      // Listen for successful booking
      cal("on", {
        action: "bookingSuccessful",
        callback: async (data: any) => {
          console.log("Booking successful:", data);

          // Get email from data or from form
          const bookingId = data?.detail?.data?.booking.uid;
          
          if (bookingId) {
            router.push(`client/booking/intake?bookingId=${bookingId}`); 
          }
        },
      });
    })();
  }, []); 

  return (
    <div className="flex w-full h-screen flex-col justify-center items-center">
      <Cal
        namespace="30min"
        calLink="circle-of-three-technologies-obtkkx/30min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
        }}
      />
    </div>
  );
}
