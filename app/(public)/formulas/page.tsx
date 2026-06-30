import { Atom } from "lucide-react";
import FormulasClient from "@/components/formulas/FormulasClient";
import { STATIC_FORMULAS, FORMULA_CATEGORIES } from "@/lib/formulaData";
import { FORMULA_CATEGORY_MAP } from "@/lib/formulaCategoryMap";

export const metadata = {
  title: "Formula Library — ফর্মুলা লাইব্রেরি",
  description: "রসায়ন সূত্র — ব্যাখ্যা ও উদাহরণ সহ।",
};

export default function FormulasPage() {
  // Static formula data-তে category key যোগ করা (shared map থেকে)
  const formulas = STATIC_FORMULAS.map((f) => ({
    ...f,
    category: FORMULA_CATEGORY_MAP[f.id] || f.category,
  }));

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
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            রসায়ন সূত্র — ব্যাখ্যা ও উদাহরণ সহ
          </p>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            মোট {formulas.length}টি সূত্র · ১৫টি বিভাগ
          </p>
        </div>

        <FormulasClient formulas={formulas} categories={FORMULA_CATEGORIES} />
      </div>
    </div>
  );
}
