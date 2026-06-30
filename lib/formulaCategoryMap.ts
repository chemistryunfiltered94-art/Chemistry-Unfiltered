// lib/formulaCategoryMap.ts — প্রতিটি ফর্মুলা আইডির জন্য তার সাব-ক্যাটাগরি কী, তার ম্যাপ।
// formulas/page.tsx (লিস্ট) ও formulas/[id]/page.tsx (ডিটেইল) — দুই জায়গায় একই ম্যাপ ব্যবহার হয়
// যাতে ক্যাটাগরি লেবেল সবসময় সামঞ্জস্যপূর্ণ থাকে।

export const FORMULA_CATEGORY_MAP: Record<string, string> = {
  // A. Basic Chemistry
  "mole-formula": "basic",
  "avogadro-formula": "basic",
  "density-formula": "basic",
  "percentage-composition": "basic",
  "empirical-formula": "basic",
  "molecular-formula": "basic",

  // B. Solution Chemistry
  "molarity-formula": "solution",
  "molality-formula": "solution",
  "normality-formula": "solution",
  "mole-fraction": "solution",
  "dilution-formula": "solution",
  "ppm-formula": "solution",
  "ppb-formula": "solution",

  // C. Gas Laws
  "boyles-law": "gas-law",
  "charles-law": "gas-law",
  "gay-lussac-law": "gas-law",
  "avogadro-law": "gas-law",
  "combined-gas-law": "gas-law",
  "ideal-gas-equation": "gas-law",
  "van-der-waals": "gas-law",
  "daltons-law": "gas-law",
  "grahams-law": "gas-law",

  // D. Thermodynamics
  "enthalpy-change": "thermodynamics",
  "entropy-formula": "thermodynamics",
  "gibbs-free-energy": "thermodynamics",
  "heat-capacity": "thermodynamics",
  "hess-law": "thermodynamics",
  "calorimetry-equation": "thermodynamics",
  "internal-energy": "thermodynamics",
  "work-done-formula": "thermodynamics",

  // E. Electrochemistry
  "nernst-equation": "electrochemistry",
  "cell-potential": "electrochemistry",
  "faradays-law": "electrochemistry",
  "conductivity-formula": "electrochemistry",

  // F. Chemical Kinetics
  "rate-law": "kinetics",
  "first-order-equation": "kinetics",
  "second-order-equation": "kinetics",
  "arrhenius-equation": "kinetics",
  "half-life-formula": "kinetics",

  // G. Equilibrium
  "equilibrium-constant": "equilibrium",
  "reaction-quotient": "equilibrium",
  "le-chatelier-calc": "equilibrium",

  // H. Acid-Base
  "ph-formula": "acid-base",
  "poh-formula": "acid-base",
  "henderson-hasselbalch": "acid-base",
  "buffer-equation": "acid-base",
  "ka-formula": "acid-base",
  "kb-formula": "acid-base",

  // I. Nuclear Chemistry
  "radioactive-decay": "nuclear",
  "nuclear-half-life": "nuclear",
  "nuclear-binding-energy": "nuclear",

  // J. Quantum Chemistry
  "de-broglie-equation": "quantum",
  "heisenberg-uncertainty": "quantum",
  "schrodinger-equation": "quantum",
  "bohr-radius": "quantum",

  // K. Spectroscopy
  "beer-lambert-law": "spectroscopy",
  "frequency-wavelength": "spectroscopy",
  "photon-energy": "spectroscopy",

  // L. Surface Chemistry
  "adsorption-isotherm": "surface",
  "surface-tension-formula": "surface",

  // M. Stoichiometry
  "limiting-reagent": "stoichiometry",
  "percent-yield": "stoichiometry",
  "atom-economy": "stoichiometry",

  // N. Colligative Properties
  "boiling-point-elevation": "colligative",
  "freezing-point-depression": "colligative",
  "osmotic-pressure": "colligative",

  // O. Atomic Structure
  "rydberg-equation": "atomic-structure",
  "electron-energy-formula": "atomic-structure",
};
