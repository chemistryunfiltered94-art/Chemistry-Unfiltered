"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, ChevronDown, ChevronRight,
  RotateCcw, ZoomIn, ZoomOut, Move,
  Eye, Layers, Activity, Zap, Triangle,
  Ruler, GitBranch, Info, Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type AtomDef  = { el: string; x: number; y: number; r: number; color: string };
type BondDef  = [number, number];
type Molecule = {
  id: string; name: string; nameBn: string; formula: string; desc: string;
  atoms: AtomDef[]; bonds: BondDef[];
  category: string;
};

// ─── Visualization Modes ──────────────────────────────────────────────────────
type VisMode = "ball-stick" | "space-fill" | "wireframe" | "electron-cloud";

// ─── Per-molecule science data ────────────────────────────────────────────────
type ScienceData = {
  geometry: string;
  hybridization: string;
  polarity: string;
  dipole: string;
  bondAngles: string[];
  bondLengths: string[];
  electronDensity: string;
};

// Science data keyed by molecule id
const scienceDB: Record<string, ScienceData> = {
  hydrogen:   { geometry:"রৈখিক (Linear)",       hybridization:"s",     polarity:"অপোলার",      dipole:"0 D",       bondAngles:["H-H: 180°"],                           bondLengths:["H-H: 74 pm"],                       electronDensity:"সমান বিতরণ" },
  oxygen:     { geometry:"রৈখিক (Linear)",       hybridization:"sp",    polarity:"অপোলার",      dipole:"0 D",       bondAngles:["O=O: 180°"],                           bondLengths:["O=O: 121 pm"],                      electronDensity:"সমান বিতরণ" },
  nitrogen:   { geometry:"রৈখিক (Linear)",       hybridization:"sp",    polarity:"অপোলার",      dipole:"0 D",       bondAngles:["N≡N: 180°"],                           bondLengths:["N≡N: 110 pm"],                      electronDensity:"সমান বিতরণ" },
  chlorine:   { geometry:"রৈখিক (Linear)",       hybridization:"sp³",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["Cl-Cl: 180°"],                         bondLengths:["Cl-Cl: 199 pm"],                    electronDensity:"সমান বিতরণ" },
  water:      { geometry:"বাঁকা (Bent)",          hybridization:"sp³",   polarity:"পোলার",       dipole:"1.85 D",    bondAngles:["H-O-H: 104.5°"],                      bondLengths:["O-H: 96 pm"],                       electronDensity:"O-এ বেশি (δ⁻)" },
  ammonia:    { geometry:"ত্রিকোণ পিরামিড",      hybridization:"sp³",   polarity:"পোলার",       dipole:"1.47 D",    bondAngles:["H-N-H: 107°"],                         bondLengths:["N-H: 101 pm"],                      electronDensity:"N-এ বেশি (δ⁻)" },
  methane:    { geometry:"টেট্রাহেড্রাল",        hybridization:"sp³",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["H-C-H: 109.5°"],                       bondLengths:["C-H: 109 pm"],                      electronDensity:"সমান বিতরণ" },
  co2:        { geometry:"রৈখিক (Linear)",       hybridization:"sp",    polarity:"অপোলার",      dipole:"0 D",       bondAngles:["O=C=O: 180°"],                         bondLengths:["C=O: 116 pm"],                      electronDensity:"O-এ বেশি (δ⁻)" },
  ethane:     { geometry:"টেট্রাহেড্রাল (প্রতিটি C)", hybridization:"sp³", polarity:"অপোলার", dipole:"0 D",       bondAngles:["H-C-H: 109.5°", "H-C-C: 109.5°"],      bondLengths:["C-C: 154 pm", "C-H: 109 pm"],      electronDensity:"সমান বিতরণ" },
  propane:    { geometry:"টেট্রাহেড্রাল",        hybridization:"sp³",   polarity:"অপোলার",      dipole:"0.08 D",    bondAngles:["C-C-C: 112°", "H-C-H: 109.5°"],        bondLengths:["C-C: 154 pm"],                      electronDensity:"প্রায় সমান" },
  butane:     { geometry:"প্রসারিত শিকল",        hybridization:"sp³",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["C-C-C: 112°"],                         bondLengths:["C-C: 154 pm"],                      electronDensity:"সমান বিতরণ" },
  ethylene:   { geometry:"সমতল ত্রিকোণ",         hybridization:"sp²",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["H-C=C: 121°", "H-C-H: 117°"],          bondLengths:["C=C: 134 pm", "C-H: 108 pm"],      electronDensity:"π মেঘ উপরে-নিচে" },
  acetylene:  { geometry:"রৈখিক (Linear)",       hybridization:"sp",    polarity:"অপোলার",      dipole:"0 D",       bondAngles:["H-C≡C: 180°"],                         bondLengths:["C≡C: 120 pm", "C-H: 106 pm"],      electronDensity:"দুটি π মেঘ" },
  benzene:    { geometry:"সমতল ষড়ভুজ",           hybridization:"sp²",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["C-C-C: 120°"],                         bondLengths:["C-C: 140 pm (ডিলোকালাইজড)"],       electronDensity:"π মেঘ রিংয়ের উপর-নিচ" },
  toluene:    { geometry:"সমতল (রিং) + টেট্রা", hybridization:"sp²/sp³", polarity:"সামান্য পোলার", dipole:"0.36 D", bondAngles:["C-C-C: 120°", "H-C-H: 109.5°"],       bondLengths:["C-C(রিং): 140 pm", "C-C(মিথাইল): 152 pm"], electronDensity:"π মেঘ রিংয়ে" },
  methanol:   { geometry:"বাঁকা (Bent)",          hybridization:"sp³",   polarity:"পোলার",       dipole:"1.70 D",    bondAngles:["C-O-H: 108.5°", "H-C-H: 109.5°"],      bondLengths:["C-O: 143 pm", "O-H: 96 pm"],       electronDensity:"O-এ বেশি (δ⁻)" },
  ethanol:    { geometry:"বাঁকা (-OH) + টেট্রা", hybridization:"sp³",  polarity:"পোলার",       dipole:"1.69 D",    bondAngles:["C-O-H: 108°", "C-C-O: 107°"],           bondLengths:["C-O: 143 pm", "O-H: 97 pm"],       electronDensity:"O-এ বেশি (δ⁻)" },
  propanol:   { geometry:"বাঁকা (-OH) + শিকল",  hybridization:"sp³",   polarity:"পোলার",       dipole:"1.68 D",    bondAngles:["C-O-H: 108°"],                         bondLengths:["C-O: 143 pm"],                      electronDensity:"O-এ বেশি (δ⁻)" },
  "acetic-acid": { geometry:"সমতল (কার্বক্সিল)", hybridization:"sp²/sp³", polarity:"পোলার",   dipole:"1.74 D",    bondAngles:["O-C=O: 123°", "C-C-O: 111°"],          bondLengths:["C=O: 122 pm", "C-O: 136 pm"],      electronDensity:"C=O-তে বেশি (δ⁻)" },
  "formic-acid": { geometry:"সমতল",              hybridization:"sp²",   polarity:"পোলার",       dipole:"1.41 D",    bondAngles:["O-C=O: 124°", "H-C=O: 124°"],          bondLengths:["C=O: 123 pm", "C-O: 134 pm"],      electronDensity:"C=O-তে বেশি (δ⁻)" },
  glucose:    { geometry:"পাইরানোজ রিং",         hybridization:"sp³",   polarity:"পোলার",       dipole:"উচ্চ",       bondAngles:["C-C-O: ~109°"],                        bondLengths:["C-O: 143 pm", "C-C: 152 pm"],      electronDensity:"OH গ্রুপে (δ⁻)" },
  fructose:   { geometry:"ফিউরানোজ রিং",         hybridization:"sp³",   polarity:"পোলার",       dipole:"উচ্চ",       bondAngles:["C-C-O: ~109°"],                        bondLengths:["C-O: 143 pm"],                      electronDensity:"OH গ্রুপে (δ⁻)" },
  urea:       { geometry:"সমতল (প্রায়)",         hybridization:"sp²",   polarity:"পোলার",       dipole:"4.56 D",    bondAngles:["N-C-N: 118°", "N-C=O: 121°"],          bondLengths:["C=O: 126 pm", "C-N: 134 pm"],      electronDensity:"O ও N-এ বেশি (δ⁻)" },
  glycine:    { geometry:"সমতল (অ্যামিনো গ্রুপ)", hybridization:"sp²/sp³", polarity:"পোলার (Zwitterion)", dipole:"উচ্চ", bondAngles:["N-C-C: 111°", "C-C=O: 117°"], bondLengths:["C-N: 147 pm", "C=O: 124 pm"],      electronDensity:"COO⁻ ও NH₃⁺-এ" },
  "sulfuric-acid": { geometry:"টেট্রাহেড্রাল",  hybridization:"sp³",   polarity:"পোলার",       dipole:"উচ্চ",       bondAngles:["O-S-O: 109°"],                         bondLengths:["S=O: 143 pm", "S-O: 157 pm"],      electronDensity:"O-তে বেশি (δ⁻)" },
  "nitric-acid":   { geometry:"সমতল",            hybridization:"sp²",   polarity:"পোলার",       dipole:"2.17 D",    bondAngles:["O-N=O: 130°", "O-N-O: 115°"],          bondLengths:["N=O: 121 pm", "N-O: 140 pm"],      electronDensity:"O-তে বেশি (δ⁻)" },
  hcl:        { geometry:"রৈখিক (Linear)",       hybridization:"sp³",   polarity:"পোলার",       dipole:"1.08 D",    bondAngles:["H-Cl: 180°"],                          bondLengths:["H-Cl: 127 pm"],                     electronDensity:"Cl-এ বেশি (δ⁻)" },
  nacl:       { geometry:"আয়নিক",               hybridization:"—",     polarity:"আয়নিক বন্ধন",  dipole:"9.0 D (gas)", bondAngles:["—"],                            bondLengths:["Na-Cl: 236 pm"],                    electronDensity:"Cl⁻-এ বেশি" },
  kmno4:      { geometry:"টেট্রাহেড্রাল (MnO₄⁻)", hybridization:"—", polarity:"আয়নিক",        dipole:"—",          bondAngles:["O-Mn-O: 109°"],                        bondLengths:["Mn-O: 163 pm"],                     electronDensity:"O-তে বেশি (δ⁻)" },
  nh4no3:     { geometry:"টেট্রাহেড্রাল + সমতল", hybridization:"sp³/sp²", polarity:"আয়নিক",   dipole:"—",          bondAngles:["H-N-H: 109.5°", "O-N-O: 120°"],       bondLengths:["N-H: 103 pm", "N=O: 122 pm"],      electronDensity:"O-তে বেশি (δ⁻)" },
  ozone:      { geometry:"বাঁকা (Bent)",          hybridization:"sp²",   polarity:"পোলার",       dipole:"0.53 D",    bondAngles:["O-O-O: 117°"],                         bondLengths:["O-O: 128 pm"],                      electronDensity:"কেন্দ্রীয় O-এ বেশি" },
  h2s:        { geometry:"বাঁকা (Bent)",          hybridization:"sp³",   polarity:"পোলার",       dipole:"0.97 D",    bondAngles:["H-S-H: 92°"],                          bondLengths:["S-H: 134 pm"],                      electronDensity:"S-এ বেশি (δ⁻)" },
  h2o2:       { geometry:"টোয়িস্টেড (Twisted)",  hybridization:"sp³",   polarity:"পোলার",       dipole:"2.13 D",    bondAngles:["H-O-O: 96°", "O-O-H (dihedral): 112°"], bondLengths:["O-O: 145 pm", "O-H: 97 pm"],    electronDensity:"O-তে বেশি (δ⁻)" },
  co:         { geometry:"রৈখিক (Linear)",       hybridization:"sp",    polarity:"সামান্য পোলার", dipole:"0.11 D",  bondAngles:["C≡O: 180°"],                           bondLengths:["C≡O: 113 pm"],                      electronDensity:"O-এ সামান্য বেশি" },
  dna:        { geometry:"ডাবল হেলিক্স",          hybridization:"sp²/sp³", polarity:"পোলার",    dipole:"—",          bondAngles:["ফসফোডায়েস্টার বন্ধন ~120°"],          bondLengths:["P-O: 160 pm"],                      electronDensity:"ফসফেট ব্যাকবোনে (δ⁻)" },
  rna:        { geometry:"একক শিকল হেলিক্স",     hybridization:"sp²/sp³", polarity:"পোলার",    dipole:"—",          bondAngles:["ফসফোডায়েস্টার বন্ধন ~120°"],          bondLengths:["P-O: 160 pm"],                      electronDensity:"ফসফেট ব্যাকবোনে (δ⁻)" },
  hemoglobin: { geometry:"স্কোয়ার প্ল্যানার (Fe)", hybridization:"sp²d", polarity:"পোলার",    dipole:"—",          bondAngles:["N-Fe-N: 90°"],                         bondLengths:["Fe-N: 200 pm"],                     electronDensity:"Fe কেন্দ্রে" },
  "protein-helix": { geometry:"আলফা হেলিক্স",   hybridization:"sp²/sp³", polarity:"পোলার",    dipole:"~3.5 D/residue", bondAngles:["N-C-C: 111°", "C-N-C: 122°"],    bondLengths:["C-N: 132 pm", "C=O: 124 pm"],      electronDensity:"C=O ও N-H-তে" },
  "nacl-crystal": { geometry:"FCC জালক",         hybridization:"—",     polarity:"আয়নিক",      dipole:"—",          bondAngles:["Na-Cl-Na: 90°"],                       bondLengths:["Na-Cl: 282 pm (crystal)"],          electronDensity:"Cl⁻-এ বেশি" },
  diamond:    { geometry:"টেট্রাহেড্রাল জালক",   hybridization:"sp³",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["C-C-C: 109.5°"],                       bondLengths:["C-C: 154 pm"],                      electronDensity:"সমান বিতরণ" },
  graphite:   { geometry:"সমতল হেক্সাগোনাল",      hybridization:"sp²",   polarity:"অপোলার",      dipole:"0 D",       bondAngles:["C-C-C: 120°"],                         bondLengths:["C-C: 142 pm (layer)"],              electronDensity:"π মেঘ স্তরে" },
  quartz:     { geometry:"টেট্রাহেড্রাল (Si)",   hybridization:"sp³",   polarity:"পোলার",       dipole:"—",          bondAngles:["O-Si-O: 109.5°", "Si-O-Si: 144°"],     bondLengths:["Si-O: 161 pm"],                     electronDensity:"O-তে বেশি (δ⁻)" },
  "ethylene-industrial": { geometry:"সমতল ত্রিকোণ", hybridization:"sp²", polarity:"অপোলার",    dipole:"0 D",       bondAngles:["H-C=C: 121°"],                         bondLengths:["C=C: 134 pm"],                      electronDensity:"π মেঘ উপরে-নিচে" },
  polyethylene: { geometry:"প্রসারিত শিকল",       hybridization:"sp³",   polarity:"অপোলার",      dipole:"~0 D",      bondAngles:["C-C-C: 112°", "H-C-H: 109.5°"],        bondLengths:["C-C: 154 pm"],                      electronDensity:"সমান বিতরণ" },
};

