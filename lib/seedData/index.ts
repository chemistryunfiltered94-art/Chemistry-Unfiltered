// lib/seedData/index.ts
//
// সম্পূর্ণ কারিকুলামের যেসব subsection-এর কনটেন্ট এখনো পর্যন্ত লেখা হয়েছে তার রেজিস্ট্রি।
// নতুন subsection (যেমন ১.২, ১.৩...) সম্পন্ন হলে এখানে import করে packages তালিকায়
// যোগ করলেই admin/seed-content পেজে সেটি ইমপোর্টের জন্য দেখা যাবে।
//
// lib/syllabus.ts-এ সম্পূর্ণ ৫৯টি subsection-এর code/title তালিকা আছে (রোডম্যাপ হিসেবে);
// এখানে শুধু সেইসব subsection থাকবে যেগুলোর জন্য সম্পূর্ণ কনটেন্ট লেখা শেষ হয়েছে।

import { SeedChapter } from "./types";
import chapter11  from "./physical/1-1-matter-structure";
import chapter12  from "./physical/1-2-gaseous-state";
import chapter13  from "./physical/1-3-thermodynamics";
import chapter14  from "./physical/1-4-chemical-equilibrium";
import chapter15  from "./physical/1-5-acid-base-chemistry";
import chapter16  from "./physical/1-6-electrochemistry";
import chapter17  from "./physical/1-7-chemical-kinetics";
import chapter18  from "./physical/1-8-surface-chemistry";
import chapter19  from "./physical/1-9-quantum-chemistry";
import chapter110 from "./physical/1-10-nuclear-chemistry";
import chapter111 from "./physical/1-11-atomic-structure";
import chapter112 from "./physical/1-12-chemical-bonding";
import chapter113 from "./physical/1-13-liquid-solid-state";
import chapter114 from "./physical/1-14-solutions-colligative-properties";
import chapter115 from "./physical/1-15-spectroscopy";
import chapter116 from "./physical/1-16-statistical-thermodynamics";
import chapter117 from "./physical/1-17-physical-chemistry-lab";
import chapter118 from "./physical/1-18-photochemistry";
import chapter119 from "./physical/1-19-solid-state-chemistry";
import chapter120 from "./physical/1-20-computational-chemistry";
import chapter121 from "./physical/1-21-molecular-symmetry";
import chapter122 from "./physical/1-22-group-theory";
import chapter123 from "./physical/1-23-nanochemistry";
import chapter124 from "./physical/1-24-polymer-physical-chemistry";
import chapter125 from "./physical/1-25-biophysical-chemistry";
import chapter126 from "./physical/1-26-non-equilibrium-thermodynamics";
import chapter127 from "./physical/1-27-surface-thermodynamics";
import chapter128 from "./physical/1-28-electrochemical-impedance";
import chapter129 from "./physical/1-29-plasma-chemistry";
import chapter130 from "./physical/1-30-laser-chemistry";
import chapter131 from "./physical/1-31-atmospheric-physical-chemistry";
import chapter132 from "./physical/1-32-materials-chemistry";
import chapter133 from "./physical/1-33-soft-matter-chemistry";
import chapter134 from "./physical/1-34-green-physical-chemistry";
import chapter135 from "./physical/1-35-advanced-reaction-kinetics";
import chapter136 from "./physical/1-36-advanced-spectroscopy";
import chapter137 from "./physical/1-37-modern-research-techniques";
import chapter21  from "./organic/2-1-basic-organic-chemistry";
import chapter22  from "./organic/2-2-hydrocarbons";
import chapter23  from "./organic/2-3-halo-compounds";
import chapter24  from "./organic/2-4-alcohols-phenols-ethers";
import chapter25  from "./organic/2-5-aldehydes-ketones";
import chapter26  from "./organic/2-6-carboxylic-acids";
import chapter27  from "./organic/2-7-amines";
import chapter28  from "./organic/2-8-biomolecules";
import chapter29  from "./organic/2-9-polymers";
import chapter210 from "./organic/2-10-reaction-mechanisms";
import chapter211 from "./organic/2-11-named-reactions";

