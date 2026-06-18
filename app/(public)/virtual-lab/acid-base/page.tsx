"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Info } from "lucide-react";

const acids = [
  { name: "HCl (0.1M)", ph: 1.0,  color: "#ef4444" },
  { name: "CH₃COOH (0.1M)", ph: 2.9, color: "#f97316" },
  { name: "H₂CO₃ (0.1M)", ph: 3.7, color: "#eab308" },
  { name: "H₂O বিশুদ্ধ", ph: 7.0,  color: "#22c55e" },
];

const bases = [
  { name: "NaOH (0.1M)",  ph: 13.0, color: "#8b5cf6" },
  { name: "NH₃ (0.1M)",   ph: 11.1, color: "#6366f1" },
  { name: "Na₂CO₃ (0.1M)", ph: 11.6, color: "#3b82f6" },
  { name: "H₂O বিশুদ্ধ",  ph: 7.0,  color: "#22c55e" },
];

function getIndicatorColor(ph: number): string {
  if (ph < 3)  return "#ef4444";
  if (ph < 5)  return "#f97316";
  if (ph < 6)  return "#eab308";
  if (ph < 7.5)return "#22c55e";
  if (ph < 9)  return "#3b82f6";
  if (ph < 11) return "#6366f1";
  return "#8b5cf6";
}

function getPhLabel(ph: number): string {
  if (ph < 3)  return "শক্তিশালী অ্যাসিড";
  if (ph < 6)  return "দুর্বল অ্যাসিড";
  if (ph < 7)  return "সামান্য অ্যাসিড";
  if (ph === 7)return "নিরপেক্ষ";
  if (ph < 9)  return "সামান্য ক্ষার";
  if (ph < 11) return "দুর্বল ক্ষার";
  return "শক্তিশালী ক্ষার";
}

function PHScale({ ph }: { ph: number }) {
  return (
    <div className="w-full">
      <div className="h-8 rounded-full overflow-hidden mb-2 relative" style={{
        background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #22c55e, #3b82f6, #6366f1, #8b5cf6)"
      }}>
        <motion.div
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
          style={{ left: `calc(${(ph / 14) * 100}% - 12px)` }}
          animate={{ left: `calc(${(ph / 14) * 100}% - 12px)` }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </motion.div>
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        {[0,2,4,6,7,8,10,12,14].map(n => <span key={n}>{n}</span>)}
      </div>
    </div>
  );
}

function Beaker({ color, label, volume, animate: anim }: { color: string; label: string; volume: number; animate: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-28">
        {/* Beaker shape */}
        <svg viewBox="0 0 80 112" className="absolute inset-0 w-full h-full">
          <path d="M15 10 L5 100 Q5 105 10 105 L70 105 Q75 105 75 100 L65 10 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <path d="M12 10 L22 10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M58 10 L68 10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {/* Liquid */}
        <motion.div
          className="absolute bottom-2 left-2 right-2 rounded-b-lg transition-all duration-500"
          style={{ backgroundColor: color, height: `${volume * 0.6}%`, opacity: 0.85 }}
          animate={anim ? { opacity: [0.85, 1, 0.85] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Bubbles when mixing */}
        {anim && [1,2,3].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{ width: 4+i*2, height: 4+i*2, left: `${20+i*15}%`, bottom: "30%" }}
            animate={{ y: [-20, -50], opacity: [0.8, 0] }}
            transition={{ duration: 1, delay: i*0.3, repeat: Infinity }}
          />
        ))}
      </div>
      <span className="text-xs text-center text-slate-300 mt-2 max-w-[80px] leading-tight">{label}</span>
    </div>
  );
}

