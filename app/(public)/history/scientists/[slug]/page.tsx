import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { scientists } from "@/lib/data/history";
import { ArrowLeft, Users2, CalendarDays, MapPin, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function findScientist(slug: string) {
  return scientists.find((s) => s.slug === slug && s.published) || null;
}

export async function generateStaticParams() {
  return scientists.filter((s) => s.published).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scientist = findScientist(slug);
  if (!scientist) return { title: "পাওয়া যায়নি — Chemistry Unfiltered" };
  return {
    title: `${scientist.nameBn || scientist.name} | Chemistry Unfiltered`,
    description: scientist.shortBio,
  };
}

export default async function ScientistDetailPage({ params }: Props) {
  const { slug } = await params;
  const scientist = findScientist(slug);

  if (!scientist) notFound();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="section-padding">
        <div className="container-max max-w-3xl">
          <Link
            href="/history/scientists"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> বিজ্ঞানী / Chemists
          </Link>

          {/* Header card */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden mb-6">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-700">
              {scientist.photo ? (
                <Image
                  src={scientist.photo}
                  alt={scientist.nameBn || scientist.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users2 className="w-14 h-14 text-slate-600" />
                </div>
              )}
            </div>

            <div className="p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {scientist.nameBn || scientist.name}
              </h1>
              <p className="text-slate-400 mb-4">{scientist.name}</p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400 mb-4">
                {(scientist.birthYear || scientist.deathYear) && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-slate-500" />
                    {scientist.birthYear ?? "?"} – {scientist.deathYear ?? "বর্তমান"}
                  </span>
                )}
                {scientist.country && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {scientist.countryBn || scientist.country}
                  </span>
                )}
              </div>

              <div className="bg-purple-900/20 border border-purple-700/30 rounded-2xl p-4">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> বিখ্যাত যে কারণে
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {scientist.famousFor}
                </p>
              </div>

              {scientist.field && (
                <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                  {scientist.fieldBn || scientist.field}
                </span>
              )}
            </div>
          </div>

          {/* Biography */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">
              জীবনী
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {scientist.biography}
            </p>
          </div>

          {/* Key Contributions */}
          {scientist.keyContributions?.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
              <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">
                মূল অবদান
              </h2>
              <ul className="space-y-2.5">
                {scientist.keyContributions.map((c, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-900/40 text-purple-400 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
