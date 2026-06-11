/**
 * Business Hours Utility
 * Handles time zone-aware business hours calculations
 */

export interface BusinessHours {
  [key: string]: string; // e.g., "MON": "09:00-17:00"
}

export interface BusinessStatus {
  isOpen: boolean;
  currentTime: string;
  nextOpeningTime: string;
  todayHours: string | null;
}

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  MON: "09:00-17:00",
  TUE: "09:00-17:00",
  WED: "09:00-17:00",
  THU: "09:00-17:00",
  FRI: "09:00-17:00",
  SAT: "10:00-14:00",
  SUN: "CLOSED",
};

/**
 * Parse time string in HH:MM format to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to HH:MM format
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Get business status for current time
 * @param timezone - IANA timezone string (e.g., "Africa/Lagos")
 * @param businessHours - Business hours configuration
 */
export function getBusinessStatus(
  timezone: string = "Africa/Lagos",
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): BusinessStatus {
  const now = new Date();

  // Format current time in specified timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value?.toUpperCase() || "MON";
  const time = `${parts.find((p) => p.type === "hour")?.value}:${parts.find((p) => p.type === "minute")?.value}`;

  const dayIndex = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].indexOf(weekday);
  const todayHours = businessHours[weekday];

  let isOpen = false;
  let nextOpeningTime = "";

  if (todayHours && todayHours !== "CLOSED") {
    const [openStr, closeStr] = todayHours.split("-");
    const openMinutes = timeToMinutes(openStr);
    const closeMinutes = timeToMinutes(closeStr);
    const currentMinutes = timeToMinutes(time);

    isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    if (!isOpen && currentMinutes >= closeMinutes) {
      // Business closed today, find next opening day
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (dayIndex + i) % 7;
        const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        const nextDay = daysOfWeek[nextDayIndex];
        const nextDayHours = businessHours[nextDay];

        if (nextDayHours && nextDayHours !== "CLOSED") {
          const [nextOpenStr] = nextDayHours.split("-");
          nextOpeningTime = nextOpenStr;
          break;
        }
      }
    } else if (!isOpen && currentMinutes < openMinutes) {
      // Business hasn't opened yet today
      nextOpeningTime = openStr;
    }
  } else {
    // Closed today, find next opening day
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (dayIndex + i) % 7;
      const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      const nextDay = daysOfWeek[nextDayIndex];
      const nextDayHours = businessHours[nextDay];

      if (nextDayHours && nextDayHours !== "CLOSED") {
        const [nextOpenStr] = nextDayHours.split("-");
        nextOpeningTime = nextOpenStr;
        break;
      }
    }
  }

  return {
    isOpen,
    currentTime: time,
    nextOpeningTime,
    todayHours: todayHours || null,
  };
}

/**
 * Format time for display
 * @param time24 - Time in HH:MM format (24-hour)
 * @param format12h - Whether to convert to 12-hour format
 */
export function formatTime(time24: string, format12h: boolean = true): string {
  if (!time24 || time24 === "CLOSED") return time24;

  if (!format12h) return time24;

  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default getBusinessStatus;
