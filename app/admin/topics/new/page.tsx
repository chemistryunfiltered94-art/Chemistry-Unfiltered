"use client";

// app/admin/topics/new/page.tsx
//
// "Deep Topic Structure" — প্রতিটি টপিকের ভেতরে ১৬টি সেকশন যোগ করার ফর্ম:
// ভূমিকা, ঐতিহাসিক পটভূমি, তত্ত্ব, সূত্র, ডেরিভেশন, ডায়াগ্রাম, 3D গঠন,
// প্রয়োগ, শিল্পে ব্যবহার, নিরাপত্তা, MCQ, অনুশীলন সমস্যা, ল্যাব এক্সপেরিমেন্ট,
// অ্যানিমেশন, কুইজ (MCQ-এর সাথে একত্রিত), PDF নোট।
//
// মূল তথ্য (নাম, slug, বিষয়, অধ্যায়, ভূমিকা, তত্ত্ব, প্রয়োগ, নোট) সবসময় খোলা থাকে;
// বাকি ঐচ্ছিক সেকশনগুলো collapsible — যাতে ফর্মটি মোবাইলে scroll করার জন্য সহনীয় থাকে।

import { useState, useEffect } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument, getChapters, createChapter } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { CATEGORY_LIST } from "@/lib/constants";
import { molecules } from "@/lib/molecules";
import {
  Chapter, ChemistryCategory, TopicFormula, Diagram, PracticeProblem,
  TopicResource, LabExperiment, MCQ,
} from "@/types";
import Link from "next/link";
import {
  ArrowLeft, Save, Plus, X, FolderPlus, ChevronDown, ChevronUp,
  History, Sigma, ListOrdered, Image as ImageIcon, Box, Factory,
  ShieldAlert, FlaskConical, Film, FileText, ListChecks, HelpCircle,
} from "lucide-react";

// ─── Collapsible Section wrapper ─────────────────────────────────────
function Section({
  icon: Icon, title, badge, open, onToggle, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-700 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-slate-700/40 hover:bg-slate-700/70 transition-colors"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
          <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
          {title}
          {badge && <span className="text-xs font-normal text-slate-500">({badge})</span>}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>
      {open && <div className="p-4 bg-slate-800 space-y-3">{children}</div>}
    </div>
  );
}

// ─── Small reusable row-list controls for plain string arrays ───────
function StringListEditor({
  label, items, setItems, placeholder,
}: {
  label?: string;
  items: string[];
  setItems: (v: string[]) => void;
  placeholder: string;
}) {
  const add    = () => setItems([...items, ""]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => setItems(items.map((it, idx) => (idx === i ? val : it)));

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">{label}</label>
          <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
            <Plus className="w-3.5 h-3.5" /> যোগ করো
          </button>
        </div>
      )}
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={val} onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-slate-500 hover:text-red-400 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-primary-500 hover:text-primary-400 transition-colors">
            <Plus className="w-4 h-4" /> প্রথম আইটেম যোগ করো
          </button>
        )}
      </div>
    </div>
  );
}

