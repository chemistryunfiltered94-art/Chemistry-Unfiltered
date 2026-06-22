"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { FormulaVariable } from "@/types";

const categories = [
  { id: "physical-chemistry", name: "ভৌত রসায়ন" },
  { id: "organic-chemistry", name: "জৈব রসায়ন" },
  { id: "inorganic-chemistry", name: "অজৈব রসায়ন" },
  { id: "analytical-chemistry", name: "বিশ্লেষণী রসায়ন" },
  { id: "biochemistry", name: "জীব রসায়ন" },
  { id: "environmental-chemistry", name: "পরিবেশ রসায়ন" },
  { id: "industrial-chemistry", name: "শিল্প রসায়ন" },
];

export default function AddFormulaPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [formula, setFormula] = useState("");
  const [latexFormula, setLatexFormula] = useState("");
  const [category, setCategory] = useState("physical-chemistry");
  const [variables, setVariables] = useState<FormulaVariable[]>([{ symbol: "", meaning: "", unit: "" }]);
  const [explanation, setExplanation] = useState("");
  const [exampleQuestion, setExampleQuestion] = useState("");
  const [exampleSolution, setExampleSolution] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateVariable = (i: number, field: keyof FormulaVariable, val: string) =>
    setVariables((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: val } : v)));

  const addVariable = () => setVariables((prev) => [...prev, { symbol: "", meaning: "", unit: "" }]);
  const removeVariable = (i: number) => setVariables((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!name.trim() || !formula.trim() || !explanation.trim()) return;
    setSaving(true);
    const id = await createDocument("formulas", {
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      formula: formula.trim(),
      latexFormula: latexFormula.trim() || formula.trim(),
      category,
      variables: variables.filter((v) => v.symbol.trim()),
      explanation: explanation.trim(),
      example: { question: exampleQuestion.trim(), solution: exampleSolution.trim() },
      relatedFormulas: [],
      relatedTopics: [],
    });
    setSaving(false);

    if (id) {
      setSuccess(true);
      showToast("success", "ফর্মুলা সফলভাবে সংরক্ষিত হয়েছে।");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      showToast("error", "সংরক্ষণ করা যায়নি। admin role বা Firestore rules যাচাই করো।");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">নতুন ফর্মুলা যোগ করো</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">নাম (বাংলা) *</label>
              <input value={nameBn} onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: মোলারিটি"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">নাম (English) *</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Molarity"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">সূত্র *</label>
              <input value={formula} onChange={(e) => setFormula(e.target.value)}
                placeholder="M = n / V"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white font-mono placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">বিষয়</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Variables */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">চলরাশিসমূহ</label>
              <button onClick={addVariable} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {variables.map((v, i) => (
                <div key={i} className="grid grid-cols-[60px_1fr_70px_auto] gap-2">
                  <input value={v.symbol} onChange={(e) => updateVariable(i, "symbol", e.target.value)}
                    placeholder="M"
                    className="px-2.5 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm font-mono text-center placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  <input value={v.meaning} onChange={(e) => updateVariable(i, "meaning", e.target.value)}
                    placeholder="অর্থ"
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  <input value={v.unit} onChange={(e) => updateVariable(i, "unit", e.target.value)}
                    placeholder="একক"
                    className="px-2 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {variables.length > 1 && (
                    <button onClick={() => removeVariable(i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">ব্যাখ্যা *</label>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={4}
              placeholder="সূত্রের বিস্তারিত ব্যাখ্যা..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* Example */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">উদাহরণ প্রশ্ন</label>
              <textarea value={exampleQuestion} onChange={(e) => setExampleQuestion(e.target.value)} rows={2}
                placeholder="প্রশ্ন লেখো..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">সমাধান</label>
              <textarea value={exampleSolution} onChange={(e) => setExampleSolution(e.target.value)} rows={3}
                placeholder="ধাপে ধাপে সমাধান..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || !name.trim() || !formula.trim() || !explanation.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
             success ? "✅ সফলভাবে সংরক্ষিত হয়েছে!" :
             <><Save className="w-5 h-5" /> ফর্মুলা সংরক্ষণ করো</>}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
