"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Info, RotateCcw } from "lucide-react";

const C_WATER = 4.186; // J/g·°C

type Metal = { id: string; name: string; c: number; color: string };
const metals: Metal[] = [
  { id: "al", name: "অ্যালুমিনিয়াম (Al)", c: 0.90, color: "#cbd5e1" },
  { id: "fe", name: "লোহা (Fe)", c: 0.45, color: "#78716c" },
  { id: "cu", name: "কপার (Cu)", c: 0.39, color: "#ea580c" },
  { id: "zn", name: "জিংক (Zn)", c: 0.39, color: "#94a3b8" },
  { id: "pb", name: "লেড (Pb)", c: 0.13, color: "#57534e" },
];

type Reaction = { id: string; name: string; deltaH: number; note: string };
const reactions: Reaction[] = [
  { id: "strong", name: "HCl + NaOH (সবল অ্যাসিড + সবল ক্ষার)", deltaH: -57.3, note: "সম্পূর্ণ আয়নিত — সর্বোচ্চ তাপ নিঃসরণ" },
  { id: "weak", name: "CH₃COOH + NaOH (দুর্বল অ্যাসিড + সবল ক্ষার)", deltaH: -56.1, note: "দুর্বল অ্যাসিড আংশিক আয়নিত হতে কিছু শক্তি ব্যয় হয়, তাই তাপ কিছুটা কম" },
];

