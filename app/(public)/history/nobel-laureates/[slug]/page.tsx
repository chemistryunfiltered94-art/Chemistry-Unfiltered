import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { nobelLaureates } from "@/lib/data/history";
import { ArrowLeft, Award, CalendarDays, MapPin } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function findLaureate(slug: string) {
  return nobelLaureates.find((l) => l.slug === slug && l.published) || null;
}

export async function generateStaticParams() {
  return nobelLaureates.filter((l) => l.published).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const laureate = findLaureate(slug);
  if (!laureate) return { title: "পাওয়া যায়নি — Chemistry Unfiltered" };
  return {
    title: `${laureate.nameBn || laureate.name} — নোবেল বিজয়ী | Chemistry Unfiltered`,
    description: laureate.motivationBn || laureate.motivation,
  };
}

export default async function NobelLaureateDetailPage({ params }: Props) {
  const { slug } = await params;
  const laureate = findLaureate(slug);

  if (!laureate) notFound();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="section-padding">
        <div className="container-max max-w-3xl">
          <Link
            href="/history/nobel-laureates"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> নোবেল বিজয়ী
          </Link>

          {/* Header card */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden mb-6">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-700">
              {laureate.photo ? (
                <Image
                  src={laureate.photo}
                  alt={laureate.nameBn || laureate.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Award className="w-14 h-14 text-slate-600" />
                </div>
              )}
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold bg-yellow-500 text-slate-900 shadow-lg">
                নোবেল {laureate.year}
              </span>
            </div>

            <div className="p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {laureate.nameBn || laureate.name}
              </h1>
              <p className="text-slate-400 mb-4">{laureate.name}</p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400 mb-4">
                {(laureate.birthYear || laureate.deathYear) && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-slate-500" />
                    {laureate.birthYear ?? "?"} – {laureate.deathYear ?? "বর্তমান"}
                  </span>
                )}
                {laureate.country && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {laureate.countryBn || laureate.country}
                  </span>
                )}
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-2xl p-4">
                <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1.5">
                  নোবেল কমিটির ভাষ্যে
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {laureate.motivationBn || laureate.motivation}
                </p>
              </div>

              {laureate.sharedWith && laureate.sharedWith.length > 0 && (
                <p className="text-xs text-slate-500 mt-3">
                  <span className="text-slate-400 font-medium">সহ-বিজয়ী: </span>
                  {laureate.sharedWith.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Biography */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">
              জীবনী
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {laureate.biography}
            </p>
          </div>

          {/* Key Contributions */}
          {laureate.keyContributions?.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
              <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">
                মূল অবদান
              </h2>
              <ul className="space-y-2.5">
                {laureate.keyContributions.map((c: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-900/40 text-yellow-400 text-xs font-bold flex items-center justify-center mt-0.5">
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
