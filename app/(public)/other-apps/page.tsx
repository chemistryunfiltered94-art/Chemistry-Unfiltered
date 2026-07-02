import type { Metadata } from "next";
import OtherAppsSection from "@/components/home/OtherAppsSection";

export const metadata: Metadata = {
  title: "অন্যান্য অ্যাপস | Chemistry Unfiltered",
  description:
    "Chemistry Unfiltered ইকোসিস্টেমের অন্যান্য অ্যাপস — MathX, PhysicsVerse (শীঘ্রই আসছে) এবং CIVION।",
};

export default function OtherAppsPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <OtherAppsSection />
    </div>
  );
}
