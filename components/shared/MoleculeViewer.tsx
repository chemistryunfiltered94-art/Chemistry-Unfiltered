"use client";

// components/shared/MoleculeViewer.tsx
// ড্র্যাগ করে ঘোরানো ও স্ক্রোল করে জুম করা যায় এমন ইন্টারেক্টিভ অণু ভিউয়ার।
// /molecules পেজ এবং Topic পেজের "3D গঠন" সেকশন — দুটোই এই কম্পোনেন্ট শেয়ার করে।

import { useState, useEffect, useRef } from "react";
import { Molecule } from "@/lib/molecules";

export default function MoleculeViewer({ mol, compact }: { mol: Molecule; compact?: boolean }) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale]       = useState(1);
  const [dragging, setDragging] = useState(false);
  const [startX,   setStartX]   = useState(0);
  const draggingRef = useRef(false);

  useEffect(() => { draggingRef.current = dragging; }, [dragging]);

  // Continuous auto-rotation so the molecule always animates, even with no touch/mouse input.
  // Pauses automatically while the user is actively dragging it.
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (!draggingRef.current) {
        setRotation(r => r + 0.4);
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const startDrag = (clientX: number) => { setDragging(true); setStartX(clientX); };
  const moveDrag   = (clientX: number) => { if (dragging) { setRotation(r => r + (clientX-startX)*0.5); setStartX(clientX); } };
  const endDrag    = () => setDragging(false);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden select-none">
      {/* SVG Canvas */}
      <div className="relative"
        onMouseDown={e => startDrag(e.clientX)}
        onMouseMove={e => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={e => startDrag(e.touches[0].clientX)}
        onTouchMove={e => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
        onWheel={e => setScale(s => Math.min(2, Math.max(0.5, s - e.deltaY*0.001)))}
        style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      >
        <svg viewBox="0 0 200 180" className={compact ? "w-full max-h-64" : "w-full"} style={{ transform:`scale(${scale})`, transformOrigin:"center" }}>
          {/* Bonds */}
          {mol.bonds.map(([a,b], i) => {
            const A = mol.atoms[a], B = mol.atoms[b];
            const angle = rotation * Math.PI / 180;
            const ax = A.x + Math.sin(i*0.3+angle)*3;
            const bx = B.x + Math.sin(i*0.3+angle)*3;
            return <line key={i} x1={ax} y1={A.y} x2={bx} y2={B.y} stroke="#475569" strokeWidth="3" strokeLinecap="round"/>;
          })}
          {/* Atoms */}
          {mol.atoms.map((atom, i) => {
            const angle = rotation * Math.PI / 180;
            const x = atom.x + Math.sin(i*0.5+angle)*5;
            return (
              <g key={i}>
                <circle cx={x} cy={atom.y} r={atom.r} fill={atom.color} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x={x} y={atom.y+4} textAnchor="middle" fill="white" fontSize={atom.r*0.9} fontWeight="bold">{atom.el}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="px-4 pb-3 text-center">
        <p className="text-xs text-slate-500">↔ ড্র্যাগ করো • স্ক্রোল করে জুম করো</p>
      </div>
    </div>
  );
}
