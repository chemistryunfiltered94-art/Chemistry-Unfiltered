// lib/seedData/index.ts
//
// সম্পূর্ণ কারিকুলামের যেসব subsection-এর কনটেন্ট এখনো পর্যন্ত লেখা হয়েছে তার রেজিস্ট্রি।
// নতুন subsection (যেমন ১.২, ১.৩...) সম্পন্ন হলে এখানে import করে packages তালিকায়
// যোগ করলেই admin/seed-content পেজে সেটি ইমপোর্টের জন্য দেখা যাবে।
//
// lib/syllabus.ts-এ সম্পূর্ণ ৫৯টি subsection-এর code/title তালিকা আছে (রোডম্যাপ হিসেবে);
// এখানে শুধু সেইসব subsection থাকবে যেগুলোর জন্য সম্পূর্ণ কনটেন্ট লেখা শেষ হয়েছে।

import { SeedChapter } from "./types";
import chapter11  from "./physical/1-1-basic-concepts";
import chapter12  from "./physical/1-2-states-of-matter";
import chapter13  from "./physical/1-3-thermodynamics";
import chapter14  from "./physical/1-4-chemical-equilibrium";
import chapter15  from "./physical/1-5-acid-base-chemistry";
import chapter16  from "./physical/1-6-electrochemistry";
import chapter17  from "./physical/1-7-chemical-kinetics";
import chapter18  from "./physical/1-8-surface-chemistry";
import chapter19  from "./physical/1-9-quantum-chemistry";
import chapter110 from "./physical/1-10-nuclear-chemistry";

// ═══════════════════════════════════════════════════════════════
// Phase 1 সম্পন্ন — ভৌত রসায়ন (১.১ – ১.১০)  ✅
// Phase 2 পরবর্তী — জৈব রসায়ন (২.১ – ২.১১)
// ═══════════════════════════════════════════════════════════════

export const SEED_PACKAGES: SeedChapter[] = [
  chapter11,   // ১.১  মৌলিক ধারণা
  chapter12,   // ১.২  পদার্থের অবস্থা
  chapter13,   // ১.৩  তাপগতিবিদ্যা
  chapter14,   // ১.৪  রাসায়নিক সাম্যাবস্থা
  chapter15,   // ১.৫  অম্ল-ক্ষার রসায়ন
  chapter16,   // ১.৬  তড়িৎ রসায়ন
  chapter17,   // ১.৭  রাসায়নিক গতিবিদ্যা
  chapter18,   // ১.৮  পৃষ্ঠ রসায়ন
  chapter19,   // ১.৯  কোয়ান্টাম রসায়ন
  chapter110,  // ১.১০ নিউক্লিয় রসায়ন
];
