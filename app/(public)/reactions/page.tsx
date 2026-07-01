import { FlaskConical } from "lucide-react";
import { reactions } from "@/components/reactions/reactionData";
import ReactionsClient from "@/components/reactions/ReactionsClient";

export const metadata = {
  title: "Reaction Database — বিক্রিয়া ডেটাবেস",
  description: "জৈব, অজৈব, শিল্প, জৈব রাসায়নিক ও নিউক্লিয় বিক্রিয়া — মেকানিজম ও প্রয়োগ সহ।",
};

export const categories = [
  { key: "all",         label: "সব বিক্রিয়া",          emoji: "⚗️" },
  { key: "organic",     label: "জৈব (Organic)",           emoji: "🌿" },
  { key: "inorganic",   label: "অজৈব (Inorganic)",        emoji: "🔷" },
  { key: "industrial",  label: "শিল্প (Industrial)",      emoji: "🏭" },
  { key: "biochemical", label: "জৈব রাসায়নিক (Biochem)", emoji: "🧬" },
  { key: "nuclear",     label: "নিউক্লিয় (Nuclear)",     emoji: "☢️" },
];

// Organic sub-category groups for display
export const organicGroups = [
  {
    label: "Substitution",
    subTypes: ["substitution-sn1", "substitution-sn2"],
  },
  {
    label: "Elimination",
    subTypes: ["elimination-e1", "elimination-e2"],
  },
  {
    label: "Addition",
    subTypes: ["addition-hydrogenation", "addition-halogenation", "addition-hydrohalogenation"],
  },
  {
    label: "Oxidation",
    subTypes: ["oxidation-kmno4", "oxidation-ozonolysis"],
  },
  {
    label: "Named Reactions",
    subTypes: [
      "named-aldol", "named-cannizzaro", "named-friedel-crafts",
      "named-grignard", "named-wurtz", "named-sandmeyer",
      "named-reimer-tiemann", "named-claisen",
    ],
  },
];

export default function ReactionsPage() {
  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <FlaskConical className="w-4 h-4" />
            বিক্রিয়া ডেটাবেস
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Reaction Database</h1>
          <p className="text-slate-600 dark:text-slate-400">
            জৈব • অজৈব • শিল্প • জৈব রাসায়নিক • নিউক্লিয় বিক্রিয়া — মেকানিজম ও প্রয়োগ সহ
          </p>
        </div>

        <ReactionsClient reactions={reactions} categories={categories} organicGroups={organicGroups} />
      </div>
    </div>
  );
}
