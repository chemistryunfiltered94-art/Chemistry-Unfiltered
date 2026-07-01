import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { scientists } from "@/lib/data/history";
import { ArrowLeft, Users2 } from "lucide-react";

export const metadata: Metadata = {
  title: "বিজ্ঞানী / Chemists — Chemistry Unfiltered",
  description: "ইতিহাসের বিখ্যাত রসায়নবিদদের জীবনী ও তাঁদের যুগান্তকারী কাজ।",
};

export default function ScientistsPage() {
  const all = scientists.filter((s) => s.published).sort((a, b) => a.name.localeCompare(b.name));
  const featured = all.filter((s) => s.featured);
  const rest = all.filter((s) => !s.featured);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="section-padding">
        <div className="container-max">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> ইতিহাস
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                বিজ্ঞানী / Chemists
              </h1>
              <p className="text-slate-400 text-sm">{all.length} জন</p>
            </div>
          </div>

          {all.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl text-center py-16 text-slate-400">
              <Users2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>এখনো কোনো কন্টেন্ট যোগ করা হয়নি।</p>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    গুরুত্বপূর্ণ
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.map((s) => (
                      <ScientistCard key={s.id} s={s} />
                    ))}
                  </div>
                </div>
              )}

              {rest.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      সকলে
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rest.map((s) => (
                      <ScientistCard key={s.id} s={s} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ScientistCard({
  s,
}: {
  s: { slug: string; name: string; nameBn: string; photo?: string; famousFor: string; field: string; fieldBn?: string };
}) {
  return (
    <Link
      href={`/history/scientists/${s.slug}`}
      className="block bg-slate-800 border border-slate-700 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all active:scale-95"
    >
      <div className="relative w-full aspect-[4/3] bg-slate-700">
        {s.photo ? (
          <Image
            src={s.photo}
            alt={s.nameBn || s.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users2 className="w-10 h-10 text-slate-600" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white mb-0.5 truncate">{s.nameBn || s.name}</h3>
        <p className="text-xs text-slate-500 mb-2 truncate">{s.name}</p>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.famousFor}</p>
        {s.field && (
          <span className="inline-block mt-2.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-900/30 text-purple-300">
            {s.fieldBn || s.field}
          </span>
        )}
      </div>
    </Link>
  );
}
