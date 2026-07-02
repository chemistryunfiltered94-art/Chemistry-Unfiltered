import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import { getSiteStats, getFormulas, getDocuments } from "@/lib/firestore";

export default async function HomePage() {
  // Parallel-fetch homepage data in one server-side round trip.
  const [siteStats, allFormulas, allReactions] =
    await Promise.all([
      getSiteStats(),
      getFormulas(),
      getDocuments<{ id: string }>("reactions", []),
    ]);

  return (
    <div className="overflow-hidden">
      <HeroSection heroStats={{
        topics:    siteStats.topics,
        formulas:  allFormulas.length,
        reactions: allReactions.length,
      }} />
      <StatsSection stats={{
        // siteStats.users ইচ্ছাকৃতভাবে বাদ: firestore.rules-এ /users কালেকশন
        // owner/admin-only, তাই এই পাবলিক (unauthenticated) হোম পেজের
        // server render-এ এটা সবসময় ০ আসে। ০ পাঠালে StatsSection-এর
        // `?? 10000` ফলব্যাক কাজ করবে না (?? শুধু null/undefined ধরে,
        // ০ কে বৈধ মান হিসেবেই নেয়), তাই "সক্রিয় শিক্ষার্থী: ০+" দেখাত।
        // users বাদ দিলে ফলব্যাকটা ঠিকঠাক প্রয়োগ হয়।
        topics:    siteStats.topics,
        formulas:  allFormulas.length,
        questions: siteStats.questions,
      }} />
    </div>
  );
}
