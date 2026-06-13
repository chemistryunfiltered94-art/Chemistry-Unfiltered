"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { elements, categoryColors, categoryNames, ElementData } from "./elementData";
import { X, Thermometer, Zap, FlaskConical } from "lucide-react";

function ElementCell({ el, onClick }: { el: ElementData; onClick: () => void }) {
  const colorClass = categoryColors[el.category] || categoryColors["unknown"];
  return (
    <motion.button
      whileHover={{ scale: 1.15, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${colorClass} rounded-lg p-1 text-white cursor-pointer flex flex-col items-center justify-center aspect-square min-w-[52px] shadow-md hover:shadow-xl transition-shadow`}
      title={el.nameBn}
    >
      <span className="text-[9px] opacity-80">{el.atomicNumber}</span>
      <span className="text-base font-bold leading-tight">{el.symbol}</span>
      <span className="text-[8px] opacity-90 truncate w-full text-center">{el.name}</span>
      <span className="text-[8px] opacity-70">{el.atomicMass.toFixed(2)}</span>
    </motion.button>
  );
}

function ElementModal({ el, onClose }: { el: ElementData; onClose: () => void }) {
  const colorClass = categoryColors[el.category] || categoryColors["unknown"];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className={`${colorClass} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-end gap-4">
            <div className="text-center">
              <div className="text-sm opacity-80">{el.atomicNumber}</div>
              <div className="text-6xl font-bold">{el.symbol}</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{el.name}</h2>
              <p className="text-lg opacity-90">{el.nameBn}</p>
              <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                {categoryNames[el.category] || el.category}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "পারমাণবিক ভর", value: `${el.atomicMass} u` },
              { label: "পর্যায়", value: `${el.period}` },
              { label: "গ্রুপ", value: el.group ? `${el.group}` : "—" },
              { label: "তড়িৎ ঋণাত্মকতা", value: el.electronegativity ? `${el.electronegativity}` : "—" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-700 rounded-xl p-3">
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="text-white font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Electron Config */}
          <div className="bg-slate-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-slate-400">ইলেকট্রন বিন্যাস</span>
            </div>
            <div className="text-white font-mono">{el.electronConfig}</div>
          </div>

          {/* Oxidation States */}
          <div className="bg-slate-700 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">জারণ অবস্থা</div>
            <div className="text-white">{el.oxidationStates}</div>
          </div>

          {/* Physical Properties */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              ভৌত ধর্ম
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400">অবস্থা</div>
                <div className="text-white text-sm font-medium capitalize">{el.state}</div>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400">গলনাঙ্ক</div>
                <div className="text-white text-sm">{el.meltingPoint !== null ? `${el.meltingPoint}°C` : "—"}</div>
              </div>
              <div className="bg-slate-700 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400">স্ফুটনাঙ্ক</div>
                <div className="text-white text-sm">{el.boilingPoint !== null ? `${el.boilingPoint}°C` : "—"}</div>
              </div>
            </div>
          </div>

          {/* Discovery */}
          <div className="bg-slate-700 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">আবিষ্কার</div>
            <div className="text-white text-sm">{el.discoveredBy} ({el.discoveryYear})</div>
          </div>

          {/* Uses */}
          <div className="bg-slate-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">ব্যবহার</span>
            </div>
            <div className="text-white text-sm">{el.uses}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Build grid lookup
const elementGrid: (ElementData | null)[][] = Array.from({ length: 10 }, () =>
  Array(18).fill(null)
);
elements.forEach((el) => {
  if (el.row <= 10 && el.col >= 1 && el.col <= 18) {
    elementGrid[el.row - 1][el.col - 1] = el;
  }
});

export default function PeriodicTableClient() {
  const [selected, setSelected] = useState<ElementData | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredElements = filter === "all"
    ? elements
    : elements.filter((el) => el.category === filter);

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === "all" ? "bg-white text-slate-900" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
        >
          সব মৌল
        </button>
        {Object.entries(categoryNames).map(([key, name]) => (
          <button
            key={key}
            onClick={() => setFilter(key === filter ? "all" : key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === key ? "bg-white text-slate-900" : `${categoryColors[key]} text-white opacity-80 hover:opacity-100`}`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto pb-4 px-2">
        <div className="min-w-max">
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(18, minmax(52px, 1fr))" }}>
            {elementGrid.map((row, ri) =>
              row.map((el, ci) => {
                // Lanthanide/Actinide gap row markers
                if (!el) {
                  if (ri === 5 && ci === 2) return (
                    <div key={`${ri}-${ci}`} className="col-span-14 flex items-center justify-center text-slate-500 text-xs py-1">
                      ↓ ল্যান্থানাইড / অ্যাক্টিনাইড
                    </div>
                  );
                  return <div key={`${ri}-${ci}`} className="aspect-square min-w-[52px]" />;
                }
                const isFiltered = filter !== "all" && el.category !== filter;
                return (
                  <div key={el.atomicNumber} className={isFiltered ? "opacity-20" : ""}>
                    <ElementCell el={el} onClick={() => setSelected(el)} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-center text-slate-500 text-sm mt-4">
        {filteredElements.length} টি মৌল দেখানো হচ্ছে (মোট ১১৮টি শীঘ্রই আসছে)
      </p>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ElementModal el={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
