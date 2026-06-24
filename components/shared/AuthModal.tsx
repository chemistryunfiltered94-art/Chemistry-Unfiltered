"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Modal } from "@/components/ui/Modal";
import { X, Mail, Lock, Eye, EyeOff, User, LogIn, FlaskConical } from "lucide-react";

type Tab = "login" | "register";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Which tab to open first — default "login" */
  defaultTab?: Tab;
}

const GoogleButton = ({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-slate-800 rounded-xl font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    {label}
  </button>
);

const Divider = () => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-slate-700" />
    <span className="text-slate-500 text-sm">অথবা</span>
    <div className="flex-1 h-px bg-slate-700" />
  </div>
);

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const router = useRouter();

  // ─── Login state ───────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ─── Register state ────────────────────────────────────────
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const handleClose = () => {
    // Reset on close so reopening feels fresh.
    setLoginEmail(""); setLoginPassword(""); setLoginError("");
    setRegName(""); setRegEmail(""); setRegPassword(""); setRegError("");
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoginLoading(true); setLoginError("");
    try {
      const provider = new GoogleAuthProvider();
      // signInWithPopup is unreliable on mobile browsers (gets silently
      // blocked). signInWithRedirect works everywhere — the browser
      // navigates to Google, then comes back and AuthProvider picks up
      // the result via getRedirectResult().
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setLoginError("Google লগইন করতে সমস্যা হয়েছে।");
      setLoginLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true); setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      handleClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setLoginError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
      } else if (code === "auth/too-many-requests") {
        setLoginError("অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।");
      } else {
        setLoginError("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      }
    } finally { setLoginLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) { setRegError("নাম দাও।"); return; }
    setRegLoading(true); setRegError("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: regName.trim(),
        email: regEmail,
        role: "student",
        createdAt: serverTimestamp(),
      });
      handleClose();
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setRegError("এই ইমেইলে আগেই অ্যাকাউন্ট আছে।");
      } else if (code === "auth/weak-password") {
        setRegError("পাসওয়ার্ড আরো শক্তিশালী করো (কমপক্ষে ৬ অক্ষর)।");
      } else {
        setRegError("রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
      }
    } finally { setRegLoading(false); }
  };

  const isLoading = loginLoading || regLoading;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" showCloseButton={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Chemistry Unfiltered</span>
        </div>
        <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-700/50 rounded-xl p-1 mb-6">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t
                ? "gradient-bg text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t === "login" ? "লগইন" : "রেজিস্ট্রেশন"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <GoogleButton onClick={handleGoogleLogin} loading={isLoading} label="Google দিয়ে লগইন করো" />
            <Divider />
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">ইমেইল</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required
                    placeholder="তোমার ইমেইল"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showLoginPass ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required
                    placeholder="পাসওয়ার্ড"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {loginError && (
                <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{loginError}</p>
              )}
              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                {loginLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><LogIn className="w-4 h-4" /> লগইন করো</>}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <GoogleButton onClick={handleGoogleLogin} loading={isLoading} label="Google দিয়ে রেজিস্ট্রেশন করো" />
            <Divider />
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">নাম</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={regName} onChange={(e) => setRegName(e.target.value)} required
                    placeholder="তোমার নাম"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">ইমেইল</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required
                    placeholder="তোমার ইমেইল"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showRegPass ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {regError && (
                <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{regError}</p>
              )}
              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity">
                {regLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : "রেজিস্ট্রেশন করো"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
