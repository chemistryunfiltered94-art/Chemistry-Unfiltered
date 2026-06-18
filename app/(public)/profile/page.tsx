"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { updateUser } from "@/lib/firestore";
import {
  User, Mail, Calendar, Shield, Edit2, Save, X,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode]   = useState(false);
  const [name, setName]           = useState("");
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change
  const [showPwSection, setShowPwSection] = useState(false);
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [pwSaving,   setPwSaving]   = useState(false);
  const [pwMsg,      setPwMsg]      = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setName(user.name || "");
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await updateUser(user.uid, { name: name.trim() });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name.trim() });
      }
      setSaveMsg({ type: "success", text: "প্রোফাইল সফলভাবে আপডেট হয়েছে!" });
      setEditMode(false);
    } catch {
      setSaveMsg({ type: "error", text: "আপডেট করতে সমস্যা হয়েছে।" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "নতুন পাসওয়ার্ড দুটি মিলছে না।" });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: "error", text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPw);
      setPwMsg({ type: "success", text: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setShowPwSection(false);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/wrong-password") {
        setPwMsg({ type: "error", text: "বর্তমান পাসওয়ার্ড ভুল।" });
      } else {
        setPwMsg({ type: "error", text: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" });
      }
    } finally {
      setPwSaving(false);
    }
  };

  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
    : "অজানা";

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">প্রোফাইল</h1>

        {/* Avatar + Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-5"
        >
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold shadow-xl flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{user.email}</p>
                  <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user.role === "admin" ? "অ্যাডমিন" : "শিক্ষার্থী"}
                  </span>
                </div>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> সম্পাদনা
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editMode ? (
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  নাম
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  সংরক্ষণ করো
                </button>
                <button
                  onClick={() => { setEditMode(false); setName(user.name || ""); }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <X className="w-4 h-4" /> বাতিল
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-5">
              {[
                { icon: Mail,     label: "ইমেইল",       value: user.email },
                { icon: Calendar, label: "যোগ দিয়েছো",  value: joinDate },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {saveMsg && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
              saveMsg.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
            }`}>
              {saveMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {saveMsg.text}
            </div>
          )}
        </motion.div>

        {/* Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">নিরাপত্তার জন্য নিয়মিত পরিবর্তন করো</p>
              </div>
            </div>
            <button
              onClick={() => setShowPwSection(!showPwSection)}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              {showPwSection ? "বাতিল" : "পরিবর্তন করো"}
            </button>
          </div>

          {showPwSection && (
            <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
              {[
                { label: "বর্তমান পাসওয়ার্ড", val: currentPw, set: setCurrentPw },
                { label: "নতুন পাসওয়ার্ড",   val: newPw,     set: setNewPw },
                { label: "নতুন পাসওয়ার্ড নিশ্চিত করো", val: confirmPw, set: setConfirmPw },
              ].map((f) => (
                <div key={f.label} className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {f.label}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              {pwMsg && (
                <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
                  pwMsg.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                }`}>
                  {pwMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {pwMsg.text}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={pwSaving}
                className="w-full py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
              >
                {pwSaving ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করো"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
