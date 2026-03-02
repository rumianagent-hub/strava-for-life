import { format, subDays, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { DEFAULT_TIMEZONE, CHECKIN_HISTORY_DAYS, DATE_FORMAT } from "./constants";

export function todayStr(timezone = DEFAULT_TIMEZONE): string {
  const now = new Date();
  try {
    const zoned = toZonedTime(now, timezone);
    return format(zoned, DATE_FORMAT);
  } catch {
    return format(now, DATE_FORMAT);
  }
}

export function yesterdayStr(timezone = DEFAULT_TIMEZONE): string {
  const now = new Date();
  try {
    const zoned = toZonedTime(now, timezone);
    return format(subDays(zoned, 1), DATE_FORMAT);
  } catch {
    return format(subDays(now, 1), DATE_FORMAT);
  }
}

export function last14Days(timezone = DEFAULT_TIMEZONE): string[] {
  const today = todayStr(timezone);
  const days: string[] = [];
  for (let i = CHECKIN_HISTORY_DAYS - 1; i >= 0; i--) {
    days.push(format(subDays(parseISO(today), i), DATE_FORMAT));
  }
  return days;
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDayLabel(dateStr: string): string {
  return format(parseISO(dateStr), "EEE d");
}
