"use client";

// components/layout/Navbar.tsx
// NO framer-motion — CSS-only transitions to prevent GPU composite glitch on Android

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/shared/AuthProvider";
import { SearchModal } from "@/components/shared/SearchModal";
import { useSearchModal } from "@/hooks/useSearch";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import {
  Menu, X, Search, FlaskConical,
  HelpCircle, User, LogOut, LayoutDashboard,
  ChevronDown, Atom, FileText, Settings,
  Bookmark, ClipboardList,
} from "lucide-react";

const drawerLinks = [
  { href: "/articles",      label: "আর্টিকেল",        icon: FileText },
  { href: "/notes",         label: "নোটস",             icon: ClipboardList },
  { href: "/molecules",     label: "আণবিক দর্শক",      icon: Atom },
  { href: "/question-bank", label: "প্রশ্নব্যাংক",     icon: HelpCircle },
  { href: "/reactions",     label: "বিক্রিয়া ডেটাবেস", icon: FlaskConical },
];

export default function Navbar() {
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading }               = useAuth();
  const pathname                        = usePathname();
  const { isOpen: searchOpen, open: openSearch, close: closeSearch } = useSearchModal();

  const isLanding = pathname === "/";

  useEffect(() => {
    setDrawerOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
  };

  const Logo = (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg">
        <Image src="/logo.png" alt="Chemistry Unfiltered" width={36} height={36} className="w-full h-full object-cover" priority />
      </div>
      <div>
        <span className="font-bold text-lg gradient-text leading-none">Chemistry Unfiltered</span>
        <p className="text-xs text-slate-400 -mt-0.5 hidden sm:block">
          রসায়ন শেখার প্ল্যাটফর্ম
        </p>
      </div>
    </Link>
  );

  const HamburgerButton = (
    <button
      onClick={() => setDrawerOpen(!drawerOpen)}
      className="p-2 rounded-lg text-slate-400 flex-shrink-0"
      aria-label="মেনু"
    >
      {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  const UserAvatarMenu = !loading && (
    <>
      {user ? (
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden gradient-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-300">
              {user.name?.split(" ")[0]}
            </span>
            <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50">
              <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
                <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড
              </Link>
              <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
                <User className="w-4 h-4" /> প্রোফাইল
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-primary-400 hover:bg-slate-700">
                  <Settings className="w-4 h-4" /> অ্যাডমিন প্যানেল
                </Link>
              )}
              <hr className="border-slate-700" />
              <button onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-900/20">
                <LogOut className="w-4 h-4" /> লগআউট
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300">
            লগইন
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-white gradient-bg rounded-lg shadow-md">
            রেজিস্ট্রেশন
          </Link>
        </div>
      )}
    </>
  );

  // ─── LANDING PAGE ─────────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {Logo}
            </div>
          </div>
        </nav>
        <SearchModal isOpen={searchOpen} onClose={closeSearch} />
      </>
    );
  }

  // ─── INNER PAGES ──────────────────────────────────────────────────────────
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {Logo}
            <div className="flex items-center gap-1">
              {UserAvatarMenu}
              {HamburgerButton}
            </div>
          </div>
          <div className="pb-3">
            <button
              onClick={openSearch}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-400"
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">সার্চ করো... (টপিক, ফর্মুলা, প্রশ্ন)</span>
              <kbd className="hidden sm:inline-block text-xs bg-slate-700 border border-slate-600 rounded px-1.5 py-0.5">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Drawer — CSS only, no framer-motion height animation */}
        {drawerOpen && (
          <div className="bg-slate-900 border-t border-slate-700 overflow-y-auto overflow-x-hidden max-h-[60vh]">
            <div className="px-4 py-4 space-y-1">
              {drawerLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                      isActive
                        ? "bg-primary-900/30 text-primary-400"
                        : "text-slate-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {user?.role === "admin" && (
                <Link href="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-400">
                  <Settings className="w-5 h-5" /> অ্যাডমিন প্যানেল
                </Link>
              )}

              {user && (
                <Link href="/dashboard/bookmarks"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300">
                  <Bookmark className="w-5 h-5" /> সংরক্ষিত আইটেম
                </Link>
              )}

              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link href="/login"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium border border-slate-600 text-slate-300 rounded-xl">
                    লগইন
                  </Link>
                  <Link href="/register"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white gradient-bg rounded-xl">
                    রেজিস্ট্রেশন
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <SearchModal isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}
