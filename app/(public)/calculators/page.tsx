import { Metadata } from "next";
import Link from "next/link";
import { Calculator, FlaskConical, Thermometer, Zap, Scale, Droplets, Beaker, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Chemistry Calculator — রসায়ন ক্যালকুলেটর",
  description: "Molarity, pH, Gas Laws, Limiting Reagent সহ ১৩+ Chemistry Calculator।",
};

const calculators = [
  { href: "/calculators/molarity",          name: "মোলারিটি",           nameEn: "Molarity",             desc: "দ্রবণের মোলারিটি হিসাব করো",                 icon: FlaskConical, color: "from-blue-500 to-indigo-600" },
  { href: "/calculators/ph",                name: "pH / pOH",            nameEn: "pH & pOH",             desc: "দ্রবণের pH ও pOH হিসাব করো",                 icon: Droplets,     color: "from-green-500 to-emerald-600" },
  { href: "/calculators/normality",         name: "নর্মালিটি",           nameEn: "Normality",            desc: "দ্রবণের নর্মালিটি হিসাব করো",               icon: Beaker,       color: "from-purple-500 to-violet-600" },
  { href: "/calculators/gas-laws",          name: "গ্যাসের সূত্র",       nameEn: "Gas Laws",             desc: "Boyle, Charles ও Ideal Gas Law",             icon: Thermometer,  color: "from-orange-500 to-amber-600" },
  { href: "/calculators/molecular-weight",  name: "আণবিক ভর",            nameEn: "Molecular Weight",     desc: "যৌগের আণবিক ভর হিসাব করো",                  icon: Scale,        color: "from-cyan-500 to-teal-600" },
  { href: "/calculators/dilution",          name: "তনুকরণ",              nameEn: "Dilution",             desc: "C₁V₁ = C₂V₂ দিয়ে তনুকরণ হিসাব",            icon: Droplets,     color: "from-rose-500 to-pink-600" },
  { href: "/calculators/limiting-reagent",  name: "সীমাবদ্ধ বিকারক",    nameEn: "Limiting Reagent",     desc: "বিক্রিয়ায় সীমাবদ্ধ বিকারক খুঁজে বের করো", icon: FlaskConical, color: "from-yellow-500 to-orange-600" },
  { href: "/calculators/percent-yield",     name: "শতকরা ফলন",           nameEn: "Percent Yield",        desc: "বিক্রিয়ার শতকরা ফলন হিসাব করো",             icon: TrendingUp,   color: "from-teal-500 to-green-600" },
  { href: "/calculators/density",           name: "ঘনত্ব",               nameEn: "Density",              desc: "পদার্থের ঘনত্ব হিসাব করো",                   icon: Calculator,   color: "from-slate-500 to-gray-600" },
  { href: "/calculators/electrochemistry",  name: "তড়িৎ রসায়ন",        nameEn: "Electrochemistry",     desc: "Faraday সূত্র, Nernst সমীকরণ",              icon: Zap,          color: "from-violet-500 to-purple-600" },
];

export default function CalculatorsPage() {
  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">টুলস</span>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">
            Chemistry Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Step-by-step solution সহ ১০+ রসায়ন ক্যালকুলেটর — যেকোনো হিসাব করো তাৎক্ষণিকভাবে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.href}
                href={calc.href}
                className="block p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl card-hover group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${calc.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {calc.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{calc.nameEn} Calculator</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{calc.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
