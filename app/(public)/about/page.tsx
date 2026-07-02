import type { Metadata } from "next";
import FounderSection from "@/components/home/FounderSection";

export const metadata: Metadata = {
  title: "প্রতিষ্ঠাতা সম্পর্কে | Chemistry Unfiltered",
  description:
    "মোঃ শরিফুল ইসলাম, Chemistry Unfiltered–এর প্রতিষ্ঠাতা সম্পর্কে জানুন — রসায়ন বিভাগ, সরকারি আকবর আলী কলেজ।",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <FounderSection />
    </div>
  );
}
