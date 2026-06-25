"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, Star, BookOpen } from "lucide-react";
import { Topic } from "@/types";
import { getCategoryName } from "@/lib/constants";

interface Props {
  topics?: Topic[];
}

const levelColors: Record<string, string> = {
  beginner:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  intermediate: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  advanced:     "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};
const levelBn: Record<string, string> = {
  beginner: "শুরু", intermediate: "মধ্যবর্তী", advanced: "উন্নত",
};
const categoryBorderColors: Record<string, string> = {
  "physical-chemistry":     "border-l-blue-500",
  "organic-chemistry":      "border-l-green-500",
  "inorganic-chemistry":    "border-l-purple-500",
  "analytical-chemistry":   "border-l-orange-500",
  biochemistry:             "border-l-pink-500",
  "environmental-chemistry":"border-l-teal-500",
  "industrial-chemistry":   "border-l-yellow-500",
};

export default function FeaturedTopics({ topics }: Props) {
  const hasData = topics && topics.length > 0;

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
          <Link href="/learn"
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all">
            সব দেখো <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {!hasData ? (
          <div className="text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">অ্যাডমিন প্যানেল থেকে featured টপিক যোগ করলে এখানে দেখাবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={`/learn/${topic.categoryId}/${topic.slug}`}
                  className={`block p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 ${categoryBorderColors[topic.categoryId] ?? "border-l-primary-500"} card-hover group h-full`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {getCategoryName(topic.categoryId)}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
                    {topic.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${topic.level ? levelColors[topic.level] : ""}`}>
                        {topic.level ? (levelBn[topic.level] ?? topic.level) : ""}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {topic.estimatedTime} মিনিট
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
