import { Metadata } from "next";
import PeriodicTableClient from "@/components/periodic-table/PeriodicTableClient";

export const metadata: Metadata = {
  title: "Interactive Periodic Table — পর্যায় সারণি",
  description: "১১৮টি মৌলের সম্পূর্ণ Interactive Periodic Table। Electron shell diagram, category filter, state filter, s/p/d/f block filter সহ বিস্তারিত তথ্য।",
};

export default function PeriodicTablePage() {
  return (
    <div className="min-h-screen bg-slate-900 py-6 pb-28 lg:pb-10">
      <div className="max-w-full px-2 sm:px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
            পর্যায় সারণি
          </h1>
          <p className="text-slate-400 text-sm">
            মৌলের উপর ক্লিক করো বিস্তারিত জানতে · Category hover করলে সেই group glow করবে
          </p>
        </div>
        <PeriodicTableClient />
      </div>
    </div>
  );
}
