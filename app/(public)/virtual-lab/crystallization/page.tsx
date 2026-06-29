"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

type Compound = { id: string; name: string; liquidColor: string; crystalColor: string; data: { t: number; s: number }[] };

const compounds: Compound[] = [
  {
    id: "alum",
    name: "ফটকিরি (Alum)",
    liquidColor: "rgba(226,232,240,0.15)",
    crystalColor: "#e2e8f0",
    data: [{ t: 20, s: 6 }, { t: 40, s: 12 }, { t: 60, s: 24 }, { t: 80, s: 45 }],
  },
  {
    id: "cuso4",
    name: "নীল তুঁতে (CuSO₄)",
    liquidColor: "rgba(59,130,246,0.25)",
    crystalColor: "#3b82f6",
    data: [{ t: 20, s: 32 }, { t: 40, s: 42 }, { t: 60, s: 62 }, { t: 80, s: 78 }],
  },
  {
    id: "nacl",
    name: "খাবার লবণ (NaCl)",
    liquidColor: "rgba(226,232,240,0.1)",
    crystalColor: "#cbd5e1",
    data: [{ t: 20, s: 36 }, { t: 40, s: 36.6 }, { t: 60, s: 37.3 }, { t: 80, s: 38.4 }],
  },
];

const ROOM_TEMP = 20;

function solubilityAt(c: Compound, t: number): number {
  const d = c.data;
  if (t <= d[0].t) return d[0].s;
  if (t >= d[d.length - 1].t) return d[d.length - 1].s;
  for (let i = 0; i < d.length - 1; i++) {
    if (t >= d[i].t && t <= d[i + 1].t) {
      const frac = (t - d[i].t) / (d[i + 1].t - d[i].t);
      return d[i].s + frac * (d[i + 1].s - d[i].s);
    }
  }
  return d[d.length - 1].s;
}

type CoolRate = "slow" | "fast";

