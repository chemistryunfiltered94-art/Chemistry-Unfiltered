import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, Tag, ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Articles — রসায়ন আর্টিকেল",
  description: "Chemistry সম্পর্কিত আর্টিকেল, আবিষ্কার ও গবেষণা।",
};

const articles = [
  { id: "1", slug: "dna-rna-chemistry", title: "DNA ও RNA: জীবনের রাসায়নিক ভিত্তি", summary: "ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড ও রাইবোনিউক্লিক অ্যাসিডের গঠন, কার্যকারিতা এবং জীবনে তাদের অপরিহার্য ভূমিকা।", category: "জীব রসায়ন", tag: "Biochemistry", tagColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400", date: "২০ ডিসেম্বর, ২০২৪", readTime: "১০ মিনিট" },
  { id: "2", slug: "greenhouse-gases", title: "গ্রিন হাউস গ্যাস ও জলবায়ু পরিবর্তনের রসায়ন", summary: "CO₂, CH₄, N₂O এর মতো গ্রিন হাউস গ্যাসগুলো কীভাবে পৃথিবীর তাপমাত্রা বাড়াচ্ছে, তার বৈজ্ঞানিক ব্যাখ্যা।", category: "পরিবেশ রসায়ন", tag: "Environmental", tagColor: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400", date: "১৫ ডিসেম্বর, ২০২৪", readTime: "৮ মিনিট" },
  { id: "3", slug: "antibiotics-chemistry", title: "অ্যান্টিবায়োটিকের কার্যপদ্ধতি", summary: "পেনিসিলিন থেকে শুরু করে আধুনিক অ্যান্টিবায়োটিক কীভাবে ব্যাকটেরিয়ার বিরুদ্ধে কাজ করে।", category: "জৈব রসায়ন", tag: "Organic", tagColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", date: "১০ ডিসেম্বর, ২০২৪", readTime: "১২ মিনিট" },
  { id: "4", slug: "polymer-chemistry", title: "পলিমার রসায়ন: প্লাস্টিক থেকে জৈব-বিভাজ্য পদার্থ", summary: "পলিমারের গঠন, বৈশিষ্ট্য এবং কীভাবে বিজ্ঞানীরা পরিবেশবান্ধব বিকল্প তৈরি করছেন।", category: "জৈব রসায়ন", tag: "Organic", tagColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", date: "৫ ডিসেম্বর, ২০২৪", readTime: "১৫ মিনিট" },
  { id: "5", slug: "electroplating", title: "ইলেকট্রোপ্লেটিং: গহনা থেকে ইলেকট্রনিক্স", summary: "তড়িৎ বিশ্লেষণের মাধ্যমে ধাতু প্রলেপ দেওয়ার পদ্ধতি এবং শিল্পে এর ব্যাপক ব্যবহার।", category: "তড়িৎ রসায়ন", tag: "Electrochemistry", tagColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400", date: "১ ডিসেম্বর, ২০২৪", readTime: "৯ মিনিট" },
  { id: "6", slug: "food-chemistry", title: "খাদ্য রসায়ন: আমরা যা খাই তার বিজ্ঞান", summary: "প্রতিদিনের খাবারে কী কী রাসায়নিক যৌগ থাকে এবং রান্নায় কী ধরনের রাসায়নিক পরিবর্তন ঘটে।", category: "জৈব রসায়ন", tag: "Organic", tagColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", date: "২৫ নভেম্বর, ২০২৪", readTime: "১১ মিনিট" },
];

export default function ArticlesPage() {
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

        {/* Search */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="আর্টিকেল খোঁজো..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden card-hover group"
            >
              <div className="h-2 gradient-bg" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${article.tagColor}`}>
                    <Tag className="w-3 h-3" /> {article.tag}
                  </span>
                  <span className="text-xs text-slate-500">{article.category}</span>
                </div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                    <span>⏱ {article.readTime}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
