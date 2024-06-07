import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getCurrentDayStart() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return currentDate;
}

export function getAWeekAgoStart() {
  return new Date(getCurrentDayStart().getTime() - 7 * 24 * 60 * 60 * 1000);
}
