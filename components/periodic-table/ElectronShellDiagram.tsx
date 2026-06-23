"use client";

import { motion } from "framer-motion";

/**
 * Parses an electron configuration string into per-shell counts.
 * e.g. "[He] 2s² 2p⁶ 3s¹" → [2, 8, 1]
 */
function parseElectronsPerShell(config: string): number[] {
  // Map superscript digits to regular digits
  const sup: Record<string, number> = {
    "¹":1,"²":2,"³":3,"⁴":4,"⁵":5,"⁶":6,"⁷":7,"⁸":8,"⁹":9,"⁰":0,
  };
  // Core shells for noble gas abbreviations
  const coreShells: Record<string, number[]> = {
    He:[2], Ne:[2,8], Ar:[2,8,8], Kr:[2,8,18,8],
    Xe:[2,8,18,18,8], Rn:[2,8,18,32,18,8],
  };

  const shells: number[] = [];
  let core: number[] = [];

  // Check for noble gas core
  const coreMatch = config.match(/\[([A-Za-z]+)\]/);
  if (coreMatch) {
    core = coreShells[coreMatch[1]] ?? [];
    config = config.replace(/\[[A-Za-z]+\]\s*/, "");
  }

  // Parse remaining orbital tokens, e.g. "3d¹⁰" "4s²"
  const tokenRegex = /(\d+)([spdf])([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/g;
  let match;
  const shellMap: Record<number, number> = {};
  while ((match = tokenRegex.exec(config)) !== null) {
    const n = parseInt(match[1]);
    const count = [...match[3]].reduce((acc, ch) => acc * 10 + (sup[ch] ?? 0), 0);
    shellMap[n] = (shellMap[n] ?? 0) + count;
  }

  // Merge core + valence
  const coreLen = core.length;
  core.forEach((c, i) => { shellMap[i + 1] = (shellMap[i + 1] ?? 0) + c; });
  const maxShell = Math.max(...Object.keys(shellMap).map(Number));
  for (let i = 1; i <= maxShell; i++) {
    shells.push(shellMap[i] ?? 0);
  }
  return shells.length > 0 ? shells : [1];
}

interface Props {
  config: string;
  symbol: string;
  color: string; // Tailwind gradient stop color, e.g. "#ef4444"
}

export function ElectronShellDiagram({ config, symbol, color }: Props) {
  const shells = parseElectronsPerShell(config);
  const maxShells = shells.length;
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const nucleusR = 18;
  const shellSpacing = (size / 2 - nucleusR - 12) / Math.max(maxShells, 1);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" aria-label="Electron shell diagram">
      {/* Shells (orbits) */}
      {shells.map((_, si) => {
        const r = nucleusR + (si + 1) * shellSpacing;
        return (
          <motion.circle
            key={si}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={0.8}
            strokeDasharray="4 3"
            opacity={0.35}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ delay: si * 0.12, duration: 0.4, type: "spring" }}
          />
        );
      })}

      {/* Electrons on each shell */}
      {shells.map((count, si) => {
        const r = nucleusR + (si + 1) * shellSpacing;
        return Array.from({ length: count }).map((_, ei) => {
          const angle = (2 * Math.PI * ei) / count - Math.PI / 2;
          const ex = cx + r * Math.cos(angle);
          const ey = cy + r * Math.sin(angle);
          return (
            <motion.circle
              key={`${si}-${ei}`}
              cx={ex} cy={ey} r={3.5}
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: si * 0.12 + ei * 0.04 + 0.2, duration: 0.3, type: "spring" }}
            />
          );
        });
      })}

      {/* Shell labels (n=1,2,3...) */}
      {shells.map((count, si) => {
        const r = nucleusR + (si + 1) * shellSpacing;
        return (
          <text
            key={`label-${si}`}
            x={cx + r + 4}
            y={cy + 4}
            fontSize="7"
            fill={color}
            opacity={0.7}
          >
            n={si + 1} ({count}e⁻)
          </text>
        );
      })}

      {/* Nucleus */}
      <motion.circle
        cx={cx} cy={cy} r={nucleusR}
        fill={color}
        opacity={0.9}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
        {symbol}
      </text>
    </svg>
  );
}