const defaultScience: ScienceData = {
  geometry:"তথ্য নেই", hybridization:"তথ্য নেই", polarity:"তথ্য নেই",
  dipole:"তথ্য নেই", bondAngles:["তথ্য নেই"], bondLengths:["তথ্য নেই"], electronDensity:"তথ্য নেই",
};

// ─── Colour palette ───────────────────────────────────────────────────────────
const C  = { el:"C",  color:"#64748b" };
const H  = { el:"H",  color:"#94a3b8" };
const O  = { el:"O",  color:"#ef4444" };
const N  = { el:"N",  color:"#3b82f6" };
const S  = { el:"S",  color:"#eab308" };
const Cl = { el:"Cl", color:"#22c55e" };
const Na = { el:"Na", color:"#a78bfa" };
const K  = { el:"K",  color:"#f97316" };
const Mn = { el:"Mn", color:"#ec4899" };
const P  = { el:"P",  color:"#f59e0b" };
const Fe = { el:"Fe", color:"#b45309" };
const Si = { el:"Si", color:"#6366f1" };

// ─── All molecules ────────────────────────────────────────────────────────────
const molecules: Molecule[] = [

  // ── A. Basic Molecules ─────────────────────────────────────────────────────
  { id:"hydrogen",  category:"basic", name:"Hydrogen",  nameBn:"হাইড্রোজেন",  formula:"H₂",
    desc:"সবচেয়ে সরল ও হালকা অণু। একটি H-H একক বন্ধন।",
    atoms:[{...H,x:65,y:90,r:16},{...H,x:135,y:90,r:16}], bonds:[[0,1]] },

  { id:"oxygen",    category:"basic", name:"Oxygen",    nameBn:"অক্সিজেন",    formula:"O₂",
    desc:"শ্বসনের জন্য অপরিহার্য। O=O দ্বিবন্ধন।",
    atoms:[{...O,x:65,y:90,r:22},{...O,x:135,y:90,r:22}], bonds:[[0,1]] },

  { id:"nitrogen",  category:"basic", name:"Nitrogen",  nameBn:"নাইট্রোজেন",  formula:"N₂",
    desc:"বায়ুমণ্ডলের ৭৮%। N≡N ট্রিপল বন্ধন, অত্যন্ত স্থিতিশীল।",
    atoms:[{...N,x:65,y:90,r:20},{...N,x:135,y:90,r:20}], bonds:[[0,1]] },

  { id:"chlorine",  category:"basic", name:"Chlorine",  nameBn:"ক্লোরিন",     formula:"Cl₂",
    desc:"হলুদ-সবুজ বিষাক্ত গ্যাস। দুটি Cl পরমাণু একক বন্ধনে যুক্ত।",
    atoms:[{...Cl,x:60,y:90,r:23},{...Cl,x:140,y:90,r:23}], bonds:[[0,1]] },

  { id:"water",     category:"basic", name:"Water",     nameBn:"পানি",         formula:"H₂O",
    desc:"সার্বজনীন দ্রাবক। H-O-H বন্ধন কোণ ১০৪.৫°।",
    atoms:[{...O,x:100,y:80,r:22},{...H,x:65,y:120,r:14},{...H,x:135,y:120,r:14}],
    bonds:[[0,1],[0,2]] },

  { id:"ammonia",   category:"basic", name:"Ammonia",   nameBn:"অ্যামোনিয়া",  formula:"NH₃",
    desc:"হেবার পদ্ধতিতে তৈরি। ত্রিকোণাকার পিরামিড গঠন।",
    atoms:[{...N,x:100,y:75,r:20},{...H,x:65,y:115,r:13},{...H,x:135,y:115,r:13},{...H,x:100,y:130,r:13}],
    bonds:[[0,1],[0,2],[0,3]] },

  { id:"methane",   category:"basic", name:"Methane",   nameBn:"মিথেন",        formula:"CH₄",
    desc:"প্রাকৃতিক গ্যাসের মূল উপাদান। টেট্রাহেড্রাল গঠন।",
    atoms:[{...C,x:100,y:90,r:20},{...H,x:60,y:60,r:13},{...H,x:140,y:60,r:13},{...H,x:60,y:120,r:13},{...H,x:140,y:120,r:13}],
    bonds:[[0,1],[0,2],[0,3],[0,4]] },

  { id:"co2",       category:"basic", name:"Carbon Dioxide", nameBn:"কার্বন ডাইঅক্সাইড", formula:"CO₂",
    desc:"গ্রিনহাউস গ্যাস। রৈখিক গঠন, দুটি C=O দ্বিবন্ধন।",
    atoms:[{...O,x:50,y:95,r:22},{...C,x:100,y:95,r:18},{...O,x:150,y:95,r:22}],
    bonds:[[0,1],[1,2]] },

  // ── B. Organic – Hydrocarbons ──────────────────────────────────────────────
  { id:"ethane",    category:"hydrocarbon", name:"Ethane",   nameBn:"ইথেন",   formula:"C₂H₆",
    desc:"দুটি মিথাইল গ্রুপের মিলন। C-C একক বন্ধন।",
    atoms:[
      {...C,x:75,y:90,r:18},{...C,x:125,y:90,r:18},
      {...H,x:50,y:65,r:11},{...H,x:55,y:110,r:11},{...H,x:65,y:118,r:11},
      {...H,x:150,y:65,r:11},{...H,x:145,y:110,r:11},{...H,x:135,y:118,r:11},
    ],
    bonds:[[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[1,7]] },

  { id:"propane",   category:"hydrocarbon", name:"Propane",  nameBn:"প্রোপেন", formula:"C₃H₈",
    desc:"LPG-র মূল উপাদান। তিনটি কার্বনের সরল শিকল।",
    atoms:[
      {...C,x:60,y:90,r:17},{...C,x:100,y:90,r:17},{...C,x:140,y:90,r:17},
      {...H,x:38,y:70,r:10},{...H,x:42,y:110,r:10},{...H,x:58,y:115,r:10},
      {...H,x:100,y:65,r:10},{...H,x:100,y:115,r:10},
      {...H,x:162,y:70,r:10},{...H,x:158,y:110,r:10},{...H,x:142,y:115,r:10},
    ],
    bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8],[2,9],[2,10]] },

  { id:"butane",    category:"hydrocarbon", name:"Butane",   nameBn:"বিউটেন",  formula:"C₄H₁₀",
    desc:"লাইটারের গ্যাস। চারটি কার্বনের সরল শিকল।",
    atoms:[
      {...C,x:45,y:90,r:16},{...C,x:80,y:90,r:16},{...C,x:120,y:90,r:16},{...C,x:155,y:90,r:16},
      {...H,x:25,y:72,r:9},{...H,x:28,y:108,r:9},{...H,x:45,y:115,r:9},
      {...H,x:80,y:66,r:9},{...H,x:80,y:114,r:9},
      {...H,x:120,y:66,r:9},{...H,x:120,y:114,r:9},
      {...H,x:175,y:72,r:9},{...H,x:172,y:108,r:9},{...H,x:155,y:115,r:9},
    ],
    bonds:[[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8],[2,9],[2,10],[3,11],[3,12],[3,13]] },

  { id:"ethylene",  category:"hydrocarbon", name:"Ethylene", nameBn:"ইথিলিন",  formula:"C₂H₄",
    desc:"পলিথিন তৈরির মূল উপাদান। C=C দ্বিবন্ধন।",
    atoms:[{...C,x:80,y:90,r:18},{...C,x:120,y:90,r:18},{...H,x:55,y:60,r:11},{...H,x:55,y:120,r:11},{...H,x:145,y:60,r:11},{...H,x:145,y:120,r:11}],
    bonds:[[0,1],[0,2],[0,3],[1,4],[1,5]] },

  { id:"acetylene", category:"hydrocarbon", name:"Acetylene (Ethyne)", nameBn:"অ্যাসিটিলিন (ইথাইন)", formula:"C₂H₂",
    desc:"ওয়েল্ডিংয়ে ব্যবহৃত। C≡C ট্রিপল বন্ধন।",
    atoms:[{...H,x:35,y:90,r:12},{...C,x:80,y:90,r:17},{...C,x:120,y:90,r:17},{...H,x:165,y:90,r:12}],
    bonds:[[0,1],[1,2],[2,3]] },

  { id:"benzene",   category:"hydrocarbon", name:"Benzene",  nameBn:"বেঞ্জিন",  formula:"C₆H₆",
    desc:"আরোমাটিক যৌগ। ষড়ভুজাকার, ডিলোকালাইজড π ইলেকট্রন।",
    atoms:[
      {...C,x:100,y:55,r:16},{...C,x:130,y:73,r:16},{...C,x:130,y:107,r:16},
      {...C,x:100,y:125,r:16},{...C,x:70,y:107,r:16},{...C,x:70,y:73,r:16},
      {...H,x:100,y:33,r:10},{...H,x:148,y:61,r:10},{...H,x:148,y:119,r:10},
      {...H,x:100,y:147,r:10},{...H,x:52,y:119,r:10},{...H,x:52,y:61,r:10},
    ],
    bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]] },

  { id:"toluene",   category:"hydrocarbon", name:"Toluene",  nameBn:"টলুইন",   formula:"C₇H₈",
    desc:"পেইন্ট সলভেন্ট। বেঞ্জিন রিং-এর সাথে মিথাইল গ্রুপ যুক্ত।",
    atoms:[
      {...C,x:100,y:60,r:15},{...C,x:125,y:77,r:15},{...C,x:125,y:107,r:15},
      {...C,x:100,y:122,r:15},{...C,x:75,y:107,r:15},{...C,x:75,y:77,r:15},
      {...C,x:100,y:35,r:15},
      {...H,x:145,y:65,r:9},{...H,x:145,y:118,r:9},{...H,x:100,y:140,r:9},
      {...H,x:55,y:118,r:9},{...H,x:55,y:65,r:9},
      {...H,x:78,y:22,r:9},{...H,x:100,y:17,r:9},{...H,x:122,y:22,r:9},
    ],
    bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11],[6,12],[6,13],[6,14]] },

  // ── B. Organic – Alcohols ──────────────────────────────────────────────────
  { id:"methanol",  category:"alcohol", name:"Methanol",  nameBn:"মিথানল",   formula:"CH₃OH",
    desc:"কাঠের অ্যালকোহল। বিষাক্ত। সবচেয়ে সরল অ্যালকোহল।",
    atoms:[
      {...C,x:80,y:95,r:18},
      {...O,x:125,y:75,r:18},
      {...H,x:55,y:70,r:11},{...H,x:55,y:105,r:11},{...H,x:80,y:120,r:11},
      {...H,x:148,y:58,r:11},
    ],
    bonds:[[0,1],[0,2],[0,3],[0,4],[1,5]] },

  { id:"ethanol",   category:"alcohol", name:"Ethanol",   nameBn:"ইথানল",    formula:"C₂H₅OH",
    desc:"পানীয় অ্যালকোহল। হাইড্রোক্সিল গ্রুপ (-OH) সহ।",
    atoms:[
      {...C,x:70,y:85,r:18},{...C,x:110,y:85,r:18},{...O,x:140,y:65,r:20},
      {...H,x:55,y:65,r:11},{...H,x:55,y:105,r:11},{...H,x:75,y:110,r:11},
      {...H,x:115,y:110,r:11},{...H,x:125,y:105,r:11},{...H,x:155,y:52,r:11},
    ],
    bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8]] },

  { id:"propanol",  category:"alcohol", name:"Propanol",  nameBn:"প্রোপানল", formula:"C₃H₇OH",
    desc:"তিন কার্বনবিশিষ্ট অ্যালকোহল। দ্রাবক হিসেবে ব্যবহৃত।",
    atoms:[
      {...C,x:50,y:95,r:16},{...C,x:90,y:95,r:16},{...C,x:130,y:95,r:16},{...O,x:158,y:72,r:17},
      {...H,x:30,y:75,r:10},{...H,x:33,y:110,r:10},{...H,x:50,y:118,r:10},
      {...H,x:90,y:72,r:10},{...H,x:90,y:118,r:10},
      {...H,x:130,y:72,r:10},{...H,x:130,y:118,r:10},
      {...H,x:170,y:55,r:10},
    ],
    bonds:[[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8],[2,9],[2,10],[3,11]] },

  // ── B. Organic – Acids ────────────────────────────────────────────────────
  { id:"acetic-acid",  category:"acid-organic", name:"Acetic Acid",  nameBn:"অ্যাসিটিক এসিড",  formula:"CH₃COOH",
    desc:"ভিনেগারের মূল উপাদান। কার্বক্সিল গ্রুপ (-COOH) যুক্ত।",
    atoms:[
      {...C,x:55,y:100,r:17},{...H,x:25,y:75,r:10},{...H,x:25,y:125,r:10},{...H,x:55,y:140,r:10},
      {...C,x:95,y:75,r:17},{...O,x:95,y:35,r:17},{...O,x:135,y:95,r:17},{...H,x:160,y:75,r:10},
    ],
    bonds:[[0,1],[0,2],[0,3],[0,4],[4,5],[4,6],[6,7]] },

  { id:"formic-acid",  category:"acid-organic", name:"Formic Acid",  nameBn:"ফর্মিক এসিড",     formula:"HCOOH",
    desc:"পিঁপড়ার কামড়ে পাওয়া এসিড। সবচেয়ে সরল কার্বক্সিলিক এসিড।",
    atoms:[
      {...C,x:100,y:85,r:18},
      {...O,x:100,y:45,r:17},{...O,x:140,y:108,r:17},
      {...H,x:60,y:85,r:11},{...H,x:162,y:92,r:10},
    ],
    bonds:[[0,1],[0,2],[0,3],[2,4]] },

  // ── B. Organic – Biomolecules ─────────────────────────────────────────────
  { id:"glucose",   category:"biomolecule", name:"Glucose",   nameBn:"গ্লুকোজ",   formula:"C₆H₁₂O₆",
    desc:"রক্তের শর্করা। শক্তির প্রধান উৎস। ষড়ভুজ পাইরানোজ রিং গঠন।",
    atoms:[
      {...C,x:100,y:65,r:14},{...C,x:128,y:80,r:14},{...C,x:128,y:108,r:14},
      {...C,x:100,y:125,r:14},{...C,x:72,y:108,r:14},{...O,x:72,y:80,r:14},
      {...O,x:100,y:40,r:13},{...O,x:152,y:72,r:13},{...O,x:152,y:118,r:13},
      {...O,x:100,y:148,r:13},{...O,x:48,y:118,r:13},
      {...H,x:100,y:23,r:8},{...H,x:162,y:58,r:8},{...H,x:162,y:130,r:8},
      {...H,x:100,y:162,r:8},{...H,x:35,y:130,r:8},
    ],
    bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[6,11],[7,12],[8,13],[9,14],[10,15]] },

  { id:"fructose",  category:"biomolecule", name:"Fructose",  nameBn:"ফ্রুক্টোজ", formula:"C₆H₁₂O₆",
    desc:"ফলের চিনি। গ্লুকোজের কেটো-আইসোমার। পঞ্চভুজ রিং গঠন।",
    atoms:[
      {...C,x:100,y:70,r:14},{...C,x:130,y:90,r:14},{...C,x:125,y:120,r:14},
      {...C,x:90,y:132,r:14},{...O,x:68,y:108,r:14},
      {...C,x:100,y:42,r:14},{...O,x:130,y:67,r:13},
      {...O,x:150,y:112,r:13},{...O,x:115,y:145,r:13},{...O,x:80,y:148,r:13},{...O,x:85,y:22,r:13},
      {...H,x:148,y:83,r:8},{...H,x:160,y:100,r:8},{...H,x:140,y:130,r:8},
      {...H,x:88,y:155,r:8},{...H,x:65,y:155,r:8},{...H,x:70,y:22,r:8},
    ],
    bonds:[[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,10],[6,11],[7,12],[8,13],[9,14],[10,15],[5,16]] },

  { id:"urea",      category:"biomolecule", name:"Urea",      nameBn:"ইউরিয়া",   formula:"CO(NH₂)₂",
    desc:"সার শিল্পের মূল উপাদান। প্রস্রাবে পাওয়া জৈব যৌগ।",
    atoms:[
      {...C,x:100,y:90,r:18},{...O,x:100,y:52,r:17},
      {...N,x:62,y:112,r:17},{...N,x:138,y:112,r:17},
      {...H,x:38,y:96,r:11},{...H,x:52,y:135,r:11},
      {...H,x:162,y:96,r:11},{...H,x:148,y:135,r:11},
    ],
    bonds:[[0,1],[0,2],[0,3],[2,4],[2,5],[3,6],[3,7]] },

  { id:"glycine",   category:"biomolecule", name:"Glycine (Amino Acid)", nameBn:"গ্লাইসিন (অ্যামিনো এসিড)", formula:"H₂NCH₂COOH",
    desc:"সবচেয়ে সরল অ্যামিনো এসিড। প্রোটিনের গঠন উপাদান।",
    atoms:[
      {...N,x:45,y:95,r:17},{...C,x:85,y:95,r:17},{...C,x:125,y:85,r:17},
      {...O,x:155,y:60,r:16},{...O,x:140,y:112,r:16},
      {...H,x:25,y:77,r:10},{...H,x:25,y:110,r:10},
      {...H,x:85,y:70,r:10},{...H,x:85,y:120,r:10},
      {...H,x:162,y:100,r:10},
    ],
    bonds:[[0,1],[1,2],[2,3],[2,4],[0,5],[0,6],[1,7],[1,8],[4,9]] },

  // ── C. Inorganic ──────────────────────────────────────────────────────────
  { id:"sulfuric-acid", category:"inorganic", name:"Sulfuric Acid", nameBn:"সালফিউরিক এসিড", formula:"H₂SO₄",
    desc:"ব্যাটারি এসিড, শিল্পে সর্বাধিক ব্যবহৃত রাসায়নিক।",
    atoms:[
      {...S,x:100,y:85,r:20},{...O,x:55,y:50,r:16},{...O,x:145,y:50,r:16},
      {...O,x:55,y:120,r:16},{...O,x:145,y:120,r:16},
      {...H,x:30,y:145,r:10},{...H,x:170,y:145,r:10},
    ],
    bonds:[[0,1],[0,2],[0,3],[0,4],[3,5],[4,6]] },

  { id:"nitric-acid",   category:"inorganic", name:"Nitric Acid",   nameBn:"নাইট্রিক এসিড",  formula:"HNO₃",
    desc:"তীব্র অক্সিডাইজিং এসিড। সার ও বিস্ফোরক শিল্পে ব্যবহৃত।",
    atoms:[
      {...N,x:100,y:85,r:18},{...O,x:55,y:55,r:16},{...O,x:145,y:55,r:16},
      {...O,x:100,y:135,r:16},{...H,x:135,y:155,r:10},
    ],
    bonds:[[0,1],[0,2],[0,3],[3,4]] },

  { id:"hcl",           category:"inorganic", name:"Hydrochloric Acid", nameBn:"হাইড্রোক্লোরিক এসিড", formula:"HCl",
    desc:"পাকস্থলীর এসিড। পানিতে দ্রবীভূত হলে তীব্র এসিড।",
    atoms:[{...H,x:60,y:90,r:14},{...Cl,x:135,y:90,r:23}], bonds:[[0,1]] },

  { id:"nacl",          category:"inorganic", name:"Sodium Chloride",   nameBn:"সোডিয়াম ক্লোরাইড",  formula:"NaCl",
    desc:"সাধারণ লবণ। আয়নিক বন্ধনে গঠিত (Na⁺ এবং Cl⁻)।",
    atoms:[{...Na,x:65,y:90,r:21},{...Cl,x:135,y:90,r:23}], bonds:[[0,1]] },

  { id:"kmno4",         category:"inorganic", name:"Potassium Permanganate", nameBn:"পটাশিয়াম পারম্যাঙ্গানেট", formula:"KMnO₄",
    desc:"গাঢ় বেগুনি অক্সিডাইজিং এজেন্ট। জীবাণুনাশক হিসেবে ব্যবহৃত।",
    atoms:[
      {...K, x:40, y:90,r:22},
      {...Mn,x:100,y:90,r:19},
      {...O, x:100,y:48,r:15},{...O,x:140,y:68,r:15},{...O,x:140,y:112,r:15},{...O,x:100,y:132,r:15},
    ],
    bonds:[[0,1],[1,2],[1,3],[1,4],[1,5]] },

  { id:"nh4no3",        category:"inorganic", name:"Ammonium Nitrate",      nameBn:"অ্যামোনিয়াম নাইট্রেট",   formula:"NH₄NO₃",
    desc:"সার ও বিস্ফোরক হিসেবে ব্যবহৃত। NH₄⁺ ও NO₃⁻ আয়নে গঠিত।",
    atoms:[
      {...N,x:55,y:90,r:18},
      {...H,x:28,y:70,r:10},{...H,x:55,y:62,r:10},{...H,x:82,y:70,r:10},{...H,x:55,y:118,r:10},
      {...N,x:135,y:90,r:18},
      {...O,x:135,y:55,r:15},{...O,x:165,y:110,r:15},{...O,x:105,y:110,r:15},
    ],
    bonds:[[0,1],[0,2],[0,3],[0,4],[5,6],[5,7],[5,8]] },

  // ── D. Biological Structures ──────────────────────────────────────────────
  { id:"dna",           category:"biological", name:"DNA (Double Helix)", nameBn:"ডিএনএ (ডাবল হেলিক্স)", formula:"DNA",
    desc:"জীবনের নীলনকশা। দুটি বিপরীত দিকমুখী পলিনিউক্লিওটাইড শিকল হাইড্রোজেন বন্ধনে যুক্ত।",
    atoms:[
      // Left backbone
      {...P,x:45,y:30,r:10},{...O,x:62,y:30,r:8},
      {...P,x:45,y:70,r:10},{...O,x:62,y:70,r:8},
      {...P,x:45,y:110,r:10},{...O,x:62,y:110,r:8},
      {...P,x:45,y:150,r:10},{...O,x:62,y:150,r:8},
      // Right backbone
      {...P,x:155,y:30,r:10},{...O,x:138,y:30,r:8},
      {...P,x:155,y:70,r:10},{...O,x:138,y:70,r:8},
      {...P,x:155,y:110,r:10},{...O,x:138,y:110,r:8},
      {...P,x:155,y:150,r:10},{...O,x:138,y:150,r:8},
      // Base pairs
      {el:"A",x:78,y:30,r:9,color:"#f97316"},{el:"T",x:122,y:30,r:9,color:"#8b5cf6"},
      {el:"G",x:78,y:70,r:9,color:"#22c55e"},{el:"C",x:122,y:70,r:9,color:"#ef4444"},
      {el:"T",x:78,y:110,r:9,color:"#8b5cf6"},{el:"A",x:122,y:110,r:9,color:"#f97316"},
      {el:"C",x:78,y:150,r:9,color:"#ef4444"},{el:"G",x:122,y:150,r:9,color:"#22c55e"},
    ],
    bonds:[
      [0,1],[2,3],[4,5],[6,7],[0,2],[2,4],[4,6],
      [8,9],[10,11],[12,13],[14,15],[8,10],[10,12],[12,14],
      [1,16],[16,17],[17,9],[3,18],[18,19],[19,11],[5,20],[20,21],[21,13],[7,22],[22,23],[23,15],
    ] },

  { id:"rna",           category:"biological", name:"RNA (Single Strand)", nameBn:"আরএনএ (একক শিকল)", formula:"RNA",
    desc:"প্রোটিন সংশ্লেষণের মাধ্যম। DNA-র মতো কিন্তু একক শিকলে এবং Uracil থাকে।",
    atoms:[
      {...P,x:75,y:25,r:11},{...O,x:92,y:22,r:8},
      {el:"A",x:100,y:48,r:12,color:"#f97316"},
      {...P,x:95,y:72,r:11},{...O,x:112,y:70,r:8},
      {el:"U",x:120,y:92,r:12,color:"#ec4899"},
      {...P,x:115,y:115,r:11},{...O,x:130,y:113,r:8},
      {el:"G",x:122,y:135,r:12,color:"#22c55e"},
      {...P,x:108,y:155,r:11},{...O,x:120,y:153,r:8},
      {el:"C",x:97,y:165,r:12,color:"#ef4444"},
      {...H,x:60,y:20,r:8},{...H,x:75,y:8,r:8},
      {...H,x:95,y:175,r:8},{...H,x:80,y:165,r:8},
    ],
    bonds:[[0,1],[0,2],[2,3],[3,4],[3,5],[5,6],[6,7],[6,8],[8,9],[9,10],[9,11],[0,12],[0,13],[10,14],[10,15]] },

  { id:"hemoglobin",    category:"biological", name:"Hemoglobin (Heme Group)", nameBn:"হিমোগ্লোবিন (হিম গ্রুপ)", formula:"Fe-Porphyrin",
    desc:"রক্তের অক্সিজেন পরিবাহক। কেন্দ্রে Fe²⁺ আয়ন সহ পোরফাইরিন রিং।",
    atoms:[
      {...Fe,x:100,y:90,r:18},
      {...N,x:75,y:68,r:13},{...N,x:125,y:68,r:13},{...N,x:75,y:112,r:13},{...N,x:125,y:112,r:13},
      {...C,x:58,y:53,r:11},{...C,x:100,y:48,r:11},{...C,x:142,y:53,r:11},
      {...C,x:58,y:127,r:11},{...C,x:100,y:132,r:11},{...C,x:142,y:127,r:11},
      {...C,x:40,y:68,r:11},{...C,x:40,y:112,r:11},
      {...C,x:160,y:68,r:11},{...C,x:160,y:112,r:11},
      {...O,x:100,y:62,r:13},
    ],
    bonds:[
      [0,1],[0,2],[0,3],[0,4],
      [1,5],[1,6],[2,6],[2,7],
      [3,8],[3,9],[4,9],[4,10],
      [1,11],[3,12],[2,13],[4,14],
      [5,11],[8,12],[7,13],[10,14],
      [6,15],
    ] },

  { id:"protein-helix", category:"biological", name:"Protein Alpha-Helix", nameBn:"প্রোটিন আলফা-হেলিক্স", formula:"Polypeptide",
    desc:"প্রোটিনের সর্বাধিক সাধারণ সেকেন্ডারি গঠন। হাইড্রোজেন বন্ধন দ্বারা স্থিতিশীল।",
    atoms:[
      {...N,x:75,y:28,r:12},{...C,x:100,y:38,r:12},{...C,x:120,y:28,r:12},{...O,x:135,y:18,r:11},
      {...N,x:88,y:60,r:12},{...C,x:112,y:68,r:12},{...C,x:100,y:82,r:12},{...O,x:80,y:80,r:11},
      {...N,x:118,y:100,r:12},{...C,x:105,y:114,r:12},{...C,x:88,y:122,r:12},{...O,x:72,y:115,r:11},
      {...N,x:100,y:140,r:12},{...C,x:115,y:152,r:12},{...C,x:105,y:165,r:12},{...O,x:88,y:168,r:11},
      {...H,x:62,y:22,r:8},{...H,x:95,y:170,r:8},
    ],
    bonds:[
      [0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[6,7],[4,8],[8,9],[9,10],[10,11],[8,12],[12,13],[13,14],[14,15],
      [0,16],[3,8],[7,12],[11,16],[14,17],
    ] },

  // ── E. Crystal Structures ─────────────────────────────────────────────────
  { id:"nacl-crystal",   category:"crystal", name:"NaCl Crystal Lattice", nameBn:"NaCl ক্রিস্টাল জালক", formula:"(NaCl)ₙ",
    desc:"সোডিয়াম ক্লোরাইডের ফেস-সেন্টার্ড কিউবিক জালক গঠন।",
    atoms:[
      {...Na,x:50,y:50,r:14},{...Cl,x:100,y:50,r:16},{...Na,x:150,y:50,r:14},
      {...Cl,x:50,y:90,r:16},{...Na,x:100,y:90,r:14},{...Cl,x:150,y:90,r:16},
      {...Na,x:50,y:130,r:14},{...Cl,x:100,y:130,r:16},{...Na,x:150,y:130,r:14},
    ],
    bonds:[[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,8],[6,7],[7,8]] },

  { id:"diamond",        category:"crystal", name:"Diamond Structure", nameBn:"হীরার গঠন", formula:"Cₙ",
    desc:"প্রকৃতির সবচেয়ে কঠিন পদার্থ। প্রতিটি C পরমাণু চারটি C-এর সাথে টেট্রাহেড্রাল বন্ধনে যুক্ত।",
    atoms:[
      {...C,x:100,y:40,r:14},
      {...C,x:65,y:65,r:14},{...C,x:135,y:65,r:14},
      {...C,x:48,y:100,r:14},{...C,x:100,y:90,r:14},{...C,x:152,y:100,r:14},
      {...C,x:65,y:130,r:14},{...C,x:135,y:130,r:14},
      {...C,x:100,y:155,r:14},
    ],
    bonds:[[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7],[6,8],[7,8]] },

  { id:"graphite",       category:"crystal", name:"Graphite Structure", nameBn:"গ্রাফাইটের গঠন", formula:"Cₙ",
    desc:"পেন্সিল ও লুব্রিকেন্টে ব্যবহৃত। স্তরে স্তরে হেক্সাগোনাল কার্বন জালক।",
    atoms:[
      {...C,x:85,y:40,r:13},{...C,x:115,y:40,r:13},
      {...C,x:68,y:68,r:13},{...C,x:100,y:60,r:13},{...C,x:132,y:68,r:13},
      {...C,x:68,y:100,r:13},{...C,x:100,y:92,r:13},{...C,x:132,y:100,r:13},
      {...C,x:85,y:128,r:13},{...C,x:115,y:128,r:13},
      {...C,x:68,y:140,r:13},{...C,x:132,y:140,r:13},
    ],
    bonds:[[0,2],[0,3],[1,3],[1,4],[2,5],[3,6],[4,7],[5,6],[6,7],[5,10],[7,11],[8,10],[9,11],[8,9]] },

  { id:"quartz",         category:"crystal", name:"Quartz (SiO₂)", nameBn:"কোয়ার্টজ (SiO₂)", formula:"SiO₂",
    desc:"বালি ও কাচের মূল উপাদান। প্রতিটি Si পরমাণু চারটি O-এর সাথে যুক্ত।",
    atoms:[
      {...Si,x:100,y:85,r:18},
      {...O,x:65,y:55,r:14},{...O,x:135,y:55,r:14},
      {...O,x:65,y:115,r:14},{...O,x:135,y:115,r:14},
      {...Si,x:42,y:40,r:15},{...Si,x:158,y:40,r:15},
      {...Si,x:42,y:128,r:15},{...Si,x:158,y:128,r:15},
    ],
    bonds:[[0,1],[0,2],[0,3],[0,4],[1,5],[2,6],[3,7],[4,8]] },

  // ── F. Industrial Compounds ────────────────────────────────────────────────
  // ammonia already in Basic as NH₃

  { id:"ethylene-industrial", category:"industrial", name:"Ethylene (Industrial)", nameBn:"ইথিলিন (শিল্প)", formula:"C₂H₄",
    desc:"প্লাস্টিক শিল্পের ভিত্তি। পেট্রোকেমিক্যাল শিল্পে সর্বাধিক উৎপাদিত জৈব যৌগ।",
    atoms:[{...C,x:78,y:90,r:18},{...C,x:122,y:90,r:18},{...H,x:53,y:60,r:11},{...H,x:53,y:120,r:11},{...H,x:147,y:60,r:11},{...H,x:147,y:120,r:11}],
    bonds:[[0,1],[0,2],[0,3],[1,4],[1,5]] },

  { id:"polyethylene",   category:"industrial", name:"Polyethylene (Fragment)", nameBn:"পলিইথিলিন (খণ্ড)", formula:"(C₂H₄)ₙ",
    desc:"সবচেয়ে বেশি উৎপাদিত প্লাস্টিক। ইথিলিনের পলিমারাইজেশন থেকে তৈরি।",
    atoms:[
      {...C,x:30,y:90,r:15},{...C,x:62,y:90,r:15},{...C,x:94,y:90,r:15},{...C,x:126,y:90,r:15},{...C,x:158,y:90,r:15},
      {...H,x:20,y:68,r:9},{...H,x:20,y:112,r:9},
      {...H,x:52,y:68,r:9},{...H,x:52,y:112,r:9},
      {...H,x:84,y:68,r:9},{...H,x:84,y:112,r:9},
      {...H,x:116,y:68,r:9},{...H,x:116,y:112,r:9},
      {...H,x:168,y:68,r:9},{...H,x:168,y:112,r:9},
    ],
    bonds:[[0,1],[1,2],[2,3],[3,4],[0,5],[0,6],[1,7],[1,8],[2,9],[2,10],[3,11],[3,12],[4,13],[4,14]] },

  // ── Extra from original list ────────────────────────────────────────────────
  { id:"ozone",     category:"inorganic", name:"Ozone",   nameBn:"ওজোন",   formula:"O₃",
    desc:"ওজোন স্তর গঠন করে, UV রশ্মি শোষণ করে। বাঁকা (bent) গঠন।",
    atoms:[{...O,x:55,y:115,r:19},{...O,x:100,y:65,r:19},{...O,x:145,y:115,r:19}],
    bonds:[[0,1],[1,2]] },

  { id:"h2s",       category:"inorganic", name:"Hydrogen Sulfide", nameBn:"হাইড্রোজেন সালফাইড", formula:"H₂S",
    desc:"পচা ডিমের গন্ধযুক্ত বিষাক্ত গ্যাস। বাঁকা আণবিক গঠন।",
    atoms:[{...S,x:100,y:75,r:21},{...H,x:65,y:120,r:14},{...H,x:135,y:120,r:14}],
    bonds:[[0,1],[0,2]] },

  { id:"h2o2",      category:"inorganic", name:"Hydrogen Peroxide", nameBn:"হাইড্রোজেন পার-অক্সাইড", formula:"H₂O₂",
    desc:"জীবাণুনাশক। O-O একক বন্ধন, অস্থিতিশীল।",
    atoms:[{...H,x:35,y:65,r:12},{...O,x:75,y:95,r:18},{...O,x:125,y:95,r:18},{...H,x:165,y:65,r:12}],
    bonds:[[0,1],[1,2],[2,3]] },

  { id:"co",        category:"basic", name:"Carbon Monoxide", nameBn:"কার্বন মনোক্সাইড", formula:"CO",
    desc:"বিষাক্ত গ্যাস, অসম্পূর্ণ দহনে উৎপন্ন। ট্রিপল বন্ধন (C≡O)।",
    atoms:[{...C,x:65,y:90,r:19},{...O,x:135,y:90,r:21}], bonds:[[0,1]] },
];

