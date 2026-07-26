// lib/seedData/index.ts
//
// সম্পূর্ণ কারিকুলামের যেসব subsection-এর কনটেন্ট এখনো পর্যন্ত লেখা হয়েছে তার রেজিস্ট্রি।
// নতুন subsection (যেমন ১.২, ১.৩...) সম্পন্ন হলে এখানে import করে packages তালিকায়
// যোগ করলেই admin/seed-content পেজে সেটি ইমপোর্টের জন্য দেখা যাবে।
//
// lib/syllabus.ts-এ সম্পূর্ণ ৫৯টি subsection-এর code/title তালিকা আছে (রোডম্যাপ হিসেবে);
// এখানে শুধু সেইসব subsection থাকবে যেগুলোর জন্য সম্পূর্ণ কনটেন্ট লেখা শেষ হয়েছে।

import { SeedChapter } from "./types";
import chapter11  from "./physical/1-1-matter-structure";
import chapter12  from "./physical/1-2-gaseous-state";
import chapter13  from "./physical/1-3-thermodynamics";
import chapter14  from "./physical/1-4-chemical-equilibrium";
import chapter15  from "./physical/1-5-acid-base-chemistry";
import chapter16  from "./physical/1-6-electrochemistry";
import chapter17  from "./physical/1-7-chemical-kinetics";
import chapter18  from "./physical/1-8-surface-chemistry";
import chapter19  from "./physical/1-9-quantum-chemistry";
import chapter110 from "./physical/1-10-nuclear-chemistry";
import chapter111 from "./physical/1-11-atomic-structure";
import chapter112 from "./physical/1-12-chemical-bonding";
import chapter113 from "./physical/1-13-liquid-solid-state";
import chapter114 from "./physical/1-14-solutions-colligative-properties";
import chapter115 from "./physical/1-15-spectroscopy";
import chapter116 from "./physical/1-16-statistical-thermodynamics";
import chapter117 from "./physical/1-17-physical-chemistry-lab";
import chapter118 from "./physical/1-18-photochemistry";
import chapter119 from "./physical/1-19-solid-state-chemistry";
import chapter120 from "./physical/1-20-computational-chemistry";
import chapter121 from "./physical/1-21-molecular-symmetry";
import chapter122 from "./physical/1-22-group-theory";
import chapter123 from "./physical/1-23-nanochemistry";
import chapter124 from "./physical/1-24-polymer-physical-chemistry";
import chapter125 from "./physical/1-25-biophysical-chemistry";
import chapter126 from "./physical/1-26-non-equilibrium-thermodynamics";
import chapter127 from "./physical/1-27-surface-thermodynamics";
import chapter128 from "./physical/1-28-electrochemical-impedance";
import chapter129 from "./physical/1-29-plasma-chemistry";
import chapter130 from "./physical/1-30-laser-chemistry";
import chapter131 from "./physical/1-31-atmospheric-physical-chemistry";
import chapter132 from "./physical/1-32-materials-chemistry";
import chapter133 from "./physical/1-33-soft-matter-chemistry";
import chapter134 from "./physical/1-34-green-physical-chemistry";
import chapter135 from "./physical/1-35-advanced-reaction-kinetics";
import chapter136 from "./physical/1-36-advanced-spectroscopy";
import chapter137 from "./physical/1-37-modern-research-techniques";
import chapter21  from "./organic/2-1-basic-organic-chemistry";
import chapter22  from "./organic/2-2-alkenes";
import chapter25  from "./organic/2-5-aldehydes";
import chapter26  from "./organic/2-6-carboxylic-acids";
import chapter27  from "./organic/2-7-amines";
import chapter29  from "./organic/2-9-polymer-chemistry";
import chapter211 from "./organic/2-11-named-reactions";
import chapter212 from "./organic/2-12-chemical-bonding-structure";
import chapter213 from "./organic/2-13-iupac-nomenclature";
import chapter214 from "./organic/2-14-isomerism";
import chapter215 from "./organic/2-15-organic-reactions";
import chapter216 from "./organic/2-16-types-of-organic-reactions";
import chapter217 from "./organic/2-17-reaction-intermediates";
import chapter218 from "./organic/2-18-alkanes";
import chapter219 from "./organic/2-19-alkynes";
import chapter220 from "./organic/2-20-aromatic-hydrocarbons";
import chapter221 from "./organic/2-21-haloalkanes";
import chapter222 from "./organic/2-22-haloarenes";
import chapter223 from "./organic/2-23-alcohols";
import chapter224 from "./organic/2-24-phenols";
import chapter225 from "./organic/2-25-ethers";
import chapter226 from "./organic/2-26-ketones";
import chapter227 from "./organic/2-27-carboxylic-acid-derivatives";
import chapter228 from "./organic/2-28-diazonium-salts";
import chapter229 from "./organic/2-29-nitro-compounds";
import chapter230 from "./organic/2-30-organic-sulfur-compounds";
import chapter231 from "./organic/2-31-carbohydrates";
import chapter232 from "./organic/2-32-amino-acids";
import chapter233 from "./organic/2-33-proteins";
import chapter234 from "./organic/2-34-lipids";
import chapter235 from "./organic/2-35-nucleic-acids";
import chapter236 from "./organic/2-36-enzymes";
import chapter237 from "./organic/2-37-vitamins";
import chapter238 from "./organic/2-38-hormones";
import chapter239 from "./organic/2-39-organic-spectroscopy";
import chapter240 from "./organic/2-40-organic-synthesis";
import chapter241 from "./organic/2-41-green-chemistry";
import chapter242 from "./organic/2-42-medicinal-chemistry";
import chapter243 from "./organic/2-43-natural-organic-compounds";
import chapter244 from "./organic/2-44-heterocyclic-compounds";
import chapter245 from "./organic/2-45-organometallic-compounds";
import chapter246 from "./organic/2-46-advanced-stereochemistry";
import chapter247 from "./organic/2-47-conformational-analysis";
import chapter248 from "./organic/2-48-pericyclic-reactions";
import chapter249 from "./organic/2-49-photochemistry";
import chapter250 from "./organic/2-50-supramolecular-chemistry";
import chapter251 from "./organic/2-51-combinatorial-click-chemistry";
import chapter252 from "./organic/2-52-asymmetric-synthesis";
import chapter253 from "./organic/2-53-bioorganic-chemistry";
import chapter254 from "./organic/2-54-computational-organic-chemistry";
import chapter255 from "./organic/2-55-flow-chemistry";
import chapter256 from "./organic/2-56-organic-nanochemistry";
import chapter257 from "./organic/2-57-organic-electronics";
import chapter258 from "./organic/2-58-advanced-polymers-smart-materials";
import chapter259 from "./organic/2-59-drug-discovery-design";
import chapter260 from "./organic/2-60-modern-organic-research-techniques";
import chapter261 from "./organic/2-61-organic-catalysis";
import chapter262 from "./organic/2-62-electroorganic-chemistry";
import chapter263 from "./organic/2-63-photoredox-chemistry";
import chapter264 from "./organic/2-64-metal-organic-frameworks";
import chapter265 from "./organic/2-65-covalent-organic-frameworks";
import chapter266 from "./organic/2-66-chemical-biology";
import chapter267 from "./organic/2-67-green-organic-synthesis";
import chapter268 from "./organic/2-68-ai-in-organic-chemistry";
import chapter269 from "./organic/2-69-future-of-organic-chemistry";
import chapter31  from "./inorganic/3-1-atomic-structure";
import chapter32  from "./inorganic/3-2-periodic-table";
import chapter33  from "./inorganic/3-3-chemical-bonding";
import chapter34  from "./inorganic/3-4-hydrogen";
import chapter35  from "./inorganic/3-5-s-block-elements";
import chapter36  from "./inorganic/3-6-p-block-elements";
import chapter37  from "./inorganic/3-7-d-block-elements";
import chapter38  from "./inorganic/3-8-f-block-elements";
import chapter39  from "./inorganic/3-9-coordination-chemistry";
import chapter310 from "./inorganic/3-10-metallurgy";
import chapter311 from "./inorganic/3-11-redox-reactions";
import chapter312 from "./inorganic/3-12-acid-base-salt";
import chapter313 from "./inorganic/3-13-noble-gases";
import chapter314 from "./inorganic/3-14-nuclear-chemistry";
import chapter315 from "./inorganic/3-15-industrial-inorganic-chemistry";
import chapter316 from "./inorganic/3-16-environmental-chemistry";
import chapter317 from "./inorganic/3-17-bio-inorganic-relationship";
import chapter318 from "./inorganic/3-18-solid-state-chemistry";
import chapter319 from "./inorganic/3-19-qualitative-analysis";
import chapter320 from "./inorganic/3-20-inorganic-reaction-mechanism";
import chapter321 from "./inorganic/3-21-organometallic-chemistry";
import chapter322 from "./inorganic/3-22-inorganic-polymers";
import chapter323 from "./inorganic/3-23-advanced-inorganic-materials";
import chapter324 from "./inorganic/3-24-quantum-chemistry-application";
import chapter325 from "./inorganic/3-25-inorganic-spectroscopy";
import chapter326 from "./inorganic/3-26-magnetic-chemistry";
import chapter327 from "./inorganic/3-27-inorganic-photochemistry";
import chapter328 from "./inorganic/3-28-advanced-solid-state-theory";
import chapter329 from "./inorganic/3-29-industrial-research-inorganic";
import chapter330 from "./inorganic/3-30-advanced-coordination-chemistry";
import chapter331 from "./inorganic/3-31-inorganic-research-methods";
import chapter332 from "./inorganic/3-32-group-theory-molecular-symmetry";
import chapter333 from "./inorganic/3-33-ligand-field-theory";
import chapter334 from "./inorganic/3-34-crystal-field-theory-advanced";
import chapter335 from "./inorganic/3-35-molecular-orbital-theory-inorganic";
import chapter336 from "./inorganic/3-36-transition-metal-reaction-mechanism";
import chapter337 from "./inorganic/3-37-metal-cluster-nanochemistry";
import chapter338 from "./inorganic/3-38-advanced-bio-inorganic-chemistry";
import chapter339 from "./inorganic/3-39-modern-inorganic-research";
import chapter340 from "./inorganic/3-40-descriptive-chemistry";
import chapter341 from "./inorganic/3-41-transition-metal-elementwise";
import chapter342 from "./inorganic/3-42-lanthanide-actinide-advanced";
import chapter343 from "./inorganic/3-43-organometallic-catalysis-advanced";
import chapter344 from "./inorganic/3-44-inorganic-reaction-kinetics";
import chapter345 from "./inorganic/3-45-solid-state-physics-inorganic";
import chapter346 from "./inorganic/3-46-analytical-inorganic-advanced";
import chapter347 from "./inorganic/3-47-computational-inorganic-chemistry";
import chapter348 from "./inorganic/3-48-main-group-advanced";
import chapter349 from "./inorganic/3-49-halogen-chemistry";
import chapter350 from "./inorganic/3-50-oxygen-chalcogen-chemistry";
import chapter351 from "./inorganic/3-51-nitrogen-phosphorus-chemistry";
import chapter352 from "./inorganic/3-52-boron-chemistry";
import chapter353 from "./inorganic/3-53-silicon-silicate-chemistry";
import chapter354 from "./inorganic/3-54-sulfur-chemistry-detailed";
import chapter355 from "./inorganic/3-55-fluorine-chemistry-advanced";
import chapter356 from "./inorganic/3-56-carbon-chemistry-inorganic";
import chapter357 from "./inorganic/3-57-metalloid-chemistry";
import chapter358 from "./inorganic/3-58-intermetallic-compounds";
import chapter359 from "./inorganic/3-59-inorganic-polymer-advanced";
import chapter360 from "./inorganic/3-60-high-temperature-chemistry";
import chapter361 from "./inorganic/3-61-nuclear-materials-chemistry";
import chapter362 from "./inorganic/3-62-environmental-inorganic-advanced";
import chapter363 from "./inorganic/3-63-future-inorganic-research";

