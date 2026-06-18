"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

type Law = "boyle" | "charles" | "ideal";

export default function GasLawsLabPage() {
  const [law, setLaw]         = useState<Law>("boyle");
  const [pressure, setPressure] = useState(1);
  const [temp,     setTemp]     = useState(300);
  const [moles,    setMoles]    = useState(1);
  const R = 0.0821; // L·atm/mol·K

  const volume = (moles * R * temp) / pressure;
  const cylinderHeight = Math.min(Math.max(volume * 8, 20), 200);

  const particleCount = Math.min(Math.round(moles * 10), 30);

  const laws = [
    { key: "boyle",   label: "বয়েলের সূত্র",   formula: "P₁V₁ = P₂V₂",  desc: "স্থির তাপমাত্রায় P ও V বিপরীতভাবে সমানুপাতিক" },
    { key: "charles", label: "চার্লসের সূত্র",  formula: "V₁/T₁ = V₂/T₂", desc: "স্থির চাপে V ও T সরাসরি সমানুপাতিক" },
    { key: "ideal",   label: "আদর্শ গ্যাস সূত্র", formula: "PV = nRT",      desc: "চাপ, আয়তন, তাপমাত্রা ও মোল একসাথে" },
  ];

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/virtual-lab" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব ল্যাব
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">গ্যাসের সূত্র ল্যাব</h1>
            <p className="text-white/80 text-sm">চাপ, তাপমাত্রা ও আয়তনের সম্পর্ক দেখো</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Law Selection */}
            <div className="flex rounded-xl overflow-hidden border border-slate-700">
              {laws.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLaw(l.key as Law)}
                  className={`flex-1 py-3 text-xs font-medium transition-colors ${law === l.key ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"}`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Formula Display */}
            <div className="bg-purple-900/30 border border-purple-700 rounded-2xl p-4 text-center">
              <p className="text-purple-300 font-mono text-2xl font-bold mb-1">
                {laws.find(l => l.key === law)?.formula}
              </p>
              <p className="text-purple-400 text-sm">{laws.find(l => l.key === law)?.desc}</p>
            </div>

            {/* Visualization */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[220px]">
              <div className="flex flex-col items-center gap-4">
                {/* Cylinder */}
                <div className="relative flex flex-col items-center">
                  {/* Piston */}
                  <motion.div
                    className="w-24 h-4 bg-slate-400 rounded-t-lg shadow-lg z-10"
                    animate={{ marginBottom: cylinderHeight }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                  {/* Gas container */}
                  <div className="relative w-24 border-2 border-slate-500 rounded-b-xl overflow-hidden"
                    style={{ height: `${cylinderHeight}px`, transition: "height 0.5s" }}
                  >
                    {/* Gas color changes with temp */}
                    <div className="absolute inset-0 transition-colors duration-500"
                      style={{
                        backgroundColor: `rgba(${Math.round(100 + (temp-200)*0.2)}, 100, ${Math.round(255 - (temp-200)*0.4)}, 0.3)`
                      }}
                    />
                    {/* Particles */}
                    {Array.from({ length: particleCount }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white/60"
                        animate={{
                          x: [Math.random()*80-10, Math.random()*80-10],
                          y: [Math.random()*cylinderHeight, Math.random()*cylinderHeight],
                        }}
                        transition={{
                          duration: Math.max(0.3, 1.5 - temp/1000),
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-slate-400 text-xs">আয়তন</p>
                  <p className="text-2xl font-bold text-white">{volume.toFixed(3)} L</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Pressure — always show for boyle and ideal */}
              {(law === "boyle" || law === "ideal") && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-300">চাপ (P)</label>
                    <span className="text-purple-400 font-bold text-sm">{pressure.toFixed(2)} atm</span>
                  </div>
                  <input type="range" min="0.1" max="10" step="0.1" value={pressure}
                    onChange={(e) => setPressure(+e.target.value)}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0.1 atm</span><span>10 atm</span>
                  </div>
                </div>
              )}

              {/* Temperature — always show for charles and ideal */}
              {(law === "charles" || law === "ideal") && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-300">তাপমাত্রা (T)</label>
                    <span className="text-orange-400 font-bold text-sm">{temp} K ({temp - 273}°C)</span>
                  </div>
                  <input type="range" min="100" max="1000" step="10" value={temp}
                    onChange={(e) => setTemp(+e.target.value)}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>100 K</span><span>1000 K</span>
                  </div>
                </div>
              )}

              {/* Moles — ideal only */}
              {law === "ideal" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-300">মোল সংখ্যা (n)</label>
                    <span className="text-green-400 font-bold text-sm">{moles.toFixed(1)} mol</span>
                  </div>
                  <input type="range" min="0.1" max="3" step="0.1" value={moles}
                    onChange={(e) => setMoles(+e.target.value)}
                    className="w-full accent-green-500"
                  />
                </div>
              )}
            </div>

            {/* Result Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "চাপ (P)", value: `${pressure.toFixed(2)} atm`, color: "text-purple-400" },
                { label: "আয়তন (V)", value: `${volume.toFixed(3)} L`, color: "text-blue-400" },
                { label: "তাপমাত্রা (T)", value: `${temp} K`, color: "text-orange-400" },
                { label: "মোল (n)", value: `${moles.toFixed(1)} mol`, color: "text-green-400" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-700 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* PV = nRT verification */}
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-sm text-slate-300 font-medium mb-2">যাচাইকরণ: PV = nRT</p>
              <p className="text-slate-400 text-sm font-mono">
                {pressure.toFixed(2)} × {volume.toFixed(3)} = {moles.toFixed(1)} × {R} × {temp}
              </p>
              <p className="text-green-400 text-sm font-mono mt-1">
                {(pressure * volume).toFixed(3)} ≈ {(moles * R * temp).toFixed(3)} ✓
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
