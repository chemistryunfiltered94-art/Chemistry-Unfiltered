// lib/syllabus.ts
// "Subject Expansion" — প্রতিটি বিষয়ের (category) জন্য প্রস্তাবিত অধ্যায়ের তালিকা।
// admin/chapters পেজ এই তালিকা থেকে এক ক্লিকে Firestore-এ অধ্যায় (chapters) তৈরি করতে পারে।
// এখানে নতুন অধ্যায় যোগ/সম্পাদনা করলেই admin প্যানেলের "বাকি অধ্যায়সমূহ" তালিকায় তা দেখা যাবে।

import { ChemistryCategory } from "@/types";

export interface SyllabusChapter {
  title: string;
  description?: string;
}

export const SYLLABUS: Record<ChemistryCategory, SyllabusChapter[]> = {
  "physical-chemistry": [
    { title: "তাপগতিবিদ্যা (Thermodynamics)", description: "তাপ, কাজ, এনথালপি, এন্ট্রপি এবং তাপগতিবিদ্যার সূত্রসমূহ।" },
    { title: "রাসায়নিক গতিবিদ্যা (Chemical Kinetics)", description: "বিক্রিয়ার হার, হার সূত্র, সক্রিয়করণ শক্তি এবং বিক্রিয়া পদ্ধতি।" },
    { title: "কোয়ান্টাম রসায়ন (Quantum Chemistry)", description: "তরঙ্গ-কণা দ্বৈততা, শ্রোডিঙ্গার সমীকরণ এবং অরবিটাল তত্ত্ব।" },
    { title: "তড়িৎ রসায়ন (Electrochemistry)", description: "তড়িৎ কোষ, জারণ-বিজারণ বিক্রিয়া এবং তড়িৎ বিশ্লেষণ।" },
    { title: "পৃষ্ঠ রসায়ন (Surface Chemistry)", description: "শোষণ (adsorption), ক্যাটালাইসিস এবং কলয়েড রসায়ন।" },
    { title: "নিউক্লিয় রসায়ন (Nuclear Chemistry)", description: "রেডিওঅ্যাক্টিভিটি, নিউক্লিয়ার বিক্রিয়া এবং অর্ধজীবন।" },
  ],
  "organic-chemistry": [
    { title: "হাইড্রোকার্বন (Hydrocarbons)", description: "অ্যালকেন, অ্যালকিন, অ্যালকাইন — গঠন, নামকরণ ও বিক্রিয়া।" },
    { title: "অ্যারোমেটিক যৌগ (Aromatic Compounds)", description: "বেঞ্জিন ও এর ডেরিভেটিভ, ইলেকট্রোফিলিক প্রতিস্থাপন বিক্রিয়া।" },
    { title: "অ্যালকোহল (Alcohols)", description: "হাইড্রোক্সিল গ্রুপযুক্ত যৌগ — প্রস্তুতি, ধর্ম ও বিক্রিয়া।" },
    { title: "অ্যালডিহাইড (Aldehydes)", description: "কার্বনিল গ্রুপ -CHO যুক্ত যৌগের রসায়ন।" },
    { title: "কিটোন (Ketones)", description: "কার্বনিল গ্রুপ >C=O যুক্ত যৌগের রসায়ন।" },
    { title: "কার্বক্সিলিক অ্যাসিড (Carboxylic Acids)", description: "-COOH গ্রুপযুক্ত যৌগ — অম্লতা, প্রস্তুতি ও বিক্রিয়া।" },
    { title: "অ্যামিন (Amines)", description: "নাইট্রোজেনযুক্ত জৈব যৌগ — শ্রেণিবিভাগ ও ক্ষারীয়তা।" },
    { title: "জীবঅণু (Biomolecules)", description: "কার্বোহাইড্রেট, প্রোটিন, লিপিড ও নিউক্লিক অ্যাসিড।" },
    { title: "পলিমার (Polymers)", description: "পলিমারাইজেশন বিক্রিয়া এবং প্রাকৃতিক ও কৃত্রিম পলিমার।" },
  ],
  "inorganic-chemistry": [
    { title: "সমন্বয় রসায়ন (Coordination Chemistry)", description: "জটিল যৌগ, লিগ্যান্ড এবং সমন্বয় সংখ্যা।" },
    { title: "ট্রানজিশন মেটাল (Transition Metals)", description: "d-ব্লক মূলকসমূহের ইলেকট্রনীয় গঠন ও ধর্ম।" },
    { title: "ধাতুবিদ্যা (Metallurgy)", description: "আকরিক থেকে ধাতু নিষ্কর্ষণের পদ্ধতি ও শোধন।" },
    { title: "ক্রিস্টাল ফিল্ড থিওরি (Crystal Field Theory)", description: "d-অরবিটালের বিভাজন এবং জটিল যৌগের বর্ণ ও চুম্বকত্ব।" },
  ],
  "analytical-chemistry": [
    { title: "ক্রোমাটোগ্রাফি (Chromatography)", description: "মিশ্রণ থেকে উপাদান পৃথকীকরণের কৌশল।" },
    { title: "স্পেকট্রোস্কোপি (Spectroscopy)", description: "আলো-পদার্থের মিথস্ক্রিয়া দিয়ে যৌগ চিহ্নিতকরণ।" },
    { title: "টাইট্রেশন (Titration)", description: "অম্ল-ক্ষার ও রেডক্স টাইট্রেশনের নীতি ও হিসাব।" },
    { title: "গ্রাভিমেট্রিক বিশ্লেষণ (Gravimetric Analysis)", description: "ভর পরিমাপের মাধ্যমে পরিমাণগত বিশ্লেষণ।" },
  ],
  biochemistry: [
    { title: "প্রোটিন (Proteins)", description: "অ্যামিনো অ্যাসিড, পেপটাইড বন্ধন ও প্রোটিনের গঠন।" },
    { title: "ডিএনএ/আরএনএ (DNA/RNA)", description: "নিউক্লিক অ্যাসিডের গঠন, প্রতিলিপি ও কার্যপ্রক্রিয়া।" },
    { title: "এনজাইম (Enzymes)", description: "জৈব ক্যাটালিস্ট — গঠন, ক্রিয়াপদ্ধতি ও গতিবিদ্যা।" },
    { title: "বিপাক ক্রিয়া (Metabolism)", description: "গ্লাইকোলাইসিস, ক্রেবস চক্র ও শক্তি উৎপাদন।" },
  ],
  // এই দুই বিষয়ের জন্য এখনো কোনো প্রস্তাবিত অধ্যায়-তালিকা নির্ধারণ করা হয়নি;
  // চাইলে admin/chapters পেজ থেকে কাস্টম অধ্যায় ম্যানুয়ালি যোগ করা যাবে।
  "environmental-chemistry": [],
  "industrial-chemistry": [],
};