// ═══════════════════════════════════════════════════════════════
// Phase 1 সম্পন্ন — ভৌত রসায়ন কাঠামো (১.১ – ১.৩৭, placeholder — কনটেন্ট বাকি)
// Phase 2 সম্পন্ন — জৈব রসায়ন (২.১ – ২.১১)  ✅
// ═══════════════════════════════════════════════════════════════

export const SEED_PACKAGES: SeedChapter[] = [
  chapter11,   // 1.1   পদার্থের গঠন
  chapter12,   // 1.2   গ্যাসের ধর্ম
  chapter13,   // 1.3   তাপগতিবিদ্যা
  chapter14,   // 1.4   রাসায়নিক সাম্যাবস্থা
  chapter15,   // 1.5   অম্ল-ক্ষার রসায়ন
  chapter16,   // 1.6   তড়িৎ রসায়ন
  chapter17,   // 1.7   রাসায়নিক গতিবিদ্যা
  chapter18,   // 1.8   পৃষ্ঠ রসায়ন
  chapter19,   // 1.9   কোয়ান্টাম রসায়ন
  chapter110,  // 1.10  নিউক্লিয়ার রসায়ন
  chapter111,  // 1.11  পরমাণুর গঠন
  chapter112,  // 1.12  রাসায়নিক বন্ধন
  chapter113,  // 1.13  তরল ও কঠিন অবস্থা
  chapter114,  // 1.14  দ্রবণ ও কোলিগেটিভ ধর্ম
  chapter115,  // 1.15  বর্ণালীবিদ্যা
  chapter116,  // 1.16  পরিসংখ্যানিক তাপগতিবিদ্যা
  chapter117,  // 1.17  ভৌত রসায়নের ব্যবহারিক
  chapter118,  // 1.18  আলোক রসায়ন
  chapter119,  // 1.19  কঠিন অবস্থার রসায়ন
  chapter120,  // 1.20  কম্পিউটেশনাল রসায়ন
  chapter121,  // 1.21  আণবিক সমমিতি
  chapter122,  // 1.22  গ্রুপ তত্ত্ব
  chapter123,  // 1.23  ন্যানো রসায়ন
  chapter124,  // 1.24  পলিমার ভৌত রসায়ন
  chapter125,  // 1.25  জৈব-ভৌত রসায়ন
  chapter126,  // 1.26  অ-সাম্য তাপগতিবিদ্যা
  chapter127,  // 1.27  পৃষ্ঠ তাপগতিবিদ্যা
  chapter128,  // 1.28  ইলেক্ট্রোকেমিক্যাল ইম্পিডেন্স
  chapter129,  // 1.29  প্লাজমা রসায়ন
  chapter130,  // 1.30  লেজার রসায়ন
  chapter131,  // 1.31  বায়ুমণ্ডলীয় ভৌত রসায়ন
  chapter132,  // 1.32  উপাদান ভৌত রসায়ন
  chapter133,  // 1.33  সফট ম্যাটার রসায়ন
  chapter134,  // 1.34  সবুজ ভৌত রসায়ন
  chapter135,  // 1.35  উন্নত বিক্রিয়া গতিবিদ্যা
  chapter136,  // 1.36  উন্নত বর্ণালীবিদ্যা
  chapter137,  // 1.37  আধুনিক গবেষণা পদ্ধতি
  chapter21,   // ২.১  জৈব রসায়নের মৌলিক ধারণা
  chapter22,   // ২.২  হাইড্রোকার্বন
  chapter23,   // ২.৩  হ্যালো যৌগ
  chapter24,   // ২.৪  অ্যালকোহল, ফেনল ও ইথার
  chapter25,   // ২.৫  অ্যালডিহাইড ও কিটোন
  chapter26,   // ২.৬  কার্বক্সিলিক অ্যাসিড
  chapter27,   // ২.৭  অ্যামিন
  chapter28,   // ২.৮  জীবঅণু
  chapter29,   // ২.৯  পলিমার
  chapter210,  // ২.১০ জৈব বিক্রিয়া প্রক্রিয়া
  chapter211,  // ২.১১ নামাঙ্কিত বিক্রিয়াসমূহ
];
