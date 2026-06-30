"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Atom } from "lucide-react";
import { molecules } from "@/lib/molecules";
import MoleculeViewer from "@/components/shared/MoleculeViewer";

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
