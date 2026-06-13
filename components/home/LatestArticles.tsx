"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "DNA ও RNA: জীবনের রাসায়নিক ভিত্তি",
    summary: "ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড ও রাইবোনিউক্লিক অ্যাসিডের গঠন, কার্যকারিতা এবং জীবনে তাদের অপরিহার্য ভূমিকা নিয়ে বিস্তারিত আলোচনা।",
    category: "জীব রসায়ন",
    date: "২০ ডিসেম্বর, ২০২৪",
    href: "/articles/dna-rna",
    tag: "Biochemistry",
    tagColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
  },
  {
    id: "2",
    title: "গ্রিন হাউস গ্যাস ও জলবায়ু পরিবর্তনের রসায়ন",
    summary: "CO₂, CH₄, N₂O এর মতো গ্রিন হাউস গ্যাসগুলো কীভাবে পৃথিবীর তাপমাত্রা বাড়াচ্ছে, তার বৈজ্ঞানিক ব্যাখ্যা।",
    category: "পরিবেশ রসায়ন",
    date: "১৫ ডিসেম্বর, ২০২৪",
    href: "/articles/greenhouse-gases",
    tag: "Environmental",
    tagColor: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  },
  {
    id: "3",
    title: "অ্যান্টিবায়োটিকের কার্যপদ্ধতি: রসায়নের দৃষ্টিতে",
    summary: "পেনিসিলিন থেকে শুরু করে আধুনিক অ্যান্টিবায়োটিক কীভাবে ব্যাকটেরিয়ার বিরুদ্ধে কাজ করে তার রাসায়নিক প্রক্রিয়া।",
    category: "জৈব রসায়ন",
    date: "১০ ডিসেম্বর, ২০২৪",
    href: "/articles/antibiotics-chemistry",
    tag: "Organic",
    tagColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
];

export default function LatestArticles() {
  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-800/30">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">
              জ্ঞান ভান্ডার
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              সাম্প্রতিক আর্টিকেল
            </h2>
          </div>
          <Link
            href="/articles"
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
          >
            সব আর্টিকেল <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={article.href}
                className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden card-hover group h-full"
              >
                {/* Color bar */}
                <div className="h-2 gradient-bg" />

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${article.tagColor}`}>
                      <Tag className="w-3 h-3" />
                      {article.tag}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      পড়ো <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
