// lib/gamification.ts
//
// XP/Level/Streak/Achievement — সব গ্যামিফিকেশন লজিক এখানে কেন্দ্রীভূত।
// এই ফাইলের বাইরে কোথাও XP-থ্রেশহোল্ড বা streak-নিয়ম হার্ডকোড করা উচিত না;
// ভবিষ্যতে ফর্মুলা বদলাতে হলে শুধু এই একটা জায়গা বদলালেই যথেষ্ট হবে।

import { Achievement, AchievementId } from "@/types";

// ── XP পুরস্কার — কোন অ্যাকশনে কত XP ──────────────────────────────
export const XP_REWARDS = {
  TOPIC_COMPLETE: 20,
  DAILY_FIRST_VISIT: 5,
} as const;

// ── Level ফর্মুলা ──────────────────────────────────────────────────
// Level N সম্পন্ন করতে ওই লেভেলে (একার) দরকার (100 + N*100) XP।
// অর্থাৎ: Level 1 → 200 XP, Level 2 → 300 XP, Level 3 → 400 XP, ...
// এটা derive করা হয় সবসময় — কখনো database-এ store করা হয় না, তাই
// ফর্মুলা বদলালেও পুরনো ডেটা automatically সঠিক থাকে।

function xpNeededForLevel(level: number): number {
  return 100 + level * 100;
}

export interface LevelInfo {
  level: number;          // চলতি লেভেল (১ থেকে শুরু)
  xpInLevel: number;      // এই লেভেলের ভেতরে এখন পর্যন্ত জমা XP
  xpForNextLevel: number; // এই লেভেল পার হতে মোট কত XP লাগে
  xpToNext: number;       // পরের লেভেলে যেতে আর কত XP বাকি
  progress: number;       // 0–1, এই লেভেলের ভেতরে অগ্রগতি (progress bar-এর জন্য)
}

export function getLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, totalXp || 0);
  let level = 1;
  let remaining = xp;

  // লেভেল-থ্রেশহোল্ড পার হতে থাকি যতক্ষণ বাকি XP দিয়ে বর্তমান লেভেল
  // সম্পূর্ণ পার করা যায়। বাস্তবে level সংখ্যা ছোট থাকবে (XP-cap নেই
  // বলে সৈদ্ধান্তিকভাবে unbounded, কিন্তু practical XP রেঞ্জে এই লুপ
  // কয়েক iteration-এর বেশি চলবে না)।
  while (remaining >= xpNeededForLevel(level)) {
    remaining -= xpNeededForLevel(level);
    level += 1;
  }

  const xpForNextLevel = xpNeededForLevel(level);
  return {
    level,
    xpInLevel: remaining,
    xpForNextLevel,
    xpToNext: xpForNextLevel - remaining,
    progress: xpForNextLevel > 0 ? remaining / xpForNextLevel : 0,
  };
}

// ── Level টাইটেল — রসায়ন-থিমড, MathX-এর "Mathematician" এর সমতুল্য ──
// প্রতিটা টাইটেল কয়েকটা লেভেল জুড়ে থাকে যাতে একটানা একই টাইটেল বদলাতে
// না থাকে; শেষ এন্ট্রির পরে (উচ্চ লেভেলে) শেষ টাইটেলটাই স্থায়ী হয়ে থাকে।
const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1,  title: "শিক্ষানবিস" },
  { minLevel: 3,  title: "পরীক্ষণকারী" },
  { minLevel: 6,  title: "গবেষক" },
  { minLevel: 10, title: "রসায়নবিদ" },
  { minLevel: 15, title: "প্রধান রসায়নবিদ" },
];

export function getLevelTitle(level: number): string {
  let title = LEVEL_TITLES[0].title;
  for (const entry of LEVEL_TITLES) {
    if (level >= entry.minLevel) title = entry.title;
  }
  return title;
}

// ── Streak হালনাগাদ ───────────────────────────────────────────────
// user-এর লোকাল তারিখ (YYYY-MM-DD) ব্যবহার করা হয়, UTC না — যাতে
// রাত ১২টার আশেপাশে ভুল দিনে গণনা না হয়।
export function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

