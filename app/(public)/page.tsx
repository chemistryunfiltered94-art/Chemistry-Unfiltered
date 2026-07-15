import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AuthRedirect from "@/components/home/AuthRedirect";
import { getSiteStats } from "@/lib/firestore";

export default async function HomePage() {
  // "সক্রিয় শিক্ষার্থী" (users) হলো একমাত্র সংখ্যা যা সত্যিকারের ইউজার ডেটা,
  // তাই এটাই একমাত্র Firestore fetch এখানে। টপিক/ফর্মুলা/বিক্রিয়া/ভার্চুয়াল
  // ল্যাব — এসব এখন hardcode/স্ট্যাটিক-ফাইল থেকে সরাসরি HeroSection ও
  // StatsSection কম্পোনেন্টের ভেতরেই আসে (দেখো: components/home/HeroSection.tsx,
  // components/home/StatsSection.tsx)। firestore.rules-এ /users owner/admin-only
  // বলে এই পাবলিক পেজের unauthenticated সার্ভার-রেন্ডারে এই সংখ্যাও সবসময় ০
  // আসে — StatsSection-এর `stats?.users ?? 10000` ফলব্যাক তখন কাজ করে।
  const siteStats = await getSiteStats();

  return (
    <AuthRedirect>
      <div className="overflow-hidden">
        <HeroSection />
        <StatsSection stats={{ users: siteStats.users || undefined }} />
      </div>
    </AuthRedirect>
  );
}
