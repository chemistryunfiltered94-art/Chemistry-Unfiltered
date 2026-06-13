export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  nameBn: string;
  atomicMass: number;
  category: string;
  period: number;
  group: number | null;
  electronConfig: string;
  oxidationStates: string;
  electronegativity: number | null;
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  state: "solid" | "liquid" | "gas" | "unknown";
  discoveredBy: string;
  discoveryYear: string;
  uses: string;
  col: number;
  row: number;
}

export const categoryColors: Record<string, string> = {
  "alkali-metal":       "bg-red-400 dark:bg-red-600",
  "alkaline-earth":     "bg-orange-400 dark:bg-orange-600",
  "transition-metal":   "bg-yellow-400 dark:bg-yellow-600",
  "post-transition":    "bg-teal-400 dark:bg-teal-600",
  "metalloid":          "bg-green-400 dark:bg-green-600",
  "nonmetal":           "bg-blue-400 dark:bg-blue-600",
  "halogen":            "bg-cyan-400 dark:bg-cyan-600",
  "noble-gas":          "bg-purple-400 dark:bg-purple-600",
  "lanthanide":         "bg-pink-400 dark:bg-pink-600",
  "actinide":           "bg-rose-400 dark:bg-rose-600",
  "unknown":            "bg-slate-400 dark:bg-slate-600",
};

export const categoryNames: Record<string, string> = {
  "alkali-metal":     "ক্ষার ধাতু",
  "alkaline-earth":   "ক্ষারীয় মৃত্তিকা ধাতু",
  "transition-metal": "অবস্থান্তর ধাতু",
  "post-transition":  "পোস্ট-ট্রানজিশন ধাতু",
  "metalloid":        "ধাতুকল্প",
  "nonmetal":         "অধাতু",
  "halogen":          "হ্যালোজেন",
  "noble-gas":        "নিষ্ক্রিয় গ্যাস",
  "lanthanide":       "ল্যান্থানাইড",
  "actinide":         "অ্যাক্টিনাইড",
  "unknown":          "অজানা",
};

