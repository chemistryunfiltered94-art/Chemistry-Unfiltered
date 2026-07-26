"use client";

import { useState } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  elements, categoryColors, categoryNames, ElementData,
} from "./elementData";
import { getExtendedData } from "./elementDataExtended";
import { getAbundance } from "./abundanceData";
import {
  X, Zap, FlaskConical, Info, Layers, Wind, Droplets, Activity, BookOpen,
  Atom, History, Radiation, Ruler, Scale, Palette, Search, Check,
} from "lucide-react";

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

// ─── Trend Explorer property definitions ───────────────────────────────────
type TrendKey =
  | "electronegativity" | "atomicRadius" | "ionizationEnergy"
  | "density" | "meltingPoint" | "boilingPoint";

interface TrendDef {
  label: string;
  unit: string;
  get: (el: ElementData) => number | null;
}

const trendDefs: Record<TrendKey, TrendDef> = {
  electronegativity: {
    label: "তড়িৎ ঋণাত্মকতা",
    unit: "",
    get: (el) => el.electronegativity,
  },
  atomicRadius: {
    label: "পারমাণবিক ব্যাসার্ধ",
    unit: "pm",
    get: (el) => getExtendedData(el.atomicNumber)?.radii.atomic ?? null,
  },
  ionizationEnergy: {
    label: "১ম আয়নীকরণ শক্তি",
    unit: "kJ/mol",
    get: (el) => getExtendedData(el.atomicNumber)?.ionizationEnergies.first ?? null,
  },
  density: {
    label: "ঘনত্ব",
    unit: "g/cm³",
    get: (el) => el.density,
  },
  meltingPoint: {
    label: "গলনাঙ্ক",
    unit: "°C",
    get: (el) => el.meltingPoint,
  },
  boilingPoint: {
    label: "স্ফুটনাঙ্ক",
    unit: "°C",
    get: (el) => el.boilingPoint,
  },
};

// Blue (low) → Yellow (mid) → Red (high) heatmap scale
function heatColor(t: number): string {
  // t is 0..1
  const stops: [number, string][] = [
    [0,    "#1e3a8a"], // deep blue
    [0.25, "#2563eb"], // blue
    [0.5,  "#eab308"], // yellow
    [0.75, "#f97316"], // orange
    [1,    "#dc2626"], // red
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (t >= t0 && t <= t1) {
      const localT = (t - t0) / (t1 - t0 || 1);
      return lerpColor(c0, c1, localT);
    }
  }
  return stops[stops.length - 1][1];
}

