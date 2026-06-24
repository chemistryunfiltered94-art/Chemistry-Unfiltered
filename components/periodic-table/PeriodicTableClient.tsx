"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  elements, categoryColors, categoryNames, ElementData,
} from "./elementData";
import { X, Zap, FlaskConical, Info, Layers, Wind, Droplets, Activity, BookOpen } from "lucide-react";

// ─── Colour maps ────────────────────────────────────────────────────────────
const categoryHex: Record<string, string> = {
  "alkali-metal":     "#f87171",
  "alkaline-earth":   "#fb923c",
  "transition-metal": "#facc15",
  "post-transition":  "#2dd4bf",
  metalloid:          "#4ade80",
  nonmetal:           "#60a5fa",
  halogen:            "#22d3ee",
  "noble-gas":        "#a78bfa",
  lanthanide:         "#f472b6",
  actinide:           "#fb7185",
  unknown:            "#94a3b8",
};

const stateRing: Record<string, string> = {
  solid:   "ring-slate-300/50",
  liquid:  "ring-blue-400",
  gas:     "ring-emerald-400",
  unknown: "ring-slate-600/30",
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
const blockOf: Record<string, string> = {
  "alkali-metal":"s","alkaline-earth":"s","transition-metal":"d",
  "post-transition":"p",metalloid:"p",nonmetal:"p",halogen:"p",
  "noble-gas":"p",lanthanide:"f",actinide:"f",unknown:"?",
};

// ─── Build row→col lookup ────────────────────────────────────────────────────
// rows 1-9 map to display rows; lanthanides go on row 9, actinides row 10.
const NUM_ROWS = 10;
const NUM_COLS = 18;

const grid: (ElementData | null)[][] = Array.from(
  { length: NUM_ROWS },
  () => Array(NUM_COLS).fill(null)
);
elements.forEach((el) => {
  const r = el.row - 1;
  const c = el.col - 1;
  if (r >= 0 && r < NUM_ROWS && c >= 0 && c < NUM_COLS) {
    grid[r][c] = el;
  }
});

type FilterMode = "category" | "state" | "block" | "period";

// ─── Animated Electron Shell SVG ────────────────────────────────────────────
function parseShells(config: string): number[] {
  const sup: Record<string, number> = {
    "¹":1,"²":2,"³":3,"⁴":4,"⁵":5,"⁶":6,"⁷":7,"⁸":8,"⁹":9,"⁰":0,
  };
  const coreMap: Record<string, number[]> = {
    He:[2], Ne:[2,8], Ar:[2,8,8], Kr:[2,8,18,8],
    Xe:[2,8,18,18,8], Rn:[2,8,18,32,18,8],
  };
  const shellMap: Record<number, number> = {};
  const coreMatch = config.match(/\[([A-Za-z]+)\]/);
  if (coreMatch) {
    const core = coreMap[coreMatch[1]] ?? [];
    core.forEach((v, i) => { shellMap[i + 1] = (shellMap[i + 1] ?? 0) + v; });
    config = config.replace(/\[[A-Za-z]+\]\s*/, "");
  }
  const re = /(\d+)[spdf]([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/g;
  let m;
  while ((m = re.exec(config)) !== null) {
    const n = parseInt(m[1]);
    const cnt = [...m[2]].reduce((a, c) => a * 10 + (sup[c] ?? 0), 0);
    shellMap[n] = (shellMap[n] ?? 0) + cnt;
  }
  const maxN = Math.max(...Object.keys(shellMap).map(Number), 0);
  return Array.from({ length: maxN }, (_, i) => shellMap[i + 1] ?? 0);
}

function ElectronShellDiagram({ config, symbol, color }: { config: string; symbol: string; color: string }) {
  const shells = parseShells(config);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const nucleusR = 20;
  const gap = (size / 2 - nucleusR - 14) / Math.max(shells.length, 1);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {/* Orbit rings */}
      {shells.map((_, si) => {
        const r = nucleusR + (si + 1) * gap;
        return (
          <motion.circle
            key={`ring-${si}`}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={0.8}
            strokeDasharray="4 3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ delay: si * 0.15, duration: 0.5, type: "spring" }}
          />
        );
      })}

      {/* Electrons — each orbits continuously */}
      {shells.map((count, si) => {
        const r = nucleusR + (si + 1) * gap;
        return Array.from({ length: count }).map((_, ei) => {
          const baseAngle = (360 * ei) / count;
          const duration = 3 + si * 1.5; // outer shells slower
          return (
            <motion.g
              key={`e-${si}-${ei}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: [baseAngle, baseAngle + 360] }}
              transition={{
                opacity: { delay: si * 0.15 + ei * 0.05, duration: 0.3 },
                rotate: { delay: si * 0.15, duration, repeat: Infinity, ease: "linear" },
              }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
            >
              <circle
                cx={cx + r}
                cy={cy}
                r={3.8}
                fill={color}
              />
            </motion.g>
          );
        });
      })}

      {/* Shell labels */}
      {shells.map((cnt, si) => {
        const r = nucleusR + (si + 1) * gap;
        return (
          <motion.text
            key={`lbl-${si}`}
            x={cx + r + 5}
            y={cy + 4}
            fontSize="6.5"
            fill={color}
            opacity={0}
            animate={{ opacity: 0.75 }}
            transition={{ delay: si * 0.15 + 0.3 }}
          >
            n={si + 1}({cnt}e⁻)
          </motion.text>
        );
      })}

      {/* Nucleus */}
      <motion.circle
        cx={cx} cy={cy} r={nucleusR}
        fill={color}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
        {symbol}
      </text>
    </svg>
  );
}

// ─── Element Cell ─────────────────────────────────────────────────────────
function ElementCell({
  el, dimmed, highlighted, onClick, onHover,
}: {
  el: ElementData;
  dimmed: boolean;
  highlighted: boolean;
  onClick: () => void;
  onHover: (c: string | null) => void;
}) {
  const hex   = categoryHex[el.category] ?? "#94a3b8";
  const bgCls = categoryColors[el.category] ?? categoryColors["unknown"];

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(el.category)}
      onMouseLeave={() => onHover(null)}
      animate={{
        opacity: dimmed ? 0.12 : 1,
        scale:   highlighted ? 1.07 : 1,
        filter:  highlighted
          ? `drop-shadow(0 0 7px ${hex}cc)`
          : dimmed ? "brightness(0.35)" : "brightness(1)",
      }}
      whileHover={!dimmed ? { scale: 1.18, zIndex: 30 } : {}}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`
        relative ${bgCls} rounded-md text-white cursor-pointer
        flex flex-col items-center justify-center w-full aspect-square
        ring-2 ${stateRing[el.state] ?? "ring-transparent"}
        shadow-md select-none
      `}
      title={`${el.nameBn} — ${el.name}`}
    >
      <span className="text-[8px] opacity-60 self-start pl-0.5 leading-none">{el.atomicNumber}</span>
      <span className="text-[15px] font-bold leading-tight">{el.symbol}</span>
      <span className="text-[7px] opacity-85 leading-none truncate w-full text-center px-0.5">{el.name}</span>
      <span className="text-[6.5px] opacity-55 leading-none">{el.atomicMass.toFixed(2)}</span>
      {/* block badge */}
      <span className="absolute top-0.5 right-0.5 text-[6px] font-bold" style={{ color: hex }}>
        {blockOf[el.category]}
      </span>
    </motion.button>
  );
}

// ─── Element Detail Modal ─────────────────────────────────────────────────
function ElementModal({ el, onClose }: { el: ElementData; onClose: () => void }) {
  const [tab, setTab] = useState<"info" | "shell" | "uses">("info");
  const hex    = categoryHex[el.category] ?? "#94a3b8";
  const bgCls  = categoryColors[el.category] ?? "bg-slate-600";

  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.72, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.72, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        style={{ boxShadow: `0 0 48px ${hex}44` }}
      >
        {/* ── Header ── */}
        <div className={`${bgCls} p-5 relative`}>
          <button onClick={onClose}
            className="absolute top-3 right-3 text-white/60 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-end gap-4">
            <div className="bg-white/15 rounded-2xl px-3 py-1.5 text-center min-w-[60px]">
              <div className="text-xs opacity-70">{el.atomicNumber}</div>
              <div className="text-4xl font-black leading-tight">{el.symbol}</div>
              <div className="text-[10px] opacity-60">{el.atomicMass.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{el.name}</div>
              <div className="text-base text-white/80">{el.nameBn}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{categoryNames[el.category]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${stateColor[el.state]}`}>{stateLabel[el.state]}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs font-mono">{blockOf[el.category]}-block</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-slate-700">
          {([
            { id: "info",  label: "তথ্য",         icon: Info },
            { id: "shell", label: "ইলেকট্রন শেল", icon: Activity },
            { id: "uses",  label: "ব্যবহার",       icon: BookOpen },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-semibold border-b-2 transition-colors ${
                tab === id
                  ? "border-current text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              style={tab === id ? { color: hex, borderColor: hex } : {}}
            >
              <Icon className="w-3 h-3" />{label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <AnimatePresence mode="wait">
            {tab === "info" && (
              <motion.div key="info"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="p-4 space-y-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["পারমাণবিক ভর",       `${el.atomicMass} u`],
                    ["পর্যায় / গ্রুপ",     `${el.period} / ${el.group ?? "—"}`],
                    ["তড়িৎ ঋণাত্মকতা",   String(el.electronegativity ?? "—")],
                    ["জারণ অবস্থা",        el.oxidationStates],
                    ["গলনাঙ্ক",            el.meltingPoint !== null ? `${el.meltingPoint} °C` : "—"],
                    ["স্ফুটনাঙ্ক",         el.boilingPoint !== null ? `${el.boilingPoint} °C` : "—"],
                    ["ঘনত্ব",              el.density !== null ? `${el.density} g/cm³` : "—"],
                    ["আবিষ্কার",           `${el.discoveredBy} (${el.discoveryYear})`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-slate-800 rounded-xl p-2.5">
                      <div className="text-[9px] text-slate-400">{label}</div>
                      <div className="text-white text-xs font-medium mt-0.5 leading-snug">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-[9px] text-slate-400">ইলেকট্রন বিন্যাস</span>
                  </div>
                  <div className="font-mono text-xs text-white bg-slate-900/50 rounded-lg px-2.5 py-2 break-all">
                    {el.electronConfig}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "shell" && (
              <motion.div key="shell"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="p-4"
              >
                <p className="text-[10px] text-slate-400 text-center mb-2">
                  প্রতিটি বিন্দু একটি ইলেকট্রন — কক্ষপথে ঘুরছে
                </p>
                <div className="w-full aspect-square max-w-[200px] mx-auto">
                  <ElectronShellDiagram
                    config={el.electronConfig}
                    symbol={el.symbol}
                    color={hex}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "পর্যায়",   value: el.period,           sub: `${el.period}টি orbit` },
                    { label: "গ্রুপ",     value: el.group ?? "—",     sub: "valence e⁻" },
                    { label: "Block",     value: blockOf[el.category], sub: "অরবিটাল" },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-slate-800 rounded-xl p-2">
                      <div className="text-[9px] text-slate-400">{label}</div>
                      <div className="text-lg font-bold" style={{ color: hex }}>{String(value)}</div>
                      <div className="text-[8px] text-slate-500">{sub}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 bg-slate-800 rounded-xl p-2.5">
                  <div className="text-[9px] text-slate-400 mb-1">ইলেকট্রন বিন্যাস</div>
                  <div className="font-mono text-xs text-white break-all">{el.electronConfig}</div>
                </div>
              </motion.div>
            )}

            {tab === "uses" && (
              <motion.div key="uses"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="p-4 space-y-3"
              >
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FlaskConical className="w-3.5 h-3.5" style={{ color: hex }} />
                    <span className="text-xs text-slate-300 font-medium">ব্যবহার ও প্রয়োগ</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{el.uses}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <Wind className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <div className="text-[9px] text-slate-400">ঘরের তাপমাত্রায়</div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${stateColor[el.state]}`}>
                      {stateLabel[el.state]}
                    </span>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <Droplets className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <div className="text-[9px] text-slate-400">ঘনত্ব</div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {el.density !== null ? `${el.density}` : "—"}
                    </div>
                    <div className="text-[8px] text-slate-500">g/cm³</div>
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

// ─── Main ─────────────────────────────────────────────────────────────────
const periodList = [1,2,3,4,5,6,7];

export default function PeriodicTableClient() {
  const [selected,         setSelected]         = useState<ElementData | null>(null);
  const [filterMode,       setFilterMode]       = useState<FilterMode>("category");
  const [activeFilter,     setActiveFilter]     = useState("all");
  const [hoveredCategory,  setHoveredCategory]  = useState<string | null>(null);

  function matches(el: ElementData) {
    if (activeFilter === "all") return true;
    if (filterMode === "category") return el.category  === activeFilter;
    if (filterMode === "state")    return el.state      === activeFilter;
    if (filterMode === "block")    return blockOf[el.category] === activeFilter;
    if (filterMode === "period")   return String(el.period) === activeFilter;
    return true;
  }

  const isDimmed      = (el: ElementData) =>
    (hoveredCategory != null && el.category !== hoveredCategory) ||
    (activeFilter !== "all" && !matches(el));

  const isHighlighted = (el: ElementData) =>
    (hoveredCategory != null && el.category === hoveredCategory) ||
    (activeFilter !== "all" && matches(el));

  const toggle = (key: string) => setActiveFilter(p => p === key ? "all" : key);

  return (
    <div>
      {/* ── Filter mode tabs ── */}
      <div className="flex justify-center gap-1.5 mb-4 flex-wrap">
        {([
          { id:"category", label:"ক্যাটাগরি",   icon:Layers },
          { id:"state",    label:"অবস্থা",        icon:Droplets },
          { id:"block",    label:"s/p/d/f ব্লক", icon:Activity },
          { id:"period",   label:"পর্যায়",        icon:Zap },
        ] as const).map(({ id, label, icon:Icon }) => (
          <button key={id}
            onClick={() => { setFilterMode(id); setActiveFilter("all"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === id
                ? "gradient-bg text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── Filter chips ── */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4 px-2">
        <button onClick={() => setActiveFilter("all")}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            activeFilter === "all"
              ? "bg-white text-slate-900 shadow"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
        >
          সব
        </button>

        {filterMode === "category" && Object.entries(categoryNames).map(([key, name]) => (
          <button key={key}
            onClick={() => toggle(key)}
            onMouseEnter={() => setHoveredCategory(key)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border-2 ${
              categoryColors[key]
            } text-white ${
              activeFilter === key ? "border-white/80 scale-105" : "border-transparent opacity-70 hover:opacity-100"
            }`}
            style={activeFilter === key ? { boxShadow: `0 0 10px ${categoryHex[key]}88` } : {}}
          >
            {name} ({elements.filter(e => e.category === key).length})
          </button>
        ))}

        {filterMode === "state" && (["solid","liquid","gas","unknown"] as const).map(s => (
          <button key={s} onClick={() => toggle(s)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              activeFilter === s
                ? "bg-white text-slate-900"
                : `${stateColor[s]} opacity-80 hover:opacity-100`
            }`}
          >
            {stateLabel[s]} ({elements.filter(e => e.state === s).length})
          </button>
        ))}

        {filterMode === "block" && ["s","p","d","f"].map(b => (
          <button key={b} onClick={() => toggle(b)}
            className={`px-4 py-1 rounded-full text-[11px] font-bold transition-all ${
              activeFilter === b
                ? "gradient-bg text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {b}-block ({elements.filter(e => blockOf[e.category] === b).length})
          </button>
        ))}

        {filterMode === "period" && periodList.map(p => (
          <button key={p} onClick={() => toggle(String(p))}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
              activeFilter === String(p)
                ? "gradient-bg text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── State ring legend ── */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4 text-[10px] text-slate-500">
        <span>রিং = ঘরের তাপমাত্রায় অবস্থা:</span>
        {(["solid","liquid","gas"] as const).map(s => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`inline-block w-3.5 h-3.5 rounded-full ring-2 bg-slate-800 ${stateRing[s]}`} />
            {stateLabel[s]}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="text-[9px] font-bold text-slate-400 bg-slate-700 rounded px-1">s</span>
          = s-block (card উপরে ডানে)
        </span>
      </div>

      {/* ── THE TABLE ── */}
      <div className="overflow-x-auto pb-4">
        {/* Fixed-width container so mobile can scroll horizontally */}
        <div style={{ minWidth: "980px", padding: "0 8px" }}>

          {/* Column headers */}
          <div className="grid mb-1" style={{ gridTemplateColumns: "24px repeat(18, 1fr)", gap: "3px" }}>
            <div /> {/* row-label spacer */}
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className="text-center text-[10px] text-slate-600 font-mono">{i+1}</div>
            ))}
          </div>

          {/* Rows 1–7 (main table) */}
          {grid.slice(0, 7).map((row, ri) => (
            <div key={ri} className="grid mb-[3px]"
              style={{ gridTemplateColumns: "24px repeat(18, 1fr)", gap: "3px" }}
            >
              {/* Row number */}
              <div className="flex items-center justify-center text-[10px] text-slate-600 font-mono">{ri+1}</div>
              {/* Cells */}
              {row.map((el, ci) =>
                el ? (
                  <ElementCell
                    key={el.atomicNumber}
                    el={el}
                    dimmed={isDimmed(el)}
                    highlighted={isHighlighted(el)}
                    onClick={() => setSelected(el)}
                    onHover={setHoveredCategory}
                  />
                ) : (
                  <div key={ci} />
                )
              )}
            </div>
          ))}

          {/* Gap row label for lanthanides/actinides */}
          <div className="grid my-1" style={{ gridTemplateColumns: "24px repeat(18, 1fr)", gap: "3px" }}>
            <div />
            <div className="col-span-2" />
            <div className="col-span-14 flex items-center justify-center">
              <span className="text-[10px] text-slate-600 border-t border-b border-slate-700/30 w-full text-center py-0.5">
                ↓ ল্যান্থানাইড / অ্যাক্টিনাইড
              </span>
            </div>
            <div className="col-span-2" />
          </div>

          {/* Lanthanides (row 9 in data) */}
          <div className="grid mb-[3px]" style={{ gridTemplateColumns: "24px repeat(18, 1fr)", gap: "3px" }}>
            <div className="flex items-center justify-center text-[10px] text-slate-600 font-mono">6*</div>
            {grid[8].map((el, ci) =>
              el ? (
                <ElementCell
                  key={el.atomicNumber}
                  el={el}
                  dimmed={isDimmed(el)}
                  highlighted={isHighlighted(el)}
                  onClick={() => setSelected(el)}
                  onHover={setHoveredCategory}
                />
              ) : (
                <div key={ci} />
              )
            )}
          </div>

          {/* Actinides (row 10 in data) */}
          <div className="grid" style={{ gridTemplateColumns: "24px repeat(18, 1fr)", gap: "3px" }}>
            <div className="flex items-center justify-center text-[10px] text-slate-600 font-mono">7*</div>
            {grid[9].map((el, ci) =>
              el ? (
                <ElementCell
                  key={el.atomicNumber}
                  el={el}
                  dimmed={isDimmed(el)}
                  highlighted={isHighlighted(el)}
                  onClick={() => setSelected(el)}
                  onHover={setHoveredCategory}
                />
              ) : (
                <div key={ci} />
              )
            )}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-center text-slate-500 text-[11px] mt-3">
        <span className="text-white font-semibold">{elements.filter(matches).length}</span> / ১১৮টি মৌল
        {activeFilter === "all" && (
          <span className="ml-2 opacity-50">· category hover করলে সেই group glow হবে</span>
        )}
      </p>

      {/* Modal */}
      <AnimatePresence>
        {selected && <ElementModal el={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
