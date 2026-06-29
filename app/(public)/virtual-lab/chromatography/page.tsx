"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

type Component = { name: string; rf: number; color: string };
type Sample = { id: string; name: string; baseColor: string; components: Component[] };

const samples: Sample[] = [
  {
    id: "ink",
    name: "কালো কলমের কালি",
    baseColor: "#1e293b",
    components: [
      { name: "নীল", rf: 0.25, color: "#2563eb" },
      { name: "গোলাপি/লাল", rf: 0.55, color: "#ec4899" },
      { name: "হলুদ", rf: 0.85, color: "#eab308" },
    ],
  },
  {
    id: "leaf",
    name: "পাতার রঞ্জক (Leaf Pigment)",
    baseColor: "#166534",
    components: [
      { name: "ক্লোরোফিল-b", rf: 0.42, color: "#65a30d" },
      { name: "ক্লোরোফিল-a", rf: 0.59, color: "#16a34a" },
      { name: "জ্যান্থোফিল", rf: 0.71, color: "#ca8a04" },
      { name: "ক্যারোটিন", rf: 0.95, color: "#f97316" },
    ],
  },
  {
    id: "food",
    name: "ফুড কালার মিক্স",
    baseColor: "#581c87",
    components: [
      { name: "লাল", rf: 0.35, color: "#dc2626" },
      { name: "নীল", rf: 0.6, color: "#2563eb" },
      { name: "হলুদ", rf: 0.8, color: "#eab308" },
    ],
  },
];

const STRIP_LENGTH_CM = 10;

export default function ChromatographyLabPage() {
  const [sample, setSample] = useState(samples[0]);
  const [front, setFront] = useState(3);

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-amber-400 to-rose-500 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">পেপার ক্রোমাটোগ্রাফি ল্যাব</h1>
            <p className="text-white/80 text-sm">মিশ্রণ পৃথক করো এবং Rf মান হিসাব করো</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">নমুনা বাছাই করো</label>
              <select
                value={sample.id}
                onChange={(e) => { setSample(samples.find((s) => s.id === e.target.value)!); setFront(3); }}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
              >
                {samples.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {/* Visualization */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[260px]">
              <div className="relative w-16 h-56 bg-slate-100/5 border border-slate-600 rounded-sm overflow-hidden">
                {/* Solvent front line */}
                <motion.div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-sky-400"
                  style={{ bottom: 0 }}
                  animate={{ bottom: `${8 + (front / STRIP_LENGTH_CM) * 88}%` }}
                  transition={{ duration: 0.3 }}
                />
                {/* Baseline spot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ bottom: "6%", backgroundColor: sample.baseColor }} />
                {/* Component spots */}
                {sample.components.map((c) => (
                  <motion.div
                    key={c.name}
                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: c.color, bottom: 0 }}
                    animate={{ bottom: `${8 + ((c.rf * front) / STRIP_LENGTH_CM) * 88}%` }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
                {/* Water reservoir hint */}
                <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-sky-500/20" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-300">সলভেন্ট ফ্রন্ট (উপরে উঠছে)</label>
                <span className="text-rose-400 font-bold text-sm">{front.toFixed(1)} cm</span>
              </div>
              <input type="range" min="0.5" max={STRIP_LENGTH_CM} step="0.1" value={front} onChange={(e) => setFront(+e.target.value)} className="w-full accent-rose-500" />
            </div>

            {/* Results table */}
            <div className="bg-slate-700 rounded-2xl p-4 space-y-2">
              <p className="text-xs text-slate-400 mb-1">Rf = উপাদানের দূরত্ব ÷ সলভেন্ট ফ্রন্টের দূরত্ব</p>
              {sample.components.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">{(c.rf * front).toFixed(2)}÷{front.toFixed(1)} cm</span>
                  <span className="text-rose-300 font-bold">{c.rf.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Rf মান কেন গুরুত্বপূর্ণ?</p>
                <p>একই কাগজ ও সলভেন্টে প্রতিটি যৌগের Rf মান নির্দিষ্ট থাকে — সলভেন্ট ফ্রন্ট যত দূর যাক, প্রতিটি উপাদানের দূরত্ব সবসময় একই অনুপাতে বাড়ে। এই ধর্ম দিয়ে অজানা যৌগ চিহ্নিত করা যায় বা মিশ্রণের বিশুদ্ধতা যাচাই করা যায়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