function lerpColor(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1,3),16), parseInt(a.slice(3,5),16), parseInt(a.slice(5,7),16)];
  const pb = [parseInt(b.slice(1,3),16), parseInt(b.slice(3,5),16), parseInt(b.slice(5,7),16)];
  const rgb = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

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
  el, dimmed, highlighted, onClick, onHover, compareSelected, heatColorValue, heatValueLabel,
}: {
  el: ElementData;
  dimmed: boolean;
  highlighted: boolean;
  onClick: () => void;
  onHover: (c: string | null) => void;
  compareSelected?: boolean;
  heatColorValue?: string | null; // when set, overrides category background with this color
  heatValueLabel?: string | null; // shown in title tooltip when in heatmap mode
}) {
  const hex   = categoryHex[el.category] ?? "#94a3b8";
  const bgCls = categoryColors[el.category] ?? categoryColors["unknown"];
  const inHeatMode = heatColorValue !== undefined;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(el.category)}
      onMouseLeave={() => onHover(null)}
      animate={{
        opacity: dimmed ? 0.12 : (inHeatMode && heatColorValue === null ? 0.15 : 1),
        scale:   highlighted ? 1.07 : compareSelected ? 1.1 : 1,
        filter:  highlighted
          ? `drop-shadow(0 0 7px ${hex}cc)`
          : compareSelected ? `drop-shadow(0 0 8px #ffffffcc)`
          : dimmed ? "brightness(0.35)" : "brightness(1)",
      }}
      whileHover={!dimmed ? { scale: 1.18, zIndex: 30 } : {}}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      style={inHeatMode && heatColorValue ? { backgroundColor: heatColorValue } : undefined}
      className={`
        relative ${inHeatMode ? "bg-slate-800" : bgCls} rounded-md text-white cursor-pointer
        flex flex-col items-center justify-center w-full aspect-square
        ring-2 ${compareSelected ? "ring-white" : stateRing[el.state] ?? "ring-transparent"}
        shadow-md select-none
      `}
      title={inHeatMode ? `${el.nameBn}: ${heatValueLabel ?? "ডেটা নেই"}` : `${el.nameBn} — ${el.name}`}
    >
      {compareSelected && (
        <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-white text-slate-900 text-[8px] font-bold flex items-center justify-center shadow z-10">
          ✓
        </span>
      )}
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
  const [tab, setTab] = useState<"info" | "shell" | "chemical" | "uses" | "discovery">("info");
  const hex    = categoryHex[el.category] ?? "#94a3b8";
  const bgCls  = categoryColors[el.category] ?? "bg-slate-600";
  const ext    = getExtendedData(el.atomicNumber);

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
        <div className="flex border-b border-slate-700 overflow-x-auto">
          {([
            { id: "info",      label: "তথ্য",      icon: Info },
            { id: "shell",     label: "শেল",        icon: Activity },
            { id: "chemical",  label: "ধর্ম",        icon: Atom },
            { id: "uses",      label: "ব্যবহার",     icon: BookOpen },
            { id: "discovery", label: "ইতিহাস",     icon: History },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 min-w-[64px] flex items-center justify-center gap-1 py-2.5 text-[10.5px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
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

            {tab === "chemical" && (
              <motion.div key="chemical"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="p-4 space-y-3"
              >
                {ext ? (
                  <>
                    {/* Radii */}
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Ruler className="w-3.5 h-3.5" style={{ color: hex }} />
                        <span className="text-[9px] text-slate-400 font-medium">পারমাণবিক ব্যাসার্ধ (pm)</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        {[
                          ["Atomic", ext.radii.atomic],
                          ["Covalent", ext.radii.covalent],
                          ["Ionic", ext.radii.ionic],
                          ["VdW", ext.radii.vanDerWaals],
                        ].map(([label, val]) => (
                          <div key={label as string} className="bg-slate-900/50 rounded-lg py-1.5">
                            <div className="text-[8px] text-slate-500">{label}</div>
                            <div className="text-xs font-semibold text-white">{val ?? "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ionization energies */}
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-[9px] text-slate-400 font-medium">আয়নীকরণ শক্তি (kJ/mol)</span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          ["১ম", ext.ionizationEnergies.first],
                          ["২য়", ext.ionizationEnergies.second],
                          ["৩য়", ext.ionizationEnergies.third],
                        ].map(([label, val]) => {
                          const numVal = typeof val === "number" ? val : null;
                          const maxVal = ext.ionizationEnergies.third ?? ext.ionizationEnergies.second ?? ext.ionizationEnergies.first ?? 1;
                          const pct = numVal ? Math.max(6, Math.min(100, (numVal / maxVal) * 100)) : 0;
                          return (
                            <div key={label as string} className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-500 w-6">{label}</span>
                              <div className="flex-1 h-3 bg-slate-900/60 rounded-full overflow-hidden">
                                {numVal !== null && (
                                  <div
                                    className="h-full rounded-full"
                                    style={{ width: `${pct}%`, backgroundColor: hex }}
                                  />
                                )}
                              </div>
                              <span className="text-[9px] text-white w-14 text-right font-mono">
                                {numVal !== null ? numVal.toLocaleString() : "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Electron affinity + hardness + crystal structure */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-800 rounded-xl p-2.5">
                        <div className="text-[9px] text-slate-400">ইলেকট্রন অ্যাফিনিটি</div>
                        <div className="text-white text-xs font-medium mt-0.5">
                          {ext.electronAffinity !== null ? `${ext.electronAffinity} kJ/mol` : "—"}
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2.5">
                        <div className="text-[9px] text-slate-400">কাঠিন্য (Mohs)</div>
                        <div className="text-white text-xs font-medium mt-0.5">
                          {ext.hardnessMohs !== null ? ext.hardnessMohs : "—"}
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2.5 col-span-2">
                        <div className="text-[9px] text-slate-400">স্ফটিক গঠন</div>
                        <div className="text-white text-xs font-medium mt-0.5 leading-snug">{ext.crystalStructure}</div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2.5">
                        <div className="text-[9px] text-slate-400">গলনতাপ</div>
                        <div className="text-white text-xs font-medium mt-0.5">
                          {ext.heatOfFusion !== null ? `${ext.heatOfFusion} kJ/mol` : "—"}
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2.5">
                        <div className="text-[9px] text-slate-400">বাষ্পীভবন তাপ</div>
                        <div className="text-white text-xs font-medium mt-0.5">
                          {ext.heatOfVaporization !== null ? `${ext.heatOfVaporization} kJ/mol` : "—"}
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2.5 col-span-2">
                        <div className="text-[9px] text-slate-400">মোলার আয়তন</div>
                        <div className="text-white text-xs font-medium mt-0.5">
                          {ext.molarVolume !== null ? `${ext.molarVolume} cm³/mol` : "—"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-xs text-center py-6">এই মৌলের বিস্তারিত রাসায়নিক ডেটা এখনো যোগ করা হয়নি।</p>
                )}
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
            {tab === "discovery" && (
              <motion.div key="discovery"
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="p-4 space-y-3"
              >
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <History className="w-3.5 h-3.5" style={{ color: hex }} />
                    <span className="text-xs text-slate-300 font-medium">আবিষ্কারের ইতিহাস</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-slate-400">আবিষ্কারক</div>
                      <div className="text-white text-sm font-medium">{el.discoveredBy}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[9px] text-slate-400">সাল</div>
                        <div className="text-white text-sm font-medium">{el.discoveryYear}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400">স্থান</div>
                        <div className="text-white text-sm font-medium">{ext?.discovery.place ?? "—"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {ext && (
                  <div className="bg-slate-800 rounded-xl p-3">
                    <div className="text-[9px] text-slate-400 mb-1">নামের উৎস</div>
                    <p className="text-white text-xs leading-relaxed">{ext.discovery.nameOrigin}</p>
                  </div>
                )}

                {(() => {
                  const ab = getAbundance(el.atomicNumber);
                  if (!ab || (ab.crustPpm === null && ab.universePpm === null)) return null;
                  // Log-scale bars: use log10(ppm+epsilon) mapped against a fixed practical range
                  const logScale = (v: number | null, maxLog: number) => {
                    if (v === null || v <= 0) return 0;
                    const logV = Math.log10(v);
                    const minLog = -12; // covers down to ~1e-12 ppm (rarest natural elements)
                    const pct = ((logV - minLog) / (maxLog - minLog)) * 100;
                    return Math.max(2, Math.min(100, pct));
                  };
                  const crustPct = logScale(ab.crustPpm, 6);      // O is ~461,000 ppm ≈ 5.66 →6
                  const universePct = logScale(ab.universePpm, 7); // H is 10,000,000 ppm = 7

                  return (
                    <div className="bg-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Layers className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-[9px] text-slate-400 font-medium">আপেক্ষিক প্রাচুর্য (লগ-স্কেল)</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                            <span>পৃথিবীর ভূত্বকে</span>
                            <span className="font-mono text-slate-300">
                              {ab.crustPpm !== null ? `${ab.crustPpm} ppm` : "প্রাকৃতিক নয়"}
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-900/60 rounded-full overflow-hidden">
                            {ab.crustPpm !== null && (
                              <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400" style={{ width: `${crustPct}%` }} />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                            <span>মহাবিশ্বে</span>
                            <span className="font-mono text-slate-300">
                              {ab.universePpm !== null ? `${ab.universePpm} ppm` : "প্রাকৃতিক নয়"}
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-900/60 rounded-full overflow-hidden">
                            {ab.universePpm !== null && (
                              <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400" style={{ width: `${universePct}%` }} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {ext && ext.notableIsotopes.length > 0 && (
                  <div className="bg-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Radiation className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-[9px] text-slate-400 font-medium">উল্লেখযোগ্য আইসোটোপ</span>
                    </div>
                    <div className="space-y-1.5">
                      {ext.notableIsotopes.map((iso) => (
                        <div key={iso.symbol} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-2.5 py-1.5">
                          <span className="text-xs font-mono text-white">{iso.symbol}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                            iso.type === "stable"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-orange-500/20 text-orange-300"
                          }`}>
                            {iso.type === "stable" ? (iso.abundance ?? "স্থিতিশীল") : (iso.halfLife ?? "তেজস্ক্রিয়")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Compare Drawer ─────────────────────────────────────────────────────
const compareRows: {
  label: string;
  get: (el: ElementData, ext: ReturnType<typeof getExtendedData>) => string;
}[] = [
  { label: "প্রতীক", get: (el) => el.symbol },
  { label: "পারমাণবিক ভর", get: (el) => `${el.atomicMass} u` },
  { label: "পর্যায় / গ্রুপ", get: (el) => `${el.period} / ${el.group ?? "—"}` },
  { label: "তড়িৎ ঋণাত্মকতা", get: (el) => String(el.electronegativity ?? "—") },
  { label: "গলনাঙ্ক", get: (el) => (el.meltingPoint !== null ? `${el.meltingPoint} °C` : "—") },
  { label: "স্ফুটনাঙ্ক", get: (el) => (el.boilingPoint !== null ? `${el.boilingPoint} °C` : "—") },
  { label: "ঘনত্ব", get: (el) => (el.density !== null ? `${el.density} g/cm³` : "—") },
  { label: "পারমাণবিক ব্যাসার্ধ", get: (_el, ext) => (ext?.radii.atomic !== null && ext?.radii.atomic !== undefined ? `${ext.radii.atomic} pm` : "—") },
  { label: "১ম আয়নীকরণ শক্তি", get: (_el, ext) => (ext?.ionizationEnergies.first !== null && ext?.ionizationEnergies.first !== undefined ? `${ext.ionizationEnergies.first} kJ/mol` : "—") },
  { label: "জারণ অবস্থা", get: (el) => el.oxidationStates },
];

// Numeric extractor used only for the mini bar-chart highlight (not displayed as text)
function numericValue(el: ElementData, ext: ReturnType<typeof getExtendedData>, label: string): number | null {
  switch (label) {
    case "পারমাণবিক ভর": return el.atomicMass;
    case "তড়িৎ ঋণাত্মকতা": return el.electronegativity;
    case "গলনাঙ্ক": return el.meltingPoint;
    case "স্ফুটনাঙ্ক": return el.boilingPoint;
    case "ঘনত্ব": return el.density;
    case "পারমাণবিক ব্যাসার্ধ": return ext?.radii.atomic ?? null;
    case "১ম আয়নীকরণ শক্তি": return ext?.ionizationEnergies.first ?? null;
    default: return null;
  }
}

function CompareDrawer({ elements: compared, onClose, onRemove }: {
  elements: ElementData[];
  onClose: () => void;
  onRemove: (atomicNumber: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-300" />
            <span className="text-white font-semibold text-sm">মৌল তুলনা</span>
            <span className="text-slate-500 text-xs">({compared.length}/৪)</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "70vh" }}>
          <div style={{ minWidth: compared.length > 1 ? `${140 + compared.length * 110}px` : "100%" }}>
            {/* Element header row */}
            <div
              className="grid sticky top-0 bg-slate-900 z-10 border-b border-slate-700"
              style={{ gridTemplateColumns: `140px repeat(${compared.length}, 1fr)` }}
            >
              <div />
              {compared.map((el) => {
                const bgCls = categoryColors[el.category] ?? "bg-slate-600";
                return (
                  <div key={el.atomicNumber} className={`${bgCls} p-2.5 relative`}>
                    <button
                      onClick={() => onRemove(el.atomicNumber)}
                      className="absolute top-1 right-1 text-white/60 hover:text-white bg-black/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="text-center">
                      <div className="text-lg font-black text-white">{el.symbol}</div>
                      <div className="text-[9px] text-white/80 truncate">{el.nameBn}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data rows */}
            {compareRows.map((row) => {
              const values = compared.map((el) => ({
                el,
                text: row.get(el, getExtendedData(el.atomicNumber)),
                num: numericValue(el, getExtendedData(el.atomicNumber), row.label),
              }));
              const maxNum = Math.max(...values.map(v => v.num ?? -Infinity));
              const hasNums = values.some(v => v.num !== null) && compared.length > 1;

              return (
                <div
                  key={row.label}
                  className="grid border-b border-slate-800"
                  style={{ gridTemplateColumns: `140px repeat(${compared.length}, 1fr)` }}
                >
                  <div className="p-2.5 text-[10px] text-slate-400 font-medium flex items-center">{row.label}</div>
                  {values.map(({ el, text, num }) => {
                    const isMax = hasNums && num !== null && num === maxNum;
                    return (
                      <div
                        key={el.atomicNumber}
                        className={`p-2.5 text-xs text-center flex items-center justify-center ${
                          isMax ? "text-white font-bold" : "text-slate-300"
                        }`}
                      >
                        {isMax && <span className="mr-1 text-amber-400">▲</span>}
                        {text}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 text-center text-[10px] text-slate-500 border-t border-slate-800">
          ▲ = সর্বোচ্চ মান (২+ মৌল নির্বাচন করলে দেখা যাবে)
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Discovery Timeline ─────────────────────────────────────────────────────
// আবিষ্কারের সাল অনুযায়ী একটা স্ক্রলযোগ্য অনুভূমিক টাইমলাইন।
// "প্রাচীন" (ancient) মৌলগুলোকে একটা নির্দিষ্ট early slot এ রাখা হয়েছে, বাকিরা প্রকৃত সাল অনুযায়ী সাজানো।
function parseDiscoveryYear(yearStr: string): number {
  if (yearStr.includes("প্রাচীন")) return -3000; // ancient elements placed before recorded discovery years
  const n = parseInt(yearStr.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function DiscoveryTimeline({ onSelect }: { onSelect: (el: ElementData) => void }) {
  const sorted = [...elements].sort(
    (a, b) => parseDiscoveryYear(a.discoveryYear) - parseDiscoveryYear(b.discoveryYear)
  );

  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <History className="w-4 h-4 text-slate-300" />
        <span className="text-white font-semibold text-sm">আবিষ্কারের সময়রেখা</span>
        <span className="text-slate-500 text-[10px]">({sorted.length}টি মৌল, সাল অনুযায়ী)</span>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex items-end gap-1.5" style={{ minWidth: `${sorted.length * 34}px` }}>
          {sorted.map((el) => {
            const bgCls = categoryColors[el.category] ?? "bg-slate-600";
            const isAncient = el.discoveryYear.includes("প্রাচীন");
            return (
              <button
                key={el.atomicNumber}
                onClick={() => onSelect(el)}
                className="flex flex-col items-center gap-1 group shrink-0"
                title={`${el.nameBn} — ${el.discoveryYear}`}
              >
                <span className={`${bgCls} w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow group-hover:scale-125 transition-transform`}>
                  {el.symbol}
                </span>
                <span className="text-[8px] text-slate-500 font-mono whitespace-nowrap">
                  {isAncient ? "প্রাচীন" : el.discoveryYear}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
const periodList = [1,2,3,4,5,6,7];

export default function PeriodicTableClient() {
  const [selected,         setSelected]         = useState<ElementData | null>(null);
  const [hoveredCategory,  setHoveredCategory]  = useState<string | null>(null);
  const [compareMode,      setCompareMode]      = useState(false);
  const [compareIds,       setCompareIds]       = useState<number[]>([]);
  const [showCompare,      setShowCompare]      = useState(false);
  const [trendKey,         setTrendKey]         = useState<TrendKey | null>(null);

  // ── Multi-filter state (Phase 5): each dimension holds its own multi-select set ──
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [activeStates,     setActiveStates]     = useState<Set<string>>(new Set());
  const [activeBlocks,     setActiveBlocks]     = useState<Set<string>>(new Set());
  const [activePeriods,    setActivePeriods]    = useState<Set<number>>(new Set());
  const [filterPanelTab,   setFilterPanelTab]   = useState<FilterMode>("category");

  // ── Smart search state ──
  const [searchQuery,      setSearchQuery]      = useState("");
  const [searchFocused,    setSearchFocused]    = useState(false);
  const [jumpedId,         setJumpedId]         = useState<number | null>(null);

  const MAX_COMPARE = 4;

  function toggleInSet<T>(setFn: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) {
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function clearAllFilters() {
    setActiveCategories(new Set());
    setActiveStates(new Set());
    setActiveBlocks(new Set());
    setActivePeriods(new Set());
  }

  const totalActiveFilters =
    activeCategories.size + activeStates.size + activeBlocks.size + activePeriods.size;

  function handleCellClick(el: ElementData) {
    if (trendKey) {
      setSelected(el); // in trend mode, clicking still opens detail modal
      return;
    }
    if (!compareMode) {
      setSelected(el);
      return;
    }
    setCompareIds((prev) => {
      if (prev.includes(el.atomicNumber)) {
        return prev.filter((id) => id !== el.atomicNumber);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, el.atomicNumber];
    });
  }

  function toggleCompareMode() {
    setTrendKey(null); // compare and trend modes are mutually exclusive
    setCompareMode((prev) => {
      if (prev) setCompareIds([]); // exiting compare mode clears selection
      return !prev;
    });
  }

  function selectTrend(key: TrendKey) {
    setCompareMode(false);
    setCompareIds([]);
    setTrendKey((prev) => (prev === key ? null : key));
  }

  // Compute min/max for the active trend property, for normalizing the heatmap
  const trendRange = (() => {
    if (!trendKey) return null;
    const def = trendDefs[trendKey];
    const values = elements
      .map((el) => def.get(el))
      .filter((v): v is number => v !== null);
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  })();

  function getHeatColorFor(el: ElementData): string | null {
    if (!trendKey || !trendRange) return null;
    const val = trendDefs[trendKey].get(el);
    if (val === null) return null;
    const { min, max } = trendRange;
    const t = max === min ? 0.5 : (val - min) / (max - min);
    return heatColor(t);
  }

  function getHeatLabelFor(el: ElementData): string | null {
    if (!trendKey) return null;
    const def = trendDefs[trendKey];
    const val = def.get(el);
    if (val === null) return null;
    return `${val}${def.unit ? " " + def.unit : ""}`;
  }

  const comparedElements = compareIds
    .map((id) => elements.find((e) => e.atomicNumber === id))
    .filter((e): e is ElementData => e != null);

  // ── Combined multi-filter match (AND across dimensions, OR within each dimension) ──
  function matches(el: ElementData) {
    if (activeCategories.size > 0 && !activeCategories.has(el.category)) return false;
    if (activeStates.size > 0 && !activeStates.has(el.state)) return false;
    if (activeBlocks.size > 0 && !activeBlocks.has(blockOf[el.category])) return false;
    if (activePeriods.size > 0 && !activePeriods.has(el.period)) return false;
    return true;
  }

  const isFilterActive = totalActiveFilters > 0;

  const isDimmed      = (el: ElementData) =>
    (hoveredCategory != null && el.category !== hoveredCategory) ||
    (isFilterActive && !matches(el));

  const isHighlighted = (el: ElementData) =>
    (hoveredCategory != null && el.category === hoveredCategory) ||
    (isFilterActive && matches(el)) ||
    (jumpedId === el.atomicNumber);

  // ── Smart search: find matching elements by name (bn/en), symbol, or atomic number ──
  const searchResults = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return elements
      .filter((el) =>
        el.name.toLowerCase().includes(q) ||
        el.nameBn.includes(searchQuery.trim()) ||
        el.symbol.toLowerCase() === q ||
        String(el.atomicNumber) === q
      )
      .slice(0, 8);
  })();

  function jumpToElement(el: ElementData) {
    setSearchQuery("");
    setSearchFocused(false);
    setJumpedId(el.atomicNumber);
    setSelected(el);
    // clear the temporary highlight after a moment
    setTimeout(() => setJumpedId((prev) => (prev === el.atomicNumber ? null : prev)), 2000);
  }

  return (
    <div>
      {/* ── Compare mode toggle ── */}
      <div className="flex justify-center mb-3">
        <button
          onClick={toggleCompareMode}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            compareMode
              ? "bg-white text-slate-900 shadow-lg"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          {compareMode ? "তুলনা মোড চালু (মৌল সিলেক্ট করুন)" : "মৌল তুলনা করুন"}
        </button>
      </div>

      {/* ── Trend Explorer ── */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="flex items-center gap-1 text-[11px] text-slate-500 mr-1">
            <Palette className="w-3.5 h-3.5" />ট্রেন্ড:
          </span>
          {(Object.entries(trendDefs) as [TrendKey, TrendDef][]).map(([key, def]) => (
            <button
              key={key}
              onClick={() => selectTrend(key)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                trendKey === key
                  ? "bg-white text-slate-900 shadow"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {def.label}
            </button>
          ))}
          {trendKey && (
            <button
              onClick={() => setTrendKey(null)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30"
            >
              বন্ধ করুন ✕
            </button>
          )}
        </div>

        {/* Heatmap legend */}
        {trendKey && trendRange && (
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>{trendRange.min}{trendDefs[trendKey].unit ? ` ${trendDefs[trendKey].unit}` : ""}</span>
            <div
              className="w-32 h-2.5 rounded-full"
              style={{ background: "linear-gradient(to right, #1e3a8a, #2563eb, #eab308, #f97316, #dc2626)" }}
            />
            <span>{trendRange.max}{trendDefs[trendKey].unit ? ` ${trendDefs[trendKey].unit}` : ""}</span>
            <span className="ml-1 opacity-60">(ধূসর = ডেটা নেই)</span>
          </div>
        )}
      </div>

      {/* ── Smart Search ── */}
      <div className="flex justify-center mb-4 px-2">
        <div className="relative w-full max-w-xs">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3.5 py-2">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="নাম, প্রতীক বা পারমাণবিক সংখ্যা লিখুন…"
              className="bg-transparent outline-none text-xs text-white placeholder:text-slate-500 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-500 hover:text-white shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute top-full mt-1.5 w-full bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-40 max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((el) => {
                  const bgCls = categoryColors[el.category] ?? "bg-slate-600";
                  return (
                    <button
                      key={el.atomicNumber}
                      onClick={() => jumpToElement(el)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-700 text-left transition-colors"
                    >
                      <span className={`${bgCls} w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                        {el.symbol}
                      </span>
                      <span className="text-xs text-white">{el.nameBn}</span>
                      <span className="text-[10px] text-slate-500">{el.name}</span>
                      <span className="ml-auto text-[10px] text-slate-500 font-mono">#{el.atomicNumber}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-3 text-[11px] text-slate-500 text-center">কোনো মৌল পাওয়া যায়নি</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Filter panel tabs ── */}
      <div className="flex justify-center gap-1.5 mb-4 flex-wrap">
        {([
          { id:"category", label:"ক্যাটাগরি",   icon:Layers,   count: activeCategories.size },
          { id:"state",    label:"অবস্থা",        icon:Droplets, count: activeStates.size },
          { id:"block",    label:"s/p/d/f ব্লক", icon:Activity, count: activeBlocks.size },
          { id:"period",   label:"পর্যায়",        icon:Zap,      count: activePeriods.size },
        ] as const).map(({ id, label, icon:Icon, count }) => (
          <button key={id}
            onClick={() => setFilterPanelTab(id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterPanelTab === id
                ? "gradient-bg text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >            <Icon className="w-3.5 h-3.5" />{label}
            {count > 0 && (
              <span className="ml-0.5 bg-white/90 text-slate-900 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Multi-select filter chips (AND across dimensions, OR within one) ── */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-2 px-2">
        {filterPanelTab === "category" && Object.entries(categoryNames).map(([key, name]) => {
          const active = activeCategories.has(key);
          return (
            <button key={key}
              onClick={() => toggleInSet(setActiveCategories, key)}
              onMouseEnter={() => setHoveredCategory(key)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border-2 ${
                categoryColors[key]
              } text-white ${
                active ? "border-white/80 scale-105" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={active ? { boxShadow: `0 0 10px ${categoryHex[key]}88` } : {}}
            >
              {active && <Check className="w-3 h-3" />}
              {name} ({elements.filter(e => e.category === key).length})
            </button>
          );
        })}

        {filterPanelTab === "state" && (["solid","liquid","gas","unknown"] as const).map(s => {
          const active = activeStates.has(s);
          return (
            <button key={s} onClick={() => toggleInSet<string>(setActiveStates, s)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                active
                  ? "bg-white text-slate-900"
                  : `${stateColor[s]} opacity-80 hover:opacity-100`
              }`}
            >
              {active && <Check className="w-3 h-3" />}
              {stateLabel[s]} ({elements.filter(e => e.state === s).length})
            </button>
          );
        })}

        {filterPanelTab === "block" && ["s","p","d","f"].map(b => {
          const active = activeBlocks.has(b);
          return (
            <button key={b} onClick={() => toggleInSet(setActiveBlocks, b)}
              className={`flex items-center gap-1 px-4 py-1 rounded-full text-[11px] font-bold transition-all ${
                active
                  ? "gradient-bg text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {active && <Check className="w-3 h-3" />}
              {b}-block ({elements.filter(e => blockOf[e.category] === b).length})
            </button>
          );
        })}

        {filterPanelTab === "period" && periodList.map(p => {
          const active = activePeriods.has(p);
          return (
            <button key={p} onClick={() => toggleInSet(setActivePeriods, p)}
              className={`flex items-center justify-center gap-0.5 w-8 h-8 rounded-full text-xs font-bold transition-all ${
                active
                  ? "gradient-bg text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* ── Active filter summary (shows AND logic across dimensions) ── */}
      {isFilterActive && (
        <div className="flex items-center justify-center gap-2 mb-4 text-[11px] text-slate-400">
          <span>সক্রিয় ফিল্টার: {totalActiveFilters}টি (AND লজিক)</span>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 font-medium"
          >
            <X className="w-3 h-3" />সব ফিল্টার মুছুন
          </button>
        </div>
      )}

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
                    onClick={() => handleCellClick(el)}
                    onHover={setHoveredCategory}
                    compareSelected={compareIds.includes(el.atomicNumber)}
                    heatColorValue={trendKey ? getHeatColorFor(el) : undefined}
                    heatValueLabel={trendKey ? getHeatLabelFor(el) : undefined}
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
                  onClick={() => handleCellClick(el)}
                  onHover={setHoveredCategory}
                  compareSelected={compareIds.includes(el.atomicNumber)}
                  heatColorValue={trendKey ? getHeatColorFor(el) : undefined}
                  heatValueLabel={trendKey ? getHeatLabelFor(el) : undefined}
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
                  onClick={() => handleCellClick(el)}
                  onHover={setHoveredCategory}
                  compareSelected={compareIds.includes(el.atomicNumber)}
                  heatColorValue={trendKey ? getHeatColorFor(el) : undefined}
                  heatValueLabel={trendKey ? getHeatLabelFor(el) : undefined}
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
        {!isFilterActive && (
          <span className="ml-2 opacity-50">· category hover করলে সেই group glow হবে</span>
        )}
      </p>

      {/* Discovery Timeline */}
      <DiscoveryTimeline onSelect={(el) => setSelected(el)} />

      {/* Modal */}
      <AnimatePresence>
        {selected && <ElementModal el={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Floating compare selection bar */}
      <AnimatePresence>
        {compareMode && compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-700 rounded-full shadow-2xl px-4 py-2.5 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {comparedElements.map((el) => (
                <div
                  key={el.atomicNumber}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-slate-900 ${categoryColors[el.category] ?? "bg-slate-600"}`}
                  title={el.nameBn}
                >
                  {el.symbol}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-400">{compareIds.length}/{MAX_COMPARE} নির্বাচিত</span>
            <button
              onClick={() => setShowCompare(true)}
              disabled={compareIds.length < 2}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                compareIds.length >= 2
                  ? "bg-white text-slate-900 hover:bg-slate-100"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              তুলনা দেখুন
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Drawer */}
      <AnimatePresence>
        {showCompare && comparedElements.length >= 2 && (
          <CompareDrawer
            elements={comparedElements}
            onClose={() => setShowCompare(false)}
            onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
