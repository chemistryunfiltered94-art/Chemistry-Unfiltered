"use client";

import Link from "next/link";
import { FlaskConical, Heart, Github, Facebook, Youtube } from "lucide-react";

const footerLinks = {
  শেখো: [
    { href: "/learn/beginner", label: "শুরু করো (Beginner)" },
    { href: "/learn/intermediate", label: "মধ্যবর্তী (Intermediate)" },
    { href: "/learn/advanced", label: "উন্নত (Advanced)" },
    { href: "/articles", label: "আর্টিকেল" },
    { href: "/notes", label: "নোটস" },
  ],
  টুলস: [
    { href: "/periodic-table", label: "পর্যায় সারণি" },
    { href: "/formulas", label: "ফর্মুলা লাইব্রেরি" },
    { href: "/calculators", label: "ক্যালকুলেটর" },
    { href: "/reactions", label: "বিক্রিয়া ডেটাবেস" },
    { href: "/molecules", label: "আণবিক দর্শক" },
  ],
  পরীক্ষা: [
    { href: "/question-bank", label: "প্রশ্নব্যাংক" },
    { href: "/question-bank?exam=ssc", label: "SSC প্রস্তুতি" },
    { href: "/question-bank?exam=hsc", label: "HSC প্রস্তুতি" },
    { href: "/question-bank?exam=admission", label: "ভর্তি পরীক্ষা" },
    { href: "/question-bank?exam=bcs", label: "BCS প্রস্তুতি" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Chemistry Unfiltered</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              বাংলাদেশের সবচেয়ে সম্পূর্ণ Chemistry Learning Ecosystem।
              SSC থেকে University পর্যন্ত সব শিক্ষার্থীর জন্য।
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 flex items-center gap-1">
            © 2024 Chemistry Unfiltered। তৈরি করা হয়েছে{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1" />
            দিয়ে বাংলাদেশে
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              ব্যবহারের শর্ত
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
