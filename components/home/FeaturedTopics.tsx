"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, Star } from "lucide-react";

const featuredTopics = [
  {
    id: "acid-base",
    title: "অ্যাসিড ও ক্ষার",
    category: "ভৌত রসায়ন",
    level: "intermediate",
    levelBn: "মধ্যবর্তী",
    time: 25,
    summary: "অ্যাসিড-ক্ষারের সংজ্ঞা, pH স্কেল, নিরপেক্ষকরণ বিক্রিয়া সম্পর্কে বিস্তারিত।",
    color: "border-l-blue-500",
    href: "/learn/physical-chemistry/acid-base",
  },
  {
    id: "periodic-table",
    title: "পর্যায় সারণি",
    category: "অজৈব রসায়ন",
    level: "beginner",
    levelBn: "শুরু",
    time: 30,
    summary: "মৌলের পর্যায়বৃত্ত ধর্ম, গ্রুপ ও পর্যায়, ইলেকট্রন বিন্যাস।",
    color: "border-l-purple-500",
    href: "/learn/inorganic-chemistry/periodic-table",
  },
  {
    id: "organic-reactions",
    title: "জৈব বিক্রিয়া",
    category: "জৈব রসায়ন",
    level: "advanced",
    levelBn: "উন্নত",
    time: 45,
    summary: "SN1, SN2, E1, E2 বিক্রিয়া, Aldol condensation, Friedel-Crafts।",
    color: "border-l-green-500",
    href: "/learn/organic-chemistry/reactions",
  },
  {
    id: "thermodynamics",
    title: "তাপগতিবিদ্যা",
    category: "ভৌত রসায়ন",
    level: "intermediate",
    levelBn: "মধ্যবর্তী",
    time: 35,
    summary: "এনথালপি, এন্ট্রপি, গিবস শক্তি, তাপগতিবিদ্যার সূত্রসমূহ।",
    color: "border-l-orange-500",
    href: "/learn/physical-chemistry/thermodynamics",
  },
  {
    id: "chemical-bonding",
    title: "রাসায়নিক বন্ধন",
    category: "অজৈব রসায়ন",
    level: "intermediate",
    levelBn: "মধ্যবর্তী",
    time: 30,
    summary: "আয়নিক, সমযোজী, ধাতব বন্ধন, VSEPR থিওরি, হাইব্রিডাইজেশন।",
    color: "border-l-cyan-500",
    href: "/learn/inorganic-chemistry/chemical-bonding",
  },
  {
    id: "electrochemistry",
    title: "তড়িৎ রসায়ন",
    category: "ভৌত রসায়ন",
    level: "advanced",
    levelBn: "উন্নত",
    time: 40,
    summary: "গ্যালভানিক কোষ, ইলেক্ট্রোলাইসিস, ফ্যারাডের সূত্র, Nernst সমীকরণ।",
    color: "border-l-yellow-500",
    href: "/learn/physical-chemistry/electrochemistry",
  },
];

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  intermediate: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  advanced: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function FeaturedTopics() {
  return (
    <section className="section-padding bg-white dark:bg-slate-900">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
              জনপ্রিয় টপিক
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Featured Topics
            </h2>
          </div>
          <Link
            href="/learn"
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
          >
            সব দেখো <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTopics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={topic.href}
                className={`block p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 ${topic.color} card-hover group h-full`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {topic.category}
                  </span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {topic.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[topic.level]}`}>
                      {topic.levelBn}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {topic.time} মিনিট
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
