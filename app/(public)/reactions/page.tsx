import { FlaskConical } from "lucide-react";
import { getReactions } from "@/lib/firestore";
import ReactionsClient from "@/components/reactions/ReactionsClient";

export const metadata = {
  title: "Reaction Database — বিক্রিয়া ডেটাবেস",
  description: "গুরুত্বপূর্ণ রসায়ন বিক্রিয়া — মেকানিজম ও প্রয়োগ সহ।",
};

const categories = [
  { key: "all", label: "সব বিক্রিয়া" },
  { key: "industrial", label: "শিল্প বিক্রিয়া" },
  { key: "organic", label: "জৈব বিক্রিয়া" },
  { key: "inorganic", label: "অজৈব বিক্রিয়া" },
  { key: "physical", label: "ভৌত বিক্রিয়া" },
  { key: "analytical", label: "বিশ্লেষণী বিক্রিয়া" },
];

export default async function ReactionsPage() {
  const reactions = await getReactions();

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <FlaskConical className="w-4 h-4" />
            বিক্রিয়া ডেটাবেস
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Reaction Database</h1>
          <p className="text-slate-600 dark:text-slate-400">গুরুত্বপূর্ণ রসায়ন বিক্রিয়া — মেকানিজম ও প্রয়োগ সহ</p>
        </div>

        <ReactionsClient reactions={reactions} categories={categories} />
      </div>
    </div>
  );
}
