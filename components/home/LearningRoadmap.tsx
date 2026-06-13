"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const roadmap = [
  {
    level: "Beginner",
    levelBn: "শুরু করো",
    color: "from-green-500 to-emerald-600",
    border: "border-green-500",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    href: "/learn/beginner",
    topics: [
      "পদার্থের অবস্থা",
      "পরমাণু ও অণু",
      "মৌল ও যৌগ",
      "রাসায়নিক সূত্র",
      "পর্যায় সারণির মূল ধারণা",
    ],
    desc: "রসায়নের একদম শুরু থেকে শেখো। কোনো পূর্ব জ্ঞান লাগবে না।",
  },
  {
    level: "Intermediate",
    levelBn: "এগিয়ে যাও",
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-500",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    href: "/learn/intermediate",
    topics: [
      "পরমাণুর গঠন",
      "রাসায়নিক বন্ধন",
      "অ্যাসিড-ক্ষার",
      "তাপগতিবিদ্যা",
      "রাসায়নিক সাম্যাবস্থা",
    ],
    desc: "SSC ও HSC মানের রসায়ন সম্পূর্ণভাবে আয়ত্ত করো।",
  },
  {
    level: "Advanced",
    levelBn: "দক্ষ হও",
    color: "from-purple-500 to-violet-600",
    border: "border-purple-500",
    badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    href: "/learn/advanced",
    topics: [
      "জৈব রসায়নের গভীর বিশ্লেষণ",
      "তড়িৎ রসায়ন",
      "কোয়ান্টাম রসায়ন",
      "বর্ণালী বিশ্লেষণ",
      "জীব রসায়ন",
    ],
    desc: "University ভর্তি ও উচ্চতর পড়াশোনার জন্য বিশেষভাবে তৈরি।",
  },
];

export default function LearningRoadmap() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-800/30">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
            শিক্ষার পথ
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            Learning Roadmap
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            তোমার বর্তমান স্তর অনুযায়ী শেখা শুরু করো এবং ধাপে ধাপে এগিয়ে যাও
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roadmap.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 ${item.border} border-opacity-50 shadow-lg`}
            >
              {/* Level badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 ${item.badge}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {item.level}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {item.levelBn}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                {item.desc}
              </p>

              {/* Topics */}
              <ul className="space-y-2 mb-8">
                {item.topics.map((topic, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={item.href}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${item.color} hover:opacity-90 transition-opacity group`}
              >
                শুরু করো
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-bold shadow-lg">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
