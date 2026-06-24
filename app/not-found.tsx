import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-6 shadow-2xl">
          <Image src="/logo.png" alt="Chemistry Unfiltered" width={80} height={80} className="w-full h-full object-cover" />
        </div>

        <div className="text-8xl font-black gradient-text mb-4">৪০৪</div>

        <h1 className="text-2xl font-bold text-white mb-3">
          পেজটি পাওয়া যায়নি!
        </h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          তুমি যে পেজটি খুঁজছো সেটি হয়তো সরানো হয়েছে বা কখনো ছিল না।
          পরীক্ষানাগারে মাঝে মাঝে এমন হয়!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            হোম পেজে যাও
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            শেখা শুরু করো
          </Link>
        </div>
      </div>
    </div>
  );
}
