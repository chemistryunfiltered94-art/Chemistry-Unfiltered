import Link from "next/link";
import { HelpCircle, Trophy } from "lucide-react";
import { getQuestions } from "@/lib/firestore";
import QuestionBankClient from "@/components/question-bank/QuestionBankClient";

export const metadata = {
  title: "Question Bank — প্রশ্নব্যাংক",
  description: "SSC থেকে BCS — সব পরীক্ষার রসায়ন প্রশ্ন এবং ব্যাখ্যা।",
};

export default async function QuestionBankPage() {
  const questions = await getQuestions();

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" /> প্রশ্নব্যাংক
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Question Bank</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">SSC থেকে BCS — সব পরীক্ষার রসায়ন প্রশ্ন এবং ব্যাখ্যা</p>
          <Link href="/question-bank/mock-test"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-semibold hover:opacity-90 shadow-lg">
            <Trophy className="w-5 h-5" /> Mock Test দাও
          </Link>
        </div>

        <QuestionBankClient questions={questions} />
      </div>
    </div>
  );
}