export const elements: ElementData[] = [
  { atomicNumber:1,  symbol:"H",  name:"Hydrogen",     nameBn:"হাইড্রোজেন",   atomicMass:1.008,   category:"nonmetal",        period:1, group:1,   electronConfig:"1s¹",               oxidationStates:"+1, -1",       electronegativity:2.20, meltingPoint:-259.16, boilingPoint:-252.88, density:0.00009,  state:"gas",     discoveredBy:"Henry Cavendish",   discoveryYear:"1766", uses:"জ্বালানি, অ্যামোনিয়া তৈরি, শিল্পকারখানা", col:1,  row:1 },
  { atomicNumber:2,  symbol:"He", name:"Helium",        nameBn:"হিলিয়াম",      atomicMass:4.003,   category:"noble-gas",       period:1, group:18,  electronConfig:"1s²",               oxidationStates:"0",            electronegativity:null, meltingPoint:null,    boilingPoint:-268.93, density:0.000178, state:"gas",     discoveredBy:"Pierre Janssen",    discoveryYear:"1868", uses:"বেলুন, ওয়েল্ডিং, MRI মেশিন", col:18, row:1 },
  { atomicNumber:3,  symbol:"Li", name:"Lithium",       nameBn:"লিথিয়াম",      atomicMass:6.941,   category:"alkali-metal",    period:2, group:1,   electronConfig:"[He] 2s¹",          oxidationStates:"+1",           electronegativity:0.98, meltingPoint:180.5,   boilingPoint:1342,    density:0.534,    state:"solid",   discoveredBy:"Johan August Arfwedson", discoveryYear:"1817", uses:"ব্যাটারি, গ্লাস, ওষুধ", col:1,  row:2 },
  { atomicNumber:4,  symbol:"Be", name:"Beryllium",     nameBn:"বেরিলিয়াম",    atomicMass:9.012,   category:"alkaline-earth",  period:2, group:2,   electronConfig:"[He] 2s²",          oxidationStates:"+2",           electronegativity:1.57, meltingPoint:1287,    boilingPoint:2470,    density:1.85,     state:"solid",   discoveredBy:"Louis Nicolas Vauquelin", discoveryYear:"1798", uses:"মহাকাশযান, পারমাণবিক চুল্লি", col:2,  row:2 },
  { atomicNumber:5,  symbol:"B",  name:"Boron",         nameBn:"বোরন",          atomicMass:10.811,  category:"metalloid",       period:2, group:13,  electronConfig:"[He] 2s² 2p¹",      oxidationStates:"+3",           electronegativity:2.04, meltingPoint:2075,    boilingPoint:4000,    density:2.34,     state:"solid",   discoveredBy:"Joseph Louis Gay-Lussac", discoveryYear:"1808", uses:"বোরাক্স, ফাইবারগ্লাস, পারমাণবিক চুল্লি", col:13, row:2 },
  { atomicNumber:6,  symbol:"C",  name:"Carbon",        nameBn:"কার্বন",        atomicMass:12.011,  category:"nonmetal",        period:2, group:14,  electronConfig:"[He] 2s² 2p²",      oxidationStates:"+4, +2, -4",   electronegativity:2.55, meltingPoint:3550,    boilingPoint:4827,    density:2.267,    state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"জীব যৌগ, ডায়মন্ড, গ্রাফাইট, জ্বালানি", col:14, row:2 },
  { atomicNumber:7,  symbol:"N",  name:"Nitrogen",      nameBn:"নাইট্রোজেন",    atomicMass:14.007,  category:"nonmetal",        period:2, group:15,  electronConfig:"[He] 2s² 2p³",      oxidationStates:"+5,+4,+3,-3",  electronegativity:3.04, meltingPoint:-210.01, boilingPoint:-195.79, density:0.00125,  state:"gas",     discoveredBy:"Daniel Rutherford", discoveryYear:"1772", uses:"সার, বিস্ফোরক, খাদ্য সংরক্ষণ", col:15, row:2 },
  { atomicNumber:8,  symbol:"O",  name:"Oxygen",        nameBn:"অক্সিজেন",      atomicMass:15.999,  category:"nonmetal",        period:2, group:16,  electronConfig:"[He] 2s² 2p⁴",      oxidationStates:"-2, -1",       electronegativity:3.44, meltingPoint:-218.79, boilingPoint:-182.96, density:0.00143,  state:"gas",     discoveredBy:"Carl Wilhelm Scheele", discoveryYear:"1771", uses:"শ্বাসকার্য, দহন, ঢালাই", col:16, row:2 },
  { atomicNumber:9,  symbol:"F",  name:"Fluorine",      nameBn:"ফ্লুরিন",       atomicMass:18.998,  category:"halogen",         period:2, group:17,  electronConfig:"[He] 2s² 2p⁵",      oxidationStates:"-1",           electronegativity:3.98, meltingPoint:-219.62, boilingPoint:-188.12, density:0.0017,   state:"gas",     discoveredBy:"Henri Moissan",     discoveryYear:"1886", uses:"টুথপেস্ট, ননস্টিক কোটিং (Teflon)", col:17, row:2 },
  { atomicNumber:10, symbol:"Ne", name:"Neon",          nameBn:"নিয়ন",          atomicMass:20.180,  category:"noble-gas",       period:2, group:18,  electronConfig:"[He] 2s² 2p⁶",      oxidationStates:"0",            electronegativity:null, meltingPoint:-248.59, boilingPoint:-246.08, density:0.0009,   state:"gas",     discoveredBy:"William Ramsay",    discoveryYear:"1898", uses:"নিয়ন লাইট, লেজার, রেফ্রিজারেশন", col:18, row:2 },
  { atomicNumber:11, symbol:"Na", name:"Sodium",        nameBn:"সোডিয়াম",      atomicMass:22.990,  category:"alkali-metal",    period:3, group:1,   electronConfig:"[Ne] 3s¹",          oxidationStates:"+1",           electronegativity:0.93, meltingPoint:97.72,   boilingPoint:883,     density:0.971,    state:"solid",   discoveredBy:"Humphry Davy",      discoveryYear:"1807", uses:"লবণ (NaCl), সাবান, কাচ, আলোক শিল্প", col:1,  row:3 },
  { atomicNumber:12, symbol:"Mg", name:"Magnesium",     nameBn:"ম্যাগনেসিয়াম", atomicMass:24.305,  category:"alkaline-earth",  period:3, group:2,   electronConfig:"[Ne] 3s²",          oxidationStates:"+2",           electronegativity:1.31, meltingPoint:650,     boilingPoint:1090,    density:1.738,    state:"solid",   discoveredBy:"Joseph Black",      discoveryYear:"1755", uses:"অ্যালুমিনিয়াম মিশ্রণ, আতশবাজি, ওষুধ", col:2,  row:3 },
  { atomicNumber:13, symbol:"Al", name:"Aluminum",      nameBn:"অ্যালুমিনিয়াম", atomicMass:26.982,  category:"post-transition", period:3, group:13,  electronConfig:"[Ne] 3s² 3p¹",      oxidationStates:"+3",           electronegativity:1.61, meltingPoint:660.32,  boilingPoint:2519,    density:2.698,    state:"solid",   discoveredBy:"Hans Christian Ørsted", discoveryYear:"1825", uses:"বিমান, প্যাকেজিং, নির্মাণ", col:13, row:3 },
  { atomicNumber:14, symbol:"Si", name:"Silicon",       nameBn:"সিলিকন",        atomicMass:28.086,  category:"metalloid",       period:3, group:14,  electronConfig:"[Ne] 3s² 3p²",      oxidationStates:"+4, -4",       electronegativity:1.90, meltingPoint:1414,    boilingPoint:3265,    density:2.329,    state:"solid",   discoveredBy:"Jöns Jacob Berzelius", discoveryYear:"1824", uses:"কম্পিউটার চিপ, সৌর প্যানেল, কাচ", col:14, row:3 },
  { atomicNumber:15, symbol:"P",  name:"Phosphorus",    nameBn:"ফসফরাস",        atomicMass:30.974,  category:"nonmetal",        period:3, group:15,  electronConfig:"[Ne] 3s² 3p³",      oxidationStates:"+5,+3,-3",     electronegativity:2.19, meltingPoint:44.15,   boilingPoint:280.5,   density:1.823,    state:"solid",   discoveredBy:"Hennig Brand",      discoveryYear:"1669", uses:"সার, দিয়াশলাই, বিস্ফোরক", col:15, row:3 },
  { atomicNumber:16, symbol:"S",  name:"Sulfur",        nameBn:"সালফার",         atomicMass:32.065,  category:"nonmetal",        period:3, group:16,  electronConfig:"[Ne] 3s² 3p⁴",      oxidationStates:"+6,+4,-2",     electronegativity:2.58, meltingPoint:115.21,  boilingPoint:444.72,  density:2.067,    state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"সালফিউরিক অ্যাসিড, রাবার, ওষুধ", col:16, row:3 },
  { atomicNumber:17, symbol:"Cl", name:"Chlorine",      nameBn:"ক্লোরিন",        atomicMass:35.453,  category:"halogen",         period:3, group:17,  electronConfig:"[Ne] 3s² 3p⁵",      oxidationStates:"+7,+5,+1,-1",  electronegativity:3.16, meltingPoint:-101.5,  boilingPoint:-34.04,  density:0.00321,  state:"gas",     discoveredBy:"Carl Wilhelm Scheele", discoveryYear:"1774", uses:"জীবাণুনাশক, PVC প্লাস্টিক, কীটনাশক", col:17, row:3 },
  { atomicNumber:18, symbol:"Ar", name:"Argon",         nameBn:"আর্গন",          atomicMass:39.948,  category:"noble-gas",       period:3, group:18,  electronConfig:"[Ne] 3s² 3p⁶",      oxidationStates:"0",            electronegativity:null, meltingPoint:-189.35, boilingPoint:-185.85, density:0.00178,  state:"gas",     discoveredBy:"Lord Rayleigh",     discoveryYear:"1894", uses:"ওয়েল্ডিং, বৈদ্যুতিক বাল্ব, নিরোধক", col:18, row:3 },
  { atomicNumber:19, symbol:"K",  name:"Potassium",     nameBn:"পটাশিয়াম",      atomicMass:39.098,  category:"alkali-metal",    period:4, group:1,   electronConfig:"[Ar] 4s¹",          oxidationStates:"+1",           electronegativity:0.82, meltingPoint:63.38,   boilingPoint:759,     density:0.862,    state:"solid",   discoveredBy:"Humphry Davy",      discoveryYear:"1807", uses:"সার, সাবান, বারুদ", col:1,  row:4 },
  { atomicNumber:20, symbol:"Ca", name:"Calcium",       nameBn:"ক্যালসিয়াম",    atomicMass:40.078,  category:"alkaline-earth",  period:4, group:2,   electronConfig:"[Ar] 4s²",          oxidationStates:"+2",           electronegativity:1.00, meltingPoint:842,     boilingPoint:1484,    density:1.54,     state:"solid",   discoveredBy:"Humphry Davy",      discoveryYear:"1808", uses:"সিমেন্ট, হাড়, দুধ, স্টিল", col:2,  row:4 },
  { atomicNumber:26, symbol:"Fe", name:"Iron",          nameBn:"আয়রন (লোহা)",   atomicMass:55.845,  category:"transition-metal",period:4, group:8,   electronConfig:"[Ar] 3d⁶ 4s²",      oxidationStates:"+2, +3",       electronegativity:1.83, meltingPoint:1538,    boilingPoint:2861,    density:7.87,     state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"স্টিল, নির্মাণ, যন্ত্রপাতি", col:8,  row:4 },
  { atomicNumber:29, symbol:"Cu", name:"Copper",        nameBn:"কপার (তামা)",    atomicMass:63.546,  category:"transition-metal",period:4, group:11,  electronConfig:"[Ar] 3d¹⁰ 4s¹",     oxidationStates:"+1, +2",       electronegativity:1.90, meltingPoint:1084.62, boilingPoint:2562,    density:8.96,     state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"তার, মুদ্রা, পাইপ, ইলেকট্রনিক্স", col:11, row:4 },
  { atomicNumber:30, symbol:"Zn", name:"Zinc",          nameBn:"জিঙ্ক",          atomicMass:65.38,   category:"transition-metal",period:4, group:12,  electronConfig:"[Ar] 3d¹⁰ 4s²",     oxidationStates:"+2",           electronegativity:1.65, meltingPoint:419.53,  boilingPoint:907,     density:7.13,     state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"গ্যালভানাইজিং, ব্যাটারি, পেইন্ট", col:12, row:4 },
  { atomicNumber:35, symbol:"Br", name:"Bromine",       nameBn:"ব্রোমিন",        atomicMass:79.904,  category:"halogen",         period:4, group:17,  electronConfig:"[Ar] 3d¹⁰ 4s² 4p⁵", oxidationStates:"+5,+1,-1",     electronegativity:2.96, meltingPoint:-7.2,    boilingPoint:58.8,    density:3.12,     state:"liquid",  discoveredBy:"Antoine Jérôme Balard", discoveryYear:"1826", uses:"অগ্নি প্রতিরোধক, ওষুধ, ছবি তোলা", col:17, row:4 },
  { atomicNumber:36, symbol:"Kr", name:"Krypton",       nameBn:"ক্রিপটন",        atomicMass:83.798,  category:"noble-gas",       period:4, group:18,  electronConfig:"[Ar] 3d¹⁰ 4s² 4p⁶", oxidationStates:"0",            electronegativity:3.00, meltingPoint:-157.36, boilingPoint:-153.22, density:0.00375,  state:"gas",     discoveredBy:"William Ramsay",    discoveryYear:"1898", uses:"আলোক শিল্প, লেজার, ফটোগ্রাফি", col:18, row:4 },
  { atomicNumber:47, symbol:"Ag", name:"Silver",        nameBn:"সিলভার (রূপা)",  atomicMass:107.868, category:"transition-metal",period:5, group:11,  electronConfig:"[Kr] 4d¹⁰ 5s¹",     oxidationStates:"+1",           electronegativity:1.93, meltingPoint:961.78,  boilingPoint:2162,    density:10.49,    state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"গহনা, মুদ্রা, ইলেকট্রনিক্স, ওষুধ", col:11, row:5 },
  { atomicNumber:53, symbol:"I",  name:"Iodine",        nameBn:"আয়োডিন",        atomicMass:126.904, category:"halogen",         period:5, group:17,  electronConfig:"[Kr] 4d¹⁰ 5s² 5p⁵", oxidationStates:"+7,+5,+1,-1",  electronegativity:2.66, meltingPoint:113.7,   boilingPoint:184.3,   density:4.94,     state:"solid",   discoveredBy:"Bernard Courtois",  discoveryYear:"1811", uses:"থাইরয়েড ওষুধ, জীবাণুনাশক, ছবি তোলা", col:17, row:5 },
  { atomicNumber:54, symbol:"Xe", name:"Xenon",         nameBn:"জেনন",           atomicMass:131.293, category:"noble-gas",       period:5, group:18,  electronConfig:"[Kr] 4d¹⁰ 5s² 5p⁶", oxidationStates:"0",            electronegativity:2.60, meltingPoint:-111.79, boilingPoint:-108.12, density:0.00589,  state:"gas",     discoveredBy:"William Ramsay",    discoveryYear:"1898", uses:"আলোক শিল্প, লেজার, মহাকাশ থ্রাস্টার", col:18, row:5 },
  { atomicNumber:79, symbol:"Au", name:"Gold",          nameBn:"গোল্ড (সোনা)",   atomicMass:196.967, category:"transition-metal",period:6, group:11,  electronConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s¹", oxidationStates:"+1, +3",      electronegativity:2.54, meltingPoint:1064.18, boilingPoint:2856,    density:19.32,    state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"গহনা, ইলেকট্রনিক্স, মুদ্রা", col:11, row:6 },
  { atomicNumber:80, symbol:"Hg", name:"Mercury",       nameBn:"মার্কারি (পারদ)",atomicMass:200.592, category:"transition-metal",period:6, group:12,  electronConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s²", oxidationStates:"+1, +2",      electronegativity:2.00, meltingPoint:-38.83,  boilingPoint:356.73,  density:13.53,    state:"liquid",  discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"থার্মোমিটার, ব্যারোমিটার, সুইচ", col:12, row:6 },
  { atomicNumber:82, symbol:"Pb", name:"Lead",          nameBn:"লেড (সীসা)",     atomicMass:207.2,   category:"post-transition", period:6, group:14,  electronConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", oxidationStates:"+2, +4",  electronegativity:2.33, meltingPoint:327.46,  boilingPoint:1749,    density:11.34,    state:"solid",   discoveredBy:"Ancient",           discoveryYear:"প্রাচীন", uses:"ব্যাটারি, বিকিরণ ঢাল, পাইপ", col:14, row:6 },
  { atomicNumber:86, symbol:"Rn", name:"Radon",         nameBn:"রেডন",           atomicMass:222,     category:"noble-gas",       period:6, group:18,  electronConfig:"[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", oxidationStates:"0",       electronegativity:null, meltingPoint:-71,     boilingPoint:-61.7,   density:0.00973,  state:"gas",     discoveredBy:"Friedrich Ernst Dorn", discoveryYear:"1900", uses:"ক্যান্সার চিকিৎসা (সীমিত)", col:18, row:6 },
  { atomicNumber:92, symbol:"U",  name:"Uranium",       nameBn:"ইউরেনিয়াম",     atomicMass:238.029, category:"actinide",        period:7, group:null,electronConfig:"[Rn] 5f³ 6d¹ 7s²",  oxidationStates:"+3,+4,+5,+6",  electronegativity:1.38, meltingPoint:1135,    boilingPoint:4131,    density:18.95,    state:"solid",   discoveredBy:"Martin Heinrich Klaproth", discoveryYear:"1789", uses:"পারমাণবিক জ্বালানি, অস্ত্র", col:6,  row:10 },
];
