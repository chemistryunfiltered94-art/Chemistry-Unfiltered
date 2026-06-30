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

/**
 * একটি ছবি ফাইলকে কেন্দ্র থেকে বর্গাকার ক্রপ করে, নির্দিষ্ট সর্বোচ্চ মাত্রায়
 * রিসাইজ করে, এবং JPEG বেস৬৪ স্ট্রিং হিসেবে রিটার্ন করে — Firebase Storage
 * (Blaze প্ল্যান) ছাড়াই Firestore ডকুমেন্টে প্রোফাইল ছবি সংরক্ষণের জন্য ব্যবহৃত হয়।
 * Chrome-এ createImageBitmap দিয়ে EXIF অরিয়েন্টেশন সঠিকভাবে হ্যান্ডেল হয়;
 * পুরোনো ব্রাউজারে Image + FileReader-এ ফলব্যাক করে।
 */
export async function compressImageToBase64(
  file: File,
  maxDimension = 256,
  quality = 0.8
): Promise<string> {
  const draw = (source: CanvasImageSource, width: number, height: number): string => {
    const size = Math.min(width, height);
    const sx = (width - size) / 2;
    const sy = (height - size) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = maxDimension;
    canvas.height = maxDimension;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("ক্যানভাস কনটেক্সট তৈরি করা যায়নি।");
    ctx.drawImage(source, sx, sy, size, size, 0, 0, maxDimension, maxDimension);
    return canvas.toDataURL("image/jpeg", quality);
  };

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const result = draw(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      return result;
    } catch {
      // নিচের ফলব্যাক পদ্ধতি চেষ্টা করা হবে
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("ফাইল পড়তে ব্যর্থ হয়েছে।"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("ছবি লোড করতে ব্যর্থ হয়েছে।"));
      img.onload = () => {
        try {
          resolve(draw(img, img.naturalWidth, img.naturalHeight));
        } catch (err) {
          reject(err as Error);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