export default function AddTopicPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // ── Basic fields ──
  const [title,        setTitle]        = useState("");
  const [slug,         setSlug]         = useState("");
  const [category,     setCategory]     = useState<ChemistryCategory>("physical-chemistry");
  const [chapterId,    setChapterId]    = useState("");
  const [estTime,      setEstTime]      = useState("20");
  const [summary,      setSummary]      = useState("");
  const [introduction, setIntroduction] = useState("");
  const [theory,       setTheory]       = useState([""]);
  const [notes,        setNotes]        = useState([""]);
  const [applications, setApplications] = useState([""]);
  const [featured,     setFeatured]     = useState(false);
  const [published,    setPublished]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [success,      setSuccess]      = useState(false);

  // ── Chapter state ──
  const [chapters,          setChapters]          = useState<Chapter[]>([]);
  const [chaptersLoading,   setChaptersLoading]   = useState(false);
  const [showNewChapter,    setShowNewChapter]     = useState(false);
  const [newChapterTitle,   setNewChapterTitle]    = useState("");
  const [newChapterDesc,    setNewChapterDesc]     = useState("");
  const [savingChapter,     setSavingChapter]      = useState(false);

  // ── Deep Topic Structure — ঐচ্ছিক সেকশনসমূহ ──
  const [historicalBackground, setHistoricalBackground] = useState("");
  const [formulas,    setFormulas]    = useState<TopicFormula[]>([]);
  const [derivation,  setDerivation]  = useState<string[]>([]);
  const [diagrams,    setDiagrams]    = useState<Diagram[]>([]);
  const [industrialUses, setIndustrialUses] = useState<string[]>([]);
  const [safety,      setSafety]      = useState<string[]>([]);
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [pdfNotes,    setPdfNotes]    = useState<TopicResource[]>([]);

  // 3D Structure
  const [moleculeId,   setMoleculeId]   = useState("");
  const [struct3DTitle,setStruct3DTitle]= useState("");
  const [struct3DDesc, setStruct3DDesc] = useState("");
  const [struct3DUrl,  setStruct3DUrl]  = useState("");

  // Lab Experiment
  const [labTitle,       setLabTitle]       = useState("");
  const [labMaterials,   setLabMaterials]   = useState<string[]>([]);
  const [labProcedure,   setLabProcedure]   = useState<string[]>([]);
  const [labPrecautions, setLabPrecautions] = useState<string[]>([]);
  const [labObservation, setLabObservation] = useState("");

  // Animation
  const [animTitle, setAnimTitle] = useState("");
  const [animDesc,  setAnimDesc]  = useState("");
  const [animUrl,   setAnimUrl]   = useState("");

  // MCQ / Quiz
  type MCQDraft = { question: string; options: string[]; correctAnswer: number; explanation: string; difficulty: "easy"|"medium"|"hard" };
  const emptyMCQ = (): MCQDraft => ({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "", difficulty: "medium" });
  const [mcqs, setMcqs] = useState<MCQDraft[]>([]);

  // কোন collapsible সেকশন খোলা আছে
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  // category বদলালে নতুন অধ্যায় load করো
  useEffect(() => {
    setChapterId("");
    setChapters([]);
    setShowNewChapter(false);
    setChaptersLoading(true);
    getChapters(category).then((data) => {
      setChapters(data);
      setChaptersLoading(false);
    });
  }, [category]);

  const addItem    = (arr: string[], set: (v: string[]) => void) => set([...arr, ""]);
  const removeItem = (arr: string[], set: (v: string[]) => void, i: number) =>
    set(arr.filter((_, idx) => idx !== i));
  const updateItem = (arr: string[], set: (v: string[]) => void, i: number, val: string) =>
    set(arr.map((item, idx) => (idx === i ? val : item)));

  // object-array (formulas / diagrams / pdfNotes / practiceProblems / mcqs)-এর জন্য generic helper
  function addRow<T>(arr: T[], set: (v: T[]) => void, empty: T) { set([...arr, empty]); }
  function removeRow<T>(arr: T[], set: (v: T[]) => void, i: number) { set(arr.filter((_, idx) => idx !== i)); }
  function updateRow<T>(arr: T[], set: (v: T[]) => void, i: number, patch: Partial<T>) {
    set(arr.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  // নতুন অধ্যায় save করো
  const handleSaveChapter = async () => {
    if (!newChapterTitle.trim()) return;
    setSavingChapter(true);
    const id = await createChapter({
      title: newChapterTitle.trim(),
      categoryId: category,
      order: chapters.length + 1,
      description: newChapterDesc.trim() || undefined,
    });
    setSavingChapter(false);
    if (id) {
      const newCh: Chapter = {
        id,
        title: newChapterTitle.trim(),
        categoryId: category,
        order: chapters.length + 1,
        description: newChapterDesc.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChapters((prev) => [...prev, newCh]);
      setChapterId(id);
      setNewChapterTitle("");
      setNewChapterDesc("");
      setShowNewChapter(false);
      showToast("success", `"${newCh.title}" অধ্যায় যোগ হয়েছে এবং সিলেক্ট করা হয়েছে।`);
    } else {
      showToast("error", "অধ্যায় যোগ করা যায়নি।");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !summary.trim() || !chapterId) return;
    setSaving(true);

    const cleanFormulas = formulas.filter((f) => f.formula.trim() || f.name.trim());
    const cleanDiagrams = diagrams.filter((d) => d.url.trim());
    const cleanPdfNotes = pdfNotes.filter((p) => p.title.trim() && p.url.trim());
    const cleanPracticeProblems = practiceProblems.filter((p) => p.question.trim() && p.answer.trim());
    const cleanDerivation = derivation.filter((d) => d.trim());
    const cleanIndustrialUses = industrialUses.filter((u) => u.trim());
    const cleanSafety = safety.filter((s) => s.trim());
    const cleanMcqs: MCQ[] = mcqs
      .filter((m) => m.question.trim() && m.options.every((o) => o.trim()))
      .map((m, i) => ({
        id: `mcq-${i + 1}`,
        question: m.question.trim(),
        options: m.options.map((o) => o.trim()),
        correctAnswer: m.correctAnswer,
        explanation: m.explanation.trim(),
        difficulty: m.difficulty,
        exam: [],
        categoryId: category,
        topicId: slug.trim(),
      }));

    const hasLabExperiment = labTitle.trim().length > 0;
    const labExperiment: LabExperiment | undefined = hasLabExperiment
      ? {
          title: labTitle.trim(),
          materials: labMaterials.filter((m) => m.trim()),
          procedure: labProcedure.filter((p) => p.trim()),
          precautions: labPrecautions.filter((p) => p.trim()),
          observation: labObservation.trim() || undefined,
        }
      : undefined;

    const hasAnimation = animTitle.trim().length > 0;
    const animation = hasAnimation
      ? { title: animTitle.trim(), description: animDesc.trim(), url: animUrl.trim() || undefined }
      : undefined;

    const hasStructure3D = moleculeId.trim().length > 0 || struct3DUrl.trim().length > 0;
    const structure3D = hasStructure3D
      ? {
          moleculeId: moleculeId.trim() || undefined,
          title: struct3DTitle.trim() || undefined,
          description: struct3DDesc.trim() || undefined,
          modelUrl: struct3DUrl.trim() || undefined,
        }
      : undefined;

    const id = await createDocument("topics", {
      title: title.trim(),
      slug: slug.trim(),
      categoryId: category,
      chapterId,
      estimatedTime: parseInt(estTime) || 20,
      summary: summary.trim(),
      content: {
        introduction: introduction.trim(),
        historicalBackground: historicalBackground.trim() || undefined,
        theory: theory.filter((t) => t.trim()),
        formulas: cleanFormulas.length ? cleanFormulas : undefined,
        derivation: cleanDerivation.length ? cleanDerivation : undefined,
        applications: applications.filter((a) => a.trim()),
        industrialUses: cleanIndustrialUses.length ? cleanIndustrialUses : undefined,
        safety: cleanSafety.length ? cleanSafety : undefined,
        practiceProblems: cleanPracticeProblems.length ? cleanPracticeProblems : undefined,
        labExperiment,
        animation,
        pdfNotes: cleanPdfNotes.length ? cleanPdfNotes : undefined,
        notes: notes.filter((n) => n.trim()),
        examples: [],
      },
      diagrams: cleanDiagrams,
      structure3D,
      mcqs: cleanMcqs,
      relatedTopics: [],
      featured,
      published,
      views: 0,
    });
    setSaving(false);
    if (id) {
      setSuccess(true);
      showToast("success", "টপিক সফলভাবে সংরক্ষিত হয়েছে।");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      showToast("error", "টপিক সংরক্ষণ করা যায়নি।");
    }
  };

  if (!isAdmin) return null;

  const canSave = title.trim() && slug.trim() && summary.trim() && chapterId;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">নতুন টপিক যোগ করো</h1>
            <p className="text-sm text-slate-400 mt-1">মূল তথ্য পূরণ করো, বাকি সেকশনগুলো ঐচ্ছিক — যতটুকু দরকার খুলে পূরণ করো।</p>
          </div>

          {/* ── Basic Info ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">টপিকের নাম *</label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }}
                placeholder="যেমন: অ্যাসিড ও ক্ষার"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug (URL) *</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="acid-base"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">পড়ার সময় (মিনিট)</label>
              <input
                type="number" value={estTime}
                onChange={(e) => setEstTime(e.target.value)} min="5" max="120"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* ── বিষয় ও অধ্যায় ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* বিষয় */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">বিষয় *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ChemistryCategory)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* অধ্যায় */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">অধ্যায় *</label>
              {chaptersLoading ? (
                <div className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-400 text-sm">
                  লোড হচ্ছে...
                </div>
              ) : chapters.length === 0 && !showNewChapter ? (
                <button
                  onClick={() => setShowNewChapter(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 border border-dashed border-primary-500 rounded-xl text-primary-400 text-sm hover:bg-slate-600 transition-colors"
                >
                  <FolderPlus className="w-4 h-4" />
                  প্রথম অধ্যায় যোগ করুন
                </button>
              ) : !showNewChapter ? (
                <div className="flex gap-2">
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="">— অধ্যায় বেছে নাও —</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowNewChapter(true)}
                    title="নতুন অধ্যায় যোগ করুন"
                    className="px-3 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-400 hover:text-primary-400 hover:border-primary-500 transition-colors"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* ── নতুন অধ্যায় form (inline) ── */}
          {showNewChapter && (
            <div className="bg-slate-700/50 border border-primary-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-400 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4" /> নতুন অধ্যায় যোগ করো
                </p>
                <button onClick={() => setShowNewChapter(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">অধ্যায়ের নাম *</label>
                <input
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="যেমন: পরমাণুর গঠন"
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">বিবরণ (ঐচ্ছিক)</label>
                <input
                  value={newChapterDesc}
                  onChange={(e) => setNewChapterDesc(e.target.value)}
                  placeholder="অধ্যায়ের সংক্ষিপ্ত বিবরণ"
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveChapter}
                  disabled={savingChapter || !newChapterTitle.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {savingChapter ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Plus className="w-4 h-4" /> অধ্যায় যোগ করো ও সিলেক্ট করো</>
                  )}
                </button>
                <button
                  onClick={() => { setShowNewChapter(false); setNewChapterTitle(""); setNewChapterDesc(""); }}
                  className="px-4 py-2.5 bg-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-500 transition-colors"
                >
                  বাতিল
                </button>
              </div>
            </div>
          )}

          {chapterId && !showNewChapter && (
            <p className="text-xs text-green-400 -mt-2">
              ✅ অধ্যায়: {chapters.find((c) => c.id === chapterId)?.title}
            </p>
          )}

          {/* ── Summary ── */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">সংক্ষিপ্ত বিবরণ *</label>
            <textarea
              value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
              placeholder="টপিকের সংক্ষিপ্ত বিবরণ"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* ── Introduction ── */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">ভূমিকা (Introduction)</label>
            <textarea
              value={introduction} onChange={(e) => setIntroduction(e.target.value)} rows={4}
              placeholder="টপিকের বিস্তারিত ভূমিকা..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* ── Theory Points ── */}
          <StringListEditor label="তত্ত্বের পয়েন্ট (Theory)" items={theory} setItems={setTheory} placeholder="তত্ত্বের পয়েন্ট" />

          {/* ════════════ Deep Topic Structure — ঐচ্ছিক সেকশনসমূহ ════════════ */}
          <div className="pt-2 border-t border-slate-700" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">আরো গভীর বিষয়বস্তু (ঐচ্ছিক)</p>

          <div className="space-y-3">
            {/* Historical Background */}
            <Section icon={History} title="ঐতিহাসিক পটভূমি" open={!!open.history} onToggle={() => toggle("history")}>
              <textarea
                value={historicalBackground} onChange={(e) => setHistoricalBackground(e.target.value)} rows={3}
                placeholder="এই বিষয়ের ঐতিহাসিক প্রেক্ষাপট, কে আবিষ্কার করেছিলেন, কবে..."
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
              />
            </Section>

            {/* Formulas */}
            <Section icon={Sigma} title="মূল সূত্রসমূহ (Formula)" badge={formulas.length ? `${formulas.length}` : undefined} open={!!open.formulas} onToggle={() => toggle("formulas")}>
              {formulas.map((f, i) => (
                <div key={i} className="border border-slate-600 rounded-xl p-3 space-y-2 relative">
                  <button type="button" onClick={() => removeRow(formulas, setFormulas, i)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                  <input value={f.name} onChange={(e) => updateRow(formulas, setFormulas, i, { name: e.target.value })}
                    placeholder="সূত্রের নাম (যেমন: আদর্শ গ্যাস সমীকরণ)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                  <input value={f.formula} onChange={(e) => updateRow(formulas, setFormulas, i, { formula: e.target.value })}
                    placeholder="সূত্র (যেমন: PV = nRT)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm font-mono placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                  <input value={f.explanation} onChange={(e) => updateRow(formulas, setFormulas, i, { explanation: e.target.value })}
                    placeholder="সংক্ষিপ্ত ব্যাখ্যা"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                </div>
              ))}
              <button type="button" onClick={() => addRow(formulas, setFormulas, { name: "", formula: "", explanation: "" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-primary-500 hover:text-primary-400 transition-colors">
                <Plus className="w-4 h-4" /> সূত্র যোগ করো
              </button>
            </Section>

            {/* Derivation */}
            <Section icon={ListOrdered} title="ডেরিভেশন (ধাপে ধাপে)" badge={derivation.length ? `${derivation.length} ধাপ` : undefined} open={!!open.derivation} onToggle={() => toggle("derivation")}>
              <StringListEditor items={derivation} setItems={setDerivation} placeholder="ডেরিভেশনের একটি ধাপ" />
            </Section>

            {/* Diagrams */}
            <Section icon={ImageIcon} title="ডায়াগ্রাম" badge={diagrams.length ? `${diagrams.length}` : undefined} open={!!open.diagrams} onToggle={() => toggle("diagrams")}>
              {diagrams.map((d, i) => (
                <div key={i} className="border border-slate-600 rounded-xl p-3 space-y-2 relative">
                  <button type="button" onClick={() => removeRow(diagrams, setDiagrams, i)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                  <input value={d.url} onChange={(e) => updateRow(diagrams, setDiagrams, i, { url: e.target.value })}
                    placeholder="ছবির URL"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                  <input value={d.caption || ""} onChange={(e) => updateRow(diagrams, setDiagrams, i, { caption: e.target.value })}
                    placeholder="ক্যাপশন (ঐচ্ছিক)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                </div>
              ))}
              <button type="button" onClick={() => addRow(diagrams, setDiagrams, { url: "", caption: "" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-primary-500 hover:text-primary-400 transition-colors">
                <Plus className="w-4 h-4" /> ডায়াগ্রাম যোগ করো
              </button>
            </Section>

            {/* 3D Structure */}
            <Section icon={Box} title="3D গঠন" open={!!open.structure3D} onToggle={() => toggle("structure3D")}>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">পূর্বনির্ধারিত অণু বেছে নাও</label>
                <select
                  value={moleculeId}
                  onChange={(e) => setMoleculeId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">— কোনোটি নয় —</option>
                  {molecules.map((m) => (
                    <option key={m.id} value={m.id}>{m.nameBn} ({m.formula})</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">এটি বেছে নিলে /molecules-এর ইন্টারেক্টিভ ভিউয়ার টপিক পেজে দেখাবে।</p>
              </div>
              <input value={struct3DTitle} onChange={(e) => setStruct3DTitle(e.target.value)}
                placeholder="শিরোনাম override (ঐচ্ছিক)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
              <input value={struct3DDesc} onChange={(e) => setStruct3DDesc(e.target.value)}
                placeholder="বিবরণ override (ঐচ্ছিক)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
              <input value={struct3DUrl} onChange={(e) => setStruct3DUrl(e.target.value)}
                placeholder="বাহিরের 3D মডেল লিংক (ঐচ্ছিক, molecule তালিকায় না থাকলে)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
            </Section>
          </div>

          {/* ── Applications ── */}
          <StringListEditor label="বাস্তব প্রয়োগ (Applications)" items={applications} setItems={setApplications} placeholder="প্রয়োগের বিবরণ" />

          <div className="space-y-3">
            {/* Industrial Uses */}
            <Section icon={Factory} title="শিল্পে ব্যবহার" badge={industrialUses.length ? `${industrialUses.length}` : undefined} open={!!open.industrial} onToggle={() => toggle("industrial")}>
              <StringListEditor items={industrialUses} setItems={setIndustrialUses} placeholder="শিল্পে ব্যবহারের বিবরণ" />
            </Section>

            {/* Safety */}
            <Section icon={ShieldAlert} title="নিরাপত্তা সতর্কতা" badge={safety.length ? `${safety.length}` : undefined} open={!!open.safety} onToggle={() => toggle("safety")}>
              <StringListEditor items={safety} setItems={setSafety} placeholder="নিরাপত্তা সতর্কতা" />
            </Section>

            {/* Lab Experiment */}
            <Section icon={FlaskConical} title="ল্যাব এক্সপেরিমেন্ট" open={!!open.lab} onToggle={() => toggle("lab")}>
              <input value={labTitle} onChange={(e) => setLabTitle(e.target.value)}
                placeholder="এক্সপেরিমেন্টের নাম"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
              <StringListEditor label="প্রয়োজনীয় উপকরণ" items={labMaterials} setItems={setLabMaterials} placeholder="যেমন: টেস্ট টিউব" />
              <StringListEditor label="পরীক্ষার পদ্ধতি" items={labProcedure} setItems={setLabProcedure} placeholder="ধাপ" />
              <StringListEditor label="সতর্কতা" items={labPrecautions} setItems={setLabPrecautions} placeholder="সতর্কতার বিবরণ" />
              <textarea value={labObservation} onChange={(e) => setLabObservation(e.target.value)} rows={2}
                placeholder="পর্যবেক্ষণ (ঐচ্ছিক)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none" />
            </Section>

            {/* Animation */}
            <Section icon={Film} title="অ্যানিমেশন / ভিডিও" open={!!open.animation} onToggle={() => toggle("animation")}>
              <input value={animTitle} onChange={(e) => setAnimTitle(e.target.value)}
                placeholder="শিরোনাম"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
              <textarea value={animDesc} onChange={(e) => setAnimDesc(e.target.value)} rows={2}
                placeholder="বিবরণ"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none" />
              <input value={animUrl} onChange={(e) => setAnimUrl(e.target.value)}
                placeholder="ভিডিও/অ্যানিমেশন URL (ঐচ্ছিক)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
            </Section>

            {/* PDF Notes */}
            <Section icon={FileText} title="PDF নোট" badge={pdfNotes.length ? `${pdfNotes.length}` : undefined} open={!!open.pdf} onToggle={() => toggle("pdf")}>
              {pdfNotes.map((p, i) => (
                <div key={i} className="border border-slate-600 rounded-xl p-3 space-y-2 relative">
                  <button type="button" onClick={() => removeRow(pdfNotes, setPdfNotes, i)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                  <input value={p.title} onChange={(e) => updateRow(pdfNotes, setPdfNotes, i, { title: e.target.value })}
                    placeholder="শিরোনাম"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                  <input value={p.url} onChange={(e) => updateRow(pdfNotes, setPdfNotes, i, { url: e.target.value })}
                    placeholder="PDF লিংক"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                </div>
              ))}
              <button type="button" onClick={() => addRow(pdfNotes, setPdfNotes, { title: "", url: "" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-primary-500 hover:text-primary-400 transition-colors">
                <Plus className="w-4 h-4" /> PDF লিংক যোগ করো
              </button>
            </Section>

            {/* Practice Problems */}
            <Section icon={ListChecks} title="অনুশীলন সমস্যা" badge={practiceProblems.length ? `${practiceProblems.length}` : undefined} open={!!open.practice} onToggle={() => toggle("practice")}>
              {practiceProblems.map((p, i) => (
                <div key={i} className="border border-slate-600 rounded-xl p-3 space-y-2 relative">
                  <button type="button" onClick={() => removeRow(practiceProblems, setPracticeProblems, i)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                  <textarea value={p.question} onChange={(e) => updateRow(practiceProblems, setPracticeProblems, i, { question: e.target.value })} rows={2}
                    placeholder="সমস্যা"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none" />
                  <input value={p.answer} onChange={(e) => updateRow(practiceProblems, setPracticeProblems, i, { answer: e.target.value })}
                    placeholder="উত্তর"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                  <select value={p.difficulty || "medium"} onChange={(e) => updateRow(practiceProblems, setPracticeProblems, i, { difficulty: e.target.value as "easy"|"medium"|"hard" })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500">
                    <option value="easy">সহজ</option>
                    <option value="medium">মধ্যম</option>
                    <option value="hard">কঠিন</option>
                  </select>
                </div>
              ))}
              <button type="button" onClick={() => addRow(practiceProblems, setPracticeProblems, { question: "", answer: "", difficulty: "medium" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-primary-500 hover:text-primary-400 transition-colors">
                <Plus className="w-4 h-4" /> সমস্যা যোগ করো
              </button>
            </Section>

            {/* MCQ / Quiz */}
            <Section icon={HelpCircle} title="MCQ / কুইজ" badge={mcqs.length ? `${mcqs.length}` : undefined} open={!!open.mcq} onToggle={() => toggle("mcq")}>
              {mcqs.map((m, i) => (
                <div key={i} className="border border-slate-600 rounded-xl p-3 space-y-2 relative">
                  <button type="button" onClick={() => removeRow(mcqs, setMcqs, i)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                  <textarea value={m.question} onChange={(e) => updateRow(mcqs, setMcqs, i, { question: e.target.value })} rows={2}
                    placeholder="প্রশ্ন"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none" />
                  {m.options.map((opt, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <button type="button" onClick={() => updateRow(mcqs, setMcqs, i, { correctAnswer: j })}
                        className={`w-7 h-7 flex-shrink-0 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${m.correctAnswer === j ? "bg-green-500 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                        title="সঠিক উত্তর চিহ্নিত করো">
                        {["ক","খ","গ","ঘ"][j]}
                      </button>
                      <input value={opt} onChange={(e) => {
                          const newOptions = m.options.map((o, oi) => (oi === j ? e.target.value : o));
                          updateRow(mcqs, setMcqs, i, { options: newOptions });
                        }}
                        placeholder={`অপশন ${["ক","খ","গ","ঘ"][j]}`}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-500">গোলাকার বাটনে ক্লিক করে সঠিক উত্তর বেছে নাও।</p>
                  <input value={m.explanation} onChange={(e) => updateRow(mcqs, setMcqs, i, { explanation: e.target.value })}
                    placeholder="ব্যাখ্যা"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500" />
                  <select value={m.difficulty} onChange={(e) => updateRow(mcqs, setMcqs, i, { difficulty: e.target.value as "easy"|"medium"|"hard" })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500">
                    <option value="easy">সহজ</option>
                    <option value="medium">মধ্যম</option>
                    <option value="hard">কঠিন</option>
                  </select>
                </div>
              ))}
              <button type="button" onClick={() => addRow(mcqs, setMcqs, emptyMCQ())}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-primary-500 hover:text-primary-400 transition-colors">
                <Plus className="w-4 h-4" /> প্রশ্ন যোগ করো
              </button>
            </Section>
          </div>

          {/* ── Notes ── */}
          <StringListEditor label="গুরুত্বপূর্ণ নোট" items={notes} setItems={setNotes} placeholder="গুরুত্বপূর্ণ তথ্য" />

          {/* ── Toggles ── */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-700">
            {[
              { label: "Featured হিসেবে চিহ্নিত করো", val: featured, set: setFeatured },
              { label: "প্রকাশিত (Published)",         val: published, set: setPublished },
            ].map((toggle2) => (
              <label key={toggle2.label} className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={toggle2.val} onChange={(e) => toggle2.set(e.target.checked)} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${toggle2.val ? "gradient-bg" : "bg-slate-600"}`} />
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggle2.val ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-slate-300">{toggle2.label}</span>
              </label>
            ))}
          </div>

          {/* ── Save ── */}
          {!canSave && (
            <p className="text-xs text-amber-400">
              ⚠️ টপিকের নাম, slug, সংক্ষিপ্ত বিবরণ এবং অধ্যায় — সবগুলো পূরণ করো।
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              "✅ সফলভাবে সংরক্ষিত হয়েছে!"
            ) : (
              <><Save className="w-5 h-5" /> টপিক সংরক্ষণ করো</>
            )}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