// ─── Category config ───────────────────────────────────────────────────────────
const categories: { id: string; label: string; labelBn: string; emoji: string }[] = [
  { id:"basic",       label:"Basic Molecules",       labelBn:"মৌলিক অণু",           emoji:"⚛️" },
  { id:"hydrocarbon", label:"Hydrocarbons",           labelBn:"হাইড্রোকার্বন",       emoji:"🛢️" },
  { id:"alcohol",     label:"Alcohols",               labelBn:"অ্যালকোহল",           emoji:"🍶" },
  { id:"acid-organic",label:"Organic Acids",          labelBn:"জৈব এসিড",            emoji:"🧪" },
  { id:"biomolecule", label:"Biomolecules",           labelBn:"জৈব-অণু",             emoji:"🧬" },
  { id:"inorganic",   label:"Inorganic Compounds",   labelBn:"অজৈব যৌগ",            emoji:"⚗️" },
  { id:"biological",  label:"Biological Structures", labelBn:"জৈবিক কাঠামো",        emoji:"🔬" },
  { id:"crystal",     label:"Crystal Structures",    labelBn:"ক্রিস্টাল গঠন",      emoji:"💎" },
  { id:"industrial",  label:"Industrial Compounds",  labelBn:"শিল্প যৌগ",           emoji:"🏭" },
];