export interface StreakUpdateResult {
  streak: number;
  isNewDay: boolean; // আজ প্রথমবার অ্যাক্টিভিটি হলে true (daily XP দেওয়ার সিদ্ধান্তে কাজে লাগে)
}

/**
 * বর্তমান streak ও lastActivityDate দেখে আজকের অ্যাক্টিভিটির জন্য নতুন
 * streak বের করে। নিয়ম:
 *  - আজই শেষ অ্যাক্টিভিটি হলে → streak অপরিবর্তিত, isNewDay=false
 *  - গতকাল শেষ অ্যাক্টিভিটি হলে → streak+1 (ধারাবাহিকতা বজায়)
 *  - ১ দিনের বেশি gap হলে → streak রিসেট হয়ে ১ (আজ থেকে নতুন করে শুরু)
 *  - lastActivityDate না থাকলে (প্রথমবার) → streak = ১
 */
export function updateStreak(
  currentStreak: number | undefined,
  lastActivityDate: string | undefined
): StreakUpdateResult {
  const today = todayLocalDate();

  if (!lastActivityDate) {
    return { streak: 1, isNewDay: true };
  }
  const gap = daysBetween(lastActivityDate, today);

  if (gap <= 0) {
    // আজই আগে থেকে অ্যাক্টিভিটি হয়ে গেছে
    return { streak: currentStreak || 1, isNewDay: false };
  }
  if (gap === 1) {
    return { streak: (currentStreak || 0) + 1, isNewDay: true };
  }
  // ধারাবাহিকতা ভেঙেছে
  return { streak: 1, isNewDay: true };
}

// ── Achievement সংজ্ঞা ─────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-topic",
    title: "First Steps",
    titleBn: "প্রথম পদক্ষেপ",
    description: "Complete your first topic",
    descriptionBn: "প্রথম টপিক সম্পন্ন করো",
    xpReward: 10,
    icon: "Sparkles",
  },
  {
    id: "five-topics",
    title: "On a Roll",
    titleBn: "গতিতে আছো",
    description: "Complete 5 topics",
    descriptionBn: "৫টি টপিক সম্পন্ন করো",
    xpReward: 30,
    icon: "Flame",
  },
  {
    id: "streak-3",
    title: "Building Habits",
    titleBn: "অভ্যাস গড়ছো",
    description: "Maintain a 3-day streak",
    descriptionBn: "৩ দিনের streak বজায় রাখো",
    xpReward: 15,
    icon: "CalendarCheck",
  },
  {
    id: "xp-100",
    title: "Century",
    titleBn: "শতক",
    description: "Earn 100+ XP",
    descriptionBn: "১০০+ XP অর্জন করো",
    xpReward: 20,
    icon: "Star",
  },
  {
    id: "streak-14",
    title: "Dedicated",
    titleBn: "নিবেদিতপ্রাণ",
    description: "Maintain a 14-day streak",
    descriptionBn: "১৪ দিনের streak বজায় রাখো",
    xpReward: 50,
    icon: "Trophy",
  },
];

export function getAchievement(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * বর্তমান stats (নতুন XP/streak/সম্পন্ন-টপিক সংখ্যা প্রয়োগ করার পরে) দেখে
 * কোন কোন achievement নতুন করে unlock হওয়ার যোগ্য তা বের করে। ইতিমধ্যে
 * unlocked থাকা achievement বাদ দেওয়া হয় — একবারই পুরস্কার পাওয়া যায়।
 */
export function checkNewAchievements(params: {
  totalXp: number;
  streak: number;
  completedTopicsCount: number;
  alreadyUnlocked: string[];
}): Achievement[] {
  const { totalXp, streak, completedTopicsCount, alreadyUnlocked } = params;
  const unlocked = new Set(alreadyUnlocked);
  const newly: Achievement[] = [];

  const maybeUnlock = (id: AchievementId, condition: boolean) => {
    if (condition && !unlocked.has(id)) {
      const a = getAchievement(id);
      if (a) newly.push(a);
    }
  };

  maybeUnlock("first-topic", completedTopicsCount >= 1);
  maybeUnlock("five-topics", completedTopicsCount >= 5);
  maybeUnlock("streak-3", streak >= 3);
  maybeUnlock("xp-100", totalXp >= 100);
  maybeUnlock("streak-14", streak >= 14);

  return newly;
}
