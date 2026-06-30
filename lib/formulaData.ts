// lib/formulaData.ts — সকল ফর্মুলার স্ট্যাটিক ডেটা (Bengali + English)

import { Formula } from "@/types";

export const STATIC_FORMULAS: Formula[] = [

  // ══════════════════════════════════════════════════════
  // A. Basic Chemistry Formulas — মৌলিক রসায়ন সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "mole-formula",
    name: "Mole Formula",
    nameBn: "মোল সূত্র",
    formula: "n = m / M",
    latexFormula: "n = \\frac{m}{M}",
    category: "physical-chemistry",
    variables: [
      { symbol: "n", meaning: "মোলের সংখ্যা", unit: "mol" },
      { symbol: "m", meaning: "পদার্থের ভর", unit: "g" },
      { symbol: "M", meaning: "মোলার ভর", unit: "g/mol" },
    ],
    explanation:
      "মোল সূত্র দিয়ে কোনো পদার্থের ভর থেকে মোলের সংখ্যা বের করা হয়। ১ মোল = ৬.০২২ × ১০²³ টি কণা।",
    example: {
      question: "১৮ গ্রাম পানির (H₂O) মোলের সংখ্যা বের করো। (M = 18 g/mol)",
      solution:
        "n = m / M\nn = 18 / 18\nn = 1 mol\nঅতএব, ১৮ গ্রাম পানিতে ১ মোল পানি আছে।",
    },
    relatedFormulas: ["avogadro-formula", "molarity-formula", "empirical-formula"],
    relatedTopics: [],
  },

  {
    id: "avogadro-formula",
    name: "Avogadro Formula",
    nameBn: "অ্যাভোগাড্রো সূত্র",
    formula: "N = n × Nₐ",
    latexFormula: "N = n \\times N_A",
    category: "physical-chemistry",
    variables: [
      { symbol: "N", meaning: "কণার মোট সংখ্যা", unit: "টি" },
      { symbol: "n", meaning: "মোলের সংখ্যা", unit: "mol" },
      { symbol: "Nₐ", meaning: "অ্যাভোগাড্রো সংখ্যা (6.022 × 10²³)", unit: "mol⁻¹" },
    ],
    explanation:
      "অ্যাভোগাড্রো সংখ্যা (Nₐ = 6.022 × 10²³) ব্যবহার করে কোনো পদার্থের মোল থেকে মোট কণার সংখ্যা নির্ধারণ করা হয়।",
    example: {
      question: "২ মোল CO₂-তে মোট কণার সংখ্যা কত?",
      solution:
        "N = n × Nₐ\nN = 2 × 6.022 × 10²³\nN = 1.2044 × 10²⁴ টি অণু",
    },
    relatedFormulas: ["mole-formula"],
    relatedTopics: [],
  },

  {
    id: "density-formula",
    name: "Density Formula",
    nameBn: "ঘনত্ব সূত্র",
    formula: "ρ = m / V",
    latexFormula: "\\rho = \\frac{m}{V}",
    category: "physical-chemistry",
    variables: [
      { symbol: "ρ", meaning: "ঘনত্ব", unit: "g/mL বা g/cm³" },
      { symbol: "m", meaning: "ভর", unit: "g" },
      { symbol: "V", meaning: "আয়তন", unit: "mL বা cm³" },
    ],
    explanation:
      "ঘনত্ব হলো একক আয়তনের ভর। তরল ও কঠিন পদার্থের ঘনত্ব g/mL বা g/cm³ এককে প্রকাশ করা হয়।",
    example: {
      question: "একটি তরলের ভর ২৫০ গ্রাম এবং আয়তন ২০০ mL হলে ঘনত্ব কত?",
      solution:
        "ρ = m / V\nρ = 250 / 200\nρ = 1.25 g/mL",
    },
    relatedFormulas: ["mole-formula"],
    relatedTopics: [],
  },

  {
    id: "percentage-composition",
    name: "Percentage Composition",
    nameBn: "শতকরা সংযুতি",
    formula: "% = (mₑ / M) × 100",
    latexFormula: "\\% = \\frac{m_e}{M} \\times 100",
    category: "physical-chemistry",
    variables: [
      { symbol: "mₑ", meaning: "মৌলের ভর (প্রতি মোলে)", unit: "g/mol" },
      { symbol: "M", meaning: "যৌগের মোলার ভর", unit: "g/mol" },
    ],
    explanation:
      "কোনো যৌগে একটি মৌলের শতকরা পরিমাণ জানতে সেই মৌলের মোট ভরকে যৌগের মোলার ভর দিয়ে ভাগ করে ১০০ গুণ করা হয়।",
    example: {
      question: "H₂O-তে হাইড্রোজেনের শতকরা পরিমাণ কত? (M_H₂O = 18)",
      solution:
        "% H = (2 / 18) × 100\n% H = 11.11%\nঅতএব, পানিতে হাইড্রোজেন ১১.১১% আছে।",
    },
    relatedFormulas: ["empirical-formula", "molecular-formula"],
    relatedTopics: [],
  },

  {
    id: "empirical-formula",
    name: "Empirical Formula",
    nameBn: "মূলানুপাতিক সংকেত",
    formula: "Ratio = n₁ : n₂ : n₃ (whole number)",
    latexFormula: "Ratio = n_1 : n_2 : n_3",
    category: "physical-chemistry",
    variables: [
      { symbol: "n₁, n₂...", meaning: "প্রতিটি মৌলের মোলের সংখ্যা", unit: "mol" },
    ],
    explanation:
      "মূলানুপাতিক সংকেত বের করতে প্রতিটি মৌলের শতকরা ভরকে তার পারমাণবিক ভর দিয়ে ভাগ করে ক্ষুদ্রতম মানে ভাগ করে পূর্ণ সংখ্যার অনুপাত বের করা হয়।",
    example: {
      question: "একটি যৌগে C=40%, H=6.67%, O=53.33% আছে। মূলানুপাতিক সংকেত কী?",
      solution:
        "C: 40/12 = 3.33\nH: 6.67/1 = 6.67\nO: 53.33/16 = 3.33\nঅনুপাত = 1:2:1\nমূলানুপাতিক সংকেত = CH₂O",
    },
    relatedFormulas: ["molecular-formula", "percentage-composition"],
    relatedTopics: [],
  },

  {
    id: "molecular-formula",
    name: "Molecular Formula",
    nameBn: "আণবিক সংকেত",
    formula: "MF = EF × n,  n = M / MEF",
    latexFormula: "n = \\frac{M}{M_{EF}}",
    category: "physical-chemistry",
    variables: [
      { symbol: "MF", meaning: "আণবিক সংকেত", unit: "—" },
      { symbol: "EF", meaning: "মূলানুপাতিক সংকেত", unit: "—" },
      { symbol: "n", meaning: "গুণক (পূর্ণ সংখ্যা)", unit: "—" },
      { symbol: "M", meaning: "প্রকৃত আণবিক ভর", unit: "g/mol" },
      { symbol: "MEF", meaning: "মূলানুপাতিক সংকেতের ভর", unit: "g/mol" },
    ],
    explanation:
      "আণবিক সংকেত বের করতে মূলানুপাতিক সংকেতের ভর দিয়ে প্রকৃত আণবিক ভর ভাগ করে গুণক (n) বের করা হয়, তারপর মূলানুপাতিক সংকেতকে n দিয়ে গুণ করা হয়।",
    example: {
      question: "CH₂O (M_EF=30) যৌগের প্রকৃত আণবিক ভর ৬০। আণবিক সংকেত কী?",
      solution:
        "n = M / MEF = 60 / 30 = 2\nআণবিক সংকেত = (CH₂O)₂ = C₂H₄O₂",
    },
    relatedFormulas: ["empirical-formula"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // B. Solution Chemistry Formulas — দ্রবণ রসায়ন সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "molarity-formula",
    name: "Molarity",
    nameBn: "মোলারিটি",
    formula: "M = n / V(L)",
    latexFormula: "M = \\frac{n}{V}",
    category: "physical-chemistry",
    variables: [
      { symbol: "M", meaning: "মোলারিটি", unit: "mol/L (M)" },
      { symbol: "n", meaning: "দ্রাবকের মোলের সংখ্যা", unit: "mol" },
      { symbol: "V", meaning: "দ্রবণের আয়তন", unit: "L" },
    ],
    explanation:
      "মোলারিটি হলো প্রতি লিটার দ্রবণে দ্রাবকের মোলের সংখ্যা। এটি সবচেয়ে বেশি ব্যবহৃত ঘনমাত্রা পরিমাপ।",
    example: {
      question: "০.৫ লিটার দ্রবণে ২ মোল NaOH থাকলে মোলারিটি কত?",
      solution:
        "M = n / V\nM = 2 / 0.5\nM = 4 mol/L = 4 M",
    },
    relatedFormulas: ["dilution-formula", "normality-formula"],
    relatedTopics: [],
  },

  {
    id: "molality-formula",
    name: "Molality",
    nameBn: "মোলালিটি",
    formula: "m = n / W(kg)",
    latexFormula: "m = \\frac{n}{W_{solvent}(kg)}",
    category: "physical-chemistry",
    variables: [
      { symbol: "m", meaning: "মোলালিটি", unit: "mol/kg" },
      { symbol: "n", meaning: "দ্রাবকের মোলের সংখ্যা", unit: "mol" },
      { symbol: "W", meaning: "দ্রাবক (solvent)-এর ভর", unit: "kg" },
    ],
    explanation:
      "মোলালিটি হলো প্রতি কিলোগ্রাম দ্রাবকে দ্রাবকের মোলের সংখ্যা। তাপমাত্রা পরিবর্তনেও মোলালিটি অপরিবর্তিত থাকে।",
    example: {
      question: "৫০০ গ্রাম পানিতে ২ মোল NaCl দ্রবীভূত করলে মোলালিটি কত?",
      solution:
        "m = n / W(kg)\nm = 2 / 0.5\nm = 4 mol/kg",
    },
    relatedFormulas: ["molarity-formula", "mole-fraction"],
    relatedTopics: [],
  },

  {
    id: "normality-formula",
    name: "Normality",
    nameBn: "নরমালিটি",
    formula: "N = n_eq / V(L)",
    latexFormula: "N = \\frac{n_{eq}}{V}",
    category: "analytical-chemistry",
    variables: [
      { symbol: "N", meaning: "নরমালিটি", unit: "eq/L (N)" },
      { symbol: "n_eq", meaning: "তুল্য মোলের সংখ্যা (equivalents)", unit: "eq" },
      { symbol: "V", meaning: "দ্রবণের আয়তন", unit: "L" },
      { symbol: "n_eq", meaning: "= মোলারিটি × n-factor", unit: "—" },
    ],
    explanation:
      "নরমালিটি হলো প্রতি লিটার দ্রবণে তুল্য মোলের সংখ্যা। অ্যাসিড-বেস ও রেডক্স টাইট্রেশনে ব্যবহার হয়। N = M × n-factor।",
    example: {
      question: "১ M H₂SO₄ দ্রবণের নরমালিটি কত? (n-factor = 2)",
      solution:
        "N = M × n-factor\nN = 1 × 2\nN = 2 N",
    },
    relatedFormulas: ["molarity-formula", "dilution-formula"],
    relatedTopics: [],
  },

  {
    id: "mole-fraction",
    name: "Mole Fraction",
    nameBn: "মোল ভগ্নাংশ",
    formula: "Xₐ = nₐ / (nₐ + nᵦ)",
    latexFormula: "X_A = \\frac{n_A}{n_A + n_B}",
    category: "physical-chemistry",
    variables: [
      { symbol: "Xₐ", meaning: "A উপাদানের মোল ভগ্নাংশ", unit: "মাত্রাহীন" },
      { symbol: "nₐ", meaning: "A উপাদানের মোল সংখ্যা", unit: "mol" },
      { symbol: "nᵦ", meaning: "B উপাদানের মোল সংখ্যা", unit: "mol" },
    ],
    explanation:
      "মোল ভগ্নাংশ হলো একটি উপাদানের মোলের সংখ্যাকে দ্রবণের মোট মোল সংখ্যা দিয়ে ভাগ করা। সমস্ত উপাদানের মোল ভগ্নাংশের যোগফল = ১।",
    example: {
      question: "৩ মোল ইথানল ও ৭ মোল পানির মিশ্রণে ইথানলের মোল ভগ্নাংশ কত?",
      solution:
        "X_ethanol = 3 / (3 + 7)\nX_ethanol = 3 / 10 = 0.3",
    },
    relatedFormulas: ["molality-formula"],
    relatedTopics: [],
  },

  {
    id: "dilution-formula",
    name: "Dilution Equation",
    nameBn: "লঘুকরণ সমীকরণ",
    formula: "C₁V₁ = C₂V₂",
    latexFormula: "C_1 V_1 = C_2 V_2",
    category: "physical-chemistry",
    variables: [
      { symbol: "C₁", meaning: "প্রাথমিক ঘনমাত্রা", unit: "M বা N" },
      { symbol: "V₁", meaning: "প্রাথমিক আয়তন", unit: "L বা mL" },
      { symbol: "C₂", meaning: "চূড়ান্ত ঘনমাত্রা", unit: "M বা N" },
      { symbol: "V₂", meaning: "চূড়ান্ত আয়তন", unit: "L বা mL" },
    ],
    explanation:
      "লঘুকরণে দ্রাবকের মোল পরিমাণ অপরিবর্তিত থাকে। তাই C₁V₁ = C₂V₂ সূত্র দিয়ে লঘু দ্রবণের ঘনমাত্রা বা আয়তন বের করা হয়।",
    example: {
      question: "৫ M HCl-এর ২০০ mL থেকে ১ M HCl কত mL তৈরি হবে?",
      solution:
        "C₁V₁ = C₂V₂\n5 × 200 = 1 × V₂\nV₂ = 1000 mL",
    },
    relatedFormulas: ["molarity-formula", "normality-formula"],
    relatedTopics: [],
  },

  {
    id: "ppm-formula",
    name: "ppm Formula",
    nameBn: "পিপিএম সূত্র",
    formula: "ppm = (m_solute / m_solution) × 10⁶",
    latexFormula: "ppm = \\frac{m_{solute}}{m_{solution}} \\times 10^6",
    category: "analytical-chemistry",
    variables: [
      { symbol: "m_solute", meaning: "দ্রাবকের ভর", unit: "g বা mg" },
      { symbol: "m_solution", meaning: "দ্রবণের ভর", unit: "g বা kg" },
    ],
    explanation:
      "ppm (parts per million) হলো প্রতি ১০ লক্ষ ভাগ দ্রবণে দ্রাবকের ভাগ। পরিবেশ রসায়নে দূষণকারী পদার্থের ঘনমাত্রা পরিমাপে ব্যবহার হয়।",
    example: {
      question: "১ কেজি পানিতে ৫ মিলিগ্রাম Pb²⁺ আয়ন থাকলে ঘনমাত্রা কত ppm?",
      solution:
        "ppm = (m_solute / m_solution) × 10⁶\nppm = (5 mg / 1,000,000 mg) × 10⁶\nppm = 5 ppm",
    },
    relatedFormulas: ["ppb-formula"],
    relatedTopics: [],
  },

  {
    id: "ppb-formula",
    name: "ppb Formula",
    nameBn: "পিপিবি সূত্র",
    formula: "ppb = (m_solute / m_solution) × 10⁹",
    latexFormula: "ppb = \\frac{m_{solute}}{m_{solution}} \\times 10^9",
    category: "analytical-chemistry",
    variables: [
      { symbol: "m_solute", meaning: "দ্রাবকের ভর", unit: "g বা µg" },
      { symbol: "m_solution", meaning: "দ্রবণের ভর", unit: "g বা kg" },
    ],
    explanation:
      "ppb (parts per billion) হলো প্রতি ১০০ কোটি ভাগ দ্রবণে দ্রাবকের ভাগ। অত্যন্ত কম ঘনমাত্রার দূষক পরিমাপে ব্যবহার হয়।",
    example: {
      question: "১ লিটার পানিতে ২ মাইক্রোগ্রাম As আছে। ঘনমাত্রা কত ppb?",
      solution:
        "ppb = (2 µg / 1,000,000,000 µg) × 10⁹\nppb = 2 ppb",
    },
    relatedFormulas: ["ppm-formula"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // C. Gas Law Formulas — গ্যাসের সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "boyles-law",
    name: "Boyle's Law",
    nameBn: "বয়েলের সূত্র",
    formula: "P₁V₁ = P₂V₂  (T = স্থির)",
    latexFormula: "P_1 V_1 = P_2 V_2",
    category: "physical-chemistry",
    variables: [
      { symbol: "P₁", meaning: "প্রাথমিক চাপ", unit: "atm বা Pa" },
      { symbol: "V₁", meaning: "প্রাথমিক আয়তন", unit: "L বা m³" },
      { symbol: "P₂", meaning: "চূড়ান্ত চাপ", unit: "atm বা Pa" },
      { symbol: "V₂", meaning: "চূড়ান্ত আয়তন", unit: "L বা m³" },
    ],
    explanation:
      "স্থির তাপমাত্রায় নির্দিষ্ট পরিমাণ গ্যাসের চাপ ও আয়তন পরস্পর ব্যস্তানুপাতিক। অর্থাৎ চাপ বাড়লে আয়তন কমে।",
    example: {
      question: "২ atm চাপে ৫ L গ্যাসকে ১ atm চাপে আনলে আয়তন কত হবে?",
      solution:
        "P₁V₁ = P₂V₂\n2 × 5 = 1 × V₂\nV₂ = 10 L",
    },
    relatedFormulas: ["charles-law", "combined-gas-law", "ideal-gas-equation"],
    relatedTopics: [],
  },

  {
    id: "charles-law",
    name: "Charles Law",
    nameBn: "চার্লসের সূত্র",
    formula: "V₁/T₁ = V₂/T₂  (P = স্থির)",
    latexFormula: "\\frac{V_1}{T_1} = \\frac{V_2}{T_2}",
    category: "physical-chemistry",
    variables: [
      { symbol: "V₁", meaning: "প্রাথমিক আয়তন", unit: "L" },
      { symbol: "T₁", meaning: "প্রাথমিক তাপমাত্রা", unit: "K" },
      { symbol: "V₂", meaning: "চূড়ান্ত আয়তন", unit: "L" },
      { symbol: "T₂", meaning: "চূড়ান্ত তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "স্থির চাপে নির্দিষ্ট পরিমাণ গ্যাসের আয়তন পরম তাপমাত্রার সাথে সমানুপাতিক। তাপমাত্রা সর্বদা কেলভিন (K) এককে ব্যবহার করতে হবে। K = °C + 273।",
    example: {
      question: "২৭°C-তে ৪ L গ্যাসকে ১২৭°C-তে আনলে আয়তন কত?",
      solution:
        "T₁ = 27 + 273 = 300 K\nT₂ = 127 + 273 = 400 K\nV₂ = V₁ × T₂/T₁ = 4 × 400/300\nV₂ = 5.33 L",
    },
    relatedFormulas: ["boyles-law", "combined-gas-law"],
    relatedTopics: [],
  },

  {
    id: "gay-lussac-law",
    name: "Gay-Lussac Law",
    nameBn: "গে-লুসাকের সূত্র",
    formula: "P₁/T₁ = P₂/T₂  (V = স্থির)",
    latexFormula: "\\frac{P_1}{T_1} = \\frac{P_2}{T_2}",
    category: "physical-chemistry",
    variables: [
      { symbol: "P₁", meaning: "প্রাথমিক চাপ", unit: "atm" },
      { symbol: "T₁", meaning: "প্রাথমিক তাপমাত্রা", unit: "K" },
      { symbol: "P₂", meaning: "চূড়ান্ত চাপ", unit: "atm" },
      { symbol: "T₂", meaning: "চূড়ান্ত তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "স্থির আয়তনে নির্দিষ্ট পরিমাণ গ্যাসের চাপ পরম তাপমাত্রার সাথে সমানুপাতিক। তাপমাত্রা কেলভিনে হতে হবে।",
    example: {
      question: "২৭°C-তে চাপ ২ atm। ১২৭°C-তে চাপ কত হবে?",
      solution:
        "T₁ = 300 K, T₂ = 400 K\nP₂ = P₁ × T₂/T₁ = 2 × 400/300\nP₂ = 2.67 atm",
    },
    relatedFormulas: ["boyles-law", "combined-gas-law"],
    relatedTopics: [],
  },

  {
    id: "avogadro-law",
    name: "Avogadro Law",
    nameBn: "অ্যাভোগাড্রোর গ্যাস সূত্র",
    formula: "V₁/n₁ = V₂/n₂  (T, P = স্থির)",
    latexFormula: "\\frac{V_1}{n_1} = \\frac{V_2}{n_2}",
    category: "physical-chemistry",
    variables: [
      { symbol: "V", meaning: "গ্যাসের আয়তন", unit: "L" },
      { symbol: "n", meaning: "মোলের সংখ্যা", unit: "mol" },
    ],
    explanation:
      "স্থির তাপমাত্রা ও চাপে গ্যাসের আয়তন মোলের সংখ্যার সাথে সমানুপাতিক। STP-তে ১ মোল যেকোনো আদর্শ গ্যাস ২২.৪ L আয়তন দখল করে।",
    example: {
      question: "STP-তে ২ মোল N₂ গ্যাসের আয়তন কত?",
      solution:
        "V = n × 22.4 L/mol\nV = 2 × 22.4\nV = 44.8 L",
    },
    relatedFormulas: ["ideal-gas-equation"],
    relatedTopics: [],
  },

  {
    id: "combined-gas-law",
    name: "Combined Gas Law",
    nameBn: "সমন্বিত গ্যাস সূত্র",
    formula: "P₁V₁/T₁ = P₂V₂/T₂",
    latexFormula: "\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}",
    category: "physical-chemistry",
    variables: [
      { symbol: "P", meaning: "চাপ", unit: "atm" },
      { symbol: "V", meaning: "আয়তন", unit: "L" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "সমন্বিত গ্যাস সূত্র বয়েল, চার্লস ও গে-লুসাকের সূত্রকে একত্রিত করে। যখন তিনটি চলরাশিই পরিবর্তিত হয় তখন এই সূত্র ব্যবহার হয়।",
    example: {
      question: "২ atm, ৩ L, ৩০০ K থেকে ১ atm, ৪০০ K-তে আনলে আয়তন কত?",
      solution:
        "P₁V₁/T₁ = P₂V₂/T₂\n(2×3)/300 = (1×V₂)/400\nV₂ = 8 L",
    },
    relatedFormulas: ["boyles-law", "charles-law", "ideal-gas-equation"],
    relatedTopics: [],
  },

  {
    id: "ideal-gas-equation",
    name: "Ideal Gas Equation",
    nameBn: "আদর্শ গ্যাস সমীকরণ",
    formula: "PV = nRT",
    latexFormula: "PV = nRT",
    category: "physical-chemistry",
    variables: [
      { symbol: "P", meaning: "চাপ", unit: "atm বা Pa" },
      { symbol: "V", meaning: "আয়তন", unit: "L বা m³" },
      { symbol: "n", meaning: "মোলের সংখ্যা", unit: "mol" },
      { symbol: "R", meaning: "গ্যাস ধ্রুবক (0.0821 L·atm/mol·K)", unit: "L·atm/mol·K" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "আদর্শ গ্যাস সমীকরণ সকল গ্যাস সূত্রকে একটি সমীকরণে প্রকাশ করে। বাস্তব গ্যাস কম চাপ ও উচ্চ তাপমাত্রায় আদর্শ গ্যাসের মতো আচরণ করে।",
    example: {
      question: "২ মোল গ্যাস ২৭°C তাপমাত্রায় ৩ L আয়তনে আছে। চাপ কত?",
      solution:
        "PV = nRT\nP × 3 = 2 × 0.0821 × 300\nP = 49.26 / 3\nP = 16.42 atm",
    },
    relatedFormulas: ["combined-gas-law", "van-der-waals"],
    relatedTopics: [],
  },

  {
    id: "van-der-waals",
    name: "Van der Waals Equation",
    nameBn: "ভ্যান ডার ওয়ালস সমীকরণ",
    formula: "(P + an²/V²)(V - nb) = nRT",
    latexFormula: "\\left(P + \\frac{an^2}{V^2}\\right)(V - nb) = nRT",
    category: "physical-chemistry",
    variables: [
      { symbol: "a", meaning: "আন্তঃআণবিক আকর্ষণ ধ্রুবক", unit: "L²·atm/mol²" },
      { symbol: "b", meaning: "অণুর নিজস্ব আয়তন ধ্রুবক", unit: "L/mol" },
      { symbol: "P, V, n, R, T", meaning: "আদর্শ গ্যাস সমীকরণের চলরাশি", unit: "—" },
    ],
    explanation:
      "বাস্তব গ্যাসের আচরণ বোঝাতে ভ্যান ডার ওয়ালস সমীকরণ ব্যবহার হয়। 'a' আন্তঃআণবিক আকর্ষণ এবং 'b' অণুর নিজস্ব আয়তনের জন্য সংশোধনী।",
    example: {
      question: "১ মোল CO₂ (a=3.59, b=0.0427) ২৭°C-তে ১ L আয়তনে চাপ কত?",
      solution:
        "(P + 3.59×1²/1²)(1 - 1×0.0427) = 1×0.0821×300\n(P + 3.59)(0.9573) = 24.63\nP + 3.59 = 25.73\nP ≈ 22.14 atm",
    },
    relatedFormulas: ["ideal-gas-equation"],
    relatedTopics: [],
  },

  {
    id: "daltons-law",
    name: "Dalton's Law",
    nameBn: "ডাল্টনের আংশিক চাপের সূত্র",
    formula: "P_total = P₁ + P₂ + P₃ + ...",
    latexFormula: "P_{total} = \\sum P_i",
    category: "physical-chemistry",
    variables: [
      { symbol: "P_total", meaning: "মোট চাপ", unit: "atm" },
      { symbol: "P₁, P₂...", meaning: "প্রতিটি গ্যাসের আংশিক চাপ", unit: "atm" },
    ],
    explanation:
      "গ্যাসীয় মিশ্রণের মোট চাপ প্রতিটি গ্যাসের আংশিক চাপের যোগফলের সমান। আংশিক চাপ: Pᵢ = Xᵢ × P_total।",
    example: {
      question: "N₂ (0.6 atm), O₂ (0.3 atm), CO₂ (0.1 atm) মিশ্রণের মোট চাপ কত?",
      solution:
        "P_total = 0.6 + 0.3 + 0.1\nP_total = 1.0 atm",
    },
    relatedFormulas: ["ideal-gas-equation", "mole-fraction"],
    relatedTopics: [],
  },

  {
    id: "grahams-law",
    name: "Graham's Law",
    nameBn: "গ্রাহামের ব্যাপন সূত্র",
    formula: "r₁/r₂ = √(M₂/M₁)",
    latexFormula: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}",
    category: "physical-chemistry",
    variables: [
      { symbol: "r₁, r₂", meaning: "দুটি গ্যাসের ব্যাপনের হার", unit: "L/s" },
      { symbol: "M₁, M₂", meaning: "দুটি গ্যাসের মোলার ভর", unit: "g/mol" },
    ],
    explanation:
      "স্থির তাপমাত্রা ও চাপে গ্যাসের ব্যাপনের হার তার মোলার ভরের বর্গমূলের ব্যস্তানুপাতিক। হালকা গ্যাস দ্রুত ব্যাপিত হয়।",
    example: {
      question: "H₂ (M=2) ও O₂ (M=32)-এর ব্যাপনের হারের অনুপাত কত?",
      solution:
        "r_H₂/r_O₂ = √(32/2) = √16 = 4\nH₂, O₂ এর চেয়ে ৪ গুণ দ্রুত ব্যাপিত হয়।",
    },
    relatedFormulas: ["ideal-gas-equation"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // D. Thermodynamics Formulas — তাপগতিবিদ্যা সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "enthalpy-change",
    name: "Enthalpy Change",
    nameBn: "এনথালপি পরিবর্তন",
    formula: "ΔH = H_products − H_reactants",
    latexFormula: "\\Delta H = H_{products} - H_{reactants}",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔH", meaning: "এনথালপি পরিবর্তন", unit: "kJ/mol" },
      { symbol: "H_products", meaning: "উৎপাদের এনথালপি", unit: "kJ/mol" },
      { symbol: "H_reactants", meaning: "বিক্রিয়কের এনথালপি", unit: "kJ/mol" },
    ],
    explanation:
      "ΔH < 0 হলে তাপউৎপাদী (exothermic) বিক্রিয়া; ΔH > 0 হলে তাপগ্রাহী (endothermic) বিক্রিয়া। স্থির চাপে q_p = ΔH।",
    example: {
      question: "H₂(g) + ½O₂(g) → H₂O(l) বিক্রিয়ায় ΔH = -286 kJ/mol। এটি কোন ধরনের বিক্রিয়া?",
      solution:
        "ΔH = -286 kJ/mol (ঋণাত্মক)\nতাই এটি তাপউৎপাদী (exothermic) বিক্রিয়া।",
    },
    relatedFormulas: ["hess-law", "gibbs-free-energy"],
    relatedTopics: [],
  },

  {
    id: "entropy-formula",
    name: "Entropy Formula",
    nameBn: "এনট্রপি সূত্র",
    formula: "ΔS = q_rev / T",
    latexFormula: "\\Delta S = \\frac{q_{rev}}{T}",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔS", meaning: "এনট্রপি পরিবর্তন", unit: "J/K·mol" },
      { symbol: "q_rev", meaning: "বিপরীতমুখী তাপ বিনিময়", unit: "J" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "এনট্রপি হলো অণুর বিশৃঙ্খলার পরিমাপ। স্বতঃস্ফূর্ত বিক্রিয়ায় মহাবিশ্বের মোট এনট্রপি বৃদ্ধি পায় (দ্বিতীয় তাপগতীয় সূত্র)।",
    example: {
      question: "৩০০ K তাপমাত্রায় ৬০০ J তাপ বিনিময় হলে ΔS কত?",
      solution:
        "ΔS = q_rev / T\nΔS = 600 / 300\nΔS = 2 J/K",
    },
    relatedFormulas: ["gibbs-free-energy"],
    relatedTopics: [],
  },

  {
    id: "gibbs-free-energy",
    name: "Gibbs Free Energy",
    nameBn: "গিবস মুক্ত শক্তি",
    formula: "ΔG = ΔH − TΔS",
    latexFormula: "\\Delta G = \\Delta H - T \\Delta S",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔG", meaning: "গিবস মুক্ত শক্তি পরিবর্তন", unit: "kJ/mol" },
      { symbol: "ΔH", meaning: "এনথালপি পরিবর্তন", unit: "kJ/mol" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
      { symbol: "ΔS", meaning: "এনট্রপি পরিবর্তন", unit: "kJ/mol·K" },
    ],
    explanation:
      "ΔG < 0 হলে বিক্রিয়া স্বতঃস্ফূর্ত; ΔG > 0 হলে অ-স্বতঃস্ফূর্ত; ΔG = 0 হলে সাম্যাবস্থা।",
    example: {
      question: "ΔH = -100 kJ/mol, ΔS = 0.2 kJ/mol·K, T = 300 K হলে ΔG কত?",
      solution:
        "ΔG = ΔH − TΔS\nΔG = -100 − (300 × 0.2)\nΔG = -100 − 60 = -160 kJ/mol\nΔG < 0, তাই স্বতঃস্ফূর্ত।",
    },
    relatedFormulas: ["enthalpy-change", "entropy-formula", "nernst-equation"],
    relatedTopics: [],
  },

  {
    id: "heat-capacity",
    name: "Heat Capacity",
    nameBn: "তাপধারণক্ষমতা সূত্র",
    formula: "q = mcΔT",
    latexFormula: "q = mc\\Delta T",
    category: "physical-chemistry",
    variables: [
      { symbol: "q", meaning: "তাপের পরিমাণ", unit: "J বা kJ" },
      { symbol: "m", meaning: "পদার্থের ভর", unit: "g" },
      { symbol: "c", meaning: "আপেক্ষিক তাপধারণক্ষমতা", unit: "J/g·K" },
      { symbol: "ΔT", meaning: "তাপমাত্রার পরিবর্তন", unit: "K বা °C" },
    ],
    explanation:
      "কোনো পদার্থের তাপমাত্রা পরিবর্তনে প্রয়োজনীয় তাপের পরিমাণ নির্ধারণে এই সূত্র ব্যবহার হয়। পানির আপেক্ষিক তাপ c = 4.18 J/g·K।",
    example: {
      question: "১০০ গ্রাম পানির তাপমাত্রা ২৫°C থেকে ৭৫°C-তে আনতে কত তাপ লাগবে?",
      solution:
        "q = mcΔT\nq = 100 × 4.18 × (75−25)\nq = 100 × 4.18 × 50\nq = 20,900 J = 20.9 kJ",
    },
    relatedFormulas: ["enthalpy-change", "calorimetry-equation"],
    relatedTopics: [],
  },

  {
    id: "hess-law",
    name: "Hess's Law",
    nameBn: "হেসের সূত্র",
    formula: "ΔH_rxn = Σ ΔH_products − Σ ΔH_reactants",
    latexFormula: "\\Delta H_{rxn} = \\sum \\Delta H_f^\\circ(products) - \\sum \\Delta H_f^\\circ(reactants)",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔH_rxn", meaning: "বিক্রিয়ার এনথালপি পরিবর্তন", unit: "kJ/mol" },
      { symbol: "ΔH_f°", meaning: "গঠন এনথালপি", unit: "kJ/mol" },
    ],
    explanation:
      "হেসের সূত্র অনুযায়ী একটি রাসায়নিক বিক্রিয়ার এনথালপি পরিবর্তন পথের উপর নির্ভর করে না। সরাসরি পরিমাপ করা যায় না এমন ΔH বের করতে ব্যবহার হয়।",
    example: {
      question: "C(s) + O₂(g) → CO₂(g): ΔH = -393.5 kJ। ΔH_f°(CO₂) কত?",
      solution:
        "ΔH_f°(CO₂) = -393.5 kJ/mol\n(মৌলিক পদার্থ থেকে ১ মোল যৌগ তৈরির এনথালপি।)",
    },
    relatedFormulas: ["enthalpy-change", "calorimetry-equation"],
    relatedTopics: [],
  },

  {
    id: "calorimetry-equation",
    name: "Calorimetry Equation",
    nameBn: "ক্যালোরিমিটার সমীকরণ",
    formula: "q_rxn = −q_cal = −(C_cal × ΔT)",
    latexFormula: "q_{rxn} = -q_{cal} = -(C_{cal} \\times \\Delta T)",
    category: "analytical-chemistry",
    variables: [
      { symbol: "q_rxn", meaning: "বিক্রিয়ার তাপ", unit: "J" },
      { symbol: "C_cal", meaning: "ক্যালোরিমিটারের তাপধারণক্ষমতা", unit: "J/K" },
      { symbol: "ΔT", meaning: "তাপমাত্রা পরিবর্তন", unit: "K" },
    ],
    explanation:
      "বোমা ক্যালোরিমিটারে বিক্রিয়ার তাপ পরিমাপ করা হয়। বিক্রিয়ায় মুক্ত তাপ ক্যালোরিমিটার শোষণ করে।",
    example: {
      question: "ক্যালোরিমিটারের তাপধারণক্ষমতা ৫ kJ/K এবং তাপমাত্রা ২°C বাড়লে বিক্রিয়ার তাপ কত?",
      solution:
        "q_cal = C_cal × ΔT = 5 × 2 = 10 kJ\nq_rxn = -q_cal = -10 kJ",
    },
    relatedFormulas: ["heat-capacity", "hess-law"],
    relatedTopics: [],
  },

  {
    id: "internal-energy",
    name: "Internal Energy",
    nameBn: "অভ্যন্তরীণ শক্তি",
    formula: "ΔU = q + w",
    latexFormula: "\\Delta U = q + w",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔU", meaning: "অভ্যন্তরীণ শক্তির পরিবর্তন", unit: "J বা kJ" },
      { symbol: "q", meaning: "সিস্টেম কর্তৃক শোষিত তাপ", unit: "J" },
      { symbol: "w", meaning: "সিস্টেমের উপর কৃত কাজ", unit: "J" },
    ],
    explanation:
      "তাপগতিবিদ্যার প্রথম সূত্র: শক্তির সংরক্ষণ। সিস্টেম তাপ শোষণ করলে q>0, কাজ করলে w<0।",
    example: {
      question: "একটি সিস্টেম ৫০০ J তাপ শোষণ করে ও ২০০ J কাজ করে। ΔU কত?",
      solution:
        "ΔU = q + w\nq = +500 J, w = -200 J (সিস্টেম কাজ করে)\nΔU = 500 + (-200) = 300 J",
    },
    relatedFormulas: ["enthalpy-change", "work-done-formula"],
    relatedTopics: [],
  },

  {
    id: "work-done-formula",
    name: "Work Done Formula",
    nameBn: "কৃত কাজের সূত্র",
    formula: "w = −PΔV",
    latexFormula: "w = -P\\Delta V",
    category: "physical-chemistry",
    variables: [
      { symbol: "w", meaning: "চাপ-আয়তন কাজ", unit: "J বা L·atm" },
      { symbol: "P", meaning: "বাহ্যিক চাপ", unit: "atm বা Pa" },
      { symbol: "ΔV", meaning: "আয়তনের পরিবর্তন", unit: "L বা m³" },
    ],
    explanation:
      "স্থির চাপে গ্যাসীয় সিস্টেম কর্তৃক কৃত কাজ w = -PΔV। প্রসারণে ΔV>0, তাই w<0 (সিস্টেম কাজ করে)।",
    example: {
      question: "১ atm চাপে গ্যাস ২ L থেকে ৫ L-এ প্রসারিত হলে কাজ কত?",
      solution:
        "w = -PΔV = -1 × (5-2) = -3 L·atm\nকনভার্শন: -3 × 101.3 = -303.9 J",
    },
    relatedFormulas: ["internal-energy"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // E. Electrochemistry Formulas — তড়িৎ রসায়ন সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "nernst-equation",
    name: "Nernst Equation",
    nameBn: "নার্নস্ট সমীকরণ",
    formula: "E = E° − (RT/nF) ln Q",
    latexFormula: "E = E^\\circ - \\frac{RT}{nF} \\ln Q",
    category: "physical-chemistry",
    variables: [
      { symbol: "E", meaning: "প্রকৃত কোষ বিভব", unit: "V" },
      { symbol: "E°", meaning: "মানক কোষ বিভব", unit: "V" },
      { symbol: "R", meaning: "গ্যাস ধ্রুবক (8.314 J/mol·K)", unit: "J/mol·K" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
      { symbol: "n", meaning: "বিনিময়িত ইলেকট্রন সংখ্যা", unit: "—" },
      { symbol: "F", meaning: "ফ্যারাডে ধ্রুবক (96485 C/mol)", unit: "C/mol" },
      { symbol: "Q", meaning: "বিক্রিয়া ভাগফল", unit: "—" },
    ],
    explanation:
      "নার্নস্ট সমীকরণ দিয়ে মানক নয় এমন অবস্থায় বৈদ্যুতিক কোষের বিভব নির্ণয় করা হয়। ২৫°C-তে: E = E° − (0.0592/n) log Q।",
    example: {
      question: "Zn-Cu কোষে [Zn²⁺]=0.1M, [Cu²⁺]=1M, E°=1.10V, n=2। E কত?",
      solution:
        "E = E° − (0.0592/n) log Q\nQ = [Zn²⁺]/[Cu²⁺] = 0.1/1 = 0.1\nE = 1.10 − (0.0592/2) log(0.1)\nE = 1.10 − (0.0296)(-1)\nE = 1.10 + 0.0296 = 1.13 V",
    },
    relatedFormulas: ["cell-potential", "gibbs-free-energy"],
    relatedTopics: [],
  },

  {
    id: "cell-potential",
    name: "Cell Potential",
    nameBn: "কোষ বিভব",
    formula: "E°_cell = E°_cathode − E°_anode",
    latexFormula: "E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}",
    category: "physical-chemistry",
    variables: [
      { symbol: "E°_cell", meaning: "মানক কোষ বিভব", unit: "V" },
      { symbol: "E°_cathode", meaning: "ক্যাথোডের মানক বিভব", unit: "V" },
      { symbol: "E°_anode", meaning: "অ্যানোডের মানক বিভব", unit: "V" },
    ],
    explanation:
      "গ্যালভানিক কোষের EMF হলো ক্যাথোড ও অ্যানোডের মানক ইলেকট্রোড বিভবের পার্থক্য। ΔG° = -nFE°।",
    example: {
      question: "Zn (E°=-0.76V) ও Cu (E°=+0.34V) দিয়ে তৈরি কোষের E°_cell কত?",
      solution:
        "E°_cell = E°_cathode − E°_anode\nE°_cell = 0.34 − (-0.76)\nE°_cell = 1.10 V",
    },
    relatedFormulas: ["nernst-equation", "faradays-law"],
    relatedTopics: [],
  },

  {
    id: "faradays-law",
    name: "Faraday's Law",
    nameBn: "ফ্যারাডের তড়িৎ বিশ্লেষণ সূত্র",
    formula: "m = (M × I × t) / (n × F)",
    latexFormula: "m = \\frac{M \\cdot I \\cdot t}{n \\cdot F}",
    category: "physical-chemistry",
    variables: [
      { symbol: "m", meaning: "জমানো পদার্থের ভর", unit: "g" },
      { symbol: "M", meaning: "মোলার ভর", unit: "g/mol" },
      { symbol: "I", meaning: "বিদ্যুৎ প্রবাহ", unit: "A" },
      { symbol: "t", meaning: "সময়", unit: "s" },
      { symbol: "n", meaning: "ইলেকট্রন সংখ্যা", unit: "—" },
      { symbol: "F", meaning: "ফ্যারাডে ধ্রুবক (96485 C/mol)", unit: "C/mol" },
    ],
    explanation:
      "ফ্যারাডের সূত্র দিয়ে তড়িৎ বিশ্লেষণে ইলেকট্রোডে জমানো পদার্থের পরিমাণ নির্ণয় করা হয়। মোট চার্জ Q = I × t।",
    example: {
      question: "২ A বিদ্যুৎ ৩২ মিনিট চালালে Cu (M=63.5, n=2) কত গ্রাম জমবে?",
      solution:
        "t = 32 × 60 = 1920 s\nm = (63.5 × 2 × 1920) / (2 × 96485)\nm = 243,840 / 192,970\nm ≈ 1.26 g",
    },
    relatedFormulas: ["cell-potential"],
    relatedTopics: [],
  },

  {
    id: "conductivity-formula",
    name: "Conductivity Formula",
    nameBn: "পরিবাহিতা সূত্র",
    formula: "Λ_m = κ / c",
    latexFormula: "\\Lambda_m = \\frac{\\kappa}{c}",
    category: "analytical-chemistry",
    variables: [
      { symbol: "Λ_m", meaning: "মোলার পরিবাহিতা", unit: "S·cm²/mol" },
      { symbol: "κ", meaning: "নির্দিষ্ট পরিবাহিতা", unit: "S/cm" },
      { symbol: "c", meaning: "ঘনমাত্রা", unit: "mol/cm³" },
    ],
    explanation:
      "মোলার পরিবাহিতা হলো একক মোল আয়নের পরিবাহিতা। ঘনমাত্রা বাড়লে Λ_m কমে (শক্তিশালী তড়িৎবিশ্লেষ্যর ক্ষেত্রে)।",
    example: {
      question: "κ = 0.024 S/cm এবং c = 0.01 mol/L হলে Λ_m কত?",
      solution:
        "c = 0.01 mol/L = 1×10⁻⁵ mol/cm³\nΛ_m = 0.024 / 1×10⁻⁵\nΛ_m = 2400 S·cm²/mol",
    },
    relatedFormulas: ["cell-potential"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // F. Chemical Kinetics Formulas — রাসায়নিক গতিবিদ্যা
  // ══════════════════════════════════════════════════════

  {
    id: "rate-law",
    name: "Rate Law",
    nameBn: "বেগ সূত্র",
    formula: "r = k[A]ᵐ[B]ⁿ",
    latexFormula: "r = k[A]^m[B]^n",
    category: "physical-chemistry",
    variables: [
      { symbol: "r", meaning: "বিক্রিয়ার বেগ", unit: "mol/L·s" },
      { symbol: "k", meaning: "বেগ ধ্রুবক", unit: "পরিবর্তনশীল" },
      { symbol: "[A], [B]", meaning: "বিক্রিয়কের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "m, n", meaning: "বিক্রিয়ার ক্রম (পরীক্ষামূলক)", unit: "—" },
    ],
    explanation:
      "বিক্রিয়ার বেগ বিক্রিয়কের ঘনমাত্রার সাথে সম্পর্কিত। মোট ক্রম = m + n। এটি স্টয়কিওমেট্রি থেকে নির্ধারণ করা যায় না, পরীক্ষামূলকভাবে বের করতে হয়।",
    example: {
      question: "A + 2B → C। পরীক্ষায় m=1, n=2, k=0.01। [A]=0.1, [B]=0.2 হলে r কত?",
      solution:
        "r = k[A]¹[B]²\nr = 0.01 × 0.1 × (0.2)²\nr = 0.01 × 0.1 × 0.04\nr = 4 × 10⁻⁵ mol/L·s",
    },
    relatedFormulas: ["first-order-equation", "arrhenius-equation"],
    relatedTopics: [],
  },

  {
    id: "first-order-equation",
    name: "First Order Equation",
    nameBn: "প্রথম ক্রমের সমীকরণ",
    formula: "ln[A]_t = ln[A]₀ − kt",
    latexFormula: "\\ln[A]_t = \\ln[A]_0 - kt",
    category: "physical-chemistry",
    variables: [
      { symbol: "[A]_t", meaning: "t সময়ে ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[A]₀", meaning: "প্রাথমিক ঘনমাত্রা", unit: "mol/L" },
      { symbol: "k", meaning: "প্রথম ক্রমের বেগ ধ্রুবক", unit: "s⁻¹" },
      { symbol: "t", meaning: "সময়", unit: "s" },
    ],
    explanation:
      "প্রথম ক্রমের বিক্রিয়ায় বেগ একটি বিক্রিয়কের ঘনমাত্রার উপর নির্ভরশীল। অর্ধজীবন: t₁/₂ = 0.693/k।",
    example: {
      question: "k = 0.1 s⁻¹, [A]₀ = 1 mol/L। ২০ সেকেন্ড পর [A] কত?",
      solution:
        "ln[A] = ln(1) − 0.1 × 20\nln[A] = 0 − 2 = -2\n[A] = e⁻² ≈ 0.135 mol/L",
    },
    relatedFormulas: ["rate-law", "half-life-formula"],
    relatedTopics: [],
  },

  {
    id: "second-order-equation",
    name: "Second Order Equation",
    nameBn: "দ্বিতীয় ক্রমের সমীকরণ",
    formula: "1/[A]_t = 1/[A]₀ + kt",
    latexFormula: "\\frac{1}{[A]_t} = \\frac{1}{[A]_0} + kt",
    category: "physical-chemistry",
    variables: [
      { symbol: "[A]_t", meaning: "t সময়ে ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[A]₀", meaning: "প্রাথমিক ঘনমাত্রা", unit: "mol/L" },
      { symbol: "k", meaning: "দ্বিতীয় ক্রমের বেগ ধ্রুবক", unit: "L/mol·s" },
      { symbol: "t", meaning: "সময়", unit: "s" },
    ],
    explanation:
      "দ্বিতীয় ক্রমের বিক্রিয়ায় বেগ ঘনমাত্রার বর্গের উপর নির্ভরশীল। অর্ধজীবন: t₁/₂ = 1/(k[A]₀)।",
    example: {
      question: "k = 0.5 L/mol·s, [A]₀ = 2 mol/L। ১ সেকেন্ড পর [A] কত?",
      solution:
        "1/[A] = 1/2 + 0.5×1 = 0.5 + 0.5 = 1\n[A] = 1 mol/L",
    },
    relatedFormulas: ["first-order-equation", "rate-law"],
    relatedTopics: [],
  },

  {
    id: "arrhenius-equation",
    name: "Arrhenius Equation",
    nameBn: "অ্যারেনিয়াস সমীকরণ",
    formula: "k = A·e^(-Ea/RT)",
    latexFormula: "k = A \\cdot e^{-E_a/RT}",
    category: "physical-chemistry",
    variables: [
      { symbol: "k", meaning: "বেগ ধ্রুবক", unit: "পরিবর্তনশীল" },
      { symbol: "A", meaning: "প্রি-এক্সপোনেনশিয়াল ফ্যাক্টর", unit: "same as k" },
      { symbol: "Ea", meaning: "সক্রিয়করণ শক্তি", unit: "J/mol" },
      { symbol: "R", meaning: "গ্যাস ধ্রুবক (8.314 J/mol·K)", unit: "J/mol·K" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "অ্যারেনিয়াস সমীকরণ তাপমাত্রার সাথে বেগ ধ্রুবকের সম্পর্ক প্রকাশ করে। ln k = ln A − Ea/RT।",
    example: {
      question: "Ea = 50,000 J/mol, A=10¹³, T=500K। k কত?",
      solution:
        "k = 10¹³ × e^(-50000/(8.314×500))\nk = 10¹³ × e^(-12.02)\nk = 10¹³ × 6.0×10⁻⁶\nk ≈ 6×10⁷ s⁻¹",
    },
    relatedFormulas: ["rate-law", "gibbs-free-energy"],
    relatedTopics: [],
  },

  {
    id: "half-life-formula",
    name: "Half Life Formula",
    nameBn: "অর্ধজীবন সূত্র (গতিবিদ্যা)",
    formula: "t₁/₂ = 0.693 / k  (1st order)",
    latexFormula: "t_{1/2} = \\frac{0.693}{k}",
    category: "physical-chemistry",
    variables: [
      { symbol: "t₁/₂", meaning: "অর্ধজীবন", unit: "s বা min" },
      { symbol: "k", meaning: "প্রথম ক্রমের বেগ ধ্রুবক", unit: "s⁻¹" },
    ],
    explanation:
      "প্রথম ক্রমের বিক্রিয়ায় অর্ধজীবন প্রাথমিক ঘনমাত্রার উপর নির্ভর করে না। দ্বিতীয় ক্রমে: t₁/₂ = 1/(k[A]₀)।",
    example: {
      question: "k = 0.0231 min⁻¹ হলে অর্ধজীবন কত?",
      solution:
        "t₁/₂ = 0.693 / k\nt₁/₂ = 0.693 / 0.0231\nt₁/₂ = 30 min",
    },
    relatedFormulas: ["first-order-equation", "radioactive-decay"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // G. Equilibrium Formulas — সাম্যাবস্থার সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "equilibrium-constant",
    name: "Equilibrium Constant",
    nameBn: "সাম্য ধ্রুবক",
    formula: "Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ",
    latexFormula: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
    category: "physical-chemistry",
    variables: [
      { symbol: "Kc", meaning: "ঘনমাত্রার ভিত্তিতে সাম্য ধ্রুবক", unit: "মাত্রাহীন" },
      { symbol: "[A],[B]", meaning: "বিক্রিয়কের সাম্য ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[C],[D]", meaning: "উৎপাদের সাম্য ঘনমাত্রা", unit: "mol/L" },
      { symbol: "a,b,c,d", meaning: "স্টয়কিওমেট্রিক সহগ", unit: "—" },
    ],
    explanation:
      "Kc > 1 হলে সাম্যাবস্থায় উৎপাদ বেশি; Kc < 1 হলে বিক্রিয়ক বেশি। বিশুদ্ধ কঠিন ও তরলকে Kc-তে অন্তর্ভুক্ত করা হয় না।",
    example: {
      question: "N₂(g) + 3H₂(g) ⇌ 2NH₃(g) সাম্যাবস্থায় [N₂]=0.5, [H₂]=0.3, [NH₃]=0.2 mol/L। Kc কত?",
      solution:
        "Kc = [NH₃]² / ([N₂][H₂]³)\nKc = (0.2)² / (0.5 × (0.3)³)\nKc = 0.04 / (0.5 × 0.027)\nKc = 0.04 / 0.0135 ≈ 2.96",
    },
    relatedFormulas: ["reaction-quotient", "gibbs-free-energy"],
    relatedTopics: [],
  },

  {
    id: "reaction-quotient",
    name: "Reaction Quotient",
    nameBn: "বিক্রিয়া ভাগফল",
    formula: "Q = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ  (যেকোনো মুহূর্তে)",
    latexFormula: "Q = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
    category: "physical-chemistry",
    variables: [
      { symbol: "Q", meaning: "বিক্রিয়া ভাগফল", unit: "মাত্রাহীন" },
    ],
    explanation:
      "Q < Kc হলে বিক্রিয়া সম্মুখে যাবে; Q > Kc হলে বিপরীতে যাবে; Q = Kc হলে সাম্যাবস্থা। নার্নস্ট সমীকরণেও Q ব্যবহার হয়।",
    example: {
      question: "উপরের উদাহরণে প্রাথমিক অবস্থায় [N₂]=1, [H₂]=1, [NH₃]=0.1। Q কত এবং বিক্রিয়া কোন দিকে যাবে?",
      solution:
        "Q = (0.1)² / (1 × 1³) = 0.01\nQ = 0.01 < Kc = 2.96\nতাই বিক্রিয়া সম্মুখে (NH₃ উৎপাদের দিকে) যাবে।",
    },
    relatedFormulas: ["equilibrium-constant", "nernst-equation"],
    relatedTopics: [],
  },

  {
    id: "le-chatelier-calc",
    name: "Le Chatelier Calculations",
    nameBn: "লা-শাতেলিয়ার গণনা",
    formula: "Kp = Kc × (RT)^Δn",
    latexFormula: "K_p = K_c \\times (RT)^{\\Delta n}",
    category: "physical-chemistry",
    variables: [
      { symbol: "Kp", meaning: "চাপের ভিত্তিতে সাম্য ধ্রুবক", unit: "atm^Δn" },
      { symbol: "Kc", meaning: "ঘনমাত্রার ভিত্তিতে সাম্য ধ্রুবক", unit: "—" },
      { symbol: "Δn", meaning: "গ্যাসীয় মোলের পরিবর্তন (উৎপাদ − বিক্রিয়ক)", unit: "—" },
      { symbol: "R", meaning: "0.0821 L·atm/mol·K", unit: "—" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "লা-শাতেলিয়ারের নীতি: সাম্যাবস্থায় কোনো পরিবর্তন করলে সিস্টেম সেই পরিবর্তনকে প্রশমিত করার দিকে অগ্রসর হয়। Kp ও Kc সম্পর্কিত সূত্র দিয়ে গণনা করা হয়।",
    example: {
      question: "N₂ + 3H₂ ⇌ 2NH₃। Kc = 0.5, T = 500K। Kp কত? (Δn = 2−4 = −2)",
      solution:
        "Kp = Kc × (RT)^Δn\nKp = 0.5 × (0.0821 × 500)^(-2)\nKp = 0.5 × (41.05)^(-2)\nKp = 0.5 / 1685 ≈ 2.97 × 10⁻⁴",
    },
    relatedFormulas: ["equilibrium-constant"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // H. Acid-Base Formulas — অ্যাসিড-বেস সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "ph-formula",
    name: "pH Formula",
    nameBn: "pH সূত্র",
    formula: "pH = −log[H⁺]",
    latexFormula: "pH = -\\log[H^+]",
    category: "analytical-chemistry",
    variables: [
      { symbol: "pH", meaning: "হাইড্রোজেন আয়নের ঘনমাত্রার পরিমাপ", unit: "মাত্রাহীন" },
      { symbol: "[H⁺]", meaning: "হাইড্রোজেন আয়নের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "pH < 7 = অ্যাসিডিক, pH = 7 = নিরপেক্ষ, pH > 7 = ক্ষারীয়। ২৫°C-তে pH + pOH = 14।",
    example: {
      question: "[H⁺] = 0.001 mol/L হলে pH কত?",
      solution:
        "pH = −log[H⁺]\npH = −log(0.001)\npH = −log(10⁻³)\npH = 3",
    },
    relatedFormulas: ["poh-formula", "ka-formula", "henderson-hasselbalch"],
    relatedTopics: [],
  },

  {
    id: "poh-formula",
    name: "pOH Formula",
    nameBn: "pOH সূত্র",
    formula: "pOH = −log[OH⁻]   এবং   pH + pOH = 14",
    latexFormula: "pOH = -\\log[OH^-]",
    category: "analytical-chemistry",
    variables: [
      { symbol: "pOH", meaning: "হাইড্রক্সাইড আয়নের পরিমাপ", unit: "মাত্রাহীন" },
      { symbol: "[OH⁻]", meaning: "হাইড্রক্সাইড আয়নের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "২৫°C-তে pH + pOH = 14 (Kw = 10⁻¹⁴)। ক্ষারীয় দ্রবণে pOH < 7 এবং pH > 7।",
    example: {
      question: "[OH⁻] = 0.01 mol/L হলে pOH ও pH কত?",
      solution:
        "pOH = −log(0.01) = −log(10⁻²) = 2\npH = 14 − pOH = 14 − 2 = 12",
    },
    relatedFormulas: ["ph-formula"],
    relatedTopics: [],
  },

  {
    id: "henderson-hasselbalch",
    name: "Henderson-Hasselbalch Equation",
    nameBn: "হেন্ডারসন-হ্যাসেলবাল্ক সমীকরণ",
    formula: "pH = pKa + log([A⁻]/[HA])",
    latexFormula: "pH = pK_a + \\log\\frac{[A^-]}{[HA]}",
    category: "analytical-chemistry",
    variables: [
      { symbol: "pH", meaning: "বাফার দ্রবণের pH", unit: "—" },
      { symbol: "pKa", meaning: "দুর্বল অ্যাসিডের pKa", unit: "—" },
      { symbol: "[A⁻]", meaning: "সংযুগ ক্ষারের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[HA]", meaning: "দুর্বল অ্যাসিডের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "বাফার দ্রবণের pH গণনায় ব্যবহার হয়। যখন [A⁻]=[HA] তখন pH = pKa। বাফার সীমা: pH = pKa ± 1।",
    example: {
      question: "CH₃COOH (pKa=4.74), [CH₃COOH]=0.1M, [CH₃COO⁻]=0.05M। pH কত?",
      solution:
        "pH = pKa + log([A⁻]/[HA])\npH = 4.74 + log(0.05/0.1)\npH = 4.74 + log(0.5)\npH = 4.74 − 0.301 = 4.44",
    },
    relatedFormulas: ["ph-formula", "ka-formula", "buffer-equation"],
    relatedTopics: [],
  },

  {
    id: "buffer-equation",
    name: "Buffer Equation",
    nameBn: "বাফার সমীকরণ",
    formula: "pH = pKa + log([Salt]/[Acid])",
    latexFormula: "pH = pK_a + \\log\\frac{[Salt]}{[Acid]}",
    category: "analytical-chemistry",
    variables: [
      { symbol: "[Salt]", meaning: "লবণের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[Acid]", meaning: "দুর্বল অ্যাসিডের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "বাফার দ্রবণ অ্যাসিড বা ক্ষার যোগ করলে pH প্রায় অপরিবর্তিত রাখে। দুর্বল অ্যাসিড + তার লবণ দিয়ে অ্যাসিডিক বাফার তৈরি হয়।",
    example: {
      question: "CH₃COOH (pKa=4.74): [লবণ]=0.2M, [অ্যাসিড]=0.1M। pH কত?",
      solution:
        "pH = 4.74 + log(0.2/0.1)\npH = 4.74 + log(2)\npH = 4.74 + 0.301 = 5.04",
    },
    relatedFormulas: ["henderson-hasselbalch", "ph-formula"],
    relatedTopics: [],
  },

  {
    id: "ka-formula",
    name: "Ka Formula",
    nameBn: "Ka সূত্র (অ্যাসিড বিয়োজন ধ্রুবক)",
    formula: "Ka = [H⁺][A⁻] / [HA]",
    latexFormula: "K_a = \\frac{[H^+][A^-]}{[HA]}",
    category: "analytical-chemistry",
    variables: [
      { symbol: "Ka", meaning: "অ্যাসিড বিয়োজন ধ্রুবক", unit: "mol/L" },
      { symbol: "[H⁺]", meaning: "হাইড্রোজেন আয়নের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[A⁻]", meaning: "সংযুগ ক্ষারের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[HA]", meaning: "অবিয়োজিত অ্যাসিডের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "Ka বড় = শক্তিশালী অ্যাসিড; Ka ছোট = দুর্বল অ্যাসিড। pKa = -log Ka। Ka × Kb = Kw = 10⁻¹⁴।",
    example: {
      question: "CH₃COOH: Ka = 1.8×10⁻⁵। 0.1M দ্রবণে [H⁺] কত?",
      solution:
        "Ka = x² / (0.1 − x) ≈ x² / 0.1\nx² = 1.8×10⁻⁵ × 0.1 = 1.8×10⁻⁶\nx = [H⁺] = 1.34×10⁻³ mol/L",
    },
    relatedFormulas: ["ph-formula", "henderson-hasselbalch", "kb-formula"],
    relatedTopics: [],
  },

  {
    id: "kb-formula",
    name: "Kb Formula",
    nameBn: "Kb সূত্র (ক্ষার বিয়োজন ধ্রুবক)",
    formula: "Kb = [BH⁺][OH⁻] / [B]",
    latexFormula: "K_b = \\frac{[BH^+][OH^-]}{[B]}",
    category: "analytical-chemistry",
    variables: [
      { symbol: "Kb", meaning: "ক্ষার বিয়োজন ধ্রুবক", unit: "mol/L" },
      { symbol: "[BH⁺]", meaning: "প্রোটোনেটেড ক্ষারের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[OH⁻]", meaning: "হাইড্রক্সাইড আয়নের ঘনমাত্রা", unit: "mol/L" },
      { symbol: "[B]", meaning: "অবিয়োজিত ক্ষারের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "Kb বড় = শক্তিশালী ক্ষার। pKb = -log Kb। সংযুগ অ্যাসিড-বেসের জন্য: Ka × Kb = Kw = 10⁻¹⁴।",
    example: {
      question: "NH₃: Kb = 1.8×10⁻⁵। 0.1M দ্রবণে [OH⁻] কত?",
      solution:
        "Kb = x² / (0.1 − x) ≈ x² / 0.1\nx = [OH⁻] = √(1.8×10⁻⁵ × 0.1)\nx = 1.34×10⁻³ mol/L",
    },
    relatedFormulas: ["ka-formula", "poh-formula"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // I. Nuclear Chemistry Formulas — পারমাণবিক রসায়ন সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "radioactive-decay",
    name: "Radioactive Decay",
    nameBn: "তেজস্ক্রিয় ক্ষয় সূত্র",
    formula: "N(t) = N₀ × e^(−λt)",
    latexFormula: "N(t) = N_0 \\cdot e^{-\\lambda t}",
    category: "physical-chemistry",
    variables: [
      { symbol: "N(t)", meaning: "t সময়ে অবশিষ্ট নিউক্লিয়াসের সংখ্যা", unit: "সংখ্যা" },
      { symbol: "N₀", meaning: "প্রাথমিক নিউক্লিয়াসের সংখ্যা", unit: "সংখ্যা" },
      { symbol: "λ", meaning: "ক্ষয় ধ্রুবক", unit: "s⁻¹" },
      { symbol: "t", meaning: "সময়", unit: "s" },
    ],
    explanation:
      "তেজস্ক্রিয় নিউক্লাইড সময়ের সাথে ক্ষয় হয়। ক্ষয় ধ্রুবক: λ = 0.693 / t₁/₂। এটি প্রথম ক্রমের গতিবিদ্যা অনুসরণ করে।",
    example: {
      question: "¹⁴C-এর t₁/₂ = 5730 বছর। N₀ = 1000 নিউক্লিয়াস। ১১৪৬০ বছর পর N কত?",
      solution:
        "λ = 0.693 / 5730 = 1.21×10⁻⁴ yr⁻¹\nN = 1000 × e^(-1.21×10⁻⁴ × 11460)\nN = 1000 × e^(-1.386)\nN = 1000 × 0.25 = 250",
    },
    relatedFormulas: ["half-life-formula", "nuclear-binding-energy"],
    relatedTopics: [],
  },

  {
    id: "nuclear-half-life",
    name: "Nuclear Half Life",
    nameBn: "পারমাণবিক অর্ধজীবন",
    formula: "t₁/₂ = 0.693 / λ",
    latexFormula: "t_{1/2} = \\frac{0.693}{\\lambda}",
    category: "physical-chemistry",
    variables: [
      { symbol: "t₁/₂", meaning: "অর্ধজীবন", unit: "s, min, yr" },
      { symbol: "λ", meaning: "ক্ষয় ধ্রুবক", unit: "s⁻¹" },
    ],
    explanation:
      "অর্ধজীবন হলো যে সময়ে তেজস্ক্রিয় নমুনার অর্ধেক ক্ষয় হয়। n অর্ধজীবন পর N = N₀ / 2ⁿ।",
    example: {
      question: "λ = 0.005 s⁻¹ হলে অর্ধজীবন কত?",
      solution:
        "t₁/₂ = 0.693 / 0.005\nt₁/₂ = 138.6 s ≈ 2.31 min",
    },
    relatedFormulas: ["radioactive-decay"],
    relatedTopics: [],
  },

  {
    id: "nuclear-binding-energy",
    name: "Nuclear Binding Energy",
    nameBn: "পারমাণবিক বন্ধন শক্তি",
    formula: "E = Δm × c²",
    latexFormula: "E = \\Delta m \\cdot c^2",
    category: "physical-chemistry",
    variables: [
      { symbol: "E", meaning: "বন্ধন শক্তি", unit: "J বা MeV" },
      { symbol: "Δm", meaning: "ভরত্রুটি (mass defect)", unit: "kg বা u" },
      { symbol: "c", meaning: "আলোর গতি (3 × 10⁸ m/s)", unit: "m/s" },
    ],
    explanation:
      "আইনস্টাইনের E=mc² সূত্র দিয়ে ভরত্রুটিকে শক্তিতে রূপান্তর করা হয়। ১ u = 931.5 MeV।",
    example: {
      question: "একটি নিউক্লিয়াসের Δm = 0.001 u। বন্ধন শক্তি কত MeV?",
      solution:
        "E = Δm × 931.5 MeV/u\nE = 0.001 × 931.5\nE = 0.9315 MeV",
    },
    relatedFormulas: ["radioactive-decay"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // J. Quantum Chemistry Formulas — কোয়ান্টাম রসায়ন সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "de-broglie-equation",
    name: "De Broglie Equation",
    nameBn: "ডি-ব্রোগলি সমীকরণ",
    formula: "λ = h / (mv)",
    latexFormula: "\\lambda = \\frac{h}{mv}",
    category: "physical-chemistry",
    variables: [
      { symbol: "λ", meaning: "তরঙ্গদৈর্ঘ্য", unit: "m" },
      { symbol: "h", meaning: "প্ল্যাংকের ধ্রুবক (6.626×10⁻³⁴ J·s)", unit: "J·s" },
      { symbol: "m", meaning: "কণার ভর", unit: "kg" },
      { symbol: "v", meaning: "কণার বেগ", unit: "m/s" },
    ],
    explanation:
      "ডি-ব্রোগলি তরঙ্গদৈর্ঘ্য দেখায় যে গতিশীল কণার তরঙ্গ বৈশিষ্ট্য আছে। ভর যত বেশি, তরঙ্গদৈর্ঘ্য তত কম।",
    example: {
      question: "একটি ইলেকট্রন (m = 9.1×10⁻³¹ kg) 10⁶ m/s বেগে চলছে। তরঙ্গদৈর্ঘ্য কত?",
      solution:
        "λ = h / mv\nλ = 6.626×10⁻³⁴ / (9.1×10⁻³¹ × 10⁶)\nλ = 6.626×10⁻³⁴ / 9.1×10⁻²⁵\nλ ≈ 7.28×10⁻¹⁰ m = 0.728 nm",
    },
    relatedFormulas: ["heisenberg-uncertainty", "photon-energy"],
    relatedTopics: [],
  },

  {
    id: "heisenberg-uncertainty",
    name: "Heisenberg Uncertainty Principle",
    nameBn: "হাইজেনবার্গের অনিশ্চয়তা নীতি",
    formula: "Δx × Δp ≥ h / (4π)",
    latexFormula: "\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}",
    category: "physical-chemistry",
    variables: [
      { symbol: "Δx", meaning: "অবস্থানের অনিশ্চয়তা", unit: "m" },
      { symbol: "Δp", meaning: "ভরবেগের অনিশ্চয়তা", unit: "kg·m/s" },
      { symbol: "h", meaning: "প্ল্যাংকের ধ্রুবক", unit: "J·s" },
    ],
    explanation:
      "একটি কণার অবস্থান ও ভরবেগ একই সাথে নিখুঁতভাবে জানা সম্ভব নয়। একটির অনিশ্চয়তা কমালে অপরটির বাড়ে।",
    example: {
      question: "একটি ইলেকট্রনের Δx = 10⁻¹⁰ m হলে Δp কমপক্ষে কত?",
      solution:
        "Δp ≥ h / (4π × Δx)\nΔp ≥ 6.626×10⁻³⁴ / (4π × 10⁻¹⁰)\nΔp ≥ 5.27×10⁻²⁵ kg·m/s",
    },
    relatedFormulas: ["de-broglie-equation"],
    relatedTopics: [],
  },

  {
    id: "schrodinger-equation",
    name: "Schrödinger Equation",
    nameBn: "শ্রোডিঙ্গার সমীকরণ",
    formula: "Ĥψ = Eψ",
    latexFormula: "\\hat{H}\\psi = E\\psi",
    category: "physical-chemistry",
    variables: [
      { symbol: "Ĥ", meaning: "হ্যামিলটোনিয়ান অপারেটর", unit: "—" },
      { symbol: "ψ", meaning: "তরঙ্গ ফাংশন (ওয়েভ ফাংশন)", unit: "—" },
      { symbol: "E", meaning: "মোট শক্তি", unit: "J" },
    ],
    explanation:
      "শ্রোডিঙ্গার সমীকরণ কোয়ান্টাম মেকানিক্সের মূল সমীকরণ। |ψ|² হলো কণা পাওয়ার সম্ভাবনা। অরবিটালের আকৃতি এই সমীকরণ থেকে পাওয়া যায়।",
    example: {
      question: "শ্রোডিঙ্গার সমীকরণের সমাধান কী দেয়?",
      solution:
        "সমাধান দেয়:\n১. ψ (তরঙ্গ ফাংশন) — অরবিটালের আকৃতি ও অভিমুখ নির্ধারণ করে\n২. E (কোয়ান্টাইজড শক্তি স্তর) — ইলেকট্রনের অনুমোদিত শক্তি",
    },
    relatedFormulas: ["de-broglie-equation", "bohr-radius"],
    relatedTopics: [],
  },

  {
    id: "bohr-radius",
    name: "Bohr Radius Formula",
    nameBn: "বোর ব্যাসার্ধ সূত্র",
    formula: "rₙ = n² × a₀  (H পরমাণুর জন্য)",
    latexFormula: "r_n = n^2 \\times a_0",
    category: "physical-chemistry",
    variables: [
      { symbol: "rₙ", meaning: "n-তম কক্ষপথের ব্যাসার্ধ", unit: "m বা Å" },
      { symbol: "n", meaning: "প্রধান কোয়ান্টাম সংখ্যা", unit: "—" },
      { symbol: "a₀", meaning: "বোর ব্যাসার্ধ (5.29×10⁻¹¹ m = 0.529 Å)", unit: "m" },
    ],
    explanation:
      "হাইড্রোজেন পরমাণুর n-তম কক্ষপথের ব্যাসার্ধ নির্ণয়ের সূত্র। Z-সংখ্যা ভিন্ন হলে: rₙ = (n²/Z) × a₀।",
    example: {
      question: "হাইড্রোজেনের দ্বিতীয় কক্ষপথের ব্যাসার্ধ কত?",
      solution:
        "r₂ = n² × a₀ = 4 × 0.529 Å = 2.116 Å",
    },
    relatedFormulas: ["rydberg-equation"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // K. Spectroscopy Formulas — বর্ণালীবিদ্যার সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "beer-lambert-law",
    name: "Beer Lambert Law",
    nameBn: "বিয়ার-ল্যাম্বার্ট সূত্র",
    formula: "A = εlc",
    latexFormula: "A = \\varepsilon l c",
    category: "analytical-chemistry",
    variables: [
      { symbol: "A", meaning: "আলোক শোষণ (absorbance)", unit: "মাত্রাহীন" },
      { symbol: "ε", meaning: "মোলার শোষণাঙ্ক", unit: "L/mol·cm" },
      { symbol: "l", meaning: "পথের দৈর্ঘ্য (কিউভেট)", unit: "cm" },
      { symbol: "c", meaning: "দ্রবণের ঘনমাত্রা", unit: "mol/L" },
    ],
    explanation:
      "বিয়ার-ল্যাম্বার্ট সূত্র বিশ্লেষণী রসায়নে অজানা ঘনমাত্রা নির্ণয়ে ব্যবহার হয়। A = log(I₀/I)।",
    example: {
      question: "ε=2000 L/mol·cm, l=1 cm, c=0.001 mol/L। A কত?",
      solution:
        "A = εlc\nA = 2000 × 1 × 0.001\nA = 2.0",
    },
    relatedFormulas: ["frequency-wavelength"],
    relatedTopics: [],
  },

  {
    id: "frequency-wavelength",
    name: "Frequency-Wavelength Relation",
    nameBn: "কম্পাঙ্ক-তরঙ্গদৈর্ঘ্য সম্পর্ক",
    formula: "c = νλ",
    latexFormula: "c = \\nu \\lambda",
    category: "physical-chemistry",
    variables: [
      { symbol: "c", meaning: "আলোর গতি (3×10⁸ m/s)", unit: "m/s" },
      { symbol: "ν", meaning: "কম্পাঙ্ক", unit: "Hz (s⁻¹)" },
      { symbol: "λ", meaning: "তরঙ্গদৈর্ঘ্য", unit: "m বা nm" },
    ],
    explanation:
      "তড়িৎচুম্বকীয় বিকিরণের কম্পাঙ্ক ও তরঙ্গদৈর্ঘ্যের গুণফল সবসময় আলোর গতির সমান। কম্পাঙ্ক বাড়লে তরঙ্গদৈর্ঘ্য কমে।",
    example: {
      question: "হলুদ আলোর তরঙ্গদৈর্ঘ্য ৫৮৯ nm হলে কম্পাঙ্ক কত?",
      solution:
        "ν = c / λ\nν = 3×10⁸ / 589×10⁻⁹\nν = 5.09×10¹⁴ Hz",
    },
    relatedFormulas: ["photon-energy", "de-broglie-equation"],
    relatedTopics: [],
  },

  {
    id: "photon-energy",
    name: "Photon Energy",
    nameBn: "ফোটনের শক্তি",
    formula: "E = hν = hc/λ",
    latexFormula: "E = h\\nu = \\frac{hc}{\\lambda}",
    category: "physical-chemistry",
    variables: [
      { symbol: "E", meaning: "ফোটনের শক্তি", unit: "J বা eV" },
      { symbol: "h", meaning: "প্ল্যাংকের ধ্রুবক (6.626×10⁻³⁴ J·s)", unit: "J·s" },
      { symbol: "ν", meaning: "কম্পাঙ্ক", unit: "Hz" },
      { symbol: "λ", meaning: "তরঙ্গদৈর্ঘ্য", unit: "m" },
    ],
    explanation:
      "প্ল্যাংকের সূত্র অনুযায়ী আলোর শক্তি তার কম্পাঙ্কের সমানুপাতিক। বেশি কম্পাঙ্কের আলোয় (যেমন UV) বেশি শক্তি।",
    example: {
      question: "λ = 400 nm (বেগুনি আলো)-এর একটি ফোটনের শক্তি কত?",
      solution:
        "E = hc/λ\nE = (6.626×10⁻³⁴ × 3×10⁸) / 400×10⁻⁹\nE = 1.99×10⁻²⁵ / 4×10⁻⁷\nE = 4.97×10⁻¹⁹ J",
    },
    relatedFormulas: ["frequency-wavelength", "rydberg-equation"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // L. Surface Chemistry Formulas — পৃষ্ঠ রসায়ন সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "adsorption-isotherm",
    name: "Adsorption Isotherm",
    nameBn: "শোষণ সমতাপ সূত্র",
    formula: "x/m = k × P^(1/n)  (Freundlich)",
    latexFormula: "\\frac{x}{m} = k \\cdot P^{1/n}",
    category: "physical-chemistry",
    variables: [
      { symbol: "x/m", meaning: "প্রতি গ্রাম শোষকে শোষিত গ্যাসের পরিমাণ", unit: "g/g" },
      { symbol: "k, n", meaning: "ফ্রুন্ডলিখ ধ্রুবক (n > 1)", unit: "—" },
      { symbol: "P", meaning: "চাপ", unit: "atm" },
    ],
    explanation:
      "ফ্রুন্ডলিখ সমতাপ সূত্র বলে শোষণের পরিমাণ চাপের 1/n শক্তির সমানুপাতিক। log(x/m) = log k + (1/n) log P।",
    example: {
      question: "k=0.5, n=2, P=4 atm হলে x/m কত?",
      solution:
        "x/m = k × P^(1/n)\nx/m = 0.5 × 4^(1/2)\nx/m = 0.5 × 2 = 1.0 g/g",
    },
    relatedFormulas: [],
    relatedTopics: [],
  },

  {
    id: "surface-tension-formula",
    name: "Surface Tension Formula",
    nameBn: "পৃষ্ঠটান সূত্র",
    formula: "γ = F / (2L)",
    latexFormula: "\\gamma = \\frac{F}{2L}",
    category: "physical-chemistry",
    variables: [
      { symbol: "γ", meaning: "পৃষ্ঠটান", unit: "N/m বা J/m²" },
      { symbol: "F", meaning: "পৃষ্ঠটনের জন্য প্রয়োজনীয় বল", unit: "N" },
      { symbol: "L", meaning: "তারের দৈর্ঘ্য (দুটি পৃষ্ঠের জন্য 2L)", unit: "m" },
    ],
    explanation:
      "পৃষ্ঠটান হলো তরলের পৃষ্ঠে প্রতি একক দৈর্ঘ্যে ক্রিয়াশীল বল। এটি সাবানের বুদবুদ, কৈশিক ক্রিয়ায় দেখা যায়।",
    example: {
      question: "১০ cm তারে পানির ফিল্ম ধরে রাখতে ০.৭৩ N বল লাগলে γ কত?",
      solution:
        "γ = F / (2L)\nγ = 0.073 N / (2 × 0.1 m)\nγ = 0.073 / 0.2 = 0.365 N/m",
    },
    relatedFormulas: [],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // M. Stoichiometry Formulas — স্টয়কিওমেট্রি সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "limiting-reagent",
    name: "Limiting Reagent",
    nameBn: "সীমাবদ্ধ বিক্রিয়ক",
    formula: "ছোট n/stoic ratio → সীমাবদ্ধ বিক্রিয়ক",
    latexFormula: "\\text{Limiting Reagent}: \\min\\left(\\frac{n_A}{a}, \\frac{n_B}{b}\\right)",
    category: "physical-chemistry",
    variables: [
      { symbol: "n_A, n_B", meaning: "বিক্রিয়ক A ও B-এর মোল", unit: "mol" },
      { symbol: "a, b", meaning: "বিক্রিয়ার সমীকরণে স্টয়কিওমেট্রিক সহগ", unit: "—" },
    ],
    explanation:
      "সীমাবদ্ধ বিক্রিয়ক হলো যে বিক্রিয়কটি আগে শেষ হয় এবং উৎপাদের সর্বোচ্চ পরিমাণ নির্ধারণ করে।",
    example: {
      question: "N₂ + 3H₂ → 2NH₃। ২ মোল N₂ ও ৫ মোল H₂ নেওয়া হলে সীমাবদ্ধ বিক্রিয়ক কোনটি?",
      solution:
        "N₂: 2/1 = 2\nH₂: 5/3 = 1.67\nH₂ এর অনুপাত ছোট → H₂ সীমাবদ্ধ বিক্রিয়ক।\nNH₃ উৎপাদ = 5/3 × 2 = 3.33 mol",
    },
    relatedFormulas: ["percent-yield", "atom-economy"],
    relatedTopics: [],
  },

  {
    id: "percent-yield",
    name: "Percentage Yield",
    nameBn: "শতকরা উৎপাদ",
    formula: "% Yield = (Actual Yield / Theoretical Yield) × 100",
    latexFormula: "\\% Yield = \\frac{Actual}{Theoretical} \\times 100",
    category: "physical-chemistry",
    variables: [
      { symbol: "Actual Yield", meaning: "পরীক্ষায় প্রাপ্ত উৎপাদের পরিমাণ", unit: "g বা mol" },
      { symbol: "Theoretical Yield", meaning: "গণনাকৃত সর্বোচ্চ উৎপাদ", unit: "g বা mol" },
    ],
    explanation:
      "শতকরা উৎপাদ ১০০%-এর বেশি হয় না। কম হওয়ার কারণ: অসম্পূর্ণ বিক্রিয়া, পার্শ্ব বিক্রিয়া, পদার্থের অপচয়।",
    example: {
      question: "তাত্ত্বিক উৎপাদ ৫০ g, কিন্তু পরীক্ষায় ৪৫ g পাওয়া গেল। % yield কত?",
      solution:
        "% Yield = (45 / 50) × 100\n% Yield = 90%",
    },
    relatedFormulas: ["limiting-reagent", "atom-economy"],
    relatedTopics: [],
  },

  {
    id: "atom-economy",
    name: "Atom Economy",
    nameBn: "পরমাণু অর্থনীতি",
    formula: "Atom Economy = (M_desired / M_all) × 100",
    latexFormula: "Atom Economy = \\frac{M_{desired}}{M_{all products}} \\times 100",
    category: "physical-chemistry",
    variables: [
      { symbol: "M_desired", meaning: "কাঙ্ক্ষিত উৎপাদের মোলার ভর", unit: "g/mol" },
      { symbol: "M_all", meaning: "সকল উৎপাদের মোলার ভরের যোগফল", unit: "g/mol" },
    ],
    explanation:
      "পরমাণু অর্থনীতি সবুজ রসায়নের মূল নীতি। উচ্চ পরমাণু অর্থনীতি = কম বর্জ্য উৎপাদ = পরিবেশবান্ধব বিক্রিয়া।",
    example: {
      question: "CH₄ + 2O₂ → CO₂ + 2H₂O। শুধু CO₂ কাঙ্ক্ষিত হলে atom economy কত?",
      solution:
        "M_CO₂ = 44, M_H₂O = 18×2 = 36\nAtom Economy = 44 / (44 + 36) × 100\n= 44/80 × 100 = 55%",
    },
    relatedFormulas: ["percent-yield"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // N. Colligative Property Formulas — অবনতিজাত ধর্মের সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "boiling-point-elevation",
    name: "Boiling Point Elevation",
    nameBn: "স্ফুটনাঙ্ক উন্নয়ন",
    formula: "ΔT_b = K_b × m × i",
    latexFormula: "\\Delta T_b = K_b \\cdot m \\cdot i",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔT_b", meaning: "স্ফুটনাঙ্কের বৃদ্ধি", unit: "°C বা K" },
      { symbol: "K_b", meaning: "এবুলিওস্কোপিক ধ্রুবক (পানির জন্য 0.512 °C·kg/mol)", unit: "°C·kg/mol" },
      { symbol: "m", meaning: "মোলালিটি", unit: "mol/kg" },
      { symbol: "i", meaning: "ভ্যান্ট হফ ফ্যাক্টর (অবিয়োজিত=1)", unit: "—" },
    ],
    explanation:
      "দ্রাবক যোগে দ্রাবকের স্ফুটনাঙ্ক বাড়ে। তড়িৎবিশ্লেষ্য দ্রাবকের জন্য i > 1 (NaCl: i≈2, CaCl₂: i≈3)।",
    example: {
      question: "পানিতে ১ mol/kg গ্লুকোজ মেশালে ΔT_b কত? (i=1)",
      solution:
        "ΔT_b = 0.512 × 1 × 1 = 0.512 °C\nনতুন স্ফুটনাঙ্ক = 100 + 0.512 = 100.512 °C",
    },
    relatedFormulas: ["freezing-point-depression", "osmotic-pressure"],
    relatedTopics: [],
  },

  {
    id: "freezing-point-depression",
    name: "Freezing Point Depression",
    nameBn: "হিমাঙ্ক অবনমন",
    formula: "ΔT_f = K_f × m × i",
    latexFormula: "\\Delta T_f = K_f \\cdot m \\cdot i",
    category: "physical-chemistry",
    variables: [
      { symbol: "ΔT_f", meaning: "হিমাঙ্কের হ্রাস", unit: "°C বা K" },
      { symbol: "K_f", meaning: "ক্রায়োস্কোপিক ধ্রুবক (পানির জন্য 1.86 °C·kg/mol)", unit: "°C·kg/mol" },
      { symbol: "m", meaning: "মোলালিটি", unit: "mol/kg" },
      { symbol: "i", meaning: "ভ্যান্ট হফ ফ্যাক্টর", unit: "—" },
    ],
    explanation:
      "দ্রাবক যোগে দ্রাবকের হিমাঙ্ক কমে। গাড়ির রেডিয়েটরে অ্যান্টিফ্রিজ ও সমুদ্রের পানির হিমাঙ্ক কমার কারণ এটি।",
    example: {
      question: "পানিতে ২ mol/kg NaCl মেশালে ΔT_f কত? (i=2)",
      solution:
        "ΔT_f = 1.86 × 2 × 2 = 7.44 °C\nহিমাঙ্ক = 0 − 7.44 = −7.44 °C",
    },
    relatedFormulas: ["boiling-point-elevation", "osmotic-pressure"],
    relatedTopics: [],
  },

  {
    id: "osmotic-pressure",
    name: "Osmotic Pressure",
    nameBn: "অভিস্রবণ চাপ",
    formula: "π = iMRT",
    latexFormula: "\\pi = iMRT",
    category: "physical-chemistry",
    variables: [
      { symbol: "π", meaning: "অভিস্রবণ চাপ", unit: "atm" },
      { symbol: "i", meaning: "ভ্যান্ট হফ ফ্যাক্টর", unit: "—" },
      { symbol: "M", meaning: "মোলারিটি", unit: "mol/L" },
      { symbol: "R", meaning: "গ্যাস ধ্রুবক (0.0821 L·atm/mol·K)", unit: "—" },
      { symbol: "T", meaning: "পরম তাপমাত্রা", unit: "K" },
    ],
    explanation:
      "অভিস্রবণ চাপ দিয়ে অজানা বড় অণুর (প্রোটিন, পলিমার) আণবিক ভর নির্ণয় করা যায়। রক্তের লোহিত কণিকা অভিস্রবণ চাপের কারণে ফুলে যায় বা চুপসে যায়।",
    example: {
      question: "২৭°C-তে ০.১ M গ্লুকোজ দ্রবণের অভিস্রবণ চাপ কত? (i=1)",
      solution:
        "π = iMRT = 1 × 0.1 × 0.0821 × 300\nπ = 2.463 atm",
    },
    relatedFormulas: ["boiling-point-elevation", "freezing-point-depression"],
    relatedTopics: [],
  },

  // ══════════════════════════════════════════════════════
  // O. Atomic Structure Formulas — পরমাণুর গঠনের সূত্র
  // ══════════════════════════════════════════════════════

  {
    id: "rydberg-equation",
    name: "Rydberg Equation",
    nameBn: "রাইডবার্গ সমীকরণ",
    formula: "1/λ = R_H × (1/n₁² − 1/n₂²)",
    latexFormula: "\\frac{1}{\\lambda} = R_H \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)",
    category: "physical-chemistry",
    variables: [
      { symbol: "λ", meaning: "বিকিরিত আলোর তরঙ্গদৈর্ঘ্য", unit: "m বা nm" },
      { symbol: "R_H", meaning: "রাইডবার্গ ধ্রুবক (1.097×10⁷ m⁻¹)", unit: "m⁻¹" },
      { symbol: "n₁", meaning: "নিম্ন কক্ষপথ সংখ্যা (n₁ < n₂)", unit: "—" },
      { symbol: "n₂", meaning: "উচ্চ কক্ষপথ সংখ্যা", unit: "—" },
    ],
    explanation:
      "রাইডবার্গ সমীকরণ হাইড্রোজেন বর্ণালীর রেখার তরঙ্গদৈর্ঘ্য নির্ণয় করে। n₁=1: লাইম্যান সিরিজ (UV), n₁=2: বামার সিরিজ (দৃশ্যমান)।",
    example: {
      question: "n=3 থেকে n=2 তে ইলেকট্রন পতনে বামার সিরিজের তরঙ্গদৈর্ঘ্য কত?",
      solution:
        "1/λ = 1.097×10⁷ × (1/4 − 1/9)\n1/λ = 1.097×10⁷ × (0.25 − 0.111)\n1/λ = 1.097×10⁷ × 0.139\n1/λ = 1.525×10⁶ m⁻¹\nλ = 656 nm (লাল আলো)",
    },
    relatedFormulas: ["bohr-radius", "photon-energy"],
    relatedTopics: [],
  },

  {
    id: "electron-energy-formula",
    name: "Electron Energy Formula",
    nameBn: "ইলেকট্রনের শক্তি সূত্র (বোর মডেল)",
    formula: "Eₙ = −13.6 / n² eV  (H পরমাণু)",
    latexFormula: "E_n = -\\frac{13.6}{n^2} \\text{ eV}",
    category: "physical-chemistry",
    variables: [
      { symbol: "Eₙ", meaning: "n-তম কক্ষপথের শক্তি", unit: "eV বা J" },
      { symbol: "n", meaning: "প্রধান কোয়ান্টাম সংখ্যা (1,2,3...)", unit: "—" },
      { symbol: "13.6 eV", meaning: "হাইড্রোজেনের আয়নীকরণ শক্তি", unit: "eV" },
    ],
    explanation:
      "বোর মডেলে হাইড্রোজেন পরমাণুর n-তম কক্ষপথের শক্তি নির্ণয়ের সূত্র। ঋণাত্মক চিহ্ন বলে ইলেকট্রন আবদ্ধ অবস্থায় আছে।",
    example: {
      question: "হাইড্রোজেনের ২য় কক্ষপথের শক্তি কত?",
      solution:
        "E₂ = −13.6 / 2² eV\nE₂ = −13.6 / 4\nE₂ = −3.4 eV",
    },
    relatedFormulas: ["rydberg-equation", "bohr-radius", "photon-energy"],
    relatedTopics: [],
  },
];

// ক্যাটাগরি ফিল্টার করার জন্য unique ক্যাটাগরি তালিকা
export const FORMULA_CATEGORIES = [
  { key: "all", label: "সব" },
  { key: "basic", label: "মৌলিক রসায়ন" },
  { key: "solution", label: "দ্রবণ রসায়ন" },
  { key: "gas-law", label: "গ্যাসের সূত্র" },
  { key: "thermodynamics", label: "তাপগতিবিদ্যা" },
  { key: "electrochemistry", label: "তড়িৎ রসায়ন" },
  { key: "kinetics", label: "রাসায়নিক গতিবিদ্যা" },
  { key: "equilibrium", label: "সাম্যাবস্থা" },
  { key: "acid-base", label: "অ্যাসিড-বেস" },
  { key: "nuclear", label: "পারমাণবিক রসায়ন" },
  { key: "quantum", label: "কোয়ান্টাম রসায়ন" },
  { key: "spectroscopy", label: "বর্ণালীবিদ্যা" },
  { key: "surface", label: "পৃষ্ঠ রসায়ন" },
  { key: "stoichiometry", label: "স্টয়কিওমেট্রি" },
  { key: "colligative", label: "অবনতিজাত ধর্ম" },
  { key: "atomic-structure", label: "পরমাণুর গঠন" },
];

// ID দিয়ে formula খোঁজার helper function
export function getStaticFormula(id: string): Formula | null {
  return STATIC_FORMULAS.find((f) => f.id === id) || null;
}
