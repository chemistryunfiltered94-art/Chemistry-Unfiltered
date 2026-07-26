// lib/syllabus.ts
//
// "Subject Expansion" — সম্পূর্ণ রসায়ন কারিকুলামের অধ্যায়-তালিকা (১.১ থেকে ৮.৬)।
// প্রতিটি এন্ট্রি একটি "chapter" — admin/chapters পেজ থেকে এক ক্লিকে Firestore-এ
// যোগ করা যায়, অথবা lib/seedData/-এর সংশ্লিষ্ট প্যাকেজ ইমপোর্ট করলে (admin/seed-content
// পেজ থেকে) চ্যাপ্টার + তার ভেতরের সব টপিক-কনটেন্ট একসাথে তৈরি হয়ে যায়।
//
// ক্রম (order) সংখ্যাগুলো ইচ্ছাকৃতভাবে ১০ ধাপ করে ফাঁকা রাখা হয়েছে (১০, ২০, ৩০...)
// যাতে ভবিষ্যতে মাঝখানে নতুন অধ্যায় ঢোকাতে হলে পুরো তালিকা পুনঃক্রমায়ন করতে না হয়।

import { ChemistryCategory } from "@/types";

export interface SyllabusChapter {
  code: string;            // যেমন: "1.1" — seedData প্যাকেজের সাথে মেলানোর রেফারেন্স
  title: string;
  description?: string;
  order: number;
}

