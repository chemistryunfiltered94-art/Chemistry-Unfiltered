import Link from "next/link";
import { Atom } from "lucide-react";
import { getFormulas } from "@/lib/firestore";
import FormulasClient from "@/components/formulas/FormulasClient";

export const metadata = {
  title: "Formula Library — ফর্মুলা লাইব্রেরি",
  description: "রসায়ন সূত্র — ব্যাখ্যা ও উদাহরণ সহ।",
};

const categories = [
  { key: "all", label: "সব" },
  { key: "physical-chemistry", label: "ভৌত রসায়ন" },
  { key: "organic-chemistry", label: "জৈব রসায়ন" },
  { key: "inorganic-chemistry", label: "অজৈব রসায়ন" },
  { key: "analytical-chemistry", label: "বিশ্লেষণী" },
  { key: "biochemistry", label: "জীব রসায়ন" },
  { key: "environmental-chemistry", label: "পরিবেশ" },
  { key: "industrial-chemistry", label: "শিল্প" },
];

export default async function FormulasPage() {
  const formulas = await getFormulas();

  return (
    <div className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Atom className="w-4 h-4" />
            ফর্মুলা লাইব্রেরি
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Chemistry Formula Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400">রসায়ন সূত্র — ব্যাখ্যা ও উদাহরণ সহ</p>
        </div>

        <FormulasClient formulas={formulas} categories={categories} />
      </div>
    </div>
  );
}

