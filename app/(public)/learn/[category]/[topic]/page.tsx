import { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicClient from "@/components/learn/TopicClient";

// ── All topic content ─────────────────────────────────────────────
const topicData: Record<string, Record<string, {
  title: string; level: "beginner"|"intermediate"|"advanced";
  estimatedTime: number; category: string; categorySlug: string;
  introduction: string; theory: string[];
  formulas: { name: string; formula: string; explanation: string }[];
  examples: { question: string; steps: string[]; answer: string }[];
  applications: string[]; notes: string[];
  mcqs: { q: string; options: string[]; answer: number; explanation: string }[];
  relatedTopics: { slug: string; title: string; categorySlug: string }[];
}>> = {
  "physical-chemistry": {
    "acid-base": {
      title: "অ্যাসিড ও ক্ষার", level: "intermediate",
      estimatedTime: 25, category: "ভৌত রসায়ন", categorySlug: "physical-chemistry",
      introduction: "অ্যাসিড ও ক্ষার রসায়নের মৌলিক ধারণাগুলির মধ্যে একটি। আমাদের দৈনন্দিন জীবনে লেবুর রস, ভিনেগার (অ্যাসিড) এবং বেকিং সোডা, সাবান (ক্ষার) ব্যবহার করি। এই অধ্যায়ে আমরা অ্যাসিড-ক্ষারের বৈজ্ঞানিক সংজ্ঞা, বৈশিষ্ট্য এবং pH স্কেল সম্পর্কে জানব।",
      theory: [
        "**Arrhenius সংজ্ঞা:** Arrhenius-এর মতে, যে পদার্থ পানিতে দ্রবীভূত হলে H⁺ আয়ন দেয় তা অ্যাসিড এবং যা OH⁻ আয়ন দেয় তা ক্ষার। উদাহরণ: HCl → H⁺ + Cl⁻, NaOH → Na⁺ + OH⁻।",
        "**Brønsted-Lowry সংজ্ঞা:** যে পদার্থ প্রোটন (H⁺) দান করে সে অ্যাসিড এবং যে প্রোটন গ্রহণ করে সে ক্ষার। এই সংজ্ঞা আরো ব্যাপক — পানিবিহীন দ্রাবকেও প্রযোজ্য।",
        "**Lewis সংজ্ঞা:** Lewis অ্যাসিড ইলেকট্রন যুগল গ্রহণ করে এবং Lewis ক্ষার ইলেকট্রন যুগল দান করে। এটি সবচেয়ে ব্যাপক সংজ্ঞা।",
        "**pH স্কেল:** pH = -log[H⁺]। pH 0-14 পর্যন্ত। pH < 7 অম্লীয়, pH = 7 নিরপেক্ষ, pH > 7 ক্ষারীয়। প্রতি 1 pH পরিবর্তনে [H⁺] 10 গুণ পরিবর্তন হয়।",
        "**নিরপেক্ষকরণ বিক্রিয়া:** অ্যাসিড + ক্ষার → লবণ + পানি। HCl + NaOH → NaCl + H₂O। এই বিক্রিয়া সর্বদা তাপমোচী (ΔH = -57 kJ/mol)।",
        "**বাফার দ্রবণ:** দুর্বল অ্যাসিড ও তার লবণ বা দুর্বল ক্ষার ও তার লবণের মিশ্রণ যা pH পরিবর্তন প্রতিরোধ করে। রক্তের pH (7.35-7.45) বাফার দ্বারা নিয়ন্ত্রিত।",
      ],
      formulas: [
        { name: "pH সূত্র", formula: "pH = -log[H⁺]", explanation: "দ্রবণের হাইড্রোজেন আয়নের ঘনত্ব থেকে pH হিসাব।" },
        { name: "pOH সূত্র", formula: "pOH = -log[OH⁻]", explanation: "হাইড্রোক্সাইড আয়নের ঘনত্ব থেকে pOH।" },
        { name: "pH + pOH", formula: "pH + pOH = 14 (25°C)", explanation: "যেকোনো দ্রবণে pH ও pOH এর যোগফল 14।" },
        { name: "Ka ও pKa", formula: "pKa = -log(Ka)", explanation: "অ্যাসিড বিয়োজন ধ্রুবকের logarithmic রূপ।" },
        { name: "Henderson-Hasselbalch", formula: "pH = pKa + log([A⁻]/[HA])", explanation: "বাফার দ্রবণের pH হিসাবের সূত্র।" },
      ],
      examples: [
        {
          question: "0.01 M HCl দ্রবণের pH কত?",
          steps: [
            "HCl সম্পূর্ণ আয়নিত: HCl → H⁺ + Cl⁻",
            "[H⁺] = 0.01 M = 10⁻² M",
            "pH = -log[H⁺] = -log(10⁻²)",
            "pH = 2",
          ],
          answer: "pH = 2 (অম্লীয় দ্রবণ)",
        },
        {
          question: "pH 9 দ্রবণের [H⁺] এবং [OH⁻] কত?",
          steps: [
            "[H⁺] = 10^(-pH) = 10^(-9) mol/L",
            "pOH = 14 - pH = 14 - 9 = 5",
            "[OH⁻] = 10^(-pOH) = 10^(-5) mol/L",
          ],
          answer: "[H⁺] = 10⁻⁹ mol/L, [OH⁻] = 10⁻⁵ mol/L (ক্ষারীয়)",
        },
      ],
      applications: [
        "রক্তের pH (7.35-7.45) বাফার সিস্টেম দ্বারা নিয়ন্ত্রিত",
        "কৃষিতে মাটির pH পরীক্ষা করে সার ব্যবহার",
        "ওষুধ শিল্পে অ্যান্টাসিড — পাকস্থলীর অতিরিক্ত অ্যাসিড নিরপেক্ষ করে",
        "সুইমিং পুলের পানির pH নিয়ন্ত্রণ (7.2-7.6)",
        "খাদ্য সংরক্ষণে ভিনেগার (অ্যাসিটিক অ্যাসিড) ব্যবহার",
      ],
      notes: [
        "শক্তিশালী অ্যাসিড: HCl, H₂SO₄, HNO₃, HBr, HI, HClO₄ — সম্পূর্ণ আয়নিত",
        "দুর্বল অ্যাসিড: CH₃COOH, H₂CO₃, H₃PO₄ — আংশিক আয়নিত",
        "pH মিটার সবচেয়ে নির্ভুল, লিটমাস কাগজ দ্রুত পরীক্ষার জন্য",
        "নিরপেক্ষকরণ বিক্রিয়া সর্বদা তাপমোচী",
        "বাফার ক্ষমতা সর্বোচ্চ যখন pH = pKa",
      ],
      mcqs: [
        { q: "পানির pH কত?", options: ["6","7","8","14"], answer: 1, explanation: "পানি নিরপেক্ষ তাই pH = 7।" },
        { q: "কোনটি শক্তিশালী অ্যাসিড?", options: ["CH₃COOH","H₂CO₃","HCl","H₃PO₄"], answer: 2, explanation: "HCl সম্পূর্ণরূপে আয়নিত হয়, তাই শক্তিশালী অ্যাসিড।" },
        { q: "pH 3 দ্রবণে [H⁺] কত?", options: ["3 mol/L","10⁻³ mol/L","10³ mol/L","0.3 mol/L"], answer: 1, explanation: "[H⁺] = 10^(-pH) = 10⁻³ mol/L।" },
        { q: "নিরপেক্ষকরণ বিক্রিয়ার উৎপাদ কী?", options: ["অ্যাসিড+পানি","ক্ষার+পানি","লবণ+পানি","শুধু লবণ"], answer: 2, explanation: "অ্যাসিড + ক্ষার → লবণ + পানি।" },
        { q: "বাফার দ্রবণ কী করে?", options: ["pH বাড়ায়","pH কমায়","pH স্থির রাখে","পানি তৈরি করে"], answer: 2, explanation: "বাফার দ্রবণ pH এর পরিবর্তন প্রতিরোধ করে।" },
      ],
      relatedTopics: [
        { slug: "solutions",          title: "দ্রবণ রসায়ন",         categorySlug: "physical-chemistry" },
        { slug: "electrochemistry",   title: "তড়িৎ রসায়ন",          categorySlug: "physical-chemistry" },
        { slug: "chemical-equilibrium",title:"রাসায়নিক সাম্যাবস্থা", categorySlug: "physical-chemistry" },
      ],
    },
    "gas-laws": {
      title: "গ্যাসের সূত্রসমূহ", level: "intermediate",
      estimatedTime: 30, category: "ভৌত রসায়ন", categorySlug: "physical-chemistry",
      introduction: "গ্যাসের আচরণ বোঝার জন্য বিজ্ঞানীরা বিভিন্ন সূত্র আবিষ্কার করেছেন। এই সূত্রগুলো গ্যাসের চাপ, তাপমাত্রা, আয়তন এবং মোল সংখ্যার মধ্যে সম্পর্ক বর্ণনা করে।",
      theory: [
        "**Boyle-এর সূত্র (1662):** স্থির তাপমাত্রায় নির্দিষ্ট পরিমাণ গ্যাসের চাপ ও আয়তন পরস্পর বিপরীতভাবে সমানুপাতিক। P ∝ 1/V বা PV = ধ্রুবক।",
        "**Charles-এর সূত্র (1787):** স্থির চাপে নির্দিষ্ট পরিমাণ গ্যাসের আয়তন পরম তাপমাত্রার সরাসরি সমানুপাতিক। V ∝ T বা V/T = ধ্রুবক।",
        "**Gay-Lussac-এর সূত্র:** স্থির আয়তনে গ্যাসের চাপ পরম তাপমাত্রার সরাসরি সমানুপাতিক। P ∝ T বা P/T = ধ্রুবক।",
        "**আদর্শ গ্যাস সূত্র:** সব সূত্র একত্রিত করলে PV = nRT। এখানে R = 0.0821 L·atm/mol·K (সার্বজনীন গ্যাস ধ্রুবক)।",
        "**বাস্তব গ্যাস:** van der Waals সমীকরণ: (P + a/V²)(V-b) = nRT। a ও b হল গ্যাস-নির্ভর ধ্রুবক।",
      ],
      formulas: [
        { name: "Boyle-এর সূত্র",   formula: "P₁V₁ = P₂V₂",      explanation: "স্থির T ও n-এ চাপ ও আয়তনের সম্পর্ক।" },
        { name: "Charles-এর সূত্র", formula: "V₁/T₁ = V₂/T₂",    explanation: "স্থির P ও n-এ আয়তন ও তাপমাত্রার সম্পর্ক।" },
        { name: "আদর্শ গ্যাস সূত্র",formula: "PV = nRT",           explanation: "P(atm), V(L), n(mol), R=0.0821, T(K)।" },
        { name: "সম্মিলিত গ্যাস সূত্র", formula: "P₁V₁/T₁ = P₂V₂/T₂", explanation: "স্থির n-এ তিনটি রাশির সম্পর্ক।" },
      ],
      examples: [
        {
          question: "27°C তাপমাত্রায় 2L গ্যাসকে স্থির চাপে 127°C তাপমাত্রায় গরম করলে আয়তন কত হবে?",
          steps: [
            "T₁ = 27 + 273 = 300 K, V₁ = 2 L",
            "T₂ = 127 + 273 = 400 K",
            "Charles সূত্র: V₁/T₁ = V₂/T₂",
            "V₂ = V₁ × T₂/T₁ = 2 × 400/300",
          ],
          answer: "V₂ = 2.67 L",
        },
      ],
      applications: [
        "গরম বায়ু বেলুন — গরম করলে আয়তন বাড়ে (Charles-এর সূত্র)",
        "টায়ারের চাপ — গরমে বাড়ে, ঠান্ডায় কমে (Gay-Lussac)",
        "শ্বাসক্রিয়া — ফুসফুসের আয়তন পরিবর্তনে গ্যাস আদান-প্রদান",
      ],
      notes: [
        "তাপমাত্রা সর্বদা Kelvin (K) এ ব্যবহার করতে হবে: K = °C + 273",
        "আদর্শ গ্যাসের ধারণা: অণুগুলো বিন্দু আকার, কোনো আন্তঃআণবিক বল নেই",
        "STP তে (0°C, 1 atm) 1 mol গ্যাসের আয়তন = 22.4 L",
      ],
      mcqs: [
        { q: "Boyle-এর সূত্রে কোনটি স্থির থাকে?", options: ["চাপ","তাপমাত্রা","আয়তন","মোল"], answer: 1, explanation: "Boyle-এর সূত্রে তাপমাত্রা ও মোল সংখ্যা স্থির।" },
        { q: "STP তে 1 mol গ্যাসের আয়তন কত?", options: ["11.2 L","22.4 L","44.8 L","24.0 L"], answer: 1, explanation: "STP (0°C, 1 atm) তে 1 mol যেকোনো আদর্শ গ্যাসের আয়তন 22.4 L।" },
        { q: "আদর্শ গ্যাস সূত্রে R-এর মান কত?", options: ["0.0821 L·atm/mol·K","8.314 J/mol·K","উভয়ই","কোনোটি নয়"], answer: 2, explanation: "R = 0.0821 L·atm/mol·K = 8.314 J/mol·K, উভয়ই সঠিক।" },
        { q: "তাপমাত্রা বাড়লে গ্যাসের চাপ কী হয় (স্থির আয়তনে)?", options: ["কমে","বাড়ে","একই থাকে","শূন্য হয়"], answer: 1, explanation: "Gay-Lussac সূত্র: স্থির V তে P ∝ T, তাই T বাড়লে P বাড়ে।" },
        { q: "0°C = কত Kelvin?", options: ["0 K","100 K","273 K","373 K"], answer: 2, explanation: "K = °C + 273, তাই 0°C = 273 K।" },
      ],
      relatedTopics: [
        { slug: "thermodynamics", title: "তাপগতিবিদ্যা", categorySlug: "physical-chemistry" },
        { slug: "solutions",      title: "দ্রবণ রসায়ন",  categorySlug: "physical-chemistry" },
      ],
    },
  },
  "inorganic-chemistry": {
    "atomic-structure": {
      title: "পরমাণুর গঠন", level: "beginner",
      estimatedTime: 25, category: "অজৈব রসায়ন", categorySlug: "inorganic-chemistry",
      introduction: "পরমাণু হল পদার্থের ক্ষুদ্রতম একক যা রাসায়নিক বিক্রিয়ায় অংশ নেয়। এর কেন্দ্রে নিউক্লিয়াস এবং চারপাশে ইলেকট্রন থাকে।",
      theory: [
        "**পরমাণুর মডেল:** Dalton → Thomson (প্লাম পুডিং) → Rutherford (নিউক্লিয়ার) → Bohr (কক্ষপথ) → কোয়ান্টাম মডেল।",
        "**Bohr মডেল:** ইলেকট্রন নির্দিষ্ট কক্ষপথে ঘোরে। প্রতিটি কক্ষপথের নির্দিষ্ট শক্তি আছে। n=1,2,3... (প্রধান কোয়ান্টাম সংখ্যা)।",
        "**কোয়ান্টাম সংখ্যা:** n (প্রধান), l (দিগংশ), m_l (চৌম্বকীয়), m_s (স্পিন)। Pauli exclusion principle: একটি অরবিটালে সর্বোচ্চ 2টি ইলেকট্রন।",
        "**ইলেকট্রন বিন্যাস:** Aufbau নীতি (1s < 2s < 2p < 3s...), Hund নিয়ম (সম শক্তির অরবিটালে একা একা ভরো)।",
      ],
      formulas: [
        { name: "Bohr শক্তি সূত্র", formula: "E_n = -13.6/n² eV", explanation: "হাইড্রোজেনের n-তম কক্ষপথের শক্তি।" },
        { name: "ত্রিজ্যা সূত্র", formula: "r_n = 0.529 × n² Å", explanation: "Bohr ত্রিজ্যা, হাইড্রোজেনের n-তম কক্ষপথের ব্যাসার্ধ।" },
        { name: "ইলেকট্রন ধারণ ক্ষমতা", formula: "2n²", explanation: "n-তম শক্তিস্তরে সর্বোচ্চ ইলেকট্রন সংখ্যা।" },
      ],
      examples: [
        {
          question: "Fe (26) এর ইলেকট্রন বিন্যাস লেখো।",
          steps: [
            "মোট ইলেকট্রন = 26",
            "Aufbau নীতি অনুসরণ করি:",
            "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶",
            "মোট: 2+2+6+2+6+2+6 = 26 ✓",
          ],
          answer: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶ বা [Ar] 4s² 3d⁶",
        },
      ],
      applications: [
        "পরমাণুর ইলেকট্রন বিন্যাস থেকে রাসায়নিক ধর্ম বোঝা যায়",
        "লেজার প্রযুক্তি — উত্তেজিত ইলেকট্রনের শক্তি নির্গমন",
        "আলোর বর্ণালী বিশ্লেষণ — পরমাণু শনাক্তকরণ",
      ],
      notes: [
        "পরমাণু সংখ্যা = প্রোটন সংখ্যা = নিরপেক্ষ পরমাণুতে ইলেকট্রন সংখ্যা",
        "ভর সংখ্যা = প্রোটন + নিউট্রন",
        "আইসোটোপ: একই পরমাণু সংখ্যা, ভিন্ন ভর সংখ্যা",
        "অরবিটাল: s(গোলাকার), p(ডাম্বেল), d(জটিল আকার)",
      ],
      mcqs: [
        { q: "পরমাণুর কেন্দ্রে কী থাকে?", options: ["ইলেকট্রন","নিউক্লিয়াস","শুধু প্রোটন","কিছু নেই"], answer: 1, explanation: "পরমাণুর কেন্দ্রে নিউক্লিয়াস থাকে যাতে প্রোটন ও নিউট্রন আছে।" },
        { q: "দ্বিতীয় শক্তিস্তরে সর্বোচ্চ কতটি ইলেকট্রন থাকতে পারে?", options: ["2","4","8","18"], answer: 2, explanation: "2n² = 2×2² = 8।" },
        { q: "Na (11) এর শেষ ইলেকট্রনটি কোন অরবিটালে?", options: ["1s","2p","3s","3p"], answer: 2, explanation: "Na: 1s²2s²2p⁶3s¹, শেষ ইলেকট্রন 3s-এ।" },
        { q: "Pauli exclusion principle অনুযায়ী একটি অরবিটালে সর্বোচ্চ কতটি ইলেকট্রন থাকে?", options: ["1","2","3","4"], answer: 1, explanation: "একটি অরবিটালে সর্বোচ্চ 2টি বিপরীত স্পিনের ইলেকট্রন।" },
        { q: "আইসোটোপে কী সমান থাকে?", options: ["ভর সংখ্যা","নিউট্রন সংখ্যা","পরমাণু সংখ্যা","সবকিছু"], answer: 2, explanation: "আইসোটোপে পরমাণু সংখ্যা (প্রোটন) সমান কিন্তু ভর সংখ্যা আলাদা।" },
      ],
      relatedTopics: [
        { slug: "chemical-bonding", title: "রাসায়নিক বন্ধন", categorySlug: "inorganic-chemistry" },
        { slug: "periodic-table",   title: "পর্যায় সারণি",   categorySlug: "inorganic-chemistry" },
      ],
    },
  },
};

interface Props { params: Promise<{ category: string; topic: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, topic } = await params;
  const data = topicData[category]?.[topic];
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.title} — ${data.category}`,
    description: data.introduction.slice(0, 160),
  };
}

export default async function TopicPage({ params }: Props) {
  const { category, topic } = await params;
  const data = topicData[category]?.[topic];
  if (!data) notFound();
  return <TopicClient data={data} categorySlug={category} topicSlug={topic} />;
}
