"use client";

// components/home/SiteSummarySection.tsx
// পুরো ওয়েবসাইটের ফিচার/বিষয়ের সামারি — ইচ্ছাকৃতভাবে কোনো ক্লিকযোগ্য লিংক/বাটন নেই।
// শুধুমাত্র সাইটে কী কী আছে তার একটা ঝলক দেখানোর জন্য। ইউজার নিচের CTA থেকে
// আসলে শেখা শুরু করবে।

import { motion } from "framer-motion";
import {
  Atom,
  BookOpen,
  FlaskConical,
  Calculator,
  ClipboardList,
  History,
  Newspaper,
  Sigma,
  TestTubes,
  LayoutDashboard,
} from "lucide-react";

const summaryItems = [
  {
    icon: BookOpen,
    title: "লার্নিং সেন্টার",
    description: "SSC থেকে HSC পর্যন্ত ধাপে ধাপে সাজানো টপিক ও বিস্তারিত পাঠ",
  },
  {
    icon: Atom,
    title: "ইন্টারেক্টিভ পিরিয়ডিক টেবিল",
    description: "প্রতিটি মৌল সম্পর্কে বিস্তারিত তথ্য এক ক্লিকে",
  },
  {
    icon: Sigma,
    title: "ফর্মুলা লাইব্রেরি",
    description: "রসায়নের সব গুরুত্বপূর্ণ সূত্র এক জায়গায়",
  },
  {
    icon: TestTubes,
    title: "রিয়েকশন ডেটাবেজ",
    description: "বিক্রিয়ার ব্যাখ্যা, সমীকরণ ও প্রক্রিয়া",
  },
  {
    icon: FlaskConical,
    title: "ভার্চুয়াল ল্যাব",
    description: "টাইট্রেশন, ক্রিস্টালাইজেশন সহ ১১টি ইন্টারঅ্যাক্টিভ পরীক্ষা",
  },
  {
    icon: Calculator,
    title: "ক্যালকুলেটর টুলস",
    description: "মোলারিটি, pH, স্টয়কিওমেট্রি সহ একাধিক ক্যালকুলেটর",
  },
  {
    icon: ClipboardList,
    title: "প্রশ্নব্যাংক ও মক টেস্ট",
    description: "বোর্ড ও ভর্তি পরীক্ষার প্রশ্ন দিয়ে অনুশীলন",
  },
  {
    icon: History,
    title: "রসায়নের ইতিহাস",
    description: "বিজ্ঞানী, নোবেল বিজয়ী ও টাইমলাইন",
  },
  {
    icon: Newspaper,
    title: "আর্টিকেল ও নোট",
    description: "সহজ ভাষায় লেখা গুরুত্বপূর্ণ বিষয়ভিত্তিক লেখা",
  },
  {
    icon: LayoutDashboard,
    title: "পার্সোনাল ড্যাশবোর্ড",
    description: "নিজের অগ্রগতি ও বুকমার্ক ট্র্যাক করো",
  },
];

export default function SiteSummarySection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            এক প্ল্যাটফর্মে <span className="gradient-text">সবকিছু</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Chemistry Unfiltered-এ যা যা পাবে তার একটা সংক্ষিপ্ত ঝলক
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {summaryItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-11 h-11 flex-shrink-0 gradient-bg rounded-xl flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
