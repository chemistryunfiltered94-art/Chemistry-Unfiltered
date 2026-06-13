"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Atom, FlaskConical, HelpCircle, ArrowRight, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "topic" | "formula" | "reaction" | "question" | "article";
  href: string;
}

const typeConfig = {
  topic:    { icon: BookOpen,    label: "টপিক",     color: "text-blue-500" },
  formula:  { icon: Atom,        label: "ফর্মুলা",   color: "text-purple-500" },
  reaction: { icon: FlaskConical,label: "বিক্রিয়া",  color: "text-orange-500" },
  question: { icon: HelpCircle,  label: "প্রশ্ন",    color: "text-green-500" },
  article:  { icon: BookOpen,    label: "আর্টিকেল",  color: "text-cyan-500" },
};

// Static data for instant search (Firebase search later)
const searchData: SearchResult[] = [
  { id:"1",  title:"অ্যাসিড ও ক্ষার",           subtitle:"ভৌত রসায়ন • মধ্যবর্তী",      type:"topic",    href:"/learn/physical-chemistry/acid-base" },
  { id:"2",  title:"পর্যায় সারণি",               subtitle:"অজৈব রসায়ন • শুরু",           type:"topic",    href:"/learn/inorganic-chemistry/periodic-table" },
  { id:"3",  title:"রাসায়নিক বন্ধন",             subtitle:"অজৈব রসায়ন • মধ্যবর্তী",     type:"topic",    href:"/learn/inorganic-chemistry/chemical-bonding" },
  { id:"4",  title:"তাপগতিবিদ্যা",               subtitle:"ভৌত রসায়ন • উন্নত",           type:"topic",    href:"/learn/physical-chemistry/thermodynamics" },
  { id:"5",  title:"জৈব বিক্রিয়া",               subtitle:"জৈব রসায়ন • উন্নত",           type:"topic",    href:"/learn/organic-chemistry/reactions" },
  { id:"6",  title:"মোলারিটি (M = n/V)",          subtitle:"ভৌত রসায়ন",                   type:"formula",  href:"/formulas/molarity" },
  { id:"7",  title:"pH সূত্র (-log[H⁺])",        subtitle:"ভৌত রসায়ন",                   type:"formula",  href:"/formulas/ph" },
  { id:"8",  title:"আদর্শ গ্যাস সূত্র (PV=nRT)", subtitle:"ভৌত রসায়ন",                   type:"formula",  href:"/formulas/ideal-gas-law" },
  { id:"9",  title:"গিবস শক্তি (ΔG=ΔH-TΔS)",    subtitle:"তাপগতিবিদ্যা",                 type:"formula",  href:"/formulas/gibbs-energy" },
  { id:"10", title:"হেবার পদ্ধতি",                subtitle:"N₂ + 3H₂ ⇌ 2NH₃",             type:"reaction", href:"/reactions#haber-process" },
  { id:"11", title:"সংস্পর্শ পদ্ধতি",             subtitle:"2SO₂ + O₂ ⇌ 2SO₃",            type:"reaction", href:"/reactions#contact-process" },
  { id:"12", title:"অ্যালডল ঘনীভবন",              subtitle:"জৈব বিক্রিয়া",                type:"reaction", href:"/reactions#aldol-condensation" },
  { id:"13", title:"পানির pH কত?",                subtitle:"SSC • ভৌত রসায়ন • সহজ",       type:"question", href:"/question-bank" },
  { id:"14", title:"DNA ও RNA: জীবনের রসায়ন",   subtitle:"জীব রসায়ন",                   type:"article",  href:"/articles/dna-rna-chemistry" },
];

const popularSearches = ["pH", "মোলারিটি", "হেবার পদ্ধতি", "পর্যায় সারণি", "অ্যাসিড", "গ্যাসের সূত্র"];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const q = query.toLowerCase();
    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(filtered);
    setActiveIndex(-1);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        router.push(results[activeIndex].href);
        onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, activeIndex, router, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="টপিক, ফর্মুলা, বিক্রিয়া খোঁজো..."
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs text-slate-500 dark:text-slate-400 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Search Results */}
              {results.length > 0 && (
                <div className="py-2">
                  {results.map((result, i) => {
                    const { icon: Icon, label, color } = typeConfig[result.type];
                    return (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          activeIndex === i
                            ? "bg-primary-50 dark:bg-primary-900/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                            {label}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* No Results */}
              {query && results.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    &ldquo;{query}&rdquo; — কোনো ফলাফল পাওয়া যায়নি
                  </p>
                </div>
              )}

              {/* Default state */}
              {!query && (
                <div className="p-4 space-y-5">
                  {/* Popular Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        জনপ্রিয় অনুসন্ধান
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        দ্রুত যাও
                      </span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { label: "পর্যায় সারণি",    href: "/periodic-table",  icon: Atom },
                        { label: "ফর্মুলা লাইব্রেরি", href: "/formulas",        icon: FlaskConical },
                        { label: "প্রশ্নব্যাংক",      href: "/question-bank",   icon: HelpCircle },
                      ].map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                          >
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{link.label}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-mono">↑↓</kbd>
                নেভিগেট
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-mono">↵</kbd>
                খোলো
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-mono">ESC</kbd>
                বন্ধ করো
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
