import { Metadata } from "next";
import PeriodicTableClient from "@/components/periodic-table/PeriodicTableClient";

export const metadata: Metadata = {
  title: "Interactive Periodic Table — পর্যায় সারণি",
  description: "১১৮টি মৌলের সম্পূর্ণ Interactive Periodic Table। Atomic number, mass, electron configuration সহ বিস্তারিত তথ্য।",
};

export default function PeriodicTablePage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-6 pb-10">
      <div className="max-w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            পর্যায় সারণি
          </h1>
          <p className="text-slate-400">
            যেকোনো মৌলের উপর ক্লিক করো বিস্তারিত জানতে
          </p>
        </div>
        <PeriodicTableClient />
      </div>
    </div>
  );
}
