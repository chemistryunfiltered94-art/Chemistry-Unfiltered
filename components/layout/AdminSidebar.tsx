"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, HelpCircle, FileText,
  Atom, FlaskConical, Users, Settings, ChevronRight,
  StickyNote, Layers, DatabaseZap,
} from "lucide-react";

const menuGroups = [
  {
    label: "ওভারভিউ",
    items: [
      { href: "/admin",          label: "ড্যাশবোর্ড",        icon: LayoutDashboard },
    ],
  },
  {
    label: "কন্টেন্ট",
    items: [
      { href: "/admin/seed-content", label: "কনটেন্ট ইমপোর্ট",  icon: DatabaseZap },
      { href: "/admin/chapters",     label: "অধ্যায়",            icon: Layers },
      { href: "/admin/topics",       label: "টপিক",              icon: BookOpen },
      { href: "/admin/articles",  label: "আর্টিকেল",          icon: FileText },
      { href: "/admin/notes",     label: "নোটস",              icon: StickyNote },
      { href: "/admin/formulas",  label: "ফর্মুলা",            icon: Atom },
      { href: "/admin/reactions", label: "বিক্রিয়া",           icon: FlaskConical },
      { href: "/admin/questions", label: "প্রশ্নব্যাংক",       icon: HelpCircle },
    ],
  },
  {
    label: "ব্যবস্থাপনা",
    items: [
      { href: "/admin/users",    label: "ব্যবহারকারী",         icon: Users },
      { href: "/admin/settings", label: "সেটিংস",              icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-700 flex-col z-30 pt-[110px]">
      {/* Menu */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "gradient-bg text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: View Site */}
      <div className="p-3 border-t border-slate-700">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          সাইট দেখো
        </Link>
      </div>
    </aside>
  );
}
