import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

const articleData: Record<string, {
  title: string; summary: string; content: string[];
  category: string; tag: string; tagColor: string; date: string; readTime: string;
}> = {
  "dna-rna-chemistry": {
    title: "DNA ও RNA: জীবনের রাসায়নিক ভিত্তি",
    summary: "ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড ও রাইবোনিউক্লিক অ্যাসিডের গঠন ও কার্যকারিতা।",
    category: "জীব রসায়ন", tag: "Biochemistry",
    tagColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
    date: "২০ ডিসেম্বর, ২০২৪", readTime: "১০ মিনিট",
    content: [
      "DNA (ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড) হল জীবের বংশগতির তথ্য বহনকারী অণু। এটি নিউক্লিওটাইড দিয়ে তৈরি — প্রতিটি নিউক্লিওটাইডে একটি ডিঅক্সিরাইবোজ শর্করা, একটি ফসফেট গ্রুপ এবং একটি নাইট্রোজেনাস বেস থাকে।",
      "DNA-তে চারটি বেস থাকে: অ্যাডেনিন (A), থাইমিন (T), গুয়ানিন (G) এবং সাইটোসিন (C)। Watson-Crick মডেল অনুযায়ী A-T এবং G-C জোড় তৈরি হয়ে দ্বি-হেলিক্স গঠন তৈরি করে।",
      "RNA (রাইবোনিউক্লিক অ্যাসিড) DNA-র তথ্য বহন করে প্রোটিন সংশ্লেষণে সাহায্য করে। RNA-তে থাইমিনের পরিবর্তে ইউরাসিল (U) থাকে এবং এটি একক সূত্রের।",
      "তিন ধরনের RNA আছে: mRNA (messenger RNA) — প্রোটিনের নির্দেশনা বহন করে; tRNA (transfer RNA) — অ্যামিনো অ্যাসিড বহন করে; rRNA (ribosomal RNA) — রাইবোসোমের অংশ।",
      "কেন্দ্রীয় মতবাদ (Central Dogma): DNA → RNA → Protein। DNA থেকে mRNA তৈরিকে Transcription এবং mRNA থেকে প্রোটিন তৈরিকে Translation বলে।",
    ],
  },
  "greenhouse-gases": {
    title: "গ্রিন হাউস গ্যাস ও জলবায়ু পরিবর্তনের রসায়ন",
    summary: "CO₂, CH₄, N₂O এর মতো গ্রিন হাউস গ্যাসগুলো কীভাবে পৃথিবীর তাপমাত্রা বাড়াচ্ছে।",
    category: "পরিবেশ রসায়ন", tag: "Environmental",
    tagColor: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
    date: "১৫ ডিসেম্বর, ২০২৪", readTime: "৮ মিনিট",
    content: [
      "গ্রিনহাউস প্রভাব একটি প্রাকৃতিক প্রক্রিয়া যেখানে বায়ুমণ্ডলের কিছু গ্যাস সূর্যের তাপ ধরে রাখে এবং পৃথিবীকে উষ্ণ রাখে। কিন্তু মানবীয় কার্যকলাপের কারণে এই গ্যাসের পরিমাণ অস্বাভাবিকভাবে বাড়ছে।",
      "প্রধান গ্রিনহাউস গ্যাসগুলো হল: CO₂ (কার্বন ডাইঅক্সাইড) — জীবাশ্ম জ্বালানি পোড়ানো থেকে; CH₄ (মিথেন) — পশুপালন ও ভাগাড় থেকে; N₂O (নাইট্রাস অক্সাইড) — সার থেকে; এবং CFC (ক্লোরোফ্লুরোকার্বন) — ফ্রিজ ও এয়ারকন্ডিশনার থেকে।",
      "CO₂ অণু সূর্যের অতিবেগুনি আলো শোষণ করে না কিন্তু পৃথিবীর তাপ নির্গমনকারী ইনফ্রারেড বিকিরণ শোষণ করে। এই শোষিত শক্তি পুনরায় বিকিরণ করে বায়ুমণ্ডল গরম করে।",
      "১৮৫০ সালের পর থেকে বায়ুমণ্ডলে CO₂ প্রায় ৪৫% বৃদ্ধি পেয়েছে। বর্তমানে এর পরিমাণ প্রায় ৪২০ ppm, যা গত ৮ লাখ বছরে সর্বোচ্চ।",
    ],
  },
  "antibiotics-chemistry": {
    title: "অ্যান্টিবায়োটিকের কার্যপদ্ধতি: রসায়নের দৃষ্টিতে",
    summary: "পেনিসিলিন থেকে শুরু করে আধুনিক অ্যান্টিবায়োটিক কীভাবে ব্যাকটেরিয়ার বিরুদ্ধে কাজ করে।",
    category: "জৈব রসায়ন", tag: "Organic",
    tagColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    date: "১০ ডিসেম্বর, ২০২৪", readTime: "১২ মিনিট",
    content: [
      "অ্যান্টিবায়োটিক হল এমন রাসায়নিক যৌগ যা ব্যাকটেরিয়া মারতে বা তাদের বৃদ্ধি রোধ করতে পারে। আলেকজান্ডার ফ্লেমিং ১৯২৮ সালে পেনিসিলিন আবিষ্কার করেন।",
      "পেনিসিলিন β-lactam কাঠামোযুক্ত একটি জৈব যৌগ। এটি ব্যাকটেরিয়ার কোষ প্রাচীর তৈরির এনজাইম (transpeptidase) কে বাধা দেয়, ফলে কোষ প্রাচীর ভেঙে যায়।",
      "বিভিন্ন ধরনের অ্যান্টিবায়োটিকের কার্যপদ্ধতি ভিন্ন: কিছু কোষ প্রাচীর সংশ্লেষণ বাধা দেয়, কিছু প্রোটিন সংশ্লেষণ বাধা দেয়, কিছু DNA replication বাধা দেয়।",
      "অ্যান্টিবায়োটিক প্রতিরোধ (Antibiotic Resistance) একটি বড় সমস্যা। অতিরিক্ত ব্যবহারে ব্যাকটেরিয়া মিউটেশনের মাধ্যমে প্রতিরোধী হয়ে যায়।",
    ],
  },
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articleData[slug];
  if (!a) return { title: "Article Not Found" };
  return { title: a.title, description: a.summary };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const a = articleData[slug];
  if (!a) notFound();

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto">
        <Link href="/articles" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> সব আর্টিকেল
        </Link>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden">
          <div className="h-2 gradient-bg" />
          <div className="p-6 lg:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${a.tagColor}`}>
                <Tag className="w-3 h-3" /> {a.tag}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">{a.category}</span>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3" /> {a.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" /> {a.readTime}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{a.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 border-l-4 border-primary-500 pl-4 mb-8 italic">{a.summary}</p>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-5">
              {a.content.map((para, i) => (
                <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
