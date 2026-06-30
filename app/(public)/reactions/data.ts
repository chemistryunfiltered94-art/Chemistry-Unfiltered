export const categories = [
  { key: "all",         label: "সব বিক্রিয়া",          emoji: "⚗️" },
  { key: "organic",     label: "জৈব (Organic)",           emoji: "🌿" },
  { key: "inorganic",   label: "অজৈব (Inorganic)",        emoji: "🔷" },
  { key: "industrial",  label: "শিল্প (Industrial)",      emoji: "🏭" },
  { key: "biochemical", label: "জৈব রাসায়নিক (Biochem)", emoji: "🧬" },
  { key: "nuclear",     label: "নিউক্লিয় (Nuclear)",     emoji: "☢️" },
];

// Organic sub-category groups for display
export const organicGroups = [
  {
    label: "Substitution",
    subTypes: ["substitution-sn1", "substitution-sn2"],
  },
  {
    label: "Elimination",
    subTypes: ["elimination-e1", "elimination-e2"],
  },
  {
    label: "Addition",
    subTypes: ["addition-hydrogenation", "addition-halogenation", "addition-hydrohalogenation"],
  },
  {
    label: "Oxidation",
    subTypes: ["oxidation-kmno4", "oxidation-ozonolysis"],
  },
  {
    label: "Named Reactions",
    subTypes: [
      "named-aldol", "named-cannizzaro", "named-friedel-crafts",
      "named-grignard", "named-wurtz", "named-sandmeyer",
      "named-reimer-tiemann", "named-claisen",
    ],
  },
];
