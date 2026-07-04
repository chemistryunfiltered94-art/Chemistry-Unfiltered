// hooks/useGamification.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { getUserActivityLog } from "@/lib/firestore";
import { getLevelInfo, LevelInfo, ACHIEVEMENTS } from "@/lib/gamification";
import { Achievement } from "@/types";

export interface GamificationData {
  loading: boolean;
  xp: number;
  streak: number;
  levelInfo: LevelInfo;
  unlockedAchievements: Achievement[];   // পুরো Achievement অবজেক্ট, শুধু id না
  lockedAchievements: Achievement[];
  activityLog: Record<string, number>;   // "YYYY-MM-DD" → count, heatmap-এর জন্য
}

/**
 * user ডকুমেন্টের xp/streak/unlockedAchievements ফিল্ড থেকে dashboard-এর
 * জন্য দরকারি সব derived ডেটা বানায় (level, progress %, unlocked/locked
 * achievement লিস্ট), এবং ৫২-সপ্তাহের activity log আনে heatmap-এর জন্য।
 *
 * user.xp/user.streak না থাকলে (পুরনো একাউন্ট, এখনো কোনো গ্যামিফিকেশন
 * অ্যাকশন হয়নি) সব ০/খালি হিসেবে ধরা হয় — এটা error state না।
 */
export function useGamification(): GamificationData {
  const { user } = useAuth();
  const [activityLog, setActivityLog] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setActivityLog({}); return; }
    setLoading(true);
    getUserActivityLog(user.uid, 52).then((log) => {
      setActivityLog(log);
      setLoading(false);
    });
  }, [user]);

  const xp = user?.xp || 0;
  const streak = user?.streak || 0;
  const levelInfo = getLevelInfo(xp);

  const unlockedIds = new Set(user?.unlockedAchievements || []);
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !unlockedIds.has(a.id));

  return {
    loading,
    xp,
    streak,
    levelInfo,
    unlockedAchievements,
    lockedAchievements,
    activityLog,
  };
}
