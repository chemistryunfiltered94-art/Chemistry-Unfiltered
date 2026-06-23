"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Tag, BookOpen } from "lucide-react";
import { Article } from "@/types";
import { formatFirestoreDate } from "@/lib/utils";

interface Props {
  articles?: Article[];
}

// Cycle through tag color pairs
const tagColors = [
  "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
  "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
];

export default function LatestArticles({ articles }: Props) {
  const hasData = articles && articles.length > 0;
  const display = articles?.slice(0, 3) ?? [];

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
          <Link href="/articles"
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all">
            সব আর্টিকেল <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {!hasData ? (
          <div className="text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">অ্যাডমিন প্যানেল থেকে আর্টিকেল যোগ করলে এখানে দেখাবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {display.map((article, i) => (
              <motion.div key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/articles/${article.slug}`}
                  className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden card-hover group h-full">
                  <div className="h-2 gradient-bg" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {article.tags?.[0] && (
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${tagColors[i % tagColors.length]}`}>
                          <Tag className="w-3 h-3" />
                          {article.tags[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {formatFirestoreDate(article.createdAt)}
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
        )}
      </div>
    </section>
  );
}