export default function CrystallizationLabPage() {
  const [compound, setCompound] = useState(compounds[0]);
  const [hotTemp, setHotTemp] = useState(80);
  const [coolRate, setCoolRate] = useState<CoolRate>("slow");

  const satHot = solubilityAt(compound, hotTemp);
  const satRoom = solubilityAt(compound, ROOM_TEMP);
  const yieldAmount = Math.max(0, satHot - satRoom);

  const grainCount = coolRate === "slow" ? 6 : 22;
  const grains = Array.from({ length: grainCount }, (_, i) => {
    const size = Math.max(3, Math.min(16, Math.sqrt(yieldAmount / grainCount) * 6));
    const x = 15 + ((i * 37) % 70);
    const y = 75 + ((i * 53) % 18);
    return { size, x, y };
  });

  const curve = Array.from({ length: 21 }, (_, i) => {
    const t = i * 5;
    return { t, s: solubilityAt(compound, t) };
  });
  const maxS = Math.max(...compounds.flatMap((c) => c.data.map((d) => d.s))) * 1.1;

  const toSvg = (pts: { t: number; s: number }[]) =>
    pts.map((p) => `${10 + (p.t / 100) * 185},${75 - (p.s / maxS) * 65}`).join(" ");

  const hotX = 10 + (hotTemp / 100) * 185;
  const hotY = 75 - (satHot / maxS) * 65;
  const roomX = 10 + (ROOM_TEMP / 100) * 185;
  const roomY = 75 - (satRoom / maxS) * 65;

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-violet-500 to-fuchsia-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">ক্রিস্টালাইজেশন ল্যাব</h1>
            <p className="text-white/80 text-sm">দ্রাব্যতা বনাম তাপমাত্রা ব্যবহার করে ক্রিস্টাল তৈরি করো</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">যৌগ বাছাই করো</label>
                <select
                  value={compound.id}
                  onChange={(e) => setCompound(compounds.find((c) => c.id === e.target.value)!)}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-fuchsia-500"
                >
                  {compounds.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">ঠান্ডা করার হার</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-600">
                  <button
                    onClick={() => setCoolRate("slow")}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${coolRate === "slow" ? "bg-fuchsia-600 text-white" : "text-slate-400 hover:bg-slate-700"}`}
                  >
                    ধীরে
                  </button>
                  <button
                    onClick={() => setCoolRate("fast")}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${coolRate === "fast" ? "bg-fuchsia-600 text-white" : "text-slate-400 hover:bg-slate-700"}`}
                  >
                    দ্রুত
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-300">গরম পানির তাপমাত্রা (দ্রবীভূত করার সময়)</label>
                <span className="text-fuchsia-400 font-bold text-sm">{hotTemp}°C</span>
              </div>
              <input type="range" min="40" max="90" value={hotTemp} onChange={(e) => setHotTemp(+e.target.value)} className="w-full accent-fuchsia-500" />
            </div>

            {/* Visualization */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
              <div className="relative w-28 h-32">
                <svg viewBox="0 0 64 80" className="absolute inset-0 w-full h-full">
                  <path d="M10 8 L10 72 Q10 78 16 78 L48 78 Q54 78 54 72 L54 8" fill={compound.liquidColor} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                </svg>
                {grains.map((g, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-sm"
                    style={{ width: g.size, height: g.size, left: `${g.x}%`, top: `${g.y}%`, backgroundColor: compound.crystalColor, transform: "rotate(45deg)" }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.02 }}
                  />
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="bg-slate-700 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{hotTemp}°C-তে দ্রাব্যতা</span>
                <span className="text-sm text-white font-semibold">{satHot.toFixed(1)} g/100mL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{ROOM_TEMP}°C-তে দ্রাব্যতা</span>
                <span className="text-sm text-white font-semibold">{satRoom.toFixed(1)} g/100mL</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                <span className="text-sm text-slate-300">ক্রিস্টাল ফলন</span>
                <span className="text-2xl font-bold text-fuchsia-400">{yieldAmount.toFixed(1)} g</span>
              </div>
              {yieldAmount < 2 && (
                <p className="text-xs text-amber-400 pt-1">⚠ এই যৌগের দ্রাব্যতা তাপমাত্রার সাথে খুব কম পরিবর্তিত হয় — ঠান্ডা করে ক্রিস্টাল পাওয়া কঠিন, বরং পানি বাষ্পীভূত করতে হবে।</p>
              )}
            </div>

            {/* Solubility curve */}
            <div className="bg-slate-700 rounded-2xl p-4">
              <p className="text-xs text-slate-400 mb-2">দ্রাব্যতা বনাম তাপমাত্রা</p>
              <svg viewBox="0 0 200 85" className="w-full">
                <line x1="0" y1="75" x2="200" y2="75" stroke="#475569" strokeWidth="1" />
                <line x1="10" y1="0" x2="10" y2="80" stroke="#475569" strokeWidth="1" />
                <polyline points={toSvg(curve)} fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1={hotX} y1={hotY} x2={roomX} y2={roomY} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx={hotX} cy={hotY} r="3" fill="#f97316" />
                <circle cx={roomX} cy={roomY} r="3" fill="#38bdf8" />
                <text x="12" y="8" fill="#94a3b8" fontSize="6">g/100mL</text>
                <text x="160" y="83" fill="#94a3b8" fontSize="6">°C</text>
              </svg>
              <div className="flex gap-4 mt-1 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> গরম (দ্রবীভবন)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> ঘরের তাপমাত্রা (ক্রিস্টালাইজেশন)</span>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">কীভাবে কাজ করে?</p>
                <p>গরম পানিতে বেশি যৌগ দ্রবীভূত হয়। ঠান্ডা করলে দ্রাব্যতা কমে যায়, তাই অতিরিক্ত দ্রবীভূত অংশ ক্রিস্টাল হয়ে জমা হয় (সুপারস্যাচুরেশন)। মোট ফলন নির্ভর করে দ্রাব্যতার পার্থক্যে, কিন্তু ক্রিস্টালের আকার নির্ভর করে ঠান্ডা করার হারে — ধীরে ঠান্ডা করলে বড় ও কম সংখ্যক ক্রিস্টাল হয়; দ্রুত ঠান্ডা করলে ছোট ও অনেক ক্রিস্টাল হয়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
