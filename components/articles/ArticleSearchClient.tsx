"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Tag, ArrowRight, BookOpen } from "lucide-react";
import { Article } from "@/types";
import { formatFirestoreDate, truncate } from "@/lib/utils";

interface Props {
  articles: Article[];
}

export default function ArticleSearchClient({ articles }: Props) {
  const [search, setSearch] = useState("");

  const filtered = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.summary?.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Search */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="আর্টিকেল খোঁজো..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>
            {articles.length === 0
              ? "এখনো কোনো আর্টিকেল প্রকাশিত হয়নি। অ্যাডমিন প্যানেল থেকে যোগ করো।"
              : "কোনো আর্টিকেল পাওয়া যায়নি।"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden card-hover group"
            >
              <div className="h-2 gradient-bg" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {article.tags?.slice(0, 1).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed line-clamp-3">
                  {truncate(article.summary || "", 140)}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatFirestoreDate(article.createdAt)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
