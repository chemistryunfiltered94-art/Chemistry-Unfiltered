import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { nobelLaureates } from "@/lib/data/history";
import { ArrowLeft, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "নোবেল বিজয়ী — Chemistry Unfiltered",
  description: "রসায়নে নোবেল পুরস্কারপ্রাপ্ত বিজ্ঞানীদের তালিকা ও অবদান।",
};

export default function NobelLaureatesPage() {
  const laureates = [...nobelLaureates]
    .filter((l) => l.published)
    .sort((a, b) => b.year - a.year);

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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                নোবেল বিজয়ী
              </h1>
              <p className="text-slate-400 text-sm">{laureates.length} জন বিজ্ঞানী</p>
            </div>
          </div>

          {laureates.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl text-center py-16 text-slate-400">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>এখনো কোনো কন্টেন্ট যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {laureates.map((l) => (
                <Link
                  key={l.id}
                  href={`/history/nobel-laureates/${l.slug}`}
                  className="block bg-slate-800 border border-slate-700 hover:border-yellow-500/40 rounded-2xl overflow-hidden transition-all active:scale-95 group"
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-700">
                    {l.photo ? (
                      <Image
                        src={l.photo}
                        alt={l.nameBn || l.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-10 h-10 text-slate-600" />
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500 text-slate-900">
                      {l.year}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-0.5 truncate">
                      {l.nameBn || l.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2 truncate">{l.name}</p>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {l.motivationBn || l.motivation}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
