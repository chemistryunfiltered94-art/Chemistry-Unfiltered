"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, Table2, FlaskConical, Beaker, HelpCircle, Atom, BookOpen } from "lucide-react";

const tools = [
  {
    name: "pH ক্যালকুলেটর",
    desc: "দ্রবণের pH তাৎক্ষণিক হিসাব করো",
    icon: Calculator,
    color: "from-green-500 to-emerald-600",
    href: "/calculators/ph",
  },
  {
    name: "মোলারিটি ক্যালকুলেটর",
    desc: "Molarity ও Normality হিসাব করো",
    icon: FlaskConical,
    color: "from-blue-500 to-indigo-600",
    href: "/calculators/molarity",
  },
  {
    name: "পর্যায় সারণি",
    desc: "সব মৌলের বিস্তারিত তথ্য",
    icon: Table2,
    color: "from-purple-500 to-violet-600",
    href: "/periodic-table",
  },
  {
    name: "ফর্মুলা লাইব্রেরি",
    desc: "২০০+ রসায়ন সূত্র একজায়গায়",
    icon: Atom,
    color: "from-orange-500 to-amber-600",
    href: "/formulas",
  },
  {
    name: "ভার্চুয়াল ল্যাব",
    desc: "Browser-এ পরীক্ষা-নিরীক্ষা করো",
    icon: Beaker,
    color: "from-cyan-500 to-teal-600",
    href: "/virtual-lab",
  },
  {
    name: "প্রশ্নব্যাংক",
    desc: "SSC, HSC, BCS সব প্রশ্ন",
    icon: HelpCircle,
    color: "from-rose-500 to-pink-600",
    href: "/question-bank",
  },
  {
    name: "বিক্রিয়া ডেটাবেস",
    desc: "১০০+ গুরুত্বপূর্ণ বিক্রিয়া",
    icon: BookOpen,
    color: "from-slate-500 to-gray-600",
    href: "/reactions",
  },
];

export default function QuickTools() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-slate-900 to-secondary-900">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent-400 font-semibold text-sm uppercase tracking-wider">
            দ্রুত অ্যাক্সেস
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">
            Quick Tools
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            সবচেয়ে বেশি ব্যবহৃত টুলগুলো এক ক্লিকে খোলো
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={tool.href}
                  className="block p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
