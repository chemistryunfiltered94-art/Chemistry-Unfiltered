"use client";

import { useState } from "react";
import { useAuth } from "@/components/shared/AuthProvider";
import { createDocument } from "@/lib/firestore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";

// ─── Master category + subtype map (তোমার দেওয়া তালিকা) ────────────
const REACTION_TAXONOMY = [
  {
    id: "organic",
    label: "জৈব বিক্রিয়া (Organic)",
    subTypes: [
      { id: "substitution-sn1",            label: "Substitution — SN1" },
      { id: "substitution-sn2",            label: "Substitution — SN2" },
      { id: "elimination-e1",              label: "Elimination — E1" },
      { id: "elimination-e2",              label: "Elimination — E2" },
      { id: "addition-hydrogenation",      label: "Addition — Hydrogenation" },
      { id: "addition-halogenation",       label: "Addition — Halogenation" },
      { id: "addition-hydrohalogenation",  label: "Addition — Hydrohalogenation" },
      { id: "oxidation-kmno4",             label: "Oxidation — KMnO₄ Oxidation" },
      { id: "oxidation-ozonolysis",        label: "Oxidation — Ozonolysis" },
      { id: "named-aldol",                 label: "Named — Aldol Condensation" },
      { id: "named-cannizzaro",            label: "Named — Cannizzaro Reaction" },
      { id: "named-friedel-crafts",        label: "Named — Friedel-Crafts" },
      { id: "named-grignard",              label: "Named — Grignard Reaction" },
      { id: "named-wurtz",                 label: "Named — Wurtz Reaction" },
      { id: "named-sandmeyer",             label: "Named — Sandmeyer Reaction" },
      { id: "named-reimer-tiemann",        label: "Named — Reimer-Tiemann" },
      { id: "named-claisen",               label: "Named — Claisen Condensation" },
    ],
  },
  {
    id: "inorganic",
    label: "অজৈব বিক্রিয়া (Inorganic)",
    subTypes: [
      { id: "neutralization",     label: "Neutralization" },
      { id: "redox",              label: "Redox Reactions" },
      { id: "precipitation",      label: "Precipitation Reactions" },
      { id: "displacement",       label: "Displacement Reactions" },
      { id: "complex-formation",  label: "Complex Formation" },
    ],
  },
  {
    id: "industrial",
    label: "শিল্প বিক্রিয়া (Industrial)",
    subTypes: [
      { id: "haber-process",    label: "Haber Process" },
      { id: "contact-process",  label: "Contact Process" },
      { id: "ostwald-process",  label: "Ostwald Process" },
      { id: "hall-heroult",     label: "Hall-Héroult Process" },
      { id: "solvay-process",   label: "Solvay Process" },
    ],
  },
  {
    id: "biochemical",
    label: "জৈব রাসায়নিক (Biochemical)",
    subTypes: [
      { id: "glycolysis",     label: "Glycolysis" },
      { id: "krebs-cycle",    label: "Krebs Cycle" },
      { id: "photosynthesis", label: "Photosynthesis" },
      { id: "respiration",    label: "Respiration" },
    ],
  },
  {
    id: "nuclear",
    label: "নিউক্লিয় বিক্রিয়া (Nuclear)",
    subTypes: [
      { id: "alpha-decay",  label: "Alpha Decay" },
      { id: "beta-decay",   label: "Beta Decay" },
      { id: "gamma-decay",  label: "Gamma Decay" },
      { id: "fission",      label: "Nuclear Fission" },
      { id: "fusion",       label: "Nuclear Fusion" },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────
const addItem    = (arr: string[], set: (v: string[]) => void) => set([...arr, ""]);
const removeItem = (arr: string[], set: (v: string[]) => void, i: number) => set(arr.filter((_, idx) => idx !== i));
const updateItem = (arr: string[], set: (v: string[]) => void, i: number, val: string) =>
  set(arr.map((item, idx) => (idx === i ? val : item)));

function ArrayField({
  label, items, setItems, placeholder,
}: { label: string; items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <button
          type="button"
          onClick={() => addItem(items, setItems)}
          className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300"
        >
          <Plus className="w-3.5 h-3.5" /> যোগ করো
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="w-6 h-9 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
            <input
              value={item}
              onChange={(e) => updateItem(items, setItems, i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(items, setItems, i)} className="text-slate-500 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AddReactionPage() {
  const { isAdmin } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // Basic
  const [name,     setName]     = useState("");
  const [nameBn,   setNameBn]   = useState("");
  const [equation, setEquation] = useState("");
  const [category, setCategory] = useState("organic");
  const [subType,  setSubType]  = useState("substitution-sn1");
  const [type,     setType]     = useState("");   // display label override

  // Conditions
  const [temperature, setTemperature] = useState("");
  const [pressure,    setPressure]    = useState("");
  const [other,       setOther]       = useState("");
  const [catalyst,    setCatalyst]    = useState("");

  // Arrays
  const [mechanism,     setMechanism]     = useState([""]);
  const [intermediates, setIntermediates] = useState([""]);
  const [products,      setProducts]      = useState([""]);
  const [applications,  setApplications]  = useState([""]);
  const [industrialUses,setIndustrialUses]= useState([""]);
  const [safetyNotes,   setSafetyNotes]   = useState([""]);

  // Thermodynamics
  const [deltaH,     setDeltaH]     = useState("");
  const [thermoType, setThermoType] = useState<"exothermic"|"endothermic">("exothermic");

  // Nuclear
  const [halfLife,        setHalfLife]        = useState("");
  const [radiation,       setRadiation]       = useState("");
  const [parentNuclide,   setParentNuclide]   = useState("");
  const [daughterNuclide, setDaughterNuclide] = useState("");
  const [energyMeV,       setEnergyMeV]       = useState("");

  // Biochemical
  const [atp,       setAtp]       = useState("");
  const [location,  setLocation]  = useState("");
  const [enzymes,   setEnzymes]   = useState([""]);

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);

  // derive subTypes for selected category
  const currentCat   = REACTION_TAXONOMY.find((c) => c.id === category);
  const currentSubs  = currentCat?.subTypes ?? [];

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const subs = REACTION_TAXONOMY.find((c) => c.id === cat)?.subTypes ?? [];
    setSubType(subs[0]?.id ?? "");
  };

  const handleSave = async () => {
    if (!name.trim() || !equation.trim()) return;
    setSaving(true);

    const conditions: Record<string,string> = {};
    if (temperature.trim()) conditions.temperature = temperature.trim();
    if (pressure.trim())    conditions.pressure    = pressure.trim();
    if (other.trim())       conditions.other       = other.trim();

    const payload: Record<string, unknown> = {
      name:         name.trim(),
      nameBn:       nameBn.trim() || name.trim(),
      equation:     equation.trim(),
      category,
      subType:      subType || undefined,
      type:         type.trim() || currentSubs.find((s) => s.id === subType)?.label || "",
      conditions,
      mechanism:     mechanism.filter((m) => m.trim()),
      intermediates: intermediates.filter((m) => m.trim()),
      products:      products.filter((p) => p.trim()),
      applications:  applications.filter((a) => a.trim()),
      industrialUses: industrialUses.filter((u) => u.trim()),
      safetyNotes:   safetyNotes.filter((s) => s.trim()),
    };

    if (catalyst.trim()) payload.catalyst = catalyst.trim();

    if (deltaH.trim()) {
      payload.thermodynamics = { deltaH: parseFloat(deltaH), unit: "kJ/mol", type: thermoType };
    }

    if (category === "nuclear") {
      const nd: Record<string,unknown> = {};
      if (halfLife)        nd.halfLife        = halfLife.trim();
      if (radiation)       nd.radiation       = radiation.trim();
      if (parentNuclide)   nd.parentNuclide   = parentNuclide.trim();
      if (daughterNuclide) nd.daughterNuclide = daughterNuclide.trim();
      if (energyMeV)       nd.energyMeV       = parseFloat(energyMeV);
      if (Object.keys(nd).length) payload.nuclearData = nd;
    }

    if (category === "biochemical") {
      const bd: Record<string,unknown> = {};
      if (atp)      bd.atp      = atp.trim();
      if (location) bd.location = location.trim();
      const enz = enzymes.filter((e) => e.trim());
      if (enz.length) bd.enzymes = enz;
      if (Object.keys(bd).length) payload.biochemData = bd;
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

  const inputCls = "w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary-500";
  const smInputCls = "w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-primary-500";
  const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> অ্যাডমিন প্যানেল
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 lg:p-8 space-y-7">
          <h1 className="text-2xl font-bold text-white">নতুন বিক্রিয়া যোগ করো</h1>

          {/* ── Section 1: Basic Info ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              ১. মূল তথ্য
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>নাম (বাংলা)</label>
                <input value={nameBn} onChange={(e) => setNameBn(e.target.value)} placeholder="যেমন: গ্রিগনার্ড বিক্রিয়া" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Name (English) *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Grignard Reaction" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>সমীকরণ (Equation) *</label>
                <input value={equation} onChange={(e) => setEquation(e.target.value)} placeholder="RX + Mg → RMgX" className={`${inputCls} font-mono`} />
              </div>
            </div>
          </section>

          {/* ── Section 2: Category & SubType ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              ২. বিভাগ ও ধরন
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>বিভাগ (Category)</label>
                <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className={inputCls}>
                  {REACTION_TAXONOMY.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>উপ-ধরন (Sub-type)</label>
                <select value={subType} onChange={(e) => setSubType(e.target.value)} className={inputCls}>
                  {currentSubs.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>কাস্টম ধরন লেবেল (ঐচ্ছিক — না দিলে subtype label ব্যবহার হবে)</label>
                <input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Nucleophilic Substitution" className={inputCls} />
              </div>
            </div>
          </section>

          {/* ── Section 3: Conditions ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              ৩. বিক্রিয়ার শর্ত (Conditions)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>তাপমাত্রা (Temperature)</label>
                <input value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="450°C" className={smInputCls} />
              </div>
              <div>
                <label className={labelCls}>চাপ (Pressure)</label>
                <input value={pressure} onChange={(e) => setPressure(e.target.value)} placeholder="150-300 atm" className={smInputCls} />
              </div>
              <div>
                <label className={labelCls}>অন্যান্য শর্ত</label>
                <input value={other} onChange={(e) => setOther(e.target.value)} placeholder="anhydrous ether" className={smInputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>অনুঘটক (Catalyst)</label>
              <input value={catalyst} onChange={(e) => setCatalyst(e.target.value)} placeholder="Fe, Ni, AlCl₃..." className={inputCls} />
            </div>
          </section>

          {/* ── Section 4: Mechanism & Intermediates ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              ৪. মেকানিজম ও ইন্টারমিডিয়েট
            </h2>
            <ArrayField label="বিক্রিয়ার কৌশল / Mechanism (ধাপে ধাপে)" items={mechanism} setItems={setMechanism} placeholder="ধাপের বিবরণ লেখো" />
            <ArrayField label="ইন্টারমিডিয়েট যৌগ (Intermediates)" items={intermediates} setItems={setIntermediates} placeholder="যেমন: carbocation, carbanion, free radical" />
          </section>

          {/* ── Section 5: Products & Applications ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              ৫. পণ্য ও প্রয়োগ
            </h2>
            <ArrayField label="পণ্য (Products)" items={products} setItems={setProducts} placeholder="পণ্যের নাম ও সূত্র" />
            <ArrayField label="প্রয়োগ (Applications)" items={applications} setItems={setApplications} placeholder="প্রয়োগের ক্ষেত্র" />
            <ArrayField label="শিল্প ব্যবহার (Industrial Uses)" items={industrialUses} setItems={setIndustrialUses} placeholder="কোন শিল্পে ব্যবহৃত হয়" />
            <ArrayField label="নিরাপত্তা তথ্য (Safety Notes)" items={safetyNotes} setItems={setSafetyNotes} placeholder="বিপদজনক পদার্থ, সতর্কতা" />
          </section>

          {/* ── Section 6: Thermodynamics ── */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-widest border-b border-slate-700 pb-2">
              ৬. তাপগতীয় ধর্ম (Thermodynamics)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ΔH (kJ/mol)</label>
                <input type="number" value={deltaH} onChange={(e) => setDeltaH(e.target.value)} placeholder="-92" className={smInputCls} />
              </div>
              <div>
                <label className={labelCls}>ধরন</label>
                <select value={thermoType} onChange={(e) => setThermoType(e.target.value as "exothermic"|"endothermic")} className={smInputCls}>
                  <option value="exothermic">তাপমোচী (Exothermic)</option>
                  <option value="endothermic">তাপগ্রাহী (Endothermic)</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Section 7: Nuclear (conditional) ── */}
          {category === "nuclear" && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest border-b border-slate-700 pb-2">
                ৭. নিউক্লিয় তথ্য (Nuclear Data)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>অর্ধজীবন (Half-life)</label>
                  <input value={halfLife} onChange={(e) => setHalfLife(e.target.value)} placeholder="1600 years" className={smInputCls} />
                </div>
                <div>
                  <label className={labelCls}>বিকিরণ ধরন (Radiation)</label>
                  <input value={radiation} onChange={(e) => setRadiation(e.target.value)} placeholder="alpha particle" className={smInputCls} />
                </div>
                <div>
                  <label className={labelCls}>মূল নিউক্লাইড (Parent)</label>
                  <input value={parentNuclide} onChange={(e) => setParentNuclide(e.target.value)} placeholder="²²⁶Ra" className={smInputCls} />
                </div>
                <div>
                  <label className={labelCls}>উৎপন্ন নিউক্লাইড (Daughter)</label>
                  <input value={daughterNuclide} onChange={(e) => setDaughterNuclide(e.target.value)} placeholder="²²²Rn" className={smInputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>শক্তি (MeV)</label>
                  <input type="number" value={energyMeV} onChange={(e) => setEnergyMeV(e.target.value)} placeholder="4.87" className={smInputCls} />
                </div>
              </div>
            </section>
          )}

          {/* ── Section 8: Biochemical (conditional) ── */}
          {category === "biochemical" && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-green-400 uppercase tracking-widest border-b border-slate-700 pb-2">
                ৭. জৈব রাসায়নিক তথ্য (Biochem Data)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>ATP উৎপাদন / ব্যয়</label>
                  <input value={atp} onChange={(e) => setAtp(e.target.value)} placeholder="Net: 2 ATP" className={smInputCls} />
                </div>
                <div>
                  <label className={labelCls}>কোষের অবস্থান (Location)</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cytoplasm / Mitochondria" className={smInputCls} />
                </div>
              </div>
              <ArrayField label="এনজাইম (Enzymes)" items={enzymes} setItems={setEnzymes} placeholder="enzyme নাম" />
            </section>
          )}

          {/* ── Save Button ── */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim() || !equation.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              "✅ সফলভাবে সংরক্ষিত হয়েছে!"
            ) : (
              <><Save className="w-5 h-5" /> বিক্রিয়া সংরক্ষণ করো</>
            )}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}