export default function CalorimetryLabPage() {
  const [tab, setTab] = useState<"metal" | "neutralization">("metal");

  // Tab 1: specific heat of metal
  const [metal, setMetal] = useState(metals[1]); // লোহা
  const [metalMass, setMetalMass] = useState(50);
  const [metalTemp, setMetalTemp] = useState(95);
  const [waterMass, setWaterMass] = useState(100);
  const [waterTemp, setWaterTemp] = useState(25);
  const [mixed1, setMixed1] = useState(false);

  const finalTemp1 =
    (metalMass * metal.c * metalTemp + waterMass * C_WATER * waterTemp) / (metalMass * metal.c + waterMass * C_WATER);
  const measuredC = (waterMass * C_WATER * (finalTemp1 - waterTemp)) / (metalMass * (metalTemp - finalTemp1));
  const closestMatch = [...metals].sort((a, b) => Math.abs(a.c - measuredC) - Math.abs(b.c - measuredC))[0];

  const reset1 = () => setMixed1(false);

  // Tab 2: heat of neutralization
  const [reaction, setReaction] = useState(reactions[0]);
  const [conc, setConc] = useState(1);
  const [volAcid, setVolAcid] = useState(50);
  const [volBase, setVolBase] = useState(50);
  const [initTemp, setInitTemp] = useState(25);
  const [mixed2, setMixed2] = useState(false);

  const molesAcid = (conc * volAcid) / 1000;
  const molesBase = (conc * volBase) / 1000;
  const limitingMoles = Math.min(molesAcid, molesBase);
  const heatReleased = limitingMoles * Math.abs(reaction.deltaH) * 1000; // J
  const solutionMass = volAcid + volBase; // g, density ≈ 1 g/mL ধরে
  const deltaT = heatReleased / (solutionMass * C_WATER);
  const finalTemp2 = initTemp + deltaT;

  const reset2 = () => setMixed2(false);

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">ক্যালরিমেট্রি ল্যাব</h1>
            <p className="text-white/80 text-sm">তাপ পরিমাপ করে আপেক্ষিক তাপ ও বিক্রিয়ার তাপ নির্ণয় করো</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setTab("metal")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "metal" ? "bg-slate-700 text-orange-400 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"}`}
            >
              ধাতুর আপেক্ষিক তাপ
            </button>
            <button
              onClick={() => setTab("neutralization")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === "neutralization" ? "bg-slate-700 text-orange-400 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"}`}
            >
              নিরপেক্ষীকরণ তাপ
            </button>
          </div>

          {tab === "metal" ? (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2">ধাতু বাছাই করো (অজানা নমুনা ধরে নাও)</label>
                <select
                  value={metal.id}
                  onChange={(e) => { setMetal(metals.find((m) => m.id === e.target.value)!); reset1(); }}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {metals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">ধাতুর ভর</label>
                    <span className="text-orange-400 font-bold text-xs">{metalMass} g</span>
                  </div>
                  <input type="range" min="10" max="100" value={metalMass} onChange={(e) => { setMetalMass(+e.target.value); reset1(); }} className="w-full accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">ধাতুর তাপমাত্রা</label>
                    <span className="text-orange-400 font-bold text-xs">{metalTemp}°C</span>
                  </div>
                  <input type="range" min="60" max="100" value={metalTemp} onChange={(e) => { setMetalTemp(+e.target.value); reset1(); }} className="w-full accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">পানির ভর</label>
                    <span className="text-sky-400 font-bold text-xs">{waterMass} g</span>
                  </div>
                  <input type="range" min="50" max="200" value={waterMass} onChange={(e) => { setWaterMass(+e.target.value); reset1(); }} className="w-full accent-sky-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">পানির প্রাথমিক তাপমাত্রা</label>
                    <span className="text-sky-400 font-bold text-xs">{waterTemp}°C</span>
                  </div>
                  <input type="range" min="15" max="35" value={waterTemp} onChange={(e) => { setWaterTemp(+e.target.value); reset1(); }} className="w-full accent-sky-500" />
                </div>
              </div>

              {/* Visualization */}
              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center gap-8 min-h-[180px]">
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    className="w-10 h-10 rounded-md"
                    style={{ backgroundColor: metal.color }}
                    animate={mixed1 ? { y: 30, opacity: 0.3 } : { y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  <span className="text-xs text-slate-400">গরম ধাতু ({metalTemp}°C)</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-slate-700 rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-400">তাপমাত্রা</p>
                    <p className="text-orange-400 font-bold">{(mixed1 ? finalTemp1 : waterTemp).toFixed(1)}°C</p>
                  </div>
                  <div className="relative w-12 h-20 border-2 border-slate-500 rounded-b-lg overflow-hidden mt-1">
                    <div className="absolute bottom-0 left-0 right-0 bg-sky-500/40" style={{ height: "70%" }} />
                  </div>
                  <span className="text-xs text-slate-400">পানি</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMixed1(true)}
                  disabled={mixed1}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  পানিতে ফেলো
                </button>
                <button onClick={reset1} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {mixed1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-700 rounded-2xl p-5 space-y-2">
                  <p className="text-slate-400 text-sm">তাপ ভারসাম্য: m₁c₁(T₁−Tf) = m₂c₂(Tf−T₂)</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">সাম্য তাপমাত্রা (Tf)</span>
                    <span className="text-lg font-bold text-orange-400">{finalTemp1.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                    <span className="text-sm text-slate-300">পরিমাপিত আপেক্ষিক তাপ</span>
                    <span className="text-xl font-bold text-orange-300">{measuredC.toFixed(2)} J/g°C</span>
                  </div>
                  <p className="text-xs text-slate-400">সবচেয়ে কাছের মিল: <span className="text-white font-medium">{closestMatch.name}</span> ({closestMatch.c} J/g°C)</p>
                </motion.div>
              )}

              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">কীভাবে কাজ করে?</p>
                  <p>গরম ধাতু পানিতে দিলে ধাতু তাপ হারায়, পানি তাপ পায়, যতক্ষণ না উভয়ে একই তাপমাত্রায় পৌঁছায়। ধাতুর হারানো তাপ = পানির পাওয়া তাপ (ক্যালরিমিটার থেকে তাপ ক্ষয় নেই ধরে নিয়ে) — এ থেকে ধাতুর আপেক্ষিক তাপ ধারণক্ষমতা বের করা যায়।</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-slate-300 mb-2">বিক্রিয়া বাছাই করো</label>
                <select
                  value={reaction.id}
                  onChange={(e) => { setReaction(reactions.find((r) => r.id === e.target.value)!); reset2(); }}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {reactions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">{reaction.note}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">অ্যাসিড আয়তন</label>
                    <span className="text-orange-400 font-bold text-xs">{volAcid} mL</span>
                  </div>
                  <input type="range" min="10" max="100" value={volAcid} onChange={(e) => { setVolAcid(+e.target.value); reset2(); }} className="w-full accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">ক্ষার আয়তন</label>
                    <span className="text-orange-400 font-bold text-xs">{volBase} mL</span>
                  </div>
                  <input type="range" min="10" max="100" value={volBase} onChange={(e) => { setVolBase(+e.target.value); reset2(); }} className="w-full accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">ঘনত্ব (উভয়ের)</label>
                    <span className="text-orange-400 font-bold text-xs">{conc} M</span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.1" value={conc} onChange={(e) => { setConc(+e.target.value); reset2(); }} className="w-full accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs text-slate-300">প্রাথমিক তাপমাত্রা</label>
                    <span className="text-orange-400 font-bold text-xs">{initTemp}°C</span>
                  </div>
                  <input type="range" min="15" max="35" value={initTemp} onChange={(e) => { setInitTemp(+e.target.value); reset2(); }} className="w-full accent-orange-500" />
                </div>
              </div>

              {/* Visualization */}
              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[180px]">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24 border-2 border-slate-500 rounded-b-2xl overflow-hidden">
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 opacity-50"
                      style={{ height: "65%" }}
                      animate={{ backgroundColor: mixed2 ? "#fb923c" : "#94a3b8" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="bg-slate-700 rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-slate-400">তাপমাত্রা</p>
                    <p className="text-orange-400 font-bold">{(mixed2 ? finalTemp2 : initTemp).toFixed(1)}°C</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMixed2(true)}
                  disabled={mixed2}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  মিশ্রিত করো
                </button>
                <button onClick={reset2} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {mixed2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-700 rounded-2xl p-5 space-y-2">
                  <p className="text-slate-400 text-sm">সীমাবদ্ধ মোল = min({molesAcid.toFixed(3)}, {molesBase.toFixed(3)}) = {limitingMoles.toFixed(3)} mol</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">নিঃসৃত তাপ (q)</span>
                    <span className="text-sm text-white font-semibold">{heatReleased.toFixed(0)} J</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">তাপমাত্রা বৃদ্ধি (ΔT)</span>
                    <span className="text-sm text-white font-semibold">+{deltaT.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                    <span className="text-sm text-slate-300">শেষ তাপমাত্রা</span>
                    <span className="text-2xl font-bold text-orange-400">{finalTemp2.toFixed(1)}°C</span>
                  </div>
                </motion.div>
              )}

              <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">নিরপেক্ষীকরণ তাপ</p>
                  <p>অ্যাসিড ও ক্ষার বিক্রিয়া করে পানি ও লবণ তৈরির সময় তাপ নির্গত হয় (এক্সোথার্মিক)। যত বেশি মোল বিক্রিয়া করে, তত বেশি তাপ নিঃসৃত হয়ে দ্রবণের তাপমাত্রা বাড়ায়।</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
