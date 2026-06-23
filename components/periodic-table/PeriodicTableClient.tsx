"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  elements, categoryColors, categoryNames, ElementData,
} from "./elementData";
import { ElectronShellDiagram } from "./ElectronShellDiagram";
import {
  X, Thermometer, Zap, FlaskConical, Info,
  Layers, Wind, Droplets, Activity, BookOpen,
} from "lucide-react";

// ─── Colour maps ────────────────────────────────────────────────────────────

/** Hex accent colour per category (for glow, diagram, badge). */
const categoryHex: Record<string, string> = {
  "alkali-metal":      "#f87171",
  "alkaline-earth":    "#fb923c",
  "transition-metal":  "#facc15",
  "post-transition":   "#2dd4bf",
  "metalloid":         "#4ade80",
  "nonmetal":          "#60a5fa",
  "halogen":           "#22d3ee",
  "noble-gas":         "#a78bfa",
  "lanthanide":        "#f472b6",
  "actinide":          "#fb7185",
  "unknown":           "#94a3b8",
};

/** Tailwind bg class per element state at room temperature */
const stateRingColor: Record<string, string> = {
  solid:   "ring-slate-300/60",
  liquid:  "ring-blue-400/80",
  gas:     "ring-emerald-400/80",
  unknown: "ring-slate-500/30",
};

const stateLabel: Record<string, string> = {
  solid: "কঠিন", liquid: "তরল", gas: "গ্যাস", unknown: "অজানা",
};

const stateColor: Record<string, string> = {
  solid:   "bg-slate-200/20 text-slate-300",
  liquid:  "bg-blue-500/20 text-blue-300",
  gas:     "bg-emerald-500/20 text-emerald-300",
  unknown: "bg-slate-600/20 text-slate-500",
};

// s/p/d/f block per category
const blockLabel: Record<string, string> = {
  "alkali-metal":"s","alkaline-earth":"s",
  "transition-metal":"d","post-transition":"p",
  "metalloid":"p","nonmetal":"p","halogen":"p","noble-gas":"p",
  "lanthanide":"f","actinide":"f","unknown":"?",
};

// ─── Filter modes ───────────────────────────────────────────────────────────

type FilterMode = "category" | "state" | "block" | "period";

// ─── Build grid ─────────────────────────────────────────────────────────────

const elementGrid: (ElementData | null)[][] = Array.from({ length: 10 }, () =>
  Array(18).fill(null)
);
elements.forEach((el) => {
  if (el.row >= 1 && el.row <= 10 && el.col >= 1 && el.col <= 18) {
    elementGrid[el.row - 1][el.col - 1] = el;
  }
});

// ─── ElementCell ────────────────────────────────────────────────────────────

