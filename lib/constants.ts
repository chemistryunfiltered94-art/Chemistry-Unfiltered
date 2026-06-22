import { ChemistryCategory } from "@/types";

/** Canonical Bengali display names for each chemistry category. */
export const CATEGORY_NAMES: Record<ChemistryCategory, string> = {
  "physical-chemistry": "ভৌত রসায়ন",
  "organic-chemistry": "জৈব রসায়ন",
  "inorganic-chemistry": "অজৈব রসায়ন",
  "analytical-chemistry": "বিশ্লেষণী রসায়ন",
  biochemistry: "জীব রসায়ন",
  "environmental-chemistry": "পরিবেশ রসায়ন",
  "industrial-chemistry": "শিল্প রসায়ন",
};

export const CATEGORY_LIST: { id: ChemistryCategory; name: string }[] = (
  Object.keys(CATEGORY_NAMES) as ChemistryCategory[]
).map((id) => ({ id, name: CATEGORY_NAMES[id] }));

export function getCategoryName(id: string): string {
  return CATEGORY_NAMES[id as ChemistryCategory] || id;
}
