import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Safely formats a Firestore Timestamp, JS Date, or date-like value
 * (Firestore documents return Timestamp objects with a `.toDate()` method,
 * not plain Date objects, so direct `new Date(value)` calls can fail silently).
 */
export function formatFirestoreDate(value: unknown): string {
  if (!value) return "";
  try {
    // Firestore Timestamp
    if (typeof value === "object" && value !== null && "toDate" in value) {
      return formatDate((value as { toDate: () => Date }).toDate());
    }
    // Already a Date
    if (value instanceof Date) return formatDate(value);
    // ISO string / number fallback
    const d = new Date(value as string | number);
    if (!isNaN(d.getTime())) return formatDate(d);
    return "";
  } catch {
    return "";
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
