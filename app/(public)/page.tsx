import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedTopics from "@/components/home/FeaturedTopics";
import PopularFormulas from "@/components/home/PopularFormulas";
import QuickTools from "@/components/home/QuickTools";
import LearningRoadmap from "@/components/home/LearningRoadmap";
import LatestArticles from "@/components/home/LatestArticles";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedTopics />
      <LearningRoadmap />
      <PopularFormulas />
      <QuickTools />
      <LatestArticles />
    </div>
  );
}