export default function AcidBaseLabPage() {
  const [acid, setAcid] = useState(acids[0]);
  const [base, setBase] = useState(bases[0]);
  const [acidVol,  setAcidVol]  = useState(50);
  const [baseVol,  setBaseVol]  = useState(50);
  const [mixed,    setMixed]    = useState(false);
  const [mixedPh,  setMixedPh]  = useState<number | null>(null);
  const [animating,setAnimating]= useState(false);

  const handleMix = () => {
    setAnimating(true);
    setTimeout(() => {
      const totalVol = acidVol + baseVol;
      const hConc  = Math.pow(10, -acid.ph)  * (acidVol / totalVol);
      const ohConc = Math.pow(10, -(14 - base.ph)) * (baseVol / totalVol);
      let ph: number;
      if (hConc > ohConc) {
        ph = -Math.log10(hConc - ohConc);
      } else if (ohConc > hConc) {
        ph = 14 + Math.log10(ohConc - hConc);
      } else {
        ph = 7;
      }
      ph = Math.max(0, Math.min(14, ph));
      setMixedPh(ph);
      setMixed(true);
      setAnimating(false);
    }, 1500);
  };

  const reset = () => {
    setMixed(false);
    setMixedPh(null);
    setAcidVol(50);
    setBaseVol(50);
  };

  const indicatorColor = mixedPh !== null ? getIndicatorColor(mixedPh) : "#94a3b8";

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">অ্যাসিড-ক্ষার মিশ্রণ ল্যাব</h1>
            <p className="text-white/80 text-sm">দুটি দ্রবণ মিশিয়ে pH পরিবর্তন পর্যবেক্ষণ করো</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">অ্যাসিড বেছে নাও</label>
                <select
                  value={acid.name}
                  onChange={(e) => { setAcid(acids.find(a => a.name === e.target.value)!); setMixed(false); setMixedPh(null); }}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                >
                  {acids.map(a => <option key={a.name}>{a.name}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">pH: {acid.ph}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ক্ষার বেছে নাও</label>
                <select
                  value={base.name}
                  onChange={(e) => { setBase(bases.find(b => b.name === e.target.value)!); setMixed(false); setMixedPh(null); }}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-green-500"
                >
                  {bases.map(b => <option key={b.name}>{b.name}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">pH: {base.ph}</p>
              </div>
            </div>

            {/* Volume Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">অ্যাসিডের আয়তন: <span className="text-green-400 font-bold">{acidVol} mL</span></label>
                <input type="range" min="10" max="100" value={acidVol} onChange={(e) => { setAcidVol(+e.target.value); setMixed(false); setMixedPh(null); }}
                  className="w-full accent-green-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">ক্ষারের আয়তন: <span className="text-purple-400 font-bold">{baseVol} mL</span></label>
                <input type="range" min="10" max="100" value={baseVol} onChange={(e) => { setBaseVol(+e.target.value); setMixed(false); setMixedPh(null); }}
                  className="w-full accent-purple-500" />
              </div>
            </div>

            {/* Animation Area */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-end justify-center gap-8 min-h-[200px] relative">
              <Beaker color={acid.color} label={`অ্যাসিড\n${acidVol}mL`} volume={acidVol} animate={animating} />

              {/* Arrow */}
              <div className="flex flex-col items-center gap-2 pb-16">
                {animating ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-2xl">⚗️</motion.div>
                ) : (
                  <span className="text-slate-500 text-2xl">+</span>
                )}
              </div>

              <Beaker color={base.color} label={`ক্ষার\n${baseVol}mL`} volume={baseVol} animate={animating} />

              {mixed && mixedPh !== null && (
                <>
                  <div className="flex flex-col items-center pb-0">
                    <span className="text-slate-500 text-2xl mb-2">=</span>
                  </div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    <div className="relative w-20 h-28">
                      <svg viewBox="0 0 80 112" className="absolute inset-0 w-full h-full">
                        <path d="M15 10 L5 100 Q5 105 10 105 L70 105 Q75 105 75 100 L65 10 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                      </svg>
                      <div className="absolute bottom-2 left-2 right-2 rounded-b-lg" style={{ backgroundColor: indicatorColor, height: "70%", opacity: 0.9 }} />
                    </div>
                    <span className="text-xs text-slate-300 mt-2">মিশ্রণ</span>
                  </motion.div>
                </>
              )}
            </div>

            {/* Result */}
            {mixed && mixedPh !== null && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">মিশ্রণের pH</p>
                    <p className="text-4xl font-bold" style={{ color: indicatorColor }}>
                      {mixedPh.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">দ্রবণের ধরন</p>
                    <p className="text-lg font-semibold text-white">{getPhLabel(mixedPh)}</p>
                    <p className="text-sm text-slate-400">{acidVol + baseVol} mL মোট আয়তন</p>
                  </div>
                </div>
                <PHScale ph={mixedPh} />
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleMix}
                disabled={animating}
                className="flex-1 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {animating ? "মিশ্রণ চলছে..." : "মিশ্রণ করো! 🧪"}
              </button>
              <button onClick={reset} className="px-5 py-3.5 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">কীভাবে কাজ করে?</p>
                <p>দুটি দ্রবণ মেশালে H⁺ এবং OH⁻ আয়ন পরস্পরের সাথে বিক্রিয়া করে পানি তৈরি করে।
                যে দ্রবণের ঘনত্ব বেশি তার ধর্ম প্রাধান্য পায়।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
