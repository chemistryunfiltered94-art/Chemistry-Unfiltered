"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Info } from "lucide-react";

type Material = { id: string; name: string; mass: number; density: number; color: string };

// প্রতিটি বস্তুর প্রকৃত আয়তন একই (৩০ mL) রাখা হয়েছে, যাতে ভরের পার্থক্য থেকে ঘনত্বের পার্থক্য স্পষ্ট বোঝা যায়
const VOLUME = 30;

const materials: Material[] = [
  { id: "wood", name: "কাঠের ব্লক", mass: 18, density: 0.6, color: "#92400e" },
  { id: "plastic", name: "প্লাস্টিক খেলনা", mass: 28.5, density: 0.95, color: "#0ea5e9" },
  { id: "rubber", name: "রাবার বল", mass: 33, density: 1.1, color: "#1e293b" },
  { id: "glass", name: "কাচের মার্বেল", mass: 75, density: 2.5, color: "#67e8f9" },
  { id: "aluminum", name: "অ্যালুমিনিয়াম টুকরা", mass: 81, density: 2.7, color: "#cbd5e1" },
  { id: "iron", name: "লোহার নাট-বল্টু", mass: 234, density: 7.8, color: "#57534e" },
];

const reference = [
  { name: "কাঠ", min: 0.4, max: 0.9, label: "0.4 – 0.9" },
  { name: "প্লাস্টিক", min: 0.9, max: 1.4, label: "0.9 – 1.4" },
  { name: "পানি", min: 1.0, max: 1.0, label: "1.0" },
  { name: "কাচ", min: 2.4, max: 2.8, label: "2.4 – 2.8" },
  { name: "অ্যালুমিনিয়াম", min: 2.6, max: 2.8, label: "≈ 2.7" },
  { name: "লোহা/ইস্পাত", min: 7.6, max: 8.0, label: "≈ 7.8" },
];

export default function DensityLabPage() {
  const [material, setMaterial] = useState(materials[0]);
  const [dropped, setDropped] = useState(false);

  const initialLevel = 50; // mL
  const finalLevel = initialLevel + VOLUME;
  const displacedVolume = VOLUME;
  const measuredDensity = material.mass / displacedVolume;
  const floats = material.density < 1.0;

  const waterHeight = dropped ? finalLevel : initialLevel;
  const fillPercent = (waterHeight / 100) * 80;

  const drop = () => setDropped(true);
  const reset = () => setDropped(false);

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-sky-500 to-blue-700 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">ঘনত্ব নির্ণয় ল্যাব</h1>
            <p className="text-white/80 text-sm">পানি অপসারণ পদ্ধতিতে (Archimedes) অজানা বস্তুর ঘনত্ব মাপো</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">বস্তু বাছাই করো</label>
              <select
                value={material.id}
                onChange={(e) => { setMaterial(materials.find((m) => m.id === e.target.value)!); setDropped(false); }}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
              >
                {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <p className="text-xs text-slate-400 mt-1">দাঁড়িপাল্লায় মাপা ভর: {material.mass} g</p>
            </div>

            {/* Visualization: graduated cylinder */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[240px]">
              <div className="relative w-20 h-52 border-2 border-slate-500 rounded-b-lg overflow-hidden">
                {[0, 20, 40, 60, 80, 100].map((v) => (
                  <div key={v} className="absolute left-0 right-0 border-t border-slate-600" style={{ bottom: `${(v / 100) * 80}%` }}>
                    <span className="absolute -left-7 -top-1.5 text-[8px] text-slate-500">{v}</span>
                  </div>
                ))}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-sky-500/40"
                  animate={{ height: `${fillPercent}%` }}
                  transition={{ duration: 1 }}
                />
                {dropped && (
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 rounded-sm"
                    style={{ width: 22, height: 22, backgroundColor: material.color }}
                    initial={{ bottom: "85%" }}
                    animate={{ bottom: floats ? `${fillPercent - 8}%` : "4%" }}
                    transition={{ duration: 1.1, ease: "easeIn" }}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={drop}
                disabled={dropped}
                className="flex-1 py-3.5 bg-gradient-to-r from-sky-500 to-blue-700 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                বস্তু পানিতে ফেলো
              </button>
              <button onClick={reset} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {dropped && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-700 rounded-2xl p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-800 rounded-lg p-2.5">
                    <p className="text-slate-500 text-xs">প্রাথমিক জলস্তর</p>
                    <p className="text-slate-200 font-semibold">{initialLevel} mL</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2.5">
                    <p className="text-slate-500 text-xs">শেষ জলস্তর</p>
                    <p className="text-slate-200 font-semibold">{finalLevel} mL</p>
                  </div>
                </div>
                <p className="font-mono text-sm text-slate-300">অপসারিত আয়তন = {finalLevel} − {initialLevel} = {displacedVolume} mL</p>
                <p className="font-mono text-sm text-slate-300">ঘনত্ব = ভর ÷ আয়তন = {material.mass} ÷ {displacedVolume}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                  <span className="text-slate-400 text-sm">পরিমাপিত ঘনত্ব</span>
                  <span className="text-2xl font-bold text-sky-400">{measuredDensity.toFixed(2)} g/mL</span>
                </div>
                <p className={`text-sm font-medium ${floats ? "text-cyan-300" : "text-slate-300"}`}>
                  {floats ? "💧 ভাসছে — ঘনত্ব পানির চেয়ে কম (< 1.0 g/mL)" : "⬇️ ডুবে গেছে — ঘনত্ব পানির চেয়ে বেশি (> 1.0 g/mL)"}
                </p>
              </motion.div>
            )}

            {/* Reference table */}
            <div className="bg-slate-700 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-2">পরিচিত পদার্থের ঘনত্ব (g/mL) — তুলনার জন্য</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {reference.map((r) => {
                  const match = dropped && measuredDensity >= r.min - 0.15 && measuredDensity <= r.max + 0.15;
                  return (
                    <div key={r.name} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg ${match ? "bg-sky-900/40 text-sky-300" : "bg-slate-800 text-slate-400"}`}>
                      <span>{r.name}</span>
                      <span className="font-mono">{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">আর্কিমিডিসের সূত্র</p>
                <p>একটি অদ্রবণীয় বস্তু পানিতে ডোবালে তা ঠিক তার নিজের আয়তনের সমান পানি অপসারণ করে। জলস্তরের পার্থক্য মেপে আয়তন পাওয়া যায়, আর ভর ভাগ করে ঘনত্ব নির্ণয় করা যায় — এভাবে দাঁড়িপাল্লা ও পানি দিয়েই অনিয়মিত আকৃতির বস্তুর ঘনত্ব মাপা সম্ভব।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