// ─── Vis-mode helpers ─────────────────────────────────────────────────────────
const visModes: { id: VisMode; label: string; labelBn: string; icon: string }[] = [
  { id:"ball-stick",    label:"Ball & Stick",   labelBn:"বল ও স্টিক",     icon:"⚪" },
  { id:"space-fill",    label:"Space Filling",  labelBn:"স্পেস ফিলিং",    icon:"🔵" },
  { id:"wireframe",     label:"Wireframe",      labelBn:"ওয়্যারফ্রেম",    icon:"🔷" },
  { id:"electron-cloud",label:"Electron Cloud", labelBn:"ইলেকট্রন ক্লাউড",icon:"☁️" },
];

// ─── MoleculeViewer ───────────────────────────────────────────────────────────
function MoleculeViewer({
  mol, visMode, showLabels, showBondAngles, showBondLengths,
}: {
  mol: Molecule;
  visMode: VisMode;
  showLabels: boolean;
  showBondAngles: boolean;
  showBondLengths: boolean;
}) {
  const [rotation,  setRotation]  = useState(0);
  const [scale,     setScale]     = useState(1);
  const [panX,      setPanX]      = useState(0);
  const [panY,      setPanY]      = useState(0);
  const [dragging,  setDragging]  = useState(false);
  const [panning,   setPanning]   = useState(false);
  const [startPos,  setStartPos]  = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const panningRef  = useRef(false);

  // Reset when molecule changes
  useEffect(() => { setRotation(0); setScale(1); setPanX(0); setPanY(0); }, [mol.id]);
  useEffect(() => { draggingRef.current = dragging; }, [dragging]);
  useEffect(() => { panningRef.current = panning; }, [panning]);

  // Auto-rotate
  useEffect(() => {
    let id: number;
    const tick = () => {
      if (!draggingRef.current && !panningRef.current) setRotation(r => r + 0.4);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const onDown = (cx: number, cy: number, isRight: boolean) => {
    if (isRight) { setPanning(true); setStartPos({ x: cx, y: cy }); }
    else         { setDragging(true); setStartPos({ x: cx, y: cy }); }
  };
  const onMove = (cx: number, cy: number) => {
    if (draggingRef.current) { setRotation(r => r + (cx - startPos.x) * 0.5); setStartPos({ x: cx, y: cy }); }
    if (panningRef.current)  { setPanX(p => p + cx - startPos.x); setPanY(p => p + cy - startPos.y); setStartPos({ x: cx, y: cy }); }
  };
  const onUp = () => { setDragging(false); setPanning(false); };

  // Radii multipliers per mode
  const rMult = visMode === "space-fill" ? 2.0 : visMode === "wireframe" ? 0 : 1;
  const showAtomCircle = visMode !== "wireframe";

  // Bond-midpoint helper for angle/length overlays
  const bondMid = (a: AtomDef, b: AtomDef, angle: number, iIdx: number) => ({
    x: (a.x + b.x) / 2 + Math.sin(iIdx * 0.3 + angle * Math.PI / 180) * 1.5,
    y: (a.y + b.y) / 2,
  });

  // Bond-angle triplets: for each central atom find pairs of neighbours
  const bondAngleTriplets: { cx: number; cy: number; label: string }[] = [];
  if (showBondAngles && mol.bonds.length >= 2) {
    const adj: Record<number, number[]> = {};
    mol.bonds.forEach(([a, b]) => {
      (adj[a] = adj[a] || []).push(b);
      (adj[b] = adj[b] || []).push(a);
    });
    const seen = new Set<string>();
    Object.entries(adj).forEach(([center, nbrs]) => {
      const ci = parseInt(center);
      if (nbrs.length < 2) return;
      const A = mol.atoms[nbrs[0]], B = mol.atoms[nbrs[1]], C = mol.atoms[ci];
      const key = [nbrs[0], ci, nbrs[1]].sort().join("-");
      if (seen.has(key)) return;
      seen.add(key);
      const dx1 = A.x - C.x, dy1 = A.y - C.y;
      const dx2 = B.x - C.x, dy2 = B.y - C.y;
      const ang = Math.round(Math.acos((dx1*dx2+dy1*dy2)/(Math.hypot(dx1,dy1)*Math.hypot(dx2,dy2))) * 180 / Math.PI);
      bondAngleTriplets.push({ cx: C.x, cy: C.y, label: `${ang}°` });
    });
  }

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden select-none">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/60 border-b border-slate-700/50 flex-wrap gap-1">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Move className="w-3 h-3"/>
          <span className="hidden sm:inline">ড্র্যাগ=ঘোরাও</span>
          <span className="mx-1 opacity-40">|</span>
          <ZoomIn className="w-3 h-3"/>
          <span className="hidden sm:inline">স্ক্রোল=জুম</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5"/>
          </button>
          <button onClick={() => setScale(s => Math.max(0.4, s - 0.2))}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5"/>
          </button>
          <button onClick={() => { setScale(1); setRotation(0); setPanX(0); setPanY(0); }}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300" title="Reset">
            <RotateCcw className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative"
        onMouseDown={e => { e.preventDefault(); onDown(e.clientX, e.clientY, e.button === 2); }}
        onMouseMove={e => onMove(e.clientX, e.clientY)}
        onMouseUp={onUp} onMouseLeave={onUp}
        onContextMenu={e => e.preventDefault()}
        onTouchStart={e => onDown(e.touches[0].clientX, e.touches[0].clientY, false)}
        onTouchMove={e => onMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={onUp}
        onWheel={e => { e.preventDefault(); setScale(s => Math.min(2.5, Math.max(0.4, s - e.deltaY * 0.001))); }}
        style={{ cursor: dragging ? "grabbing" : panning ? "move" : "grab", touchAction: "none" }}
      >
        <svg viewBox="0 0 200 190" className="w-full"
          style={{ transform: `scale(${scale}) translate(${panX/scale}px,${panY/scale}px)`, transformOrigin: "center" }}>

          {/* Electron cloud mode – blurred glow behind atoms */}
          {visMode === "electron-cloud" && mol.atoms.map((atom, i) => {
            const angle = rotation * Math.PI / 180;
            const x = atom.x + Math.sin(i * 0.5 + angle) * 5;
            return (
              <ellipse key={`cloud-${i}`} cx={x} cy={atom.y}
                rx={atom.r * 2.5} ry={atom.r * 2.0}
                fill={atom.color} opacity="0.18"
                style={{ filter: "blur(6px)" }} />
            );
          })}

          {/* Bonds */}
          {mol.bonds.map(([a, b], i) => {
            const A = mol.atoms[a], B = mol.atoms[b];
            const angle = rotation * Math.PI / 180;
            const ax = A.x + Math.sin(i * 0.3 + angle) * 3;
            const bx = B.x + Math.sin(i * 0.3 + angle) * 3;
            if (visMode === "space-fill") return null; // no bonds in space-fill
            const strokeW = visMode === "wireframe" ? 2 : visMode === "electron-cloud" ? 1.5 : 2.5;
            const strokeC = visMode === "wireframe" ? "#38bdf8" : visMode === "electron-cloud" ? "#7dd3fc" : "#475569";
            return (
              <g key={i}>
                <line x1={ax} y1={A.y} x2={bx} y2={B.y} stroke={strokeC} strokeWidth={strokeW} strokeLinecap="round"/>
                {/* Bond-length label */}
                {showBondLengths && (() => {
                  const mid = bondMid(A, B, rotation, i);
                  return (
                    <text x={mid.x} y={mid.y - 5} textAnchor="middle" fill="#fbbf24" fontSize="6" fontWeight="bold">
                      {`b${i+1}`}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Atoms */}
          {showAtomCircle && mol.atoms.map((atom, i) => {
            const angle = rotation * Math.PI / 180;
            const x = atom.x + Math.sin(i * 0.5 + angle) * 5;
            const r = atom.r * rMult;
            const isCloud = visMode === "electron-cloud";
            return (
              <g key={i}>
                {isCloud && (
                  <circle cx={x} cy={atom.y} r={r * 1.6} fill={atom.color} opacity="0.15"/>
                )}
                <circle cx={x} cy={atom.y} r={r}
                  fill={atom.color}
                  stroke={isCloud ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.25)"}
                  strokeWidth={visMode === "ball-stick" ? 1.5 : 1}/>
                {/* Atom label */}
                {showLabels && (
                  <text x={x} y={atom.y + (r * 0.35)} textAnchor="middle"
                    fill="white" fontSize={Math.max(6, r * 0.85)} fontWeight="bold"
                    style={{ pointerEvents: "none" }}>{atom.el}</text>
                )}
                {/* Default label when no showLabels – small tag */}
                {!showLabels && visMode !== "space-fill" && (
                  <text x={x} y={atom.y + 4} textAnchor="middle"
                    fill="white" fontSize={atom.r * 0.85} fontWeight="bold"
                    style={{ pointerEvents: "none" }}>{atom.el}</text>
                )}
              </g>
            );
          })}

          {/* Bond-angle markers */}
          {showBondAngles && bondAngleTriplets.map((t, i) => (
            <text key={i} x={t.cx} y={t.cy - 16} textAnchor="middle"
              fill="#34d399" fontSize="6.5" fontWeight="bold">{t.label}</text>
          ))}

        </svg>
      </div>

      {/* Bond-length legend */}
      {showBondLengths && mol.bonds.length > 0 && (
        <div className="px-3 py-2 bg-slate-800/50 flex flex-wrap gap-x-3 gap-y-0.5">
          {mol.bonds.map((_, i) => {
            const sci = scienceDB[mol.id] || defaultScience;
            const len = sci.bondLengths[i] ?? sci.bondLengths[0];
            return (
              <span key={i} className="text-xs text-amber-400">
                <span className="font-bold">b{i+1}:</span> {len}
              </span>
            );
          })}
        </div>
      )}

      <div className="px-4 pb-2 pt-1 text-center">
        <p className="text-xs text-slate-600">↔ ড্র্যাগ=ঘোরাও &bull; স্ক্রোল=জুম &bull; Right-drag=প্যান</p>
      </div>
    </div>
  );
}

// ─── Science Info Panel ───────────────────────────────────────────────────────
function SciencePanel({ mol }: { mol: Molecule }) {
  const sci = scienceDB[mol.id] || defaultScience;
  const rows: { icon: React.ReactNode; label: string; value: string | string[] }[] = [
    { icon: <Triangle  className="w-3.5 h-3.5"/>, label:"আণবিক জ্যামিতি",   value: sci.geometry },
    { icon: <GitBranch className="w-3.5 h-3.5"/>, label:"হাইব্রিডাইজেশন",   value: sci.hybridization },
    { icon: <Zap       className="w-3.5 h-3.5"/>, label:"পোলারিটি",          value: sci.polarity },
    { icon: <Activity  className="w-3.5 h-3.5"/>, label:"ডাইপোল মোমেন্ট",   value: sci.dipole },
    { icon: <Ruler     className="w-3.5 h-3.5"/>, label:"বন্ধ কোণ (Bond Angle)", value: sci.bondAngles },
    { icon: <Ruler     className="w-3.5 h-3.5"/>, label:"বন্ধ দৈর্ঘ্য (Bond Length)", value: sci.bondLengths },
    { icon: <Layers    className="w-3.5 h-3.5"/>, label:"ইলেকট্রন ঘনত্ব",   value: sci.electronDensity },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/40 border-b border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5"/> আণবিক তথ্য
        </p>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5">
            <span className="text-primary-500 mt-0.5 shrink-0">{row.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">{row.label}</p>
              {Array.isArray(row.value)
                ? row.value.map((v, j) => <p key={j} className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v}</p>)
                : <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{row.value}</p>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MoleculesPage() {
  const [selected,         setSelected]         = useState<Molecule>(molecules[0]);
  const [expandedCategory, setExpandedCategory] = useState<string>("basic");
  const [visMode,          setVisMode]          = useState<VisMode>("ball-stick");
  const [showLabels,       setShowLabels]       = useState(true);
  const [showBondAngles,   setShowBondAngles]   = useState(false);
  const [showBondLengths,  setShowBondLengths]  = useState(false);
  const [showScience,      setShowScience]      = useState(false);

  const toggleCat = (id: string) => setExpandedCategory(prev => prev === id ? "" : id);

  const selectMol = (mol: Molecule) => {
    setSelected(mol);
    // keep angle/length off by default on new selection for cleanliness
    setShowBondAngles(false);
    setShowBondLengths(false);
    setShowScience(false);
  };

  // Toggle-button helper
  const Toggle = ({
    active, onClick, icon, label,
  }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
        active
          ? "gradient-bg text-white shadow"
          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
      }`}>
      {icon}{label}
    </button>
  );

  return (
    <div className="section-padding">
      <div className="container-max">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Atom className="w-4 h-4" /> আণবিক দর্শক
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">3D Molecule Viewer</h1>
          <p className="text-slate-600 dark:text-slate-400">অণুর গঠন ইন্টারেক্টিভভাবে দেখো ও ঘোরাও</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{molecules.length}টি অণু • {categories.length}টি ক্যাটাগরি</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-6">

          {/* ── Left: Molecule List ── */}
          <div className="space-y-2 max-h-[82vh] overflow-y-auto pr-1 rounded-2xl">
            {categories.map(cat => {
              const mols = molecules.filter(m => m.category === cat.id);
              if (!mols.length) return null;
              const isOpen = expandedCategory === cat.id;
              return (
                <div key={cat.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <button onClick={() => toggleCat(cat.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <div className="text-left">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{cat.labelBn}</p>
                        <p className="text-xs text-slate-500">{cat.label} ({mols.length})</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400"/> : <ChevronRight className="w-4 h-4 text-slate-400"/>}
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
                      {mols.map(mol => (
                        <button key={mol.id} onClick={() => selectMol(mol)}
                          className={`w-full text-left px-4 py-3 transition-all flex items-center justify-between ${
                            selected.id === mol.id
                              ? "gradient-bg text-white"
                              : "hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-700 dark:text-slate-300"
                          }`}>
                          <div>
                            <p className="font-semibold text-sm">{mol.nameBn}</p>
                            <p className={`text-xs ${selected.id === mol.id ? "text-white/75" : "text-slate-500 dark:text-slate-400"}`}>{mol.name}</p>
                          </div>
                          <span className={`font-mono text-sm font-bold ml-2 shrink-0 ${selected.id === mol.id ? "text-white" : "text-primary-600 dark:text-primary-400"}`}>
                            {mol.formula}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right: Viewer + Controls ── */}
          <div className="space-y-4">
            <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">

              {/* Molecule header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selected.nameBn}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{selected.name}</p>
                  </div>
                  <span className="font-mono text-2xl font-bold text-primary-600 dark:text-primary-400 shrink-0">{selected.formula}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selected.desc}</p>
              </div>

              {/* ── Visualization Mode tabs ── */}
              <div className="px-5 pt-4 pb-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5"/> Visualization Mode
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {visModes.map(vm => (
                    <button key={vm.id} onClick={() => setVisMode(vm.id)}
                      className={`flex flex-col items-center gap-1 py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                        visMode === vm.id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
                      }`}>
                      <span className="text-base">{vm.icon}</span>
                      <span className="text-center leading-tight">{vm.labelBn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Viewer Features toggle bar ── */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Viewer Features</p>
                <div className="flex flex-wrap gap-2">
                  <Toggle active={showLabels}      onClick={() => setShowLabels(v => !v)}      icon={<Tag      className="w-3 h-3"/>} label="Atom Labels"/>
                  <Toggle active={showBondAngles}  onClick={() => setShowBondAngles(v => !v)}  icon={<Triangle className="w-3 h-3"/>} label="Bond Angle"/>
                  <Toggle active={showBondLengths} onClick={() => setShowBondLengths(v => !v)} icon={<Ruler    className="w-3 h-3"/>} label="Bond Length"/>
                  <Toggle active={showScience}     onClick={() => setShowScience(v => !v)}     icon={<Info     className="w-3 h-3"/>} label="বিস্তারিত তথ্য"/>
                </div>
              </div>

              {/* ── SVG Viewer ── */}
              <div className="p-4">
                <MoleculeViewer
                  mol={selected}
                  visMode={visMode}
                  showLabels={showLabels}
                  showBondAngles={showBondAngles}
                  showBondLengths={showBondLengths}
                />
              </div>

              {/* ── Atom Legend ── */}
              <div className="px-5 pb-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5"/> পরমাণু তালিকা
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(selected.atoms.map(a => a.el))).map(el => {
                    const atom = selected.atoms.find(a => a.el === el)!;
                    const count = selected.atoms.filter(a => a.el === el).length;
                    return (
                      <div key={el} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: atom.color }}/>
                        <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{el}</span>
                        <span className="text-xs text-slate-500">×{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* ── Science info panel (expandable) ── */}
            <AnimatePresence>
              {showScience && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden"
                >
                  <SciencePanel mol={selected}/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
