"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/firestore";
import Link from "next/link";
import { ArrowLeft, Plus, X, Save } from "lucide-react";

export default function AddQuestionPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  const [question,   setQuestion]   = useState("");
  const [options,    setOptions]    = useState(["","","",""]);
  const [answer,     setAnswer]     = useState(0);
  const [explanation,setExplanation]= useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [exams,      setExams]      = useState<string[]>(["SSC"]);
  const [category,   setCategory]   = useState("physical-chemistry");
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState(false);

  const toggleExam = (exam: string) =>
    setExams(prev => prev.includes(exam) ? prev.filter(e=>e!==exam) : [...prev, exam]);

  const handleSave = async () => {
    if (!question.trim() || options.some(o=>!o.trim()) || !explanation.trim()) return;
    setSaving(true);
    await createDocument("questions", {
      question: question.trim(),
      options: options.map(o=>o.trim()),
      correctAnswer: answer,
      explanation: explanation.trim(),
      difficulty,
      exam: exams,
      categoryId: category,
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      setQuestion(""); setOptions(["","","",""]); setAnswer(0); setExplanation(""); setSuccess(false);
    }, 2000);
  };

  if (!isAdmin) return null;

  const examList = ["SSC","HSC","Admission","University","BCS","Job"];
  const categories = [
    { id:"physical-chemistry",   name:"ভৌত রসায়ন" },
    { id:"organic-chemistry",    name:"জৈব রসায়ন" },
    { id:"inorganic-chemistry",  name:"অজৈব রসায়ন" },
    { id:"analytical-chemistry", name:"বিশ্লেষণী রসায়ন" },
    { id:"biochemistry",         name:"জীব রসায়ন" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-white mb-6">নতুন প্রশ্ন যোগ করো</h1>

          {/* Question */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">প্রশ্ন</label>
            <textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={3} placeholder="প্রশ্ন লেখো..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"/>
          </div>

          {/* Options */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">বিকল্পসমূহ</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button onClick={() => setAnswer(i)}
                    className={`w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm transition-all ${answer===i ? "gradient-bg text-white" : "border-2 border-slate-600 text-slate-400 hover:border-primary-500"}`}>
                    {["ক","খ","গ","ঘ"][i]}
                  </button>
                  <input value={opt} onChange={e => setOptions(p => p.map((o,idx)=>idx===i?e.target.value:o))}
                    placeholder={`বিকল্প ${["ক","খ","গ","ঘ"][i]}`}
                    className="flex-1 px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 text-sm"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">✓ সঠিক উত্তরের বোতামে ক্লিক করো</p>
          </div>

          {/* Explanation */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">ব্যাখ্যা</label>
            <textarea value={explanation} onChange={e=>setExplanation(e.target.value)} rows={2} placeholder="সঠিক উত্তরের ব্যাখ্যা..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"/>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">কঠিনতা</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
                <option value="easy">সহজ (Easy)</option>
                <option value="medium">মাঝারি (Medium)</option>
                <option value="hard">কঠিন (Hard)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">বিষয়</label>
              <select value={category} onChange={e=>setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Exam Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">পরীক্ষার ধরন</label>
            <div className="flex flex-wrap gap-2">
              {examList.map(exam => (
                <button key={exam} onClick={() => toggleExam(exam)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${exams.includes(exam) ? "gradient-bg text-white" : "border border-slate-600 text-slate-400 hover:border-primary-500"}`}>
                  {exam}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || !question.trim() || options.some(o=>!o.trim())}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> :
             success ? "✅ সফলভাবে যোগ হয়েছে!" :
             <><Save className="w-5 h-5"/> প্রশ্ন সংরক্ষণ করো</>}
          </button>
        </div>
      </div>
    </div>
  );
}
