import { MetadataRoute } from "next";

const baseUrl = "https://chemistryos.vercel.app";

const staticRoutes = [
  "/",
  "/learn",
  "/periodic-table",
  "/formulas",
  "/reactions",
  "/calculators",
  "/calculators/ph",
  "/calculators/molarity",
  "/calculators/gas-laws",
  "/calculators/molecular-weight",
  "/calculators/dilution",
  "/calculators/limiting-reagent",
  "/calculators/percent-yield",
  "/virtual-lab",
  "/virtual-lab/acid-base",
  "/virtual-lab/titration",
  "/virtual-lab/gas-laws",
  "/question-bank",
  "/question-bank/mock-test",
  "/molecules",
  "/articles",
  "/notes",
];

const categoryRoutes = [
  "physical-chemistry",
  "organic-chemistry",
  "inorganic-chemistry",
  "analytical-chemistry",
  "biochemistry",
  "environmental-chemistry",
  "industrial-chemistry",
].map(c => `/learn/${c}`);

const topicRoutes = [
  "physical-chemistry/acid-base",
  "physical-chemistry/gas-laws",
  "physical-chemistry/thermodynamics",
  "physical-chemistry/electrochemistry",
  "physical-chemistry/solutions",
  "physical-chemistry/chemical-equilibrium",
  "inorganic-chemistry/atomic-structure",
  "inorganic-chemistry/chemical-bonding",
  "inorganic-chemistry/periodic-table",
  "organic-chemistry/hydrocarbons",
  "organic-chemistry/organic-reactions",
].map(t => `/learn/${t}`);

const formulaRoutes = [
  "molarity", "ph", "ideal-gas-law", "gibbs-energy",
  "nernst", "henderson", "boyle", "charles",
].map(f => `/formulas/${f}`);

const articleRoutes = [
  "dna-rna-chemistry", "greenhouse-gases", "antibiotics-chemistry",
].map(a => `/articles/${a}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const allRoutes = [
    ...staticRoutes,
    ...categoryRoutes,
    ...topicRoutes,
    ...formulaRoutes,
    ...articleRoutes,
  ];

  return allRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1.0 : route.startsWith("/learn/") ? 0.8 : 0.6,
  }));
}
