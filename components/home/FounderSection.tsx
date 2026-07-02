"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FlaskConical, GraduationCap, Sparkles, Quote } from "lucide-react";

export default function FounderSection() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* background accents */}
      <div className="molecule-bg opacity-40" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />
      <motion.div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-primary-600/20 blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            আমাদের সম্পর্কে
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            প্রতিষ্ঠাতা <span className="gradient-text">সম্পর্কে</span>
          </h2>
        </motion.div>

        {/* card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl glass border border-white/10 p-6 sm:p-10 lg:p-12 overflow-hidden"
        >
          {/* decorative glow inside card */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-secondary-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
              className="relative shrink-0"
            >
              <motion.div
                className="absolute -inset-3 rounded-[2rem] gradient-bg opacity-70 blur-md"
                animate={{ rotate: [0, 6, 0, -6, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl shadow-primary-900/50">
                <Image
                  src="/founder.jpg"
                  alt="মোঃ শরিফুল ইসলাম — প্রতিষ্ঠাতা, Chemistry Unfiltered"
                  fill
                  sizes="192px"
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute -bottom-3 -right-3 w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-900"
              >
                <FlaskConical className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-3"
              >
                মোঃ শরিফুল ইসলাম
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6"
              >
                <span className="inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/30 text-primary-300 rounded-full px-3 py-1.5 text-sm">
                  <FlaskConical className="w-3.5 h-3.5" />
                  রসায়ন বিভাগ | ২০২৫–২০২৬ সেশন
                </span>
                <span className="inline-flex items-center gap-1.5 bg-secondary-500/10 border border-secondary-500/30 text-secondary-300 rounded-full px-3 py-1.5 text-sm">
                  <GraduationCap className="w-3.5 h-3.5" />
                  সরকারি আকবর আলী কলেজ
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-primary-400 font-semibold mb-4"
              >
                Chemistry Unfiltered–এর প্রতিষ্ঠাতা
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="relative pl-5 border-l-2 border-primary-500/40 mb-6"
              >
                <Quote className="absolute -left-3 -top-1 w-6 h-6 text-primary-500/50 bg-slate-900 rounded-full p-1" />
                <p className="text-slate-300 leading-relaxed">
                  রসায়নকে শুধু একটি বিষয় নয়, বরং বোঝার ও উপভোগ করার একটি যাত্রা হিসেবে
                  তুলে ধরাই আমার লক্ষ্য। এই প্ল্যাটফর্মে সহজ ভাষায় নোট, ধারণা, কুইজ,
                  পর্যায় সারণি, বিজ্ঞানভিত্তিক তথ্য এবং শিক্ষামূলক কনটেন্ট প্রকাশ করা হয়,
                  যাতে শেখা হয় আরও সহজ, নির্ভুল ও আনন্দদায়ক।
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4"
              >
                <span className="text-lg font-bold gradient-text">
                  Chemistry Unfiltered
                </span>
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span className="text-slate-400 text-sm tracking-wide">
                  Laugh. Learn. React.
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
