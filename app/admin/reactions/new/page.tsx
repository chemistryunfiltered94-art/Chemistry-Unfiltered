"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";

const categories = [
  { id: "industrial", name: "শিল্প বিক্রিয়া" },
  { id: "organic", name: "জৈব বিক্রিয়া" },
  { id: "inorganic", name: "অজৈব বিক্রিয়া" },
  { id: "physical", name: "ভৌত বিক্রিয়া" },
  { id: "analytical", name: "বিশ্লেষণী বিক্রিয়া" },
];

export default function AddReactionPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [equation, setEquation] = useState("");
  const [category, setCategory] = useState("organic");
  const [type, setType] = useState("");
  const [temperature, setTemperature] = useState("");
  const [pressure, setPressure] = useState("");
  const [other, setOther] = useState("");
  const [catalyst, setCatalyst] = useState("");
  const [mechanism, setMechanism] = useState([""]);
  const [products, setProducts] = useState([""]);
  const [applications, setApplications] = useState([""]);
  const [deltaH, setDeltaH] = useState("");
  const [thermoType, setThermoType] = useState("exothermic");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const addItem = (arr: string[], set: (v: string[]) => void) => set([...arr, ""]);
  const removeItem = (arr: string[], set: (v: string[]) => void, i: number) => set(arr.filter((_, idx) => idx !== i));
  const updateItem = (arr: string[], set: (v: string[]) => void, i: number, val: string) =>
    set(arr.map((item, idx) => (idx === i ? val : item)));

  const handleSave = async () => {
    if (!name.trim() || !equation.trim()) return;
    setSaving(true);

    const conditions: { temperature?: string; pressure?: string; other?: string } = {};
    if (temperature.trim()) conditions.temperature = temperature.trim();
    if (pressure.trim()) conditions.pressure = pressure.trim();
    if (other.trim()) conditions.other = other.trim();

    const payload: Record<string, unknown> = {
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      equation: equation.trim(),
      category,
      type: type.trim(),
      conditions,
      mechanism: mechanism.filter((m) => m.trim()),
      products: products.filter((p) => p.trim()),
      applications: applications.filter((a) => a.trim()),
    };
    if (catalyst.trim()) payload.catalyst = catalyst.trim();
    if (deltaH.trim()) {
      payload.thermodynamics = { deltaH: parseFloat(deltaH), unit: "kJ/mol", type: thermoType };
    }

    const id = await createDocument("reactions", payload);
    setSaving(false);

    if (id) {
      setSuccess(true);
      showToast("success", "বিক্রিয়া সফলভাবে সংরক্ষিত হয়েছে।");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      showToast("error", "সংরক্ষণ করা যায়নি। admin role বা Firestore rules যাচাই করো।");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-6">
          <h1 className="text-2xl font-bold text-white">নতুন বিক্রিয়া যোগ করো</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">নাম (বাংলা) *</label>
              <input value={nameBn} onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: হেবার পদ্ধতি"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">নাম (English) *</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Haber Process"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">সমীকরণ *</label>
              <input value={equation} onChange={(e) => setEquation(e.target.value)}
                placeholder="N₂ + 3H₂ ⇌ 2NH₃"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white font-mono placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">বিষয়</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">ধরন (Type)</label>
              <input value={type} onChange={(e) => setType(e.target.value)}
                placeholder="synthesis / oxidation / substitution..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">তাপমাত্রা</label>
              <input value={temperature} onChange={(e) => setTemperature(e.target.value)}
                placeholder="450°C"
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">চাপ</label>
              <input value={pressure} onChange={(e) => setPressure(e.target.value)}
                placeholder="150-300 atm"
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">অন্যান্য শর্ত</label>
              <input value={other} onChange={(e) => setOther(e.target.value)}
                placeholder="ঐচ্ছিক"
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">অনুঘটক (Catalyst)</label>
            <input value={catalyst} onChange={(e) => setCatalyst(e.target.value)}
              placeholder="আয়রন (Fe) + প্রমোটার"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Mechanism */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">বিক্রিয়ার কৌশল (ধাপে ধাপে)</label>
              <button onClick={() => addItem(mechanism, setMechanism)} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {mechanism.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-6 h-9 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                  <input value={m} onChange={(e) => updateItem(mechanism, setMechanism, i, e.target.value)}
                    placeholder="ধাপের বিবরণ"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {mechanism.length > 1 && (
                    <button onClick={() => removeItem(mechanism, setMechanism, i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">পণ্য (Products)</label>
              <button onClick={() => addItem(products, setProducts)} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {products.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input value={p} onChange={(e) => updateItem(products, setProducts, i, e.target.value)}
                    placeholder="পণ্যের নাম"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {products.length > 1 && (
                    <button onClick={() => removeItem(products, setProducts, i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">প্রয়োগ (Applications)</label>
              <button onClick={() => addItem(applications, setApplications)} className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                <Plus className="w-3.5 h-3.5" /> যোগ করো
              </button>
            </div>
            <div className="space-y-2">
              {applications.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <input value={a} onChange={(e) => updateItem(applications, setApplications, i, e.target.value)}
                    placeholder="প্রয়োগের ক্ষেত্র"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
                  />
                  {applications.length > 1 && (
                    <button onClick={() => removeItem(applications, setApplications, i)} className="text-slate-500 hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Thermodynamics */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">ΔH (kJ/mol)</label>
              <input type="number" value={deltaH} onChange={(e) => setDeltaH(e.target.value)}
                placeholder="-92"
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">ধরন</label>
              <select value={thermoType} onChange={(e) => setThermoType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500">
                <option value="exothermic">তাপমোচী (Exothermic)</option>
                <option value="endothermic">তাপগ্রাহী (Endothermic)</option>
              </select>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || !name.trim() || !equation.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
             success ? "✅ সফলভাবে সংরক্ষিত হয়েছে!" :
             <><Save className="w-5 h-5" /> বিক্রিয়া সংরক্ষণ করো</>}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
