import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedTopics from "@/components/home/FeaturedTopics";
import LearningRoadmap from "@/components/home/LearningRoadmap";
import PopularFormulas from "@/components/home/PopularFormulas";
import QuickTools from "@/components/home/QuickTools";
import LatestArticles from "@/components/home/LatestArticles";
import { getSiteStats, getTopics, getFormulas, getArticles, getDocuments } from "@/lib/firestore";

export default async function HomePage() {
  // Parallel-fetch all homepage data in one server-side round trip.
  const [siteStats, featuredTopics, allFormulas, latestArticles, allReactions] =
    await Promise.all([
      getSiteStats(),
      getTopics({ featured: true, limitCount: 6 }),
      getFormulas(),          // no limitCount option — slice to 6 below
      getArticles({ limitCount: 3 }),
      getDocuments<{ id: string }>("reactions", []),
    ]);

  const popularFormulas = allFormulas.slice(0, 6);

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
      <CategoriesSection />
      <FeaturedTopics topics={featuredTopics} />
      <LearningRoadmap />
      <PopularFormulas formulas={popularFormulas} />
      <QuickTools />
      <LatestArticles articles={latestArticles} />
    </div>
  );
}
