import { format, subDays, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const DEFAULT_TIMEZONE = "America/Montreal";

export function todayStr(timezone = DEFAULT_TIMEZONE): string {
  // Returns yyyy-mm-dd in the given timezone
  const now = new Date();
  try {
    const zoned = toZonedTime(now, timezone);
    return format(zoned, "yyyy-MM-dd");
  } catch {
    return format(now, "yyyy-MM-dd");
  }
}

export function yesterdayStr(timezone = DEFAULT_TIMEZONE): string {
  const now = new Date();
  try {
    const zoned = toZonedTime(now, timezone);
    return format(subDays(zoned, 1), "yyyy-MM-dd");
  } catch {
    return format(subDays(now, 1), "yyyy-MM-dd");
  }
}

export function last14Days(timezone = DEFAULT_TIMEZONE): string[] {
  const today = todayStr(timezone);
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    days.push(format(subDays(parseISO(today), i), "yyyy-MM-dd"));
  }
  return days;
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDayLabel(dateStr: string): string {
  return format(parseISO(dateStr), "EEE d");
}
