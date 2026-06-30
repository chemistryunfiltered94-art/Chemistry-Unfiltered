import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { getStaticFormula, STATIC_FORMULAS, FORMULA_CATEGORIES } from "@/lib/formulaData";
import { FORMULA_CATEGORY_MAP } from "@/lib/formulaCategoryMap";
import { Topic } from "@/types";

interface Props { params: Promise<{ id: string }> }

// সব ফর্মুলার জন্য স্ট্যাটিক পেজ আগে থেকেই বিল্ড করা (পারফরম্যান্স ও SEO)
export async function generateStaticParams() {
  return STATIC_FORMULAS.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const f = getStaticFormula(id);
  if (!f) return { title: "Formula Not Found" };
  return {
    title: `${f.nameBn} (${f.name}) — Formula | Chemistry Unfiltered`,
    description: f.explanation?.slice(0, 160),
  };
}

export default async function FormulaDetailPage({ params }: Props) {
  const { id } = await params;
  const f = getStaticFormula(id);
  if (!f) notFound();

  // ক্যাটাগরির Bengali লেবেল বের করা (যেমন "thermodynamics" → "তাপগতিবিদ্যা")
  const categoryKey = FORMULA_CATEGORY_MAP[f.id] || f.category;
  const categoryLabel = FORMULA_CATEGORIES.find((c) => c.key === categoryKey)?.label || categoryKey;

  // Related formulas — স্ট্যাটিক ডেটা থেকেই resolve করা হয়, Firestore কল লাগে না
  const relatedFormulas = (f.relatedFormulas || [])
    .map((rfId) => getStaticFormula(rfId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  // Topics এখনো Firebase-ভিত্তিক হওয়ায় relatedTopics খালি রাখা হলো —
  // ভবিষ্যতে topic আইডি যুক্ত করলে getDocument<Topic>() দিয়ে resolve করা যাবে
  const relatedTopics: Topic[] = [];

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/formulas" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> ফর্মুলা লাইব্রেরি
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 mb-5">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">{categoryLabel}</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-1">{f.nameBn}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{f.name}</p>

          {/* Big Formula Display */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-2xl p-8 text-center mb-6">
            <div className="font-mono text-4xl font-bold text-primary-700 dark:text-primary-300">
              {f.formula}
            </div>
          </div>

          {/* Variables */}
          {f.variables?.length > 0 && (
            <>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">চলরাশিসমূহ</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {f.variables.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                    <span className="font-mono font-bold text-primary-600 dark:text-primary-400 w-10 text-center flex-shrink-0">{v.symbol}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{v.meaning}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{v.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.explanation}</p>
        </div>

        {/* Example */}
        {f.example?.question && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">✏️ উদাহরণ</h2>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-4">
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">প্রশ্ন: {f.example.question}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-2.5 whitespace-pre-line">
              <p className="text-green-800 dark:text-green-300 text-sm font-semibold">সমাধান: {f.example.solution}</p>
            </div>

            <Link href={`/calculators`}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl text-sm font-semibold hover:opacity-90 w-fit">
              <Calculator className="w-4 h-4" /> ক্যালকুলেটর দেখো
            </Link>
          </div>
        )}

        {/* Related Formulas */}
        {relatedFormulas.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">সম্পর্কিত সূত্র</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {relatedFormulas.map((rf) => (
                <Link key={rf.id} href={`/formulas/${rf.id}`}
                  className="block p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-colors group text-center">
                  <div className="font-mono text-base font-bold text-primary-600 dark:text-primary-400 mb-1">{rf.formula}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">{rf.nameBn || rf.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">সম্পর্কিত টপিক</h2>
            <div className="space-y-2">
              {relatedTopics.map((rt) => (
                <Link key={rt.id} href={`/learn/${rt.categoryId}/${rt.slug}`}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-all group">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">{rt.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
