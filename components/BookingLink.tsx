import { AnchorHTMLAttributes } from "react";
import { BOOKING_LINK } from "@/lib/booking-link";

export interface BookingLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export function BookingLink({ children, className, ...props }: BookingLinkProps) {
  return (
    <a
      href={BOOKING_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