// ═══════════════════════════════════════════════════════════════
// Phase 1 সম্পন্ন — ভৌত রসায়ন কাঠামো (১.১ – ১.৩৭, placeholder — কনটেন্ট বাকি)
// Phase 2 সম্পন্ন — জৈব রসায়ন কাঠামো (২.১ – ২.৬৯, placeholder — কনটেন্ট বাকি)
// Phase 3 সম্পন্ন — অজৈব রসায়ন কাঠামো (৩.১ – ৩.৬৩, Chapter→Topic→Subtopic, placeholder — কনটেন্ট বাকি)
// ═══════════════════════════════════════════════════════════════

export const SEED_PACKAGES: SeedChapter[] = [
  chapter11,   // 1.1   পদার্থের গঠন
  chapter12,   // 1.2   গ্যাসের ধর্ম
  chapter13,   // 1.3   তাপগতিবিদ্যা
  chapter14,   // 1.4   রাসায়নিক সাম্যাবস্থা
  chapter15,   // 1.5   অম্ল-ক্ষার রসায়ন
  chapter16,   // 1.6   তড়িৎ রসায়ন
  chapter17,   // 1.7   রাসায়নিক গতিবিদ্যা
  chapter18,   // 1.8   পৃষ্ঠ রসায়ন
  chapter19,   // 1.9   কোয়ান্টাম রসায়ন
  chapter110,  // 1.10  নিউক্লিয়ার রসায়ন
  chapter111,  // 1.11  পরমাণুর গঠন
  chapter112,  // 1.12  রাসায়নিক বন্ধন
  chapter113,  // 1.13  তরল ও কঠিন অবস্থা
  chapter114,  // 1.14  দ্রবণ ও কোলিগেটিভ ধর্ম
  chapter115,  // 1.15  বর্ণালীবিদ্যা
  chapter116,  // 1.16  পরিসংখ্যানিক তাপগতিবিদ্যা
  chapter117,  // 1.17  ভৌত রসায়নের ব্যবহারিক
  chapter118,  // 1.18  আলোক রসায়ন
  chapter119,  // 1.19  কঠিন অবস্থার রসায়ন
  chapter120,  // 1.20  কম্পিউটেশনাল রসায়ন
  chapter121,  // 1.21  আণবিক সমমিতি
  chapter122,  // 1.22  গ্রুপ তত্ত্ব
  chapter123,  // 1.23  ন্যানো রসায়ন
  chapter124,  // 1.24  পলিমার ভৌত রসায়ন
  chapter125,  // 1.25  জৈব-ভৌত রসায়ন
  chapter126,  // 1.26  অ-সাম্য তাপগতিবিদ্যা
  chapter127,  // 1.27  পৃষ্ঠ তাপগতিবিদ্যা
  chapter128,  // 1.28  ইলেক্ট্রোকেমিক্যাল ইম্পিডেন্স
  chapter129,  // 1.29  প্লাজমা রসায়ন
  chapter130,  // 1.30  লেজার রসায়ন
  chapter131,  // 1.31  বায়ুমণ্ডলীয় ভৌত রসায়ন
  chapter132,  // 1.32  উপাদান ভৌত রসায়ন
  chapter133,  // 1.33  সফট ম্যাটার রসায়ন
  chapter134,  // 1.34  সবুজ ভৌত রসায়ন
  chapter135,  // 1.35  উন্নত বিক্রিয়া গতিবিদ্যা
  chapter136,  // 1.36  উন্নত বর্ণালীবিদ্যা
  chapter137,  // 1.37  আধুনিক গবেষণা পদ্ধতি
  chapter21,   // 2.1   জৈব রসায়নের পরিচিতি
  chapter22,   // 2.2   আলকিন
  chapter25,   // 2.5   অ্যালডিহাইড
  chapter26,   // 2.6   কার্বক্সিলিক অ্যাসিড
  chapter27,   // 2.7   অ্যামিন
  chapter29,   // 2.9   পলিমার রসায়ন
  chapter211,  // 2.11  নামযুক্ত জৈব বিক্রিয়া
  chapter212,  // 2.12  রাসায়নিক বন্ধন ও গঠন
  chapter213,  // 2.13  IUPAC নামকরণ
  chapter214,  // 2.14  সমাণুতা
  chapter215,  // 2.15  জৈব বিক্রিয়া
  chapter216,  // 2.16  জৈব বিক্রিয়ার ধরন
  chapter217,  // 2.17  জৈব বিক্রিয়ার মধ্যবর্তী কণা
  chapter218,  // 2.18  আলকেন
  chapter219,  // 2.19  আলকাইন
  chapter220,  // 2.20  অ্যারোমেটিক হাইড্রোকার্বন
  chapter221,  // 2.21  হ্যালোআলকেন
  chapter222,  // 2.22  হ্যালোঅ্যারিন
  chapter223,  // 2.23  অ্যালকোহল
  chapter224,  // 2.24  ফেনল
  chapter225,  // 2.25  ইথার
  chapter226,  // 2.26  কিটোন
  chapter227,  // 2.27  কার্বক্সিলিক অ্যাসিডের ডেরিভেটিভ
  chapter228,  // 2.28  ডায়াজোনিয়াম লবণ
  chapter229,  // 2.29  নাইট্রো যৌগ
  chapter230,  // 2.30  জৈব সালফার যৌগ
  chapter231,  // 2.31  কার্বোহাইড্রেট
  chapter232,  // 2.32  অ্যামিনো অ্যাসিড
  chapter233,  // 2.33  প্রোটিন
  chapter234,  // 2.34  লিপিড
  chapter235,  // 2.35  নিউক্লিক অ্যাসিড (DNA ও RNA)
  chapter236,  // 2.36  এনজাইম
  chapter237,  // 2.37  ভিটামিন
  chapter238,  // 2.38  হরমোন
  chapter239,  // 2.39  জৈব স্পেকট্রোস্কপি
  chapter240,  // 2.40  জৈব সংশ্লেষণ
  chapter241,  // 2.41  গ্রিন কেমিস্ট্রি
  chapter242,  // 2.42  ঔষধ রসায়ন
  chapter243,  // 2.43  প্রাকৃতিক জৈব যৌগ
  chapter244,  // 2.44  হেটারোসাইক্লিক যৌগ
  chapter245,  // 2.45  অর্গানোমেটালিক যৌগ
  chapter246,  // 2.46  উন্নত স্টেরিওরসায়ন
  chapter247,  // 2.47  কনফরমেশনাল বিশ্লেষণ
  chapter248,  // 2.48  পারিসাইক্লিক বিক্রিয়া
  chapter249,  // 2.49  ফটোরসায়ন
  chapter250,  // 2.50  সুপ্রামলিকুলার রসায়ন
  chapter251,  // 2.51  কম্বিনেটোরিয়াল ও ক্লিক কেমিস্ট্রি
  chapter252,  // 2.52  অ্যাসিমেট্রিক সংশ্লেষণ
  chapter253,  // 2.53  জৈব-জীবরসায়ন
  chapter254,  // 2.54  কম্পিউটেশনাল জৈব রসায়ন
  chapter255,  // 2.55  ফ্লো কেমিস্ট্রি
  chapter256,  // 2.56  জৈব ন্যানোরসায়ন
  chapter257,  // 2.57  জৈব ইলেকট্রনিক্স
  chapter258,  // 2.58  উন্নত পলিমার ও স্মার্ট উপাদান
  chapter259,  // 2.59  ওষুধ আবিষ্কার ও নকশা
  chapter260,  // 2.60  আধুনিক গবেষণা কৌশল (জৈব)
  chapter261,  // 2.61  জৈব অনুঘটক রসায়ন
  chapter262,  // 2.62  ইলেক্ট্রোজৈব রসায়ন
  chapter263,  // 2.63  ফটোরেডক্স রসায়ন
  chapter264,  // 2.64  ধাতু–জৈব কাঠামো (MOFs)
  chapter265,  // 2.65  কোভ্যালেন্ট জৈব কাঠামো (COFs)
  chapter266,  // 2.66  রাসায়নিক জীববিজ্ঞান
  chapter267,  // 2.67  সবুজ জৈব সংশ্লেষণ
  chapter268,  // 2.68  কৃত্রিম বুদ্ধিমত্তা ও জৈব রসায়ন
  chapter269,  // 2.69  জৈব রসায়নের ভবিষ্যৎ
  chapter31,   // 3.1   পরমাণুর গঠন
  chapter32,   // 3.2   পর্যায় সারণি
  chapter33,   // 3.3   রাসায়নিক বন্ধন
  chapter34,   // 3.4   হাইড্রোজেন
  chapter35,   // 3.5   s-ব্লক মৌল
  chapter36,   // 3.6   p-ব্লক মৌল
  chapter37,   // 3.7   d-ব্লক মৌল
  chapter38,   // 3.8   f-ব্লক মৌল
  chapter39,   // 3.9   সমন্বয় রসায়ন
  chapter310,  // 3.10  ধাতুবিদ্যা
  chapter311,  // 3.11  জারণ-বিজারণ বিক্রিয়া
  chapter312,  // 3.12  অম্ল, ক্ষার ও লবণ
  chapter313,  // 3.13  নিষ্ক্রিয় গ্যাস
  chapter314,  // 3.14  নিউক্লিয়ার রসায়ন
  chapter315,  // 3.15  শিল্প অজৈব রসায়ন
  chapter316,  // 3.16  পরিবেশ রসায়ন
  chapter317,  // 3.17  জৈব-অজৈব যৌগের আন্তঃসম্পর্ক
  chapter318,  // 3.18  কঠিন অবস্থা রসায়ন
  chapter319,  // 3.19  অজৈব যৌগের বিশ্লেষণ
  chapter320,  // 3.20  অজৈব বিক্রিয়ার প্রক্রিয়া
  chapter321,  // 3.21  জৈব ধাতব রসায়ন
  chapter322,  // 3.22  অজৈব পলিমার
  chapter323,  // 3.23  উন্নত অজৈব পদার্থ
  chapter324,  // 3.24  কোয়ান্টাম রসায়নের অজৈব প্রয়োগ
  chapter325,  // 3.25  অজৈব স্পেকট্রোস্কপি
  chapter326,  // 3.26  চৌম্বক রসায়ন
  chapter327,  // 3.27  অজৈব ফটোকেমিস্ট্রি
  chapter328,  // 3.28  কঠিন পদার্থের উন্নত তত্ত্ব
  chapter329,  // 3.29  শিল্প ও গবেষণাভিত্তিক অজৈব রসায়ন
  chapter330,  // 3.30  জটিল অজৈব যৌগের রসায়ন
  chapter331,  // 3.31  অজৈব রসায়নের গবেষণা পদ্ধতি
  chapter332,  // 3.32  Group Theory ও Molecular Symmetry
  chapter333,  // 3.33  Ligand Field Theory
  chapter334,  // 3.34  Crystal Field Theory বিস্তারিত
  chapter335,  // 3.35  Molecular Orbital Theory (অজৈব প্রয়োগ)
  chapter336,  // 3.36  Transition Metal Reaction Mechanism
  chapter337,  // 3.37  Metal Cluster ও Nanochemistry
  chapter338,  // 3.38  Advanced Bio-Inorganic Chemistry
  chapter339,  // 3.39  Inorganic Chemistry এর আধুনিক গবেষণা ক্ষেত্র
  chapter340,  // 3.40  Descriptive Chemistry (মৌলভিত্তিক)
  chapter341,  // 3.41  Transition Metal Element-wise Chemistry
  chapter342,  // 3.42  Lanthanide ও Actinide Advanced Chemistry
  chapter343,  // 3.43  Organometallic Catalysis Advanced
  chapter344,  // 3.44  Inorganic Reaction Kinetics
  chapter345,  // 3.45  Solid State Physics ভিত্তিক অজৈব রসায়ন
  chapter346,  // 3.46  Analytical Inorganic Chemistry Advanced
  chapter347,  // 3.47  Computational Inorganic Chemistry
  chapter348,  // 3.48  Main Group Element Advanced Chemistry
  chapter349,  // 3.49  Halogen Chemistry
  chapter350,  // 3.50  Oxygen ও Chalcogen Chemistry
  chapter351,  // 3.51  Nitrogen ও Phosphorus Chemistry
  chapter352,  // 3.52  Boron Chemistry
  chapter353,  // 3.53  Silicon ও Silicate Chemistry
  chapter354,  // 3.54  Sulfur Chemistry বিস্তারিত
  chapter355,  // 3.55  Fluorine Chemistry Advanced
  chapter356,  // 3.56  Carbon Chemistry (অজৈব)
  chapter357,  // 3.57  Metalloid Chemistry
  chapter358,  // 3.58  Intermetallic Compounds
  chapter359,  // 3.59  Inorganic Polymer Advanced Chemistry
  chapter360,  // 3.60  High Temperature Chemistry
  chapter361,  // 3.61  Nuclear Materials Chemistry
  chapter362,  // 3.62  Environmental Inorganic Chemistry Advanced
  chapter363,  // 3.63  Future Inorganic Chemistry Research
];
