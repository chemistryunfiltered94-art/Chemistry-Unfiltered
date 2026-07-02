"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Table2, BookOpen, Calculator, Beaker, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const bottomLinks = [
  { href: "/dashboard",     label: "হোম",         icon: Home,      exact: true  },
  { href: "/periodic-table",label: "পর্যায় সারণি", icon: Table2,    exact: false },
  { href: "/history",       label: "ইতিহাস",       icon: ScrollText,exact: false },
  { href: "/learn",         label: "বিষয়",        icon: BookOpen,  exact: false },
  { href: "/calculators",   label: "ক্যালকুলেটর",  icon: Calculator,exact: false },
  { href: "/virtual-lab",   label: "ভার্চুয়াল ল্যাব",icon: Beaker,  exact: false },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-700 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-6">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5",
                isActive ? "text-primary-400" : "text-slate-400"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none text-center px-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
