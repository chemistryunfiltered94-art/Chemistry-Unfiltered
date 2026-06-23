"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, BookOpen, FlaskConical, Award } from "lucide-react";

interface SiteStats {
  users: number;
  topics: number;
  formulas: number;
  questions: number;
}

interface Props {
  stats?: SiteStats;
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("bn-BD")}
      {suffix}
    </span>
  );
}

export default function StatsSection({ stats }: Props) {
  const statItems = [
    { value: stats?.users    ?? 10000, label: "সক্রিয় শিক্ষার্থী",  icon: Users,       suffix: "+" },
    { value: stats?.topics   ?? 500,   label: "শিক্ষামূলক টপিক",     icon: BookOpen,    suffix: "+" },
    { value: stats?.formulas ?? 200,   label: "রসায়ন ফর্মুলা",       icon: FlaskConical,suffix: "+" },
    { value: stats?.questions?? 5000,  label: "অনুশীলন প্রশ্ন",      icon: Award,       suffix: "+" },
  ];
  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 card-hover"
              >
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
