import Link from "next/link";
import { BookOpen, Calendar, Tag, ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/firestore";
import { formatDate, truncate } from "@/lib/utils";
import ArticleSearchClient from "@/components/articles/ArticleSearchClient";

export const metadata = {
  title: "Articles — রসায়ন আর্টিকেল",
  description: "Chemistry সম্পর্কিত আর্টিকেল, আবিষ্কার ও গবেষণা।",
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            আর্টিকেল
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Chemistry Articles</h1>
          <p className="text-slate-600 dark:text-slate-400">রসায়নের মজার বিষয়গুলো সহজ ভাষায় জানো</p>
        </div>

        <ArticleSearchClient articles={articles} />
      </div>
    </div>
  );
}
