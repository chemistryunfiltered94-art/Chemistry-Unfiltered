import { ChemistryCategory, NoteType } from "@/types";
import { BookOpen, RotateCcw, ClipboardList, FileText, LucideIcon } from "lucide-react";

/** Canonical Bengali display names for each chemistry category. */
export const CATEGORY_NAMES: Record<ChemistryCategory, string> = {
  "physical-chemistry": "ভৌত রসায়ন",
  "organic-chemistry": "জৈব রসায়ন",
  "inorganic-chemistry": "অজৈব রসায়ন",
  "analytical-chemistry": "বিশ্লেষণী রসায়ন",
  biochemistry: "জীব রসায়ন",
  "environmental-chemistry": "পরিবেশ রসায়ন",
  "industrial-chemistry": "শিল্প রসায়ন",
};

export const CATEGORY_LIST: { id: ChemistryCategory; name: string }[] = (
  Object.keys(CATEGORY_NAMES) as ChemistryCategory[]
).map((id) => ({ id, name: CATEGORY_NAMES[id] }));

export function getCategoryName(id: string): string {
  return CATEGORY_NAMES[id as ChemistryCategory] || id;
}

/** Metadata (label, description, icon, color) for each note type, used
 *  on the public Notes Center page (/notes) and the admin notes panel. */
export const NOTE_TYPE_LIST: {
  id: NoteType;
  label: string;
  desc: string;
  color: string;
  icon: LucideIcon;
}[] = [
  { id: "class",     label: "ক্লাস নোটস",        desc: "বিষয়ভিত্তিক বিস্তারিত নোট",          color: "from-blue-500 to-indigo-600",   icon: BookOpen },
  { id: "revision",  label: "রিভিশন নোটস",       desc: "দ্রুত পুনরালোচনার জন্য সংক্ষিপ্ত নোট", color: "from-green-500 to-emerald-600", icon: RotateCcw },
  { id: "practical", label: "প্র্যাকটিক্যাল নোটস", desc: "ল্যাবরেটরি পরীক্ষার নোট",             color: "from-purple-500 to-violet-600", icon: ClipboardList },
  { id: "formula",   label: "ফর্মুলা শিট",        desc: "সব গুরুত্বপূর্ণ সূত্রের সংকলন",        color: "from-orange-500 to-amber-600",  icon: FileText },
];

export const NOTE_TYPE_LABELS: Record<NoteType, string> = NOTE_TYPE_LIST.reduce(
  (acc, t) => ({ ...acc, [t.id]: t.label }),
  {} as Record<NoteType, string>
);

export function getNoteType(id: string) {
  return NOTE_TYPE_LIST.find((t) => t.id === id);
}

export function getNoteTypeLabel(id: string): string {
  return NOTE_TYPE_LABELS[id as NoteType] || id;
}
