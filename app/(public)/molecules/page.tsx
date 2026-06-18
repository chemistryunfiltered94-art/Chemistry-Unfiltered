"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Atom } from "lucide-react";

const molecules = [
  { id:"water",   name:"Water",   nameBn:"পানি",               formula:"H₂O",       desc:"সার্বজনীন দ্রাবক। দুটি H-O-H বন্ধন, কোণ ১০৪.৫°",   atoms:[{el:"O",x:100,y:80,r:22,color:"#ef4444"},{el:"H",x:65,y:120,r:14,color:"#94a3b8"},{el:"H",x:135,y:120,r:14,color:"#94a3b8"}], bonds:[[0,1],[0,2]] },
  { id:"methane",  name:"Methane", nameBn:"মিথেন",              formula:"CH₄",       desc:"প্রাকৃতিক গ্যাসের মূল উপাদান। টেট্রাহেড্রাল গঠন।", atoms:[{el:"C",x:100,y:90,r:20,color:"#64748b"},{el:"H",x:60,y:60,r:13,color:"#94a3b8"},{el:"H",x:140,y:60,r:13,color:"#94a3b8"},{el:"H",x:60,y:120,r:13,color:"#94a3b8"},{el:"H",x:140,y:120,r:13,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3],[0,4]] },
  { id:"ammonia",  name:"Ammonia", nameBn:"অ্যামোনিয়া",        formula:"NH₃",       desc:"হেবার পদ্ধতিতে তৈরি। ত্রিকোণাকার পিরামিড গঠন।",   atoms:[{el:"N",x:100,y:75,r:20,color:"#3b82f6"},{el:"H",x:65,y:115,r:13,color:"#94a3b8"},{el:"H",x:135,y:115,r:13,color:"#94a3b8"},{el:"H",x:100,y:130,r:13,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3]] },
  { id:"co2",     name:"Carbon Dioxide",nameBn:"কার্বন ডাইঅক্সাইড",formula:"CO₂",desc:"গ্রিনহাউস গ্যাস। রৈখিক গঠন, দুটি C=O দ্বিবন্ধন।",    atoms:[{el:"O",x:50,y:95,r:22,color:"#ef4444"},{el:"C",x:100,y:95,r:18,color:"#64748b"},{el:"O",x:150,y:95,r:22,color:"#ef4444"}], bonds:[[0,1],[1,2]] },
  { id:"benzene", name:"Benzene",  nameBn:"বেঞ্জিন",            formula:"C₆H₆",     desc:"আরোমাটিক যৌগ। ষড়ভুজাকার, ডিলোকালাইজড π ইলেকট্রন।", atoms:[{el:"C",x:100,y:55,r:16,color:"#64748b"},{el:"C",x:130,y:73,r:16,color:"#64748b"},{el:"C",x:130,y:107,r:16,color:"#64748b"},{el:"C",x:100,y:125,r:16,color:"#64748b"},{el:"C",x:70,y:107,r:16,color:"#64748b"},{el:"C",x:70,y:73,r:16,color:"#64748b"},{el:"H",x:100,y:33,r:10,color:"#94a3b8"},{el:"H",x:148,y:61,r:10,color:"#94a3b8"},{el:"H",x:148,y:119,r:10,color:"#94a3b8"},{el:"H",x:100,y:147,r:10,color:"#94a3b8"},{el:"H",x:52,y:119,r:10,color:"#94a3b8"},{el:"H",x:52,y:61,r:10,color:"#94a3b8"}], bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]] },
  { id:"ethanol", name:"Ethanol",  nameBn:"ইথানল (অ্যালকোহল)",  formula:"C₂H₅OH",   desc:"পানীয় অ্যালকোহল। হাইড্রোক্সিল গ্রুপ (-OH) সহ।",   atoms:[{el:"C",x:70,y:85,r:18,color:"#64748b"},{el:"C",x:110,y:85,r:18,color:"#64748b"},{el:"O",x:140,y:65,r:20,color:"#ef4444"},{el:"H",x:55,y:65,r:11,color:"#94a3b8"},{el:"H",x:55,y:105,r:11,color:"#94a3b8"},{el:"H",x:75,y:110,r:11,color:"#94a3b8"},{el:"H",x:115,y:110,r:11,color:"#94a3b8"},{el:"H",x:125,y:105,r:11,color:"#94a3b8"},{el:"H",x:155,y:52,r:11,color:"#94a3b8"}], bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8]] },
];

function MoleculeViewer({ mol }: { mol: typeof molecules[0] }) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale]       = useState(1);
  const [dragging, setDragging] = useState(false);
  const [startX,   setStartX]   = useState(0);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden select-none">
      {/* SVG Canvas */}
      <div className="relative"
        onMouseDown={e => { setDragging(true); setStartX(e.clientX); }}
        onMouseMove={e => { if (dragging) { setRotation(r => r + (e.clientX-startX)*0.5); setStartX(e.clientX); } }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onWheel={e => setScale(s => Math.min(2, Math.max(0.5, s - e.deltaY*0.001)))}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <svg viewBox="0 0 200 180" className="w-full" style={{ transform:`scale(${scale})`, transformOrigin:"center" }}>
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

export default function MoleculesPage() {
  const [selected, setSelected] = useState(molecules[0]);

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Atom className="w-4 h-4" /> আণবিক দর্শক
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">3D Molecule Viewer</h1>
          <p className="text-slate-600 dark:text-slate-400">অণুর গঠন ইন্টারেক্টিভভাবে দেখো ও ঘোরাও</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Molecule List */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">অণুর তালিকা</p>
            {molecules.map(mol => (
              <button key={mol.id} onClick={() => setSelected(mol)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${selected.id===mol.id ? "gradient-bg text-white shadow-lg" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{mol.nameBn}</p>
                    <p className={`text-sm ${selected.id===mol.id ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{mol.name}</p>
                  </div>
                  <span className={`font-mono text-lg font-bold ${selected.id===mol.id ? "text-white" : "text-primary-600 dark:text-primary-400"}`}>
                    {mol.formula}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Viewer */}
          <div>
            <motion.div key={selected.id} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selected.nameBn}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{selected.name}</p>
                  </div>
                  <span className="font-mono text-3xl font-bold text-primary-600 dark:text-primary-400">{selected.formula}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{selected.desc}</p>
              </div>

              {/* 3D Viewer */}
              <div className="p-6">
                <MoleculeViewer mol={selected} />
              </div>

              {/* Atom Legend */}
              <div className="px-6 pb-6">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">পরমাণু তালিকা</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(selected.atoms.map(a=>a.el))).map(el => {
                    const atom = selected.atoms.find(a=>a.el===el)!;
                    const count = selected.atoms.filter(a=>a.el===el).length;
                    return (
                      <div key={el} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: atom.color }}/>
                        <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{el}</span>
                        <span className="text-xs text-slate-500">×{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
