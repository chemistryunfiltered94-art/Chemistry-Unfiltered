import { Metadata } from "next";
import { FileText } from "lucide-react";
import { getStudyNotes } from "@/lib/firestore";
import NotesPageClient from "@/components/notes/NotesPageClient";

export const metadata: Metadata = {
  title: "Notes — রসায়ন নোটস",
  description: "Class Notes, Revision Notes ও Practical Notes।",
};

export default async function NotesPage() {
  const notes = await getStudyNotes();

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            নোটস সেন্টার
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Chemistry Notes</h1>
          <p className="text-slate-600 dark:text-slate-400">Class Notes, Revision Notes ও Practical Notes — সব এক জায়গায়</p>
        </div>

        <NotesPageClient notes={notes} />
      </div>
    </div>
  );
}