export const SYLLABUS: Record<ChemistryCategory, SyllabusChapter[]> = {

  // 1. Physical Chemistry — ভৌত রসায়ন (১.১ – ১.৩৭)
  "physical-chemistry": [
    { code: "1.1",    order: 10,   title: "পদার্থের গঠন",                   description: "পদার্থ কী, পদার্থের শ্রেণিবিভাগ, কঠিন, তরল ও গ্যাস, প্লাজমা ও বোস-আইনস্টাইন কনডেনসেট, ভৌত ও রাসায়নিক ধর্ম ইত্যাদি।" },
    { code: "1.2",    order: 20,   title: "গ্যাসের ধর্ম",                   description: "গ্যাসের বৈশিষ্ট্য, গ্যাসের চাপ, গ্যাসের আয়তন, গ্যাসের তাপমাত্রা, Boyle's Law ইত্যাদি।" },
    { code: "1.3",    order: 30,   title: "তাপগতিবিদ্যা",                   description: "তাপগতিবিদ্যার পরিচিতি, সিস্টেম, পরিবেশ ও সীমানা, উন্মুক্ত, বন্ধ ও বিচ্ছিন্ন সিস্টেম, State Function ও Path Function, Intensive ও Extensive Property ইত্যাদি।" },
    { code: "1.4",    order: 40,   title: "রাসায়নিক সাম্যাবস্থা",          description: "সাম্যাবস্থার ধারণা, Dynamic Equilibrium, Law of Mass Action, Equilibrium Constant (Kc), Equilibrium Constant (Kp) ইত্যাদি।" },
    { code: "1.5",    order: 50,   title: "অম্ল-ক্ষার রসায়ন",              description: "Buffer Solution, Buffer Capacity, Henderson–Hasselbalch Equation, pH, pOH ইত্যাদি।" },
    { code: "1.6",    order: 60,   title: "তড়িৎ রসায়ন",                   description: "Electrochemistry-এর পরিচিতি, Electrolyte, Non-electrolyte, Conductors, Ionic Conductance ইত্যাদি।" },
    { code: "1.7",    order: 70,   title: "রাসায়নিক গতিবিদ্যা",            description: "বিক্রিয়ার গতি, Rate of Reaction, Rate Law, Rate Constant, Order of Reaction ইত্যাদি।" },
    { code: "1.8",    order: 80,   title: "পৃষ্ঠ রসায়ন",                   description: "পৃষ্ঠ রসায়নের পরিচিতি, পৃষ্ঠ (Surface) কী, আন্তঃপৃষ্ঠ (Interface), পৃষ্ঠ শক্তি, পৃষ্ঠ মুক্ত শক্তি ইত্যাদি।" },
    { code: "1.9",    order: 90,   title: "কোয়ান্টাম রসায়ন",              description: "কোয়ান্টাম তত্ত্বের পরিচিতি, ব্ল্যাক বডি বিকিরণ, প্ল্যাঙ্কের কোয়ান্টাম তত্ত্ব, ফটোইলেকট্রিক প্রভাব, আইনস্টাইনের ব্যাখ্যা ইত্যাদি।" },
    { code: "1.10",   order: 100,  title: "নিউক্লিয়ার রসায়ন",             description: "নিউক্লিয়াসের গঠন, নিউক্লিয়ার স্থায়িত্ব, নিউক্লিয়ার বল, ভর ত্রুটি, বন্ধন শক্তি ইত্যাদি।" },
    { code: "1.11",   order: 105,  title: "পরমাণুর গঠন",                    description: "পরমাণুর ধারণা, ডাল্টনের পরমাণু তত্ত্ব, থমসনের মডেল, রাদারফোর্ডের পরীক্ষা, বোর মডেল ইত্যাদি।" },
    { code: "1.12",   order: 106,  title: "রাসায়নিক বন্ধন",                description: "রাসায়নিক বন্ধনের ধারণা, অক্টেট সূত্র, আয়নিক বন্ধন, সমযোজী বন্ধন, সমন্বয় সমযোজী বন্ধন ইত্যাদি।" },
    { code: "1.13",   order: 107,  title: "তরল ও কঠিন অবস্থা",              description: "কঠিনের বৈশিষ্ট্য, স্ফটিক কঠিন, অস্ফটিক কঠিন, Crystal Lattice, Unit Cell ইত্যাদি।" },
    { code: "1.14",   order: 108,  title: "দ্রবণ ও কোলিগেটিভ ধর্ম",         description: "দ্রবণের ধারণা, দ্রবণের প্রকারভেদ, Solute, Solvent, Saturated Solution ইত্যাদি।" },
    { code: "1.15",   order: 109,  title: "বর্ণালীবিদ্যা",                  description: "বর্ণালীবিদ্যার পরিচিতি, তড়িৎচুম্বকীয় বর্ণালী, বিকিরণের প্রকৃতি, তরঙ্গদৈর্ঘ্য, কম্পাঙ্ক ইত্যাদি।" },
    { code: "1.16",   order: 110,  title: "পরিসংখ্যানিক তাপগতিবিদ্যা",      description: "পরিসংখ্যানিক তাপগতিবিদ্যার পরিচিতি, মাইক্রোস্টেট, ম্যাক্রোস্টেট, সম্ভাব্যতা, Boltzmann Distribution ইত্যাদি।" },
    { code: "1.17",   order: 111,  title: "ভৌত রসায়নের ব্যবহারিক",         description: "ল্যাবরেটরি নিরাপত্তা, পরীক্ষাগারের যন্ত্রপাতি পরিচিতি, পরিমাপের নিয়ম, ত্রুটি বিশ্লেষণ, Significant Figures ইত্যাদি।" },
    { code: "1.18",   order: 112,  title: "আলোক রসায়ন",                    description: "আলোক রসায়নের পরিচিতি, আলো ও পদার্থের পারস্পরিক ক্রিয়া, ফোটন, আলোর শক্তি, কোয়ান্টাম ফলন (Quantum Yield) ইত্যাদি।" },
    { code: "1.19",   order: 113,  title: "কঠিন অবস্থার রসায়ন",            description: "কঠিন অবস্থার পরিচিতি, স্ফটিক (Crystal), অস্ফটিক (Amorphous), ইউনিট সেল, ল্যাটিস ইত্যাদি।" },
    { code: "1.20",   order: 114,  title: "কম্পিউটেশনাল রসায়ন",            description: "কম্পিউটেশনাল রসায়নের পরিচিতি, মলিকুলার মডেলিং, Molecular Mechanics, Quantum Mechanics ভিত্তিক গণনা, Hartree–Fock পদ্ধতি ইত্যাদি।" },
    { code: "1.21",   order: 115,  title: "আণবিক সমমিতি",                   description: "সমমিতির ধারণা, Symmetry Element, Symmetry Operation, Rotation Axis, Mirror Plane ইত্যাদি।" },
    { code: "1.22",   order: 116,  title: "গ্রুপ তত্ত্ব",                   description: "গ্রুপের ধারণা, গ্রুপের বৈশিষ্ট্য, Symmetry Group, Matrix Representation, Reducible Representation ইত্যাদি।" },
    { code: "1.23",   order: 117,  title: "ন্যানো রসায়ন",                  description: "ন্যানো প্রযুক্তির পরিচিতি, ন্যানো কণা, ন্যানো উপাদান, Nanostructure, Quantum Dot ইত্যাদি।" },
    { code: "1.24",   order: 118,  title: "পলিমার ভৌত রসায়ন",              description: "পলিমারের পরিচিতি, মনোমার, পলিমারাইজেশন, সংযোজন পলিমার, ঘনীভবন পলিমার ইত্যাদি।" },
    { code: "1.25",   order: 119,  title: "জৈব-ভৌত রসায়ন",                 description: "জৈব-ভৌত রসায়নের পরিচিতি, বায়োমলিকিউল, প্রোটিনের গঠন, DNA ও RNA, এনজাইমের গতিবিদ্যা ইত্যাদি।" },
    { code: "1.26",   order: 120,  title: "অ-সাম্য তাপগতিবিদ্যা",           description: "অ-সাম্য অবস্থার ধারণা, স্থিতিশীল ও অস্থিতিশীল অবস্থা, তাপ প্রবাহ, ভর প্রবাহ, শক্তি প্রবাহ ইত্যাদি।" },
    { code: "1.27",   order: 121,  title: "পৃষ্ঠ তাপগতিবিদ্যা",             description: "পৃষ্ঠ শক্তি, Surface Free Energy, Surface Tension, Interfacial Tension, Wetting ইত্যাদি।" },
    { code: "1.28",   order: 122,  title: "ইলেক্ট্রোকেমিক্যাল ইম্পিডেন্স",  description: "ইম্পিডেন্সের ধারণা, AC Current, Complex Impedance, Nyquist Plot, Bode Plot ইত্যাদি।" },
    { code: "1.29",   order: 123,  title: "প্লাজমা রসায়ন",                 description: "প্লাজমার পরিচিতি, প্লাজমার ধর্ম, আয়নীকরণ, পুনর্মিলন, ঠান্ডা প্লাজমা ইত্যাদি।" },
    { code: "1.30",   order: 124,  title: "লেজার রসায়ন",                   description: "লেজারের পরিচিতি, উদ্দীপিত বিকিরণ, Population Inversion, Optical Pumping, Laser Medium ইত্যাদি।" },
    { code: "1.31",   order: 125,  title: "বায়ুমণ্ডলীয় ভৌত রসায়ন",       description: "বায়ুমণ্ডলের গঠন, গ্যাসীয় বিক্রিয়া, ওজোন স্তর, ওজোন ক্ষয়, গ্রিনহাউস গ্যাস ইত্যাদি।" },
    { code: "1.32",   order: 126,  title: "উপাদান ভৌত রসায়ন",              description: "উপাদান বিজ্ঞানের পরিচিতি, ধাতব পদার্থ, সিরামিক, পলিমার, কম্পোজিট ইত্যাদি।" },
    { code: "1.33",   order: 127,  title: "সফট ম্যাটার রসায়ন",             description: "Soft Matter-এর পরিচিতি, Polymer Gel, Foam, Emulsion, Liquid Crystal ইত্যাদি।" },
    { code: "1.34",   order: 128,  title: "সবুজ ভৌত রসায়ন",                description: "সবুজ রসায়নের ধারণা, পরিবেশবান্ধব বিক্রিয়া, শক্তি দক্ষতা, নবায়নযোগ্য শক্তি, Green Solvent ইত্যাদি।" },
    { code: "1.35",   order: 129,  title: "উন্নত বিক্রিয়া গতিবিদ্যা",      description: "Fast Reaction, Slow Reaction, Chain Reaction, Oscillating Reaction, Autocatalytic Reaction ইত্যাদি।" },
    { code: "1.36",   order: 130,  title: "উন্নত বর্ণালীবিদ্যা",            description: "Fourier Transform Infrared (FTIR), FT-NMR, Two-dimensional NMR, Electron Spin Resonance (ESR), X-ray Diffraction (XRD) ইত্যাদি।" },
    { code: "1.37",   order: 131,  title: "আধুনিক গবেষণা পদ্ধতি",           description: "Computational Simulation, Molecular Docking, Molecular Dynamics, Machine Learning in Chemistry, Artificial Intelligence in Chemistry ইত্যাদি।" },
  ],

  // 2. Organic Chemistry — জৈব রসায়ন (২.১ – ২.৬৯)
  "organic-chemistry": [
    { code: "2.1",    order: 10,   title: "জৈব রসায়নের পরিচিতি",           description: "জৈব রসায়নের সংজ্ঞা, জৈব যৌগের বৈশিষ্ট্য, জৈব ও অজৈব যৌগের পার্থক্য, কার্বনের বিশেষ ধর্ম, কার্বনের ক্যাটেনেশন (Catenation) ইত্যাদি।" },
    { code: "2.2",    order: 20,   title: "আলকিন",                          description: "আলকিনের পরিচিতি, সাধারণ সংকেত (General Formula), গঠন ও হাইব্রিডাইজেশন (sp²), ডাবল বন্ডের প্রকৃতি, শারীরিক ধর্ম ইত্যাদি।" },
    { code: "2.5",    order: 50,   title: "অ্যালডিহাইড",                    description: "অ্যালডিহাইডের পরিচিতি, সাধারণ গঠন, কার্যকরী মূলক (–CHO), IUPAC নামকরণ, প্রস্তুত প্রণালী ইত্যাদি।" },
    { code: "2.6",    order: 60,   title: "কার্বক্সিলিক অ্যাসিড",           description: "কার্বক্সিলিক অ্যাসিডের পরিচিতি, কার্যকরী মূলক (–COOH), IUPAC নামকরণ, প্রস্তুত প্রণালী, অ্যালকোহল ও অ্যালডিহাইডের জারণ ইত্যাদি।" },
    { code: "2.7",    order: 70,   title: "অ্যামিন",                        description: "অ্যামিনের পরিচিতি, শ্রেণিবিভাগ, প্রাইমারি অ্যামিন, সেকেন্ডারি অ্যামিন, টারশিয়ারি অ্যামিন ইত্যাদি।" },
    { code: "2.9",    order: 90,   title: "পলিমার রসায়ন",                  description: "পলিমারের সংজ্ঞা, মনোমার, Repeat Unit, Degree of Polymerization, Natural Polymer ইত্যাদি।" },
    { code: "2.11",   order: 110,  title: "নামযুক্ত জৈব বিক্রিয়া",         description: "নামযুক্ত বিক্রিয়ার ধারণা, বিক্রিয়ার শ্রেণিবিভাগ, শিল্প ও গবেষণায় গুরুত্ব, ফ্রিডেল–ক্রাফ্টস অ্যালকাইলেশন, ফ্রিডেল–ক্রাফ্টস অ্যাসাইলেশন ইত্যাদি।" },
    { code: "2.12",   order: 115,  title: "রাসায়নিক বন্ধন ও গঠন",          description: "Covalent Bond, Sigma Bond (σ), Pi Bond (π), Single, Double, Triple Bond, Orbital ইত্যাদি।" },
    { code: "2.13",   order: 116,  title: "IUPAC নামকরণ",                   description: "IUPAC-এর নিয়ম, Parent Chain নির্বাচন, Numbering Rule, Functional Group Priority, Prefix ইত্যাদি।" },
    { code: "2.14",   order: 117,  title: "সমাণুতা",                        description: "Isomerism পরিচিতি, Structural Isomerism, Chain Isomerism, Position Isomerism, Functional Isomerism ইত্যাদি।" },
    { code: "2.15",   order: 118,  title: "জৈব বিক্রিয়া",                  description: "Organic Reaction পরিচিতি, Bond Breaking, Homolytic Cleavage, Heterolytic Cleavage, Electrophile ইত্যাদি।" },
    { code: "2.16",   order: 119,  title: "জৈব বিক্রিয়ার ধরন",             description: "Addition Reaction, Electrophilic Addition, Nucleophilic Addition, Substitution Reaction, Nucleophilic Substitution ইত্যাদি।" },
    { code: "2.17",   order: 120,  title: "জৈব বিক্রিয়ার মধ্যবর্তী কণা",   description: "Carbocation, Carbanion, Free Radical, Carbene, Nitrene ইত্যাদি।" },
    { code: "2.18",   order: 121,  title: "আলকেন",                          description: "Alkane পরিচিতি, General Formula, Homologous Series, Physical Properties, Chemical Properties ইত্যাদি।" },
    { code: "2.19",   order: 122,  title: "আলকাইন",                         description: "আলকাইনের পরিচিতি, সাধারণ সংকেত, sp Hybridization, Triple Bond Structure, শারীরিক ধর্ম ইত্যাদি।" },
    { code: "2.20",   order: 123,  title: "অ্যারোমেটিক হাইড্রোকার্বন",      description: "Aromaticity, Benzene Structure, Kekulé Structure, Resonance, Hückel's Rule ইত্যাদি।" },
    { code: "2.21",   order: 124,  title: "হ্যালোআলকেন",                    description: "Haloalkane পরিচিতি, Classification, Nomenclature, Preparation, Free Radical Halogenation ইত্যাদি।" },
    { code: "2.22",   order: 125,  title: "হ্যালোঅ্যারিন",                  description: "Haloarene পরিচিতি, Preparation, Chlorobenzene, Bromobenzene, Physical Properties ইত্যাদি।" },
    { code: "2.23",   order: 126,  title: "অ্যালকোহল",                      description: "Alcohol পরিচিতি, Classification, Monohydric Alcohol, Dihydric Alcohol, Trihydric Alcohol ইত্যাদি।" },
    { code: "2.24",   order: 127,  title: "ফেনল",                           description: "Phenol পরিচিতি, Structure, Acidity of Phenol, Preparation, Cumene Process ইত্যাদি।" },
    { code: "2.25",   order: 128,  title: "ইথার",                           description: "Ether পরিচিতি, Classification, Nomenclature, Preparation, Williamson Ether Synthesis ইত্যাদি।" },
    { code: "2.26",   order: 129,  title: "কিটোন",                          description: "কিটোনের পরিচিতি, সাধারণ গঠন, কার্যকরী মূলক (>C=O), IUPAC নামকরণ, প্রস্তুত প্রণালী ইত্যাদি।" },
    { code: "2.27",   order: 130,  title: "কার্বক্সিলিক অ্যাসিডের ডেরিভেটিভ", description: "পরিচিতি, অ্যাসিড ক্লোরাইড, অ্যাসিড অ্যানহাইড্রাইড, এস্টার, অ্যামাইড ইত্যাদি।" },
    { code: "2.28",   order: 131,  title: "ডায়াজোনিয়াম লবণ",              description: "পরিচিতি, ডায়াজোটাইজেশন, প্রস্তুত প্রণালী, বেনজিন ডায়াজোনিয়াম ক্লোরাইড, ভৌত ধর্ম ইত্যাদি।" },
    { code: "2.29",   order: 132,  title: "নাইট্রো যৌগ",                    description: "পরিচিতি, গঠন, IUPAC নামকরণ, প্রস্তুত প্রণালী, নাইট্রেশন ইত্যাদি।" },
    { code: "2.30",   order: 133,  title: "জৈব সালফার যৌগ",                 description: "পরিচিতি, থাইঅ্যালকোহল (থিওল), সালফাইড, ডাইসালফাইড, সালফোনিক অ্যাসিড ইত্যাদি।" },
    { code: "2.31",   order: 134,  title: "কার্বোহাইড্রেট",                 description: "কার্বোহাইড্রেটের সংজ্ঞা, ইতিহাস, সাধারণ সংকেত, শ্রেণিবিভাগ, জৈবিক গুরুত্ব ইত্যাদি।" },
    { code: "2.32",   order: 135,  title: "অ্যামিনো অ্যাসিড",               description: "সংজ্ঞা, গঠন, α, β, γ অ্যামিনো অ্যাসিড, জুইটার আয়ন, আইসোইলেকট্রিক পয়েন্ট ইত্যাদি।" },
    { code: "2.33",   order: 136,  title: "প্রোটিন",                        description: "সংজ্ঞা, গঠন, প্রোটিনের গুরুত্ব, সরল প্রোটিন, যৌগিক প্রোটিন ইত্যাদি।" },
    { code: "2.34",   order: 137,  title: "লিপিড",                          description: "সংজ্ঞা, বৈশিষ্ট্য, গুরুত্ব, সরল লিপিড, যৌগিক লিপিড ইত্যাদি।" },
    { code: "2.35",   order: 138,  title: "নিউক্লিক অ্যাসিড (DNA ও RNA)",   description: "নিউক্লিক অ্যাসিডের সংজ্ঞা, নিউক্লিওটাইড, নিউক্লিওসাইড, DNA গঠন, ডাবল হেলিক্স ইত্যাদি।" },
    { code: "2.36",   order: 139,  title: "এনজাইম",                         description: "সংজ্ঞা, বৈশিষ্ট্য, Oxidoreductase, Transferase, Hydrolase ইত্যাদি।" },
    { code: "2.37",   order: 140,  title: "ভিটামিন",                        description: "পরিচিতি, চর্বিতে দ্রবণীয় ভিটামিন (A, D, E, K), পানিতে দ্রবণীয় ভিটামিন (B-কমপ্লেক্স, C), উৎস, রাসায়নিক প্রকৃতি ইত্যাদি।" },
    { code: "2.38",   order: 141,  title: "হরমোন",                          description: "পরিচিতি, পেপটাইড হরমোন, স্টেরয়েড হরমোন, অ্যামিন হরমোন, ইনসুলিন ইত্যাদি।" },
    { code: "2.39",   order: 142,  title: "জৈব স্পেকট্রোস্কপি",             description: "স্পেকট্রোস্কপির সংজ্ঞা, স্পেকট্রোস্কপির গুরুত্ব, তড়িৎচৌম্বকীয় বর্ণালী (Electromagnetic Spectrum), শক্তি ও তরঙ্গদৈর্ঘ্যের সম্পর্ক, মৌলিক নীতি (UV-Vis) ইত্যাদি।" },
    { code: "2.40",   order: 143,  title: "জৈব সংশ্লেষণ",                   description: "জৈব সংশ্লেষণের ধারণা, পরিকল্পনা, Functional Group Transformation, Carbon–Carbon Bond Formation, Protecting Group ইত্যাদি।" },
    { code: "2.41",   order: 144,  title: "গ্রিন কেমিস্ট্রি",               description: "গ্রিন কেমিস্ট্রির ধারণা, উদ্দেশ্য, বর্জ্য প্রতিরোধ, Atom Economy, কম বিষাক্ত রাসায়নিক ইত্যাদি।" },
    { code: "2.42",   order: 145,  title: "ঔষধ রসায়ন",                     description: "ঔষধ রসায়নের সংজ্ঞা, ওষুধ আবিষ্কার, Drug Target, Receptor, Enzyme ইত্যাদি।" },
    { code: "2.43",   order: 146,  title: "প্রাকৃতিক জৈব যৌগ",              description: "পরিচিতি, Quinine, Morphine, Nicotine, Caffeine ইত্যাদি।" },
    { code: "2.44",   order: 147,  title: "হেটারোসাইক্লিক যৌগ",             description: "পরিচিতি, Saturated, Unsaturated, Aromatic, Pyridine ইত্যাদি।" },
    { code: "2.45",   order: 148,  title: "অর্গানোমেটালিক যৌগ",             description: "পরিচিতি, ধাতু–কার্বন বন্ধন, Grignard Reagent, Organolithium Compound, Organozinc Compound ইত্যাদি।" },
    { code: "2.46",   order: 149,  title: "উন্নত স্টেরিওরসায়ন",            description: "ত্রিমাত্রিক গঠন, চিরাল কেন্দ্র, বহু চিরাল কেন্দ্র, স্টেরিওজেনিক কেন্দ্র, R/S নামকরণ ইত্যাদি।" },
    { code: "2.47",   order: 150,  title: "কনফরমেশনাল বিশ্লেষণ",            description: "পরিচিতি, Staggered Conformation, Eclipsed Conformation, Torsional Strain, Anti Conformation ইত্যাদি।" },
    { code: "2.48",   order: 151,  title: "পারিসাইক্লিক বিক্রিয়া",         description: "পরিচিতি, Diels–Alder Reaction, [2+2] Cycloaddition, ইলেক্ট্রোসাইক্লিক বিক্রিয়া, Cope Rearrangement ইত্যাদি।" },
    { code: "2.49",   order: 152,  title: "ফটোরসায়ন",                      description: "পরিচিতি, আলোর সাথে অণুর মিথস্ক্রিয়া, Singlet State, Triplet State, Cis–Trans Isomerization ইত্যাদি।" },
    { code: "2.50",   order: 153,  title: "সুপ্রামলিকুলার রসায়ন",          description: "পরিচিতি, Hydrogen Bond, Van der Waals Force, π–π Interaction, Host–Guest Chemistry ইত্যাদি।" },
    { code: "2.51",   order: 154,  title: "কম্বিনেটোরিয়াল ও ক্লিক কেমিস্ট্রি", description: "কম্বিনেটোরিয়াল রসায়ন পরিচিতি, Library Synthesis, High Throughput Screening, Drug Discovery, ক্লিক কেমিস্ট্রি পরিচিতি ইত্যাদি।" },
    { code: "2.52",   order: 155,  title: "অ্যাসিমেট্রিক সংশ্লেষণ",         description: "পরিচিতি, Chiral Pool Synthesis, Chiral Auxiliary, Asymmetric Catalyst, Enantioselective Reaction ইত্যাদি।" },
    { code: "2.53",   order: 156,  title: "জৈব-জীবরসায়ন",                  description: "জৈব-জীবরসায়নের সংজ্ঞা, ইতিহাস, গুরুত্ব, কার্বোহাইড্রেট (বায়োমলিকিউল), প্রোটিন (বায়োমলিকিউল) ইত্যাদি।" },
    { code: "2.54",   order: 157,  title: "কম্পিউটেশনাল জৈব রসায়ন",        description: "পরিচিতি, Molecular Mechanics (MM), Quantum Mechanics (QM), Semi-Empirical Method, Density Functional Theory (DFT) ইত্যাদি।" },
    { code: "2.55",   order: 158,  title: "ফ্লো কেমিস্ট্রি",                description: "পরিচিতি, Continuous Flow Reactor, Microreactor Technology, Flow Synthesis, Batch বনাম Flow Chemistry ইত্যাদি।" },
    { code: "2.56",   order: 159,  title: "জৈব ন্যানোরসায়ন",               description: "পরিচিতি, Carbon Nanotube, Fullerene, Graphene, Quantum Dot ইত্যাদি।" },
    { code: "2.57",   order: 160,  title: "জৈব ইলেকট্রনিক্স",               description: "পরিচিতি, Conducting Polymer, Organic Semiconductor, OLED (Organic Light Emitting Diode), OFET (Organic Field Effect Transistor) ইত্যাদি।" },
    { code: "2.58",   order: 161,  title: "উন্নত পলিমার ও স্মার্ট উপাদান",  description: "স্মার্ট পলিমার, Shape Memory Polymer, Self-Healing Polymer, Conductive Polymer, Biodegradable Polymer ইত্যাদি।" },
    { code: "2.59",   order: 162,  title: "ওষুধ আবিষ্কার ও নকশা",           description: "পরিচিতি, Target Identification, Lead Compound, Lead Optimization, Structure-Based Drug Design ইত্যাদি।" },
    { code: "2.60",   order: 163,  title: "আধুনিক গবেষণা কৌশল (জৈব)",       description: "গবেষণা পরিকল্পনা, সাহিত্য পর্যালোচনা (Literature Review), গবেষণা নকশা, পরীক্ষাগার নিরাপত্তা, নমুনা প্রস্তুতি ইত্যাদি।" },
    { code: "2.61",   order: 164,  title: "জৈব অনুঘটক রসায়ন",              description: "অনুঘটকের সংজ্ঞা, অনুঘটকের বৈশিষ্ট্য, অনুঘটকের গুরুত্ব, সমসত্ত্ব (Homogeneous Catalyst), বিষমসত্ত্ব (Heterogeneous Catalyst) ইত্যাদি।" },
    { code: "2.62",   order: 165,  title: "ইলেক্ট্রোজৈব রসায়ন",            description: "পরিচিতি, জারণ ও বিজারণ, Electrochemical Cell, Electrosynthesis, Electrocatalysis ইত্যাদি।" },
    { code: "2.63",   order: 166,  title: "ফটোরেডক্স রসায়ন",               description: "পরিচিতি, আলোক-অনুঘটক, দৃশ্যমান আলোর ব্যবহার, Single Electron Transfer (SET), Radical Generation ইত্যাদি।" },
    { code: "2.64",   order: 167,  title: "ধাতু–জৈব কাঠামো (MOFs)",         description: "পরিচিতি, গঠন, সংশ্লেষণ, ছিদ্রযুক্ত (Porous) কাঠামো, গ্যাস সংরক্ষণ ইত্যাদি।" },
    { code: "2.65",   order: 168,  title: "কোভ্যালেন্ট জৈব কাঠামো (COFs)",  description: "পরিচিতি, দ্বি-মাত্রিক COF, ত্রি-মাত্রিক COF, সংশ্লেষণ, বৈশিষ্ট্য ইত্যাদি।" },
    { code: "2.66",   order: 169,  title: "রাসায়নিক জীববিজ্ঞান",           description: "পরিচিতি, ছোট জৈব অণু (Small Molecules), বায়োমলিকিউল পরিবর্তন, Protein Labeling, DNA/RNA Targeting ইত্যাদি।" },
    { code: "2.67",   order: 170,  title: "সবুজ জৈব সংশ্লেষণ",              description: "পরিচিতি, Water (দ্রাবক), Ethanol (দ্রাবক), Ionic Liquid, Deep Eutectic Solvent ইত্যাদি।" },
    { code: "2.68",   order: 171,  title: "কৃত্রিম বুদ্ধিমত্তা ও জৈব রসায়ন", description: "পরিচিতি, AI-ভিত্তিক বিক্রিয়া পূর্বাভাস, Retrosynthesis AI, Drug Discovery AI, Molecular Property Prediction ইত্যাদি।" },
    { code: "2.69",   order: 172,  title: "জৈব রসায়নের ভবিষ্যৎ",           description: "টেকসই জৈব রসায়ন, কার্বন নিরপেক্ষ সংশ্লেষণ, CO₂ ব্যবহার করে রাসায়নিক উৎপাদন, কৃত্রিম সালোকসংশ্লেষণ (Artificial Photosynthesis), জৈব কোয়ান্টাম উপাদান ইত্যাদি।" },
  ],

  // 3. Inorganic Chemistry — অজৈব রসায়ন (৩.১ – ৩.১০)
  "inorganic-chemistry": [
    { code: "3.1",  order: 10,  title: "পরমাণুর গঠন",            description: "পারমাণবিক মডেল, উপ-পারমাণবিক কণা, ইলেকট্রন বিন্যাস, অরবিটাল।" },
    { code: "3.2",  order: 20,  title: "পর্যায় সারণি",            description: "আধুনিক পর্যায় সারণি, গ্রুপ ও পিরিয়ড, পর্যায়বৃত্ত ধর্ম, পারমাণবিক ব্যাসার্ধ, আয়নীকরণ শক্তি, তড়িৎঋণাত্মকতা।" },
    { code: "3.3",  order: 30,  title: "রাসায়নিক বন্ধন",          description: "আয়নিক, সমযোজী, সন্নিবেশ ও ধাতব বন্ধন, হাইড্রোজেন বন্ধন, আণবিক অরবিটাল তত্ত্ব, VSEPR, সংকরণ।" },
    { code: "3.4",  order: 40,  title: "হাইড্রোজেন",              description: "ধর্ম, প্রস্তুতি, হাইড্রাইড, ব্যবহার।" },
    { code: "3.5",  order: 50,  title: "s-ব্লক মৌল",              description: "ক্ষার ধাতু ও মৃৎক্ষার ধাতু।" },
    { code: "3.6",  order: 60,  title: "p-ব্লক মৌল",              description: "বোরন, কার্বন, নাইট্রোজেন, অক্সিজেন পরিবার, হ্যালোজেন, নিষ্ক্রিয় গ্যাস।" },
    { code: "3.7",  order: 70,  title: "d-ব্লক মৌল",              description: "ট্রানজিশন ধাতু, ধর্ম, বর্ণিল যৌগ, ক্যাটালাইটিক কার্যকারিতা।" },
    { code: "3.8",  order: 80,  title: "f-ব্লক মৌল",              description: "ল্যান্থানাইড ও অ্যাক্টিনাইড।" },
    { code: "3.9",  order: 90,  title: "সমন্বয় রসায়ন",            description: "লিগ্যান্ড, সমন্বয় সংখ্যা, ওয়ার্নার তত্ত্ব, সমাণুতা, ক্রিস্টাল ফিল্ড তত্ত্ব।" },
    { code: "3.10", order: 100, title: "ধাতুবিদ্যা",              description: "ধাতু নিষ্কাশন, আকরিক ঘনীভবন, বিজারণ প্রক্রিয়া, তড়িৎ বিশ্লেষণ পরিশোধন।" },
  ],

  // 4. Analytical Chemistry — বিশ্লেষণী রসায়ন (৪.১ – ৪.৬)
  "analytical-chemistry": [
    { code: "4.1", order: 10, title: "গুণগত বিশ্লেষণ",   description: "লবণ বিশ্লেষণ, ক্যাটায়ন শনাক্তকরণ, অ্যানায়ন শনাক্তকরণ।" },
    { code: "4.2", order: 20, title: "পরিমাণগত বিশ্লেষণ", description: "গ্রাভিমেট্রিক বিশ্লেষণ, ভলিউমেট্রিক বিশ্লেষণ।" },
    { code: "4.3", order: 30, title: "টাইট্রেশন",        description: "অম্ল-ক্ষার, রেডক্স ও কমপ্লেক্সোমেট্রিক টাইট্রেশন।" },
    { code: "4.4", order: 40, title: "ক্রোমাটোগ্রাফি",    description: "পেপার ক্রোমাটোগ্রাফি, TLC, কলাম ক্রোমাটোগ্রাফি, HPLC, GC।" },
    { code: "4.5", order: 50, title: "স্পেকট্রোস্কোপি",   description: "UV, IR, NMR ও ভর স্পেকট্রোস্কোপি।" },
    { code: "4.6", order: 60, title: "যান্ত্রিক বিশ্লেষণ",   description: "কন্ডাক্টোমেট্রি, পোটেনশিওমেট্রি, পোলারোগ্রাফি।" },
  ],

  // 5. Biochemistry — জীব রসায়ন (৫.১ – ৫.৭)
  biochemistry: [
    { code: "5.1", order: 10, title: "কোষ রসায়ন",            description: "কোষের গঠন ও উপাদান।" },
    { code: "5.2", order: 20, title: "জীবঅণু",               description: "কার্বোহাইড্রেট, প্রোটিন, লিপিড, নিউক্লিক অ্যাসিড।" },
    { code: "5.3", order: 30, title: "এনজাইম",               description: "শ্রেণিবিভাগ, কার্যপ্রক্রিয়া, এনজাইম কার্যক্ষমতায় প্রভাবক বিষয়সমূহ।" },
    { code: "5.4", order: 40, title: "বিপাক ক্রিয়া",          description: "ক্যাটাবলিজম, অ্যানাবলিজম, ATP চক্র।" },
    { code: "5.5", order: 50, title: "কার্বোহাইড্রেট বিপাক",    description: "গ্লাইকোলাইসিস, ক্রেবস চক্র, ইলেকট্রন পরিবহন শৃঙ্খল।" },
    { code: "5.6", order: 60, title: "সালোকসংশ্লেষণ",         description: "আলোক বিক্রিয়া ও অন্ধকার বিক্রিয়া।" },
    { code: "5.7", order: 70, title: "আণবিক জীববিদ্যা",        description: "DNA প্রতিলিপন, ট্রান্সক্রিপশন, ট্রান্সলেশন।" },
  ],

  // 6. Environmental Chemistry — পরিবেশ রসায়ন (৬.১ – ৬.৪)
  "environmental-chemistry": [
    { code: "6.1", order: 10, title: "বায়ু দূষণ",   description: "গ্রিনহাউস গ্যাস, ধোঁয়াশা (smog), অ্যাসিড বৃষ্টি।" },
    { code: "6.2", order: 20, title: "পানি দূষণ",   description: "পানি শোধন, ভারী ধাতু দূষণ।" },
    { code: "6.3", order: 30, title: "মাটি দূষণ",   description: "কীটনাশক, শিল্প বর্জ্য।" },
    { code: "6.4", order: 40, title: "সবুজ রসায়ন",  description: "টেকসই রসায়ন, পরিবেশবান্ধব বিক্রিয়া।" },
  ],

  // 7. Industrial Chemistry — শিল্প রসায়ন (৭.১ – ৭.৫)
  "industrial-chemistry": [
    { code: "7.1", order: 10, title: "সার শিল্প",         description: "অ্যামোনিয়া উৎপাদন, ইউরিয়া উৎপাদন।" },
    { code: "7.2", order: 20, title: "জ্বালানি তেল শিল্প",  description: "ক্র্যাকিং, পরিশোধন, পেট্রোকেমিক্যালস।" },
    { code: "7.3", order: 30, title: "সিমেন্ট শিল্প",       description: "সিমেন্ট উৎপাদন প্রক্রিয়া।" },
    { code: "7.4", order: 40, title: "পলিমার শিল্প",        description: "প্লাস্টিক উৎপাদন, রাবার শিল্প।" },
    { code: "7.5", order: 50, title: "ফার্মাসিউটিক্যাল শিল্প", description: "ওষুধ সংশ্লেষণ, মেডিসিনাল কেমিস্ট্রি।" },
  ],

  // 8. Advanced Chemistry — উচ্চতর রসায়ন (৮.১ – ৮.৬)
  "advanced-chemistry": [
    { code: "8.1", order: 10, title: "ন্যানোকেমিস্ট্রি",        description: "ন্যানোপার্টিকেল, ন্যানোম্যাটেরিয়াল।" },
    { code: "8.2", order: 20, title: "মেডিসিনাল কেমিস্ট্রি",     description: "ড্রাগ ডিজাইন, ড্রাগ অ্যাকশন।" },
    { code: "8.3", order: 30, title: "ম্যাটেরিয়ালস কেমিস্ট্রি",   description: "স্মার্ট ম্যাটেরিয়াল, সেমিকন্ডাক্টর।" },
    { code: "8.4", order: 40, title: "কম্পিউটেশনাল কেমিস্ট্রি",   description: "আণবিক মডেলিং, সিমুলেশন।" },
    { code: "8.5", order: 50, title: "অ্যাস্ট্রোকেমিস্ট্রি",      description: "মহাকাশীয় অণু, রাসায়নিক বিবর্তন।" },
    { code: "8.6", order: 60, title: "ফরেনসিক কেমিস্ট্রি",       description: "টক্সিকোলজি, রাসায়নিক প্রমাণ।" },
  ],
};

/** code (যেমন "1.1") দিয়ে কোনো নির্দিষ্ট subsection খুঁজে বের করার সহায়ক ফাংশন। */
export function findSyllabusChapter(category: ChemistryCategory, code: string): SyllabusChapter | undefined {
  return SYLLABUS[category]?.find((c) => c.code === code);
}
