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
        users:     siteStats.users,
        topics:    siteStats.topics,
        formulas:  allFormulas.length,
        questions: siteStats.questions,
      }} />
    </div>
  );
}
