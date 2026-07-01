import { Metadata } from "next";
import Link from "next/link";
import { historyEras } from "@/lib/data/history";
import { ArrowLeft, ScrollText, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "রসায়নের ইতিহাস — Chemistry Unfiltered",
  description: "প্রাচীন আলকেমি থেকে আধুনিক রসায়ন পর্যন্ত সময়রেখা।",
};

export default function HistoryTimelinePage() {
  const eras = [...historyEras]
    .filter((e) => e.published)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> ইতিহাস
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <ScrollText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                রসায়নের ইতিহাস
              </h1>
              <p className="text-slate-400 text-sm">{eras.length}টি যুগ/ঘটনা</p>
            </div>
          </div>

          {eras.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl text-center py-16 text-slate-400 mt-8">
              <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>এখনো কোনো কন্টেন্ট যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div className="relative mt-10">
              {/* Vertical line */}
              <div className="absolute left-[18px] sm:left-6 top-2 bottom-2 w-px bg-slate-700" />

              <div className="space-y-6">
                {eras.map((era) => (
                  <div key={era.id} className="relative pl-12 sm:pl-16">
                    {/* Dot */}
                    <div className="absolute left-0 sm:left-3 top-1.5 w-9 h-9 rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-amber-500/40 transition-colors">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-900/30 text-amber-400 mb-2">
                        {era.period}
                      </span>
                      <h3 className="font-bold text-white text-lg mb-1">
                        {era.titleBn || era.title}
                      </h3>
                      {era.titleBn && era.title && (
                        <p className="text-xs text-slate-500 font-medium mb-2">{era.title}</p>
                      )}
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {era.summary}
                      </p>
                      {era.keyFigures?.length > 0 && (
                        <p className="text-xs text-slate-500 mt-3">
                          <span className="text-slate-400 font-medium">সংশ্লিষ্ট: </span>
                          {era.keyFigures.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