function ElementCell({
  el, dimmed, highlighted, hoveredCategory,
  onClick, onHover,
}: {
  el: ElementData;
  dimmed: boolean;
  highlighted: boolean;
  hoveredCategory: string | null;
  onClick: () => void;
  onHover: (cat: string | null) => void;
}) {
  const hex = categoryHex[el.category] ?? "#94a3b8";
  const colorClass = categoryColors[el.category] ?? categoryColors["unknown"];

  return (
    <motion.button
      layout
      onClick={onClick}
      onMouseEnter={() => onHover(el.category)}
      onMouseLeave={() => onHover(null)}
      animate={{
        opacity: dimmed ? 0.12 : 1,
        scale: highlighted ? 1.08 : 1,
        filter: highlighted
          ? `drop-shadow(0 0 8px ${hex}bb)`
          : dimmed ? "brightness(0.4)" : "brightness(1)",
      }}
      whileHover={{ scale: dimmed ? 1 : 1.18, zIndex: 20 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative ${colorClass} rounded-lg p-1 text-white cursor-pointer
        flex flex-col items-center justify-center aspect-square min-w-[52px]
        shadow-md ring-2 ring-transparent transition-shadow
        ${highlighted ? "ring-white/50 shadow-xl" : ""}
        ${stateRingColor[el.state] ?? ""}
      `}
      title={`${el.nameBn} (${el.name})`}
    >
      <span className="text-[9px] opacity-70 self-start pl-0.5">{el.atomicNumber}</span>
      <span className="text-base font-bold leading-tight">{el.symbol}</span>
      <span className="text-[8px] opacity-90 truncate w-full text-center leading-none">{el.name}</span>
      <span className="text-[7px] opacity-60">{el.atomicMass.toFixed(2)}</span>
      {/* Block badge */}
      <span
        className="absolute top-0.5 right-0.5 text-[6px] font-bold opacity-60"
        style={{ color: hex }}
      >
        {blockLabel[el.category]}
      </span>
    </motion.button>
  );
}

// ─── ElementModal ────────────────────────────────────────────────────────────

function ElementModal({ el, onClose }: { el: ElementData; onClose: () => void }) {
  const colorClass = categoryColors[el.category] ?? categoryColors["unknown"];
  const hex = categoryHex[el.category] ?? "#94a3b8";
  const [tab, setTab] = useState<"info" | "shell" | "uses">("info");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.75, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
        style={{ boxShadow: `0 0 40px ${hex}44` }}
      >
        {/* Header */}
        <div className={`${colorClass} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-end gap-5">
            {/* Big symbol */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.05 }}
              className="text-center bg-white/15 rounded-2xl px-4 py-2 min-w-[72px]"
            >
              <div className="text-sm opacity-80 font-mono">{el.atomicNumber}</div>
              <div className="text-5xl font-black leading-none">{el.symbol}</div>
              <div className="text-xs opacity-70 mt-1">{el.atomicMass.toFixed(3)}</div>
            </motion.div>

            <div>
              <h2 className="text-2xl font-bold">{el.name}</h2>
              <p className="text-lg opacity-90 font-medium">{el.nameBn}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {categoryNames[el.category]}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stateColor[el.state]}`}>
                  {stateLabel[el.state]}
                </span>
                <span className="px-2.5 py-1 bg-white/10 rounded-full text-xs font-mono">
                  {blockLabel[el.category]}-block
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {([
            { id: "info", label: "তথ্য", icon: Info },
            { id: "shell", label: "ইলেকট্রন শেল", icon: Activity },
            { id: "uses", label: "ব্যবহার", icon: BookOpen },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 ${
                tab === id
                  ? "text-white border-current"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
              style={tab === id ? { color: hex, borderColor: hex } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="max-h-[52vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === "info" && (
              <motion.div key="info"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="p-5 space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "পারমাণবিক ভর",       value: `${el.atomicMass} u` },
                    { label: "পর্যায় / গ্রুপ",      value: `${el.period} / ${el.group ?? "—"}` },
                    { label: "তড়িৎ ঋণাত্মকতা",    value: el.electronegativity ?? "—" },
                    { label: "জারণ অবস্থা",         value: el.oxidationStates },
                    { label: "গলনাঙ্ক",             value: el.meltingPoint !== null ? `${el.meltingPoint} °C` : "—" },
                    { label: "স্ফুটনাঙ্ক",          value: el.boilingPoint !== null ? `${el.boilingPoint} °C` : "—" },
                    { label: "ঘনত্ব",               value: el.density !== null ? `${el.density} g/cm³` : "—" },
                    { label: "আবিষ্কার",            value: `${el.discoveredBy} (${el.discoveryYear})` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
                      <div className="text-white text-sm font-medium leading-snug">{String(value)}</div>
                    </div>
                  ))}
                </div>

                {/* Electron config */}
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-[10px] text-slate-400">ইলেকট্রন বিন্যাস</span>
                  </div>
                  <div className="font-mono text-sm text-white bg-slate-900/50 rounded-lg px-3 py-2">
                    {el.electronConfig}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "shell" && (
              <motion.div key="shell"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="p-5"
              >
                <p className="text-xs text-slate-400 text-center mb-3">
                  কক্ষপথ অনুযায়ী ইলেকট্রন বিন্যাস — প্রতিটি বিন্দু একটি ইলেকট্রন
                </p>
                <div className="w-full aspect-square max-w-[220px] mx-auto">
                  <ElectronShellDiagram
                    config={el.electronConfig}
                    symbol={el.symbol}
                    color={hex}
                  />
                </div>

                {/* Shell breakdown text */}
                <div className="mt-4 bg-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 mb-2">কক্ষপথ বিস্তারিত</div>
                  <div className="font-mono text-sm text-white">{el.electronConfig}</div>

                  {/* Period / Group visual */}
                  <div className="mt-3 flex gap-4 text-xs">
                    <div className="flex-1 bg-slate-700 rounded-lg p-2 text-center">
                      <div className="text-slate-400 text-[10px]">পর্যায় (Period)</div>
                      <div className="text-white font-bold text-lg">{el.period}</div>
                      <div className="text-slate-400 text-[10px]">= {el.period}টি কক্ষপথ</div>
                    </div>
                    <div className="flex-1 bg-slate-700 rounded-lg p-2 text-center">
                      <div className="text-slate-400 text-[10px]">গ্রুপ (Group)</div>
                      <div className="text-white font-bold text-lg">{el.group ?? "—"}</div>
                      <div className="text-slate-400 text-[10px]">যোজনী e⁻ সংখ্যা</div>
                    </div>
                    <div className="flex-1 bg-slate-700 rounded-lg p-2 text-center">
                      <div className="text-slate-400 text-[10px]">Block</div>
                      <div className="font-bold text-lg" style={{ color: hex }}>{blockLabel[el.category]}</div>
                      <div className="text-slate-400 text-[10px]">অরবিটাল</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "uses" && (
              <motion.div key="uses"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="p-5 space-y-3"
              >
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-4 h-4" style={{ color: hex }} />
                    <span className="text-sm text-slate-300 font-medium">ব্যবহার ও প্রয়োগ</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{el.uses}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                    <div className="text-[10px] text-slate-400">ঘরের তাপমাত্রায়</div>
                    <div className={`text-sm font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${stateColor[el.state]}`}>
                      {stateLabel[el.state]}
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <Wind className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                    <div className="text-[10px] text-slate-400">ঘনত্ব</div>
                    <div className="text-sm font-semibold text-white mt-1">
                      {el.density !== null ? `${el.density}` : "—"}
                    </div>
                    <div className="text-[9px] text-slate-500">g/cm³</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Filter controls ─────────────────────────────────────────────────────────

const periodList = [1,2,3,4,5,6,7];
const blockList  = ["s","p","d","f"];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PeriodicTableClient() {
  const [selected, setSelected]             = useState<ElementData | null>(null);
  const [filterMode, setFilterMode]         = useState<FilterMode>("category");
  const [activeFilter, setActiveFilter]     = useState<string>("all");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  /** Whether an element passes the active filter. */
  function matches(el: ElementData): boolean {
    if (activeFilter === "all") return true;
    switch (filterMode) {
      case "category": return el.category === activeFilter;
      case "state":    return el.state === activeFilter;
      case "block":    return blockLabel[el.category] === activeFilter;
      case "period":   return String(el.period) === activeFilter;
      default:         return true;
    }
  }

  function isDimmed(el: ElementData): boolean {
    // Dimmed when hovered category is set and this element doesn't match,
    // OR when a filter is active and this element doesn't match.
    if (hoveredCategory && el.category !== hoveredCategory) return true;
    if (activeFilter !== "all" && !matches(el)) return true;
    return false;
  }

  function isHighlighted(el: ElementData): boolean {
    if (hoveredCategory) return el.category === hoveredCategory;
    if (activeFilter !== "all") return matches(el);
    return false;
  }

  const toggleFilter = (key: string) =>
    setActiveFilter((prev) => (prev === key ? "all" : key));

  const matchCount = elements.filter(matches).length;

  return (
    <div>

      {/* ── Filter mode tabs ── */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {([
          { id: "category", label: "ক্যাটাগরি",  icon: Layers },
          { id: "state",    label: "অবস্থা",       icon: Droplets },
          { id: "block",    label: "ব্লক (s/p/d/f)", icon: Activity },
          { id: "period",   label: "পর্যায়",        icon: Thermometer },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setFilterMode(id); setActiveFilter("all"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === id
                ? "gradient-bg text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ── Filter chips (changes based on mode) ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === "all"
              ? "bg-white text-slate-900 shadow"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          সব ({elements.length})
        </button>

        {filterMode === "category" &&
          Object.entries(categoryNames).map(([key, name]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFilter(key)}
              onMouseEnter={() => setHoveredCategory(key)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2 ${
                activeFilter === key
                  ? "border-white/80 scale-105 shadow-lg"
                  : "border-transparent opacity-75 hover:opacity-100"
              } ${categoryColors[key]} text-white`}
              style={activeFilter === key ? { boxShadow: `0 0 12px ${categoryHex[key]}88` } : {}}
            >
              <span
                className="w-2 h-2 rounded-full bg-white/50"
              />
              {name}
              <span className="opacity-70">
                ({elements.filter(e => e.category === key).length})
              </span>
            </motion.button>
          ))
        }

        {filterMode === "state" &&
          (["solid","liquid","gas","unknown"] as const).map((s) => (
            <button
              key={s}
              onClick={() => toggleFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === s
                  ? "bg-white text-slate-900 shadow"
                  : `${stateColor[s]} hover:opacity-100 opacity-75`
              }`}
            >
              {stateLabel[s]} ({elements.filter(e => e.state === s).length})
            </button>
          ))
        }

        {filterMode === "block" &&
          blockList.map((b) => (
            <button
              key={b}
              onClick={() => toggleFilter(b)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === b
                  ? "gradient-bg text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {b}-block ({elements.filter(e => blockLabel[e.category] === b).length})
            </button>
          ))
        }

        {filterMode === "period" &&
          periodList.map((p) => (
            <button
              key={p}
              onClick={() => toggleFilter(String(p))}
              className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                activeFilter === String(p)
                  ? "gradient-bg text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {p}
            </button>
          ))
        }
      </div>

      {/* ── Visual legend: what the ring colours mean ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-4 px-4">
        <span className="text-[10px] text-slate-500 self-center">রিং রঙ = ঘরের তাপমাত্রায় অবস্থা:</span>
        {(["solid","liquid","gas"] as const).map((s) => (
          <span key={s} className={`flex items-center gap-1 text-[10px] font-medium ${stateColor[s]}`}>
            <span className={`w-3 h-3 rounded-full ring-2 ${stateRingColor[s]}`} />
            {stateLabel[s]}
          </span>
        ))}
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="text-[9px] font-bold text-slate-400">s</span> = s-block (উপরে ডানে)
        </span>
      </div>

      {/* ── Periodic Table Grid ── */}
      <div className="overflow-x-auto pb-4 px-2">
        <div className="min-w-max">
          {/* Column numbers */}
          <div className="grid gap-[3px] mb-1"
            style={{ gridTemplateColumns: "repeat(18, minmax(52px, 1fr))" }}>
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className="text-center text-[10px] text-slate-500 font-mono">
                {i + 1}
              </div>
            ))}
          </div>

          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: "repeat(18, minmax(52px, 1fr))" }}
          >
            {elementGrid.map((row, ri) =>
              row.map((el, ci) => {
                // Lanthanide/actinide gap label
                if (!el) {
                  if (ri === 7 && ci === 2) return (
                    <div
                      key={`${ri}-${ci}`}
                      className="col-span-14 flex items-center justify-center text-slate-500 text-[10px] py-0.5 border-t border-b border-slate-700/30"
                    >
                      ↓ ল্যান্থানাইড / অ্যাক্টিনাইড (row 6 & 7)
                    </div>
                  );
                  return <div key={`${ri}-${ci}`} className="aspect-square min-w-[52px]" />;
                }

                return (
                  <div key={el.atomicNumber} className="relative">
                    {/* Row number on first column */}
                    {ci === 0 && (
                      <div className="absolute -left-5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">
                        {ri + 1}
                      </div>
                    )}
                    <ElementCell
                      el={el}
                      dimmed={isDimmed(el)}
                      highlighted={isHighlighted(el)}
                      hoveredCategory={hoveredCategory}
                      onClick={() => setSelected(el)}
                      onHover={setHoveredCategory}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Count + hint ── */}
      <p className="text-center text-slate-500 text-xs mt-4">
        <span className="text-white font-semibold">{matchCount}</span>টি মৌল দেখানো হচ্ছে — মোট ১১৮টি
        {activeFilter === "all" && (
          <span className="ml-2 opacity-60">· যেকোনো category chip hover করলে সেই group glow করবে</span>
        )}
      </p>

      {/* ── Element Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <ElementModal el={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
