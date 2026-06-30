// lib/molecules.ts
// অণুর ডেটাসেট — /molecules পেজ এবং Topic-এর "3D গঠন" সেকশন দুটোই এই একই ডেটা শেয়ার করে।

export interface MoleculeAtom {
  el: string;
  x: number;
  y: number;
  r: number;
  color: string;
}

export interface Molecule {
  id: string;
  name: string;
  nameBn: string;
  formula: string;
  desc: string;
  atoms: MoleculeAtom[];
  bonds: [number, number][];
}

export const molecules: Molecule[] = [
  { id:"water",   name:"Water",   nameBn:"পানি",               formula:"H₂O",       desc:"সার্বজনীন দ্রাবক। দুটি H-O-H বন্ধন, কোণ ১০৪.৫°",   atoms:[{el:"O",x:100,y:80,r:22,color:"#ef4444"},{el:"H",x:65,y:120,r:14,color:"#94a3b8"},{el:"H",x:135,y:120,r:14,color:"#94a3b8"}], bonds:[[0,1],[0,2]] },
  { id:"methane",  name:"Methane", nameBn:"মিথেন",              formula:"CH₄",       desc:"প্রাকৃতিক গ্যাসের মূল উপাদান। টেট্রাহেড্রাল গঠন।", atoms:[{el:"C",x:100,y:90,r:20,color:"#64748b"},{el:"H",x:60,y:60,r:13,color:"#94a3b8"},{el:"H",x:140,y:60,r:13,color:"#94a3b8"},{el:"H",x:60,y:120,r:13,color:"#94a3b8"},{el:"H",x:140,y:120,r:13,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3],[0,4]] },
  { id:"ammonia",  name:"Ammonia", nameBn:"অ্যামোনিয়া",        formula:"NH₃",       desc:"হেবার পদ্ধতিতে তৈরি। ত্রিকোণাকার পিরামিড গঠন।",   atoms:[{el:"N",x:100,y:75,r:20,color:"#3b82f6"},{el:"H",x:65,y:115,r:13,color:"#94a3b8"},{el:"H",x:135,y:115,r:13,color:"#94a3b8"},{el:"H",x:100,y:130,r:13,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3]] },
  { id:"co2",     name:"Carbon Dioxide",nameBn:"কার্বন ডাইঅক্সাইড",formula:"CO₂",desc:"গ্রিনহাউস গ্যাস। রৈখিক গঠন, দুটি C=O দ্বিবন্ধন।",    atoms:[{el:"O",x:50,y:95,r:22,color:"#ef4444"},{el:"C",x:100,y:95,r:18,color:"#64748b"},{el:"O",x:150,y:95,r:22,color:"#ef4444"}], bonds:[[0,1],[1,2]] },
  { id:"benzene", name:"Benzene",  nameBn:"বেঞ্জিন",            formula:"C₆H₆",     desc:"আরোমাটিক যৌগ। ষড়ভুজাকার, ডিলোকালাইজড π ইলেকট্রন।", atoms:[{el:"C",x:100,y:55,r:16,color:"#64748b"},{el:"C",x:130,y:73,r:16,color:"#64748b"},{el:"C",x:130,y:107,r:16,color:"#64748b"},{el:"C",x:100,y:125,r:16,color:"#64748b"},{el:"C",x:70,y:107,r:16,color:"#64748b"},{el:"C",x:70,y:73,r:16,color:"#64748b"},{el:"H",x:100,y:33,r:10,color:"#94a3b8"},{el:"H",x:148,y:61,r:10,color:"#94a3b8"},{el:"H",x:148,y:119,r:10,color:"#94a3b8"},{el:"H",x:100,y:147,r:10,color:"#94a3b8"},{el:"H",x:52,y:119,r:10,color:"#94a3b8"},{el:"H",x:52,y:61,r:10,color:"#94a3b8"}], bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]] },
  { id:"ethanol", name:"Ethanol",  nameBn:"ইথানল (অ্যালকোহল)",  formula:"C₂H₅OH",   desc:"পানীয় অ্যালকোহল। হাইড্রোক্সিল গ্রুপ (-OH) সহ।",   atoms:[{el:"C",x:70,y:85,r:18,color:"#64748b"},{el:"C",x:110,y:85,r:18,color:"#64748b"},{el:"O",x:140,y:65,r:20,color:"#ef4444"},{el:"H",x:55,y:65,r:11,color:"#94a3b8"},{el:"H",x:55,y:105,r:11,color:"#94a3b8"},{el:"H",x:75,y:110,r:11,color:"#94a3b8"},{el:"H",x:115,y:110,r:11,color:"#94a3b8"},{el:"H",x:125,y:105,r:11,color:"#94a3b8"},{el:"H",x:155,y:52,r:11,color:"#94a3b8"}], bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8]] },
  { id:"hydrogen", name:"Hydrogen", nameBn:"হাইড্রোজেন", formula:"H₂", desc:"সবচেয়ে সরল ও লাইটেস্ট অণু। একটি একক H-H বন্ধন।", atoms:[{el:"H",x:70,y:90,r:16,color:"#94a3b8"},{el:"H",x:130,y:90,r:16,color:"#94a3b8"}], bonds:[[0,1]] },
  { id:"oxygen", name:"Oxygen", nameBn:"অক্সিজেন", formula:"O₂", desc:"শ্বসনের জন্য অপরিহার্য গ্যাস। একটি দ্বিবন্ধন (O=O)।", atoms:[{el:"O",x:65,y:90,r:22,color:"#ef4444"},{el:"O",x:135,y:90,r:22,color:"#ef4444"}], bonds:[[0,1]] },
  { id:"nitrogen", name:"Nitrogen", nameBn:"নাইট্রোজেন", formula:"N₂", desc:"বায়ুমণ্ডলের প্রধান উপাদান (৭৮%)। ট্রিপল বন্ধন (N≡N), অত্যন্ত স্থিতিশীল।", atoms:[{el:"N",x:65,y:90,r:20,color:"#3b82f6"},{el:"N",x:135,y:90,r:20,color:"#3b82f6"}], bonds:[[0,1]] },
  { id:"co", name:"Carbon Monoxide", nameBn:"কার্বন মনোক্সাইড", formula:"CO", desc:"বিষাক্ত গ্যাস, অসম্পূর্ণ দহনে উৎপন্ন হয়। ট্রিপল বন্ধন (C≡O)।", atoms:[{el:"C",x:65,y:90,r:19,color:"#64748b"},{el:"O",x:135,y:90,r:21,color:"#ef4444"}], bonds:[[0,1]] },
  { id:"hcl", name:"Hydrogen Chloride", nameBn:"হাইড্রোজেন ক্লোরাইড", formula:"HCl", desc:"তীব্র এসিড। পানিতে দ্রবীভূত হয়ে হাইড্রোক্লোরিক এসিড গঠন করে।", atoms:[{el:"H",x:60,y:90,r:14,color:"#94a3b8"},{el:"Cl",x:135,y:90,r:23,color:"#22c55e"}], bonds:[[0,1]] },
  { id:"nacl", name:"Sodium Chloride", nameBn:"সোডিয়াম ক্লোরাইড", formula:"NaCl", desc:"সাধারণ লবণ। আয়নিক বন্ধনে গঠিত (Na⁺ এবং Cl⁻)।", atoms:[{el:"Na",x:65,y:90,r:21,color:"#a78bfa"},{el:"Cl",x:135,y:90,r:23,color:"#22c55e"}], bonds:[[0,1]] },
  { id:"h2s", name:"Hydrogen Sulfide", nameBn:"হাইড্রোজেন সালফাইড", formula:"H₂S", desc:"পচা ডিমের গন্ধযুক্ত বিষাক্ত গ্যাস। বাঁকা (bent) আণবিক গঠন।", atoms:[{el:"S",x:100,y:75,r:21,color:"#eab308"},{el:"H",x:65,y:120,r:14,color:"#94a3b8"},{el:"H",x:135,y:120,r:14,color:"#94a3b8"}], bonds:[[0,1],[0,2]] },
  { id:"ozone", name:"Ozone", nameBn:"ওজোন", formula:"O₃", desc:"ওজোন স্তর গঠন করে, UV রশ্মি শোষণ করে। বাঁকা (bent) গঠন।", atoms:[{el:"O",x:55,y:115,r:19,color:"#ef4444"},{el:"O",x:100,y:65,r:19,color:"#ef4444"},{el:"O",x:145,y:115,r:19,color:"#ef4444"}], bonds:[[0,1],[1,2]] },
  { id:"h2o2", name:"Hydrogen Peroxide", nameBn:"হাইড্রোজেন পার-অক্সাইড", formula:"H₂O₂", desc:"জীবাণুনাশক হিসেবে ব্যবহৃত হয়। O-O একক বন্ধন, অস্থিতিশীল।", atoms:[{el:"H",x:35,y:65,r:12,color:"#94a3b8"},{el:"O",x:75,y:95,r:18,color:"#ef4444"},{el:"O",x:125,y:95,r:18,color:"#ef4444"},{el:"H",x:165,y:65,r:12,color:"#94a3b8"}], bonds:[[0,1],[1,2],[2,3]] },
  { id:"ethylene", name:"Ethylene", nameBn:"ইথিলিন", formula:"C₂H₄", desc:"পলিথিন তৈরির মূল উপাদান। C=C দ্বিবন্ধনযুক্ত।", atoms:[{el:"C",x:80,y:90,r:18,color:"#64748b"},{el:"C",x:120,y:90,r:18,color:"#64748b"},{el:"H",x:55,y:60,r:11,color:"#94a3b8"},{el:"H",x:55,y:120,r:11,color:"#94a3b8"},{el:"H",x:145,y:60,r:11,color:"#94a3b8"},{el:"H",x:145,y:120,r:11,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3],[1,4],[1,5]] },
  { id:"acetylene", name:"Acetylene", nameBn:"অ্যাসিটিলিন", formula:"C₂H₂", desc:"ওয়েল্ডিং-এ ব্যবহৃত গ্যাস। C≡C ট্রিপল বন্ধন।", atoms:[{el:"H",x:35,y:90,r:12,color:"#94a3b8"},{el:"C",x:80,y:90,r:17,color:"#64748b"},{el:"C",x:120,y:90,r:17,color:"#64748b"},{el:"H",x:165,y:90,r:12,color:"#94a3b8"}], bonds:[[0,1],[1,2],[2,3]] },
  { id:"nitric-acid", name:"Nitric Acid", nameBn:"নাইট্রিক এসিড", formula:"HNO₃", desc:"তীব্র অক্সিডাইজিং এসিড, সার শিল্পে ব্যবহৃত।", atoms:[{el:"N",x:100,y:85,r:18,color:"#3b82f6"},{el:"O",x:55,y:55,r:16,color:"#ef4444"},{el:"O",x:145,y:55,r:16,color:"#ef4444"},{el:"O",x:100,y:135,r:16,color:"#ef4444"},{el:"H",x:135,y:155,r:10,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3],[3,4]] },
  { id:"sulfuric-acid", name:"Sulfuric Acid", nameBn:"সালফিউরিক এসিড", formula:"H₂SO₄", desc:"ব্যাটারি এসিড, শিল্পে সর্বাধিক ব্যবহৃত রাসায়নিক।", atoms:[{el:"S",x:100,y:85,r:20,color:"#eab308"},{el:"O",x:55,y:50,r:16,color:"#ef4444"},{el:"O",x:145,y:50,r:16,color:"#ef4444"},{el:"O",x:55,y:120,r:16,color:"#ef4444"},{el:"O",x:145,y:120,r:16,color:"#ef4444"},{el:"H",x:30,y:145,r:10,color:"#94a3b8"},{el:"H",x:170,y:145,r:10,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3],[0,4],[3,5],[4,6]] },
  { id:"acetic-acid", name:"Acetic Acid", nameBn:"অ্যাসিটিক এসিড", formula:"CH₃COOH", desc:"ভিনেগারের মূল উপাদান। কার্বক্সিল গ্রুপ (-COOH) যুক্ত।", atoms:[{el:"C",x:55,y:100,r:17,color:"#64748b"},{el:"H",x:25,y:75,r:10,color:"#94a3b8"},{el:"H",x:25,y:125,r:10,color:"#94a3b8"},{el:"H",x:55,y:140,r:10,color:"#94a3b8"},{el:"C",x:95,y:75,r:17,color:"#64748b"},{el:"O",x:95,y:35,r:17,color:"#ef4444"},{el:"O",x:135,y:95,r:17,color:"#ef4444"},{el:"H",x:160,y:75,r:10,color:"#94a3b8"}], bonds:[[0,1],[0,2],[0,3],[0,4],[4,5],[4,6],[6,7]] },
];

export function getMolecule(id: string): Molecule | undefined {
  return molecules.find((m) => m.id === id);
}
