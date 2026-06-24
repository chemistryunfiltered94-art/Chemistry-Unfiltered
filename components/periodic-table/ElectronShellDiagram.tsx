"use client";

import { motion } from "framer-motion";

/**
 * Parses electron config string → electrons per shell array.
 * e.g. "[Ne] 3s¹ 3p¹" → [2,8,1] (core Ne + valence)
 */
function parseShells(config: string): number[] {
  const sup: Record<string, number> = {
    "¹":1,"²":2,"³":3,"⁴":4,"⁵":5,"⁶":6,"⁷":7,"⁸":8,"⁹":9,"⁰":0,
  };
  const coreShells: Record<string, number[]> = {
    He:[2], Ne:[2,8], Ar:[2,8,8], Kr:[2,8,18,8],
    Xe:[2,8,18,18,8], Rn:[2,8,18,32,18,8],
  };

  const shellMap: Record<number, number> = {};

  // Noble gas core
  const coreMatch = config.match(/\[([A-Za-z]+)\]/);
  if (coreMatch) {
    (coreShells[coreMatch[1]] ?? []).forEach((v, i) => {
      shellMap[i + 1] = (shellMap[i + 1] ?? 0) + v;
    });
    config = config.replace(/\[[A-Za-z]+\]\s*/, "");
  }

  // Parse remaining tokens: "3d¹⁰" "4s²" etc.
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

interface Props {
  config: string;
  symbol: string;
  color: string;
}

export function ElectronShellDiagram({ config, symbol, color }: Props) {
  const shells = parseShells(config);
  const nucleusSize = 36;
  const minGap = 28; // px between nucleus edge and first orbit
  const orbitGap = 26; // px between orbits

  // Total container size needed
  const maxOrbit = shells.length;
  const containerSize = nucleusSize + minGap * 2 + orbitGap * 2 * (maxOrbit - 1) + 20;
  const cx = containerSize / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: containerSize, height: containerSize, maxWidth: "100%", margin: "0 auto" }}>

      {/* Orbit rings + spinning electron wrapper — pure CSS animation */}
      {shells.map((count, si) => {
        const orbitR = nucleusSize / 2 + minGap + si * orbitGap;
        const orbitDiameter = orbitR * 2;
        const duration = 2.5 + si * 1.2; // outer shells slower

        return (
          <motion.div
            key={si}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: si * 0.12, duration: 0.5, type: "spring" }}
            className="absolute rounded-full flex items-start justify-center"
            style={{
              width: orbitDiameter,
              height: orbitDiameter,
              border: `1px dashed ${color}55`,
              top: cx - orbitR,
              left: cx - orbitR,
            }}
          >
            {/* Electrons evenly spaced on this orbit, all spinning together */}
            {Array.from({ length: count }).map((_, ei) => {
              const angleOffset = (360 / count) * ei;
              return (
                <div
                  key={ei}
                  className="absolute"
                  style={{
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    transform: `rotate(${angleOffset}deg)`,
                    animation: `orbit-spin ${duration}s linear infinite`,
                  }}
                >
                  {/* Electron dot at the top of the orbit ring */}
                  <div
                    style={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 6px ${color}, 0 0 10px ${color}88`,
                      top: -4,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
              );
            })}

            {/* Shell label */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: si * 0.12 + 0.4 }}
              className="absolute text-[7px] font-mono pointer-events-none"
              style={{
                color,
                top: "50%",
                right: -2,
                transform: "translateY(-50%)",
                whiteSpace: "nowrap",
              }}
            >
              n={si + 1}({count}e⁻)
            </motion.span>
          </motion.div>
        );
      })}

      {/* Nucleus */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
        className="absolute flex items-center justify-center rounded-full font-black text-sm text-black z-10"
        style={{
          width: nucleusSize,
          height: nucleusSize,
          background: `radial-gradient(circle, #fff 15%, ${color} 100%)`,
          boxShadow: `0 0 16px ${color}, 0 0 28px ${color}66`,
          top: cx - nucleusSize / 2,
          left: cx - nucleusSize / 2,
        }}
      >
        {symbol}
      </motion.div>

      {/* Global CSS keyframe injected once */}
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(var(--ao, 0deg)); }
          to   { transform: rotate(calc(var(--ao, 0deg) + 360deg)); }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
