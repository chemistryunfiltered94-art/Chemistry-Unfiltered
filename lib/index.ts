// lib/seedData/index.ts
//
// সম্পূর্ণ কারিকুলামের যেসব subsection-এর কনটেন্ট এখনো পর্যন্ত লেখা হয়েছে তার রেজিস্ট্রি।
// নতুন subsection (যেমন ১.২, ১.৩...) সম্পন্ন হলে এখানে import করে packages তালিকায়
// যোগ করলেই admin/seed-content পেজে সেটি ইমপোর্টের জন্য দেখা যাবে।
//
// lib/syllabus.ts-এ সম্পূর্ণ ৫৯টি subsection-এর code/title তালিকা আছে (রোডম্যাপ হিসেবে);
// এখানে শুধু সেইসব subsection থাকবে যেগুলোর জন্য সম্পূর্ণ কনটেন্ট লেখা শেষ হয়েছে।

import { SeedChapter } from "./types";
import chapter11  from "./physical/1-1-matter-structure";
import chapter12  from "./physical/1-2-gaseous-state";
import chapter13  from "./physical/1-3-thermodynamics";
import chapter14  from "./physical/1-4-chemical-equilibrium";
import chapter15  from "./physical/1-5-acid-base-chemistry";
import chapter16  from "./physical/1-6-electrochemistry";
import chapter17  from "./physical/1-7-chemical-kinetics";
import chapter18  from "./physical/1-8-surface-chemistry";
import chapter19  from "./physical/1-9-quantum-chemistry";
import chapter110 from "./physical/1-10-nuclear-chemistry";
import chapter111 from "./physical/1-11-atomic-structure";
import chapter112 from "./physical/1-12-chemical-bonding";
import chapter113 from "./physical/1-13-liquid-solid-state";
import chapter114 from "./physical/1-14-solutions-colligative-properties";
import chapter115 from "./physical/1-15-spectroscopy";
import chapter116 from "./physical/1-16-statistical-thermodynamics";
import chapter117 from "./physical/1-17-physical-chemistry-lab";
import chapter118 from "./physical/1-18-photochemistry";
import chapter119 from "./physical/1-19-solid-state-chemistry";
import chapter120 from "./physical/1-20-computational-chemistry";
import chapter121 from "./physical/1-21-molecular-symmetry";
import chapter122 from "./physical/1-22-group-theory";
import chapter123 from "./physical/1-23-nanochemistry";
import chapter124 from "./physical/1-24-polymer-physical-chemistry";
import chapter125 from "./physical/1-25-biophysical-chemistry";
import chapter126 from "./physical/1-26-non-equilibrium-thermodynamics";
import chapter127 from "./physical/1-27-surface-thermodynamics";
import chapter128 from "./physical/1-28-electrochemical-impedance";
import chapter129 from "./physical/1-29-plasma-chemistry";
import chapter130 from "./physical/1-30-laser-chemistry";
import chapter131 from "./physical/1-31-atmospheric-physical-chemistry";
import chapter132 from "./physical/1-32-materials-chemistry";
import chapter133 from "./physical/1-33-soft-matter-chemistry";
import chapter134 from "./physical/1-34-green-physical-chemistry";
import chapter135 from "./physical/1-35-advanced-reaction-kinetics";
import chapter136 from "./physical/1-36-advanced-spectroscopy";
import chapter137 from "./physical/1-37-modern-research-techniques";
import chapter21  from "./organic/2-1-basic-organic-chemistry";
import chapter22  from "./organic/2-2-alkenes";
import chapter25  from "./organic/2-5-aldehydes";
import chapter26  from "./organic/2-6-carboxylic-acids";
import chapter27  from "./organic/2-7-amines";
import chapter29  from "./organic/2-9-polymer-chemistry";
import chapter211 from "./organic/2-11-named-reactions";
import chapter212 from "./organic/2-12-chemical-bonding-structure";
import chapter213 from "./organic/2-13-iupac-nomenclature";
import chapter214 from "./organic/2-14-isomerism";
import chapter215 from "./organic/2-15-organic-reactions";
import chapter216 from "./organic/2-16-types-of-organic-reactions";
import chapter217 from "./organic/2-17-reaction-intermediates";
import chapter218 from "./organic/2-18-alkanes";
import chapter219 from "./organic/2-19-alkynes";
import chapter220 from "./organic/2-20-aromatic-hydrocarbons";
import chapter221 from "./organic/2-21-haloalkanes";
import chapter222 from "./organic/2-22-haloarenes";
import chapter223 from "./organic/2-23-alcohols";
import chapter224 from "./organic/2-24-phenols";
import chapter225 from "./organic/2-25-ethers";
import chapter226 from "./organic/2-26-ketones";
import chapter227 from "./organic/2-27-carboxylic-acid-derivatives";
import chapter228 from "./organic/2-28-diazonium-salts";
import chapter229 from "./organic/2-29-nitro-compounds";
import chapter230 from "./organic/2-30-organic-sulfur-compounds";
import chapter231 from "./organic/2-31-carbohydrates";
import chapter232 from "./organic/2-32-amino-acids";
import chapter233 from "./organic/2-33-proteins";
import chapter234 from "./organic/2-34-lipids";
import chapter235 from "./organic/2-35-nucleic-acids";
import chapter236 from "./organic/2-36-enzymes";
import chapter237 from "./organic/2-37-vitamins";
import chapter238 from "./organic/2-38-hormones";
import chapter239 from "./organic/2-39-organic-spectroscopy";
import chapter240 from "./organic/2-40-organic-synthesis";
import chapter241 from "./organic/2-41-green-chemistry";
import chapter242 from "./organic/2-42-medicinal-chemistry";
import chapter243 from "./organic/2-43-natural-organic-compounds";
import chapter244 from "./organic/2-44-heterocyclic-compounds";
import chapter245 from "./organic/2-45-organometallic-compounds";
import chapter246 from "./organic/2-46-advanced-stereochemistry";
import chapter247 from "./organic/2-47-conformational-analysis";
import chapter248 from "./organic/2-48-pericyclic-reactions";
import chapter249 from "./organic/2-49-photochemistry";
import chapter250 from "./organic/2-50-supramolecular-chemistry";
import chapter251 from "./organic/2-51-combinatorial-click-chemistry";
import chapter252 from "./organic/2-52-asymmetric-synthesis";
import chapter253 from "./organic/2-53-bioorganic-chemistry";
import chapter254 from "./organic/2-54-computational-organic-chemistry";
import chapter255 from "./organic/2-55-flow-chemistry";
import chapter256 from "./organic/2-56-organic-nanochemistry";
import chapter257 from "./organic/2-57-organic-electronics";
import chapter258 from "./organic/2-58-advanced-polymers-smart-materials";
import chapter259 from "./organic/2-59-drug-discovery-design";
import chapter260 from "./organic/2-60-modern-organic-research-techniques";
import chapter261 from "./organic/2-61-organic-catalysis";
import chapter262 from "./organic/2-62-electroorganic-chemistry";
import chapter263 from "./organic/2-63-photoredox-chemistry";
import chapter264 from "./organic/2-64-metal-organic-frameworks";
import chapter265 from "./organic/2-65-covalent-organic-frameworks";
import chapter266 from "./organic/2-66-chemical-biology";
import chapter267 from "./organic/2-67-green-organic-synthesis";
import chapter268 from "./organic/2-68-ai-in-organic-chemistry";
import chapter269 from "./organic/2-69-future-of-organic-chemistry";
import chapter31  from "./inorganic/3-1-atomic-structure";
import chapter32  from "./inorganic/3-2-periodic-table";
import chapter33  from "./inorganic/3-3-chemical-bonding";
import chapter34  from "./inorganic/3-4-hydrogen";
import chapter35  from "./inorganic/3-5-s-block-elements";
import chapter36  from "./inorganic/3-6-p-block-elements";
import chapter37  from "./inorganic/3-7-d-block-elements";
import chapter38  from "./inorganic/3-8-f-block-elements";
import chapter39  from "./inorganic/3-9-coordination-chemistry";
import chapter310 from "./inorganic/3-10-metallurgy";
import chapter311 from "./inorganic/3-11-redox-reactions";
import chapter312 from "./inorganic/3-12-acid-base-salt";
import chapter313 from "./inorganic/3-13-noble-gases";
import chapter314 from "./inorganic/3-14-nuclear-chemistry";
import chapter315 from "./inorganic/3-15-industrial-inorganic-chemistry";
import chapter316 from "./inorganic/3-16-environmental-chemistry";
import chapter317 from "./inorganic/3-17-bio-inorganic-relationship";
import chapter318 from "./inorganic/3-18-solid-state-chemistry";
import chapter319 from "./inorganic/3-19-qualitative-analysis";
import chapter320 from "./inorganic/3-20-inorganic-reaction-mechanism";
import chapter321 from "./inorganic/3-21-organometallic-chemistry";
import chapter322 from "./inorganic/3-22-inorganic-polymers";
import chapter323 from "./inorganic/3-23-advanced-inorganic-materials";
import chapter324 from "./inorganic/3-24-quantum-chemistry-application";
import chapter325 from "./inorganic/3-25-inorganic-spectroscopy";
import chapter326 from "./inorganic/3-26-magnetic-chemistry";
import chapter327 from "./inorganic/3-27-inorganic-photochemistry";
import chapter328 from "./inorganic/3-28-advanced-solid-state-theory";
import chapter329 from "./inorganic/3-29-industrial-research-inorganic";
import chapter330 from "./inorganic/3-30-advanced-coordination-chemistry";
import chapter331 from "./inorganic/3-31-inorganic-research-methods";
import chapter332 from "./inorganic/3-32-group-theory-molecular-symmetry";
import chapter333 from "./inorganic/3-33-ligand-field-theory";
import chapter334 from "./inorganic/3-34-crystal-field-theory-advanced";
import chapter335 from "./inorganic/3-35-molecular-orbital-theory-inorganic";
import chapter336 from "./inorganic/3-36-transition-metal-reaction-mechanism";
import chapter337 from "./inorganic/3-37-metal-cluster-nanochemistry";
import chapter338 from "./inorganic/3-38-advanced-bio-inorganic-chemistry";
import chapter339 from "./inorganic/3-39-modern-inorganic-research";
import chapter340 from "./inorganic/3-40-descriptive-chemistry";
import chapter341 from "./inorganic/3-41-transition-metal-elementwise";
import chapter342 from "./inorganic/3-42-lanthanide-actinide-advanced";
import chapter343 from "./inorganic/3-43-organometallic-catalysis-advanced";
import chapter344 from "./inorganic/3-44-inorganic-reaction-kinetics";
import chapter345 from "./inorganic/3-45-solid-state-physics-inorganic";
import chapter346 from "./inorganic/3-46-analytical-inorganic-advanced";
import chapter347 from "./inorganic/3-47-computational-inorganic-chemistry";
import chapter348 from "./inorganic/3-48-main-group-advanced";
import chapter349 from "./inorganic/3-49-halogen-chemistry";
import chapter350 from "./inorganic/3-50-oxygen-chalcogen-chemistry";
import chapter351 from "./inorganic/3-51-nitrogen-phosphorus-chemistry";
import chapter352 from "./inorganic/3-52-boron-chemistry";
import chapter353 from "./inorganic/3-53-silicon-silicate-chemistry";
import chapter354 from "./inorganic/3-54-sulfur-chemistry-detailed";
import chapter355 from "./inorganic/3-55-fluorine-chemistry-advanced";
import chapter356 from "./inorganic/3-56-carbon-chemistry-inorganic";
import chapter357 from "./inorganic/3-57-metalloid-chemistry";
import chapter358 from "./inorganic/3-58-intermetallic-compounds";
import chapter359 from "./inorganic/3-59-inorganic-polymer-advanced";
import chapter360 from "./inorganic/3-60-high-temperature-chemistry";
import chapter361 from "./inorganic/3-61-nuclear-materials-chemistry";
import chapter362 from "./inorganic/3-62-environmental-inorganic-advanced";
import chapter363 from "./inorganic/3-63-future-inorganic-research";
import chapter41  from "./analytical/4-1-bishleshnatmk-rsayner-prichy";
import chapter42  from "./analytical/4-2-primangt-bishleshn";
import chapter43  from "./analytical/4-3-taitreshn-bhliumetrik-bishleshn";
import chapter44  from "./analytical/4-4-kromatographi-o-bichchhed-pddhti";
import chapter45  from "./analytical/4-5-spektroskopi-moulik-bhitti";
import chapter46  from "./analytical/4-6-yantrik-bishleshn-electroanalytical";
import chapter47  from "./analytical/4-7-rasaynik-hisab-o-stykiometri";
import chapter48  from "./analytical/4-8-rasaynik-samyabstha-bishleshnatmk";
import chapter49  from "./analytical/4-9-gryabhimetrik-bishleshn";
import chapter410 from "./analytical/4-10-analytical-instrumentation-er-prichy";
import chapter411 from "./analytical/4-11-inphrared-spektroskpi-ir";
import chapter412 from "./analytical/4-12-niukliyar-myagnetik-rejonyans-nmr";
import chapter413 from "./analytical/4-13-bhr-spektrometri";
import chapter414 from "./analytical/4-14-parmanbik-spektroskpi";
import chapter415 from "./analytical/4-15-eks-re-bishleshn";
import chapter416 from "./analytical/4-16-kromatographir-unnt-pddhti";
import chapter417 from "./analytical/4-17-tapiiy-bishleshn";
import chapter418 from "./analytical/4-18-ilektrokemikyal-sensr-o-bayosensr";
import chapter419 from "./analytical/4-19-pribeshgt-bishleshn";
import chapter420 from "./analytical/4-20-pharmasiutikyal-bishleshn";
import chapter421 from "./analytical/4-21-unnt-primangt-bishleshn";
import chapter422 from "./analytical/4-22-kemometriks";
import chapter423 from "./analytical/4-23-analytical-method-development";
import chapter424 from "./analytical/4-24-analytical-method-validation";
import chapter425 from "./analytical/4-25-quality-control-o-quality-assurance";
import chapter426 from "./analytical/4-26-tres-ayanalaisis";
import chapter427 from "./analytical/4-27-bayoayanalitikyal-kemistri";
import chapter428 from "./analytical/4-28-nyano-ayanalitikyal-kemistri";
import chapter429 from "./analytical/4-29-phrensik-ayanalitikyal-kemistri";
import chapter430 from "./analytical/4-30-shilp-bishleshnatmk-rsayn";
import chapter431 from "./analytical/4-31-unnt-instrumental-bishleshn";
import chapter432 from "./analytical/4-32-liquid-chromatographymass-spectrometry-lc-ms";
import chapter433 from "./analytical/4-33-unnt-gas-chromatography";
import chapter434 from "./analytical/4-34-surface-analytical-techniques";
import chapter435 from "./analytical/4-35-unnt-ilektroayanalitikyal-kemistri";
import chapter436 from "./analytical/4-36-sensr-o-smart-ayanalitikyal-sistem";
import chapter437 from "./analytical/4-37-grin-ayanalitikyal-kemistri";
import chapter438 from "./analytical/4-38-prses-ayanalitikyal-teknolji-pat";
import chapter439 from "./analytical/4-39-analytical-chemistry-e-artificial-intelligence";
import chapter440 from "./analytical/4-40-bhbishyter-bishleshnatmk-rsayn";
import chapter441 from "./analytical/4-41-analytical-chemistry-laboratory-techniques";
import chapter442 from "./analytical/4-42-sample-preparation-techniques";
import chapter443 from "./analytical/4-43-standard-reference-materials-srm";
import chapter444 from "./analytical/4-44-calibration-techniques";
import chapter445 from "./analytical/4-45-ph-ebng-ion-measurement-techniques";
import chapter446 from "./analytical/4-46-clinical-analytical-chemistry";
import chapter447 from "./analytical/4-47-food-analytical-chemistry";
import chapter448 from "./analytical/4-48-agricultural-analytical-chemistry";
import chapter449 from "./analytical/4-49-geological-ebng-material-analysis";
import chapter450 from "./analytical/4-50-research-level-analytical-methods";
import chapter451 from "./analytical/4-51-raman-spektroskpi";
import chapter452 from "./analytical/4-52-phlurosens-o-luminesens-spektroskpi";
import chapter453 from "./analytical/4-53-sarphes-plajmn-rejonyans-spr";
import chapter454 from "./analytical/4-54-ilektrn-spektroskpi";
import chapter455 from "./analytical/4-55-niutrn-bishleshn";
import chapter456 from "./analytical/4-56-rediokemikyal-bishleshn";
import chapter457 from "./analytical/4-57-niukliyar-ayanalitikyal-kemistri";
import chapter458 from "./analytical/4-58-unnt-bichchhed-bijnyan";
import chapter459 from "./analytical/4-59-analytical-imaging-techniques";
import chapter460 from "./analytical/4-60-research-instrumentation-o-future-analytical-platforms";
import chapter461 from "./analytical/4-61-unnt-bayoayanalitikyal-kemistri";
import chapter462 from "./analytical/4-62-protiomiks";
import chapter463 from "./analytical/4-63-metabolomiks";
import chapter464 from "./analytical/4-64-jinomiks-o-mlikiular-ayanalaisis";
import chapter465 from "./analytical/4-65-unnt-pharmasiutikyal-bishleshn";
import chapter466 from "./analytical/4-66-tksikoljikyal-ayanalaisis";
import chapter467 from "./analytical/4-67-unnt-phrensik-ayanalitikyal-kemistri";
import chapter468 from "./analytical/4-68-unnt-pribeshgt-bishleshn";
import chapter469 from "./analytical/4-69-shilp-prkriya-niyntrn-bishleshn";
import chapter470 from "./analytical/4-70-regulatory-analytical-chemistry";
import chapter471 from "./analytical/4-71-supramlikiular-ayanalitikyal-kemistri";
import chapter472 from "./analytical/4-72-mlikiular-sensr-o-smart-sensing-sistem";
import chapter473 from "./analytical/4-73-nyano-bayo-ayanalitikyal-sistem";
import chapter474 from "./analytical/4-74-ekk-anu-bishleshn";
import chapter475 from "./analytical/4-75-koyantam-ayanalitikyal-kemistri";
import chapter476 from "./analytical/4-76-kritrim-buddhimtta-bhittik-ayanalitikyal-kemistri";
import chapter477 from "./analytical/4-77-atonomas-kemikyal-lyabretri";
import chapter478 from "./analytical/4-78-dijital-ayanalitikyal-kemistri";
import chapter479 from "./analytical/4-79-advanced-imaging-analytical-chemistry";
import chapter480 from "./analytical/4-80-bhbishyter-bishleshnatmk-rsayn-smpuurn";
import chapter51  from "./biochemistry/5-1-kosh-rsayn";
import chapter53  from "./biochemistry/5-3-enjaim-jiibrsayn";
import chapter54  from "./biochemistry/5-4-bipak-kriya";
import chapter55  from "./biochemistry/5-5-karbohaidret-bipak";
import chapter57  from "./biochemistry/5-7-aanbik-jiibbidya";
import chapter58  from "./biochemistry/5-8-jiibrsayner-prichiti";
import chapter59  from "./biochemistry/5-9-jiibrsayne-pani-o-joib-pribesh";
import chapter510 from "./biochemistry/5-10-jiibrsaynik-anu-o-functional-group";
import chapter511 from "./biochemistry/5-11-karbohaidret-rsayn-jiibrsayn";
import chapter512 from "./biochemistry/5-12-lipid-jiibrsayn";
import chapter513 from "./biochemistry/5-13-protin-jiibrsayn";
import chapter514 from "./biochemistry/5-14-niuklik-ayasid-jiibrsayn";
import chapter515 from "./biochemistry/5-15-bhitamin-o-ko-enjaim";
import chapter516 from "./biochemistry/5-16-joib-shktibidya-bioenergetics";
import chapter517 from "./biochemistry/5-17-lipid-bipak";
import chapter518 from "./biochemistry/5-18-ayamino-ayasid-o-protin-bipak";
import chapter519 from "./biochemistry/5-19-jenetik-inyjiniyaring";
import chapter520 from "./biochemistry/5-20-klinikyal-jiibrsayn";
import chapter521 from "./biochemistry/5-21-rog-prtirodh-jiibrsayn-immunochemistry";
import chapter522 from "./biochemistry/5-22-aadhunik-jiibrsayn-o-bayoteknolji";
import chapter523 from "./biochemistry/5-23-unnt-enjaimbidya";
import chapter524 from "./biochemistry/5-24-unnt-aanbik-jenetiks";
import chapter525 from "./biochemistry/5-25-kyansar-jiibrsayn";
import chapter526 from "./biochemistry/5-26-snayu-jiibrsayn-neurochemistry";
import chapter527 from "./biochemistry/5-27-hrmon-jiibrsayn-endocrine-biochemistry";
import chapter528 from "./biochemistry/5-28-pushti-jiibrsayn";
import chapter529 from "./biochemistry/5-29-kosh-jhilli-jiibrsayn-membrane-biochemistry";
import chapter530 from "./biochemistry/5-30-structural-biology";
import chapter531 from "./biochemistry/5-31-jiibrsayn-gbeshna-pryukti-experimental-techniques";
import chapter532 from "./biochemistry/5-32-jiibrsayn-gbeshna-pddhti-research-methods";
import chapter533 from "./biochemistry/5-33-unnt-imiunolji";
import chapter534 from "./biochemistry/5-34-klinikyal-mlikiular-dayagnstiks";
import chapter535 from "./biochemistry/5-35-pharmakoljikyal-jiibrsayn";
import chapter536 from "./biochemistry/5-36-drag-metablijm-o-pharmakokainetiks";
import chapter537 from "./biochemistry/5-37-bishtttbiiy-jiibrsayn";
import chapter538 from "./biochemistry/5-38-maikrobiyal-jiibrsayn";
import chapter539 from "./biochemistry/5-39-udbhid-jiibrsayn";
import chapter540 from "./biochemistry/5-40-pribeshiiy-jiibrsayn";
import chapter541 from "./biochemistry/5-41-shilp-jiibrsayn";
import chapter542 from "./biochemistry/5-42-unnt-bayoteknolji";
import chapter543 from "./biochemistry/5-43-protiomiks-jiibrsayn";
import chapter544 from "./biochemistry/5-44-jinomiks-o-transkriptomiks";
import chapter545 from "./biochemistry/5-45-metabolomiks-jiibrsayn";
import chapter546 from "./biochemistry/5-46-strakcharal-bayoinphrmetiks";
import chapter547 from "./biochemistry/5-47-kmpiuteshnal-bayolji";
import chapter548 from "./biochemistry/5-48-mlikiular-medisin";
import chapter549 from "./biochemistry/5-49-stem-sel-jiibrsayn";
import chapter550 from "./biochemistry/5-50-punrjnm-chikitsa-regenerative-medicine";
import chapter551 from "./biochemistry/5-51-bardhky-jiibrsayn-aging-biochemistry";
import chapter552 from "./biochemistry/5-52-mhakash-o-chrm-pribesher-jiibrsayn";
import chapter553 from "./biochemistry/5-53-aanbik-bibrtn-molecular-evolution";
import chapter554 from "./biochemistry/5-54-kemikyal-bayolji-jiibrsayn";
import chapter555 from "./biochemistry/5-55-glaikobayolji";
import chapter556 from "./biochemistry/5-56-lipidomiks";
import chapter557 from "./biochemistry/5-57-unnt-rna-jiibbijnyan";
import chapter558 from "./biochemistry/5-58-unnt-sistems-bayolji";
import chapter559 from "./biochemistry/5-59-imiunotherapi-jiibrsayn";
import chapter560 from "./biochemistry/5-60-bhyaksin-jiibrsayn";
import chapter561 from "./biochemistry/5-61-bayoinyjiniyaring";
import chapter562 from "./biochemistry/5-62-jiibrsayner-bhbishyt-prbnta";
import chapter563 from "./biochemistry/5-63-unnt-metablik-inyjiniyaring";
import chapter564 from "./biochemistry/5-64-mlikiular-pharmakolji";
import chapter565 from "./biochemistry/5-65-bayophijikyal-kemistri";
import chapter566 from "./biochemistry/5-66-protin-inyjiniyaring";
import chapter567 from "./biochemistry/5-67-enjaim-pryukti";
import chapter568 from "./biochemistry/5-68-bayoayanalitikyal-kemistri-jiibrsayn";
import chapter569 from "./biochemistry/5-69-mlikiular-imejing";
import chapter570 from "./biochemistry/5-70-klinikyal-jenetiks";
import chapter571 from "./biochemistry/5-71-unnt-medikel-jiibrsayn";
import chapter572 from "./biochemistry/5-72-gbeshna-pryayer-jiibrsayn";
import chapter573 from "./biochemistry/5-73-unnt-klinikyal-jiibrsayn";
import chapter574 from "./biochemistry/5-74-unnt-bayoteknolji-pryog";
import chapter575 from "./biochemistry/5-75-unnt-shilp-o-pharmasiutikyal-jiibrsayn";
import chapter576 from "./biochemistry/5-76-unnt-pribesh-o-prtibeshiiy-jiibrsayn";
import chapter577 from "./biochemistry/5-77-krishi-jiibrsayn";
import chapter578 from "./biochemistry/5-78-khady-jiibrsayn";
import chapter579 from "./biochemistry/5-79-samudrik-jiibrsayn";
import chapter580 from "./biochemistry/5-80-unnt-mhakash-o-ayastrobayokemistri";
import chapter581 from "./biochemistry/5-81-bhbishyt-mlikiular-bijnyan";
import chapter582 from "./biochemistry/5-82-jiibrsayne-puurnangg-gbeshna-rodmyap";

// ═══════════════════════════════════════════════════════════════
// Phase 1 সম্পন্ন — ভৌত রসায়ন কাঠামো (১.১ – ১.৩৭, placeholder — কনটেন্ট বাকি)
// Phase 2 সম্পন্ন — জৈব রসায়ন কাঠামো (২.১ – ২.৬৯, placeholder — কনটেন্ট বাকি)
// Phase 3 সম্পন্ন — অজৈব রসায়ন কাঠামো (৩.১ – ৩.৬৩, Chapter→Topic→Subtopic, placeholder — কনটেন্ট বাকি)
// Phase 4 সম্পন্ন — বিশ্লেষণাত্মক রসায়ন কাঠামো (৪.১ – ৪.৮০, Chapter→Topic→Subtopic, placeholder — কনটেন্ট বাকি)
// Phase 5 সম্পন্ন — জীবরসায়ন কাঠামো (৫.১–৫.৮২, ৫.২ ও ৫.৬ বাদে, Chapter→Topic→Subtopic, placeholder — কনটেন্ট বাকি)
// ═══════════════════════════════════════════════════════════════

export const SEED_PACKAGES: SeedChapter[] = [
  chapter11,   // 1.1   পদার্থের গঠন
  chapter12,   // 1.2   গ্যাসের ধর্ম
  chapter13,   // 1.3   তাপগতিবিদ্যা
  chapter14,   // 1.4   রাসায়নিক সাম্যাবস্থা
  chapter15,   // 1.5   অম্ল-ক্ষার রসায়ন
  chapter16,   // 1.6   তড়িৎ রসায়ন
  chapter17,   // 1.7   রাসায়নিক গতিবিদ্যা
  chapter18,   // 1.8   পৃষ্ঠ রসায়ন
  chapter19,   // 1.9   কোয়ান্টাম রসায়ন
  chapter110,  // 1.10  নিউক্লিয়ার রসায়ন
  chapter111,  // 1.11  পরমাণুর গঠন
  chapter112,  // 1.12  রাসায়নিক বন্ধন
  chapter113,  // 1.13  তরল ও কঠিন অবস্থা
  chapter114,  // 1.14  দ্রবণ ও কোলিগেটিভ ধর্ম
  chapter115,  // 1.15  বর্ণালীবিদ্যা
  chapter116,  // 1.16  পরিসংখ্যানিক তাপগতিবিদ্যা
  chapter117,  // 1.17  ভৌত রসায়নের ব্যবহারিক
  chapter118,  // 1.18  আলোক রসায়ন
  chapter119,  // 1.19  কঠিন অবস্থার রসায়ন
  chapter120,  // 1.20  কম্পিউটেশনাল রসায়ন
  chapter121,  // 1.21  আণবিক সমমিতি
  chapter122,  // 1.22  গ্রুপ তত্ত্ব
  chapter123,  // 1.23  ন্যানো রসায়ন
  chapter124,  // 1.24  পলিমার ভৌত রসায়ন
  chapter125,  // 1.25  জৈব-ভৌত রসায়ন
  chapter126,  // 1.26  অ-সাম্য তাপগতিবিদ্যা
  chapter127,  // 1.27  পৃষ্ঠ তাপগতিবিদ্যা
  chapter128,  // 1.28  ইলেক্ট্রোকেমিক্যাল ইম্পিডেন্স
  chapter129,  // 1.29  প্লাজমা রসায়ন
  chapter130,  // 1.30  লেজার রসায়ন
  chapter131,  // 1.31  বায়ুমণ্ডলীয় ভৌত রসায়ন
  chapter132,  // 1.32  উপাদান ভৌত রসায়ন
  chapter133,  // 1.33  সফট ম্যাটার রসায়ন
  chapter134,  // 1.34  সবুজ ভৌত রসায়ন
  chapter135,  // 1.35  উন্নত বিক্রিয়া গতিবিদ্যা
  chapter136,  // 1.36  উন্নত বর্ণালীবিদ্যা
  chapter137,  // 1.37  আধুনিক গবেষণা পদ্ধতি
  chapter21,   // 2.1   জৈব রসায়নের পরিচিতি
  chapter22,   // 2.2   আলকিন
  chapter25,   // 2.5   অ্যালডিহাইড
  chapter26,   // 2.6   কার্বক্সিলিক অ্যাসিড
  chapter27,   // 2.7   অ্যামিন
  chapter29,   // 2.9   পলিমার রসায়ন
  chapter211,  // 2.11  নামযুক্ত জৈব বিক্রিয়া
  chapter212,  // 2.12  রাসায়নিক বন্ধন ও গঠন
  chapter213,  // 2.13  IUPAC নামকরণ
  chapter214,  // 2.14  সমাণুতা
  chapter215,  // 2.15  জৈব বিক্রিয়া
  chapter216,  // 2.16  জৈব বিক্রিয়ার ধরন
  chapter217,  // 2.17  জৈব বিক্রিয়ার মধ্যবর্তী কণা
  chapter218,  // 2.18  আলকেন
  chapter219,  // 2.19  আলকাইন
  chapter220,  // 2.20  অ্যারোমেটিক হাইড্রোকার্বন
  chapter221,  // 2.21  হ্যালোআলকেন
  chapter222,  // 2.22  হ্যালোঅ্যারিন
  chapter223,  // 2.23  অ্যালকোহল
  chapter224,  // 2.24  ফেনল
  chapter225,  // 2.25  ইথার
  chapter226,  // 2.26  কিটোন
  chapter227,  // 2.27  কার্বক্সিলিক অ্যাসিডের ডেরিভেটিভ
  chapter228,  // 2.28  ডায়াজোনিয়াম লবণ
  chapter229,  // 2.29  নাইট্রো যৌগ
  chapter230,  // 2.30  জৈব সালফার যৌগ
  chapter231,  // 2.31  কার্বোহাইড্রেট
  chapter232,  // 2.32  অ্যামিনো অ্যাসিড
  chapter233,  // 2.33  প্রোটিন
  chapter234,  // 2.34  লিপিড
  chapter235,  // 2.35  নিউক্লিক অ্যাসিড (DNA ও RNA)
  chapter236,  // 2.36  এনজাইম
  chapter237,  // 2.37  ভিটামিন
  chapter238,  // 2.38  হরমোন
  chapter239,  // 2.39  জৈব স্পেকট্রোস্কপি
  chapter240,  // 2.40  জৈব সংশ্লেষণ
  chapter241,  // 2.41  গ্রিন কেমিস্ট্রি
  chapter242,  // 2.42  ঔষধ রসায়ন
  chapter243,  // 2.43  প্রাকৃতিক জৈব যৌগ
  chapter244,  // 2.44  হেটারোসাইক্লিক যৌগ
  chapter245,  // 2.45  অর্গানোমেটালিক যৌগ
  chapter246,  // 2.46  উন্নত স্টেরিওরসায়ন
  chapter247,  // 2.47  কনফরমেশনাল বিশ্লেষণ
  chapter248,  // 2.48  পারিসাইক্লিক বিক্রিয়া
  chapter249,  // 2.49  ফটোরসায়ন
  chapter250,  // 2.50  সুপ্রামলিকুলার রসায়ন
  chapter251,  // 2.51  কম্বিনেটোরিয়াল ও ক্লিক কেমিস্ট্রি
  chapter252,  // 2.52  অ্যাসিমেট্রিক সংশ্লেষণ
  chapter253,  // 2.53  জৈব-জীবরসায়ন
  chapter254,  // 2.54  কম্পিউটেশনাল জৈব রসায়ন
  chapter255,  // 2.55  ফ্লো কেমিস্ট্রি
  chapter256,  // 2.56  জৈব ন্যানোরসায়ন
  chapter257,  // 2.57  জৈব ইলেকট্রনিক্স
  chapter258,  // 2.58  উন্নত পলিমার ও স্মার্ট উপাদান
  chapter259,  // 2.59  ওষুধ আবিষ্কার ও নকশা
  chapter260,  // 2.60  আধুনিক গবেষণা কৌশল (জৈব)
  chapter261,  // 2.61  জৈব অনুঘটক রসায়ন
  chapter262,  // 2.62  ইলেক্ট্রোজৈব রসায়ন
  chapter263,  // 2.63  ফটোরেডক্স রসায়ন
  chapter264,  // 2.64  ধাতু–জৈব কাঠামো (MOFs)
  chapter265,  // 2.65  কোভ্যালেন্ট জৈব কাঠামো (COFs)
  chapter266,  // 2.66  রাসায়নিক জীববিজ্ঞান
  chapter267,  // 2.67  সবুজ জৈব সংশ্লেষণ
  chapter268,  // 2.68  কৃত্রিম বুদ্ধিমত্তা ও জৈব রসায়ন
  chapter269,  // 2.69  জৈব রসায়নের ভবিষ্যৎ
  chapter31,   // 3.1   পরমাণুর গঠন
  chapter32,   // 3.2   পর্যায় সারণি
  chapter33,   // 3.3   রাসায়নিক বন্ধন
  chapter34,   // 3.4   হাইড্রোজেন
  chapter35,   // 3.5   s-ব্লক মৌল
  chapter36,   // 3.6   p-ব্লক মৌল
  chapter37,   // 3.7   d-ব্লক মৌল
  chapter38,   // 3.8   f-ব্লক মৌল
  chapter39,   // 3.9   সমন্বয় রসায়ন
  chapter310,  // 3.10  ধাতুবিদ্যা
  chapter311,  // 3.11  জারণ-বিজারণ বিক্রিয়া
  chapter312,  // 3.12  অম্ল, ক্ষার ও লবণ
  chapter313,  // 3.13  নিষ্ক্রিয় গ্যাস
  chapter314,  // 3.14  নিউক্লিয়ার রসায়ন
  chapter315,  // 3.15  শিল্প অজৈব রসায়ন
  chapter316,  // 3.16  পরিবেশ রসায়ন
  chapter317,  // 3.17  জৈব-অজৈব যৌগের আন্তঃসম্পর্ক
  chapter318,  // 3.18  কঠিন অবস্থা রসায়ন
  chapter319,  // 3.19  অজৈব যৌগের বিশ্লেষণ
  chapter320,  // 3.20  অজৈব বিক্রিয়ার প্রক্রিয়া
  chapter321,  // 3.21  জৈব ধাতব রসায়ন
  chapter322,  // 3.22  অজৈব পলিমার
  chapter323,  // 3.23  উন্নত অজৈব পদার্থ
  chapter324,  // 3.24  কোয়ান্টাম রসায়নের অজৈব প্রয়োগ
  chapter325,  // 3.25  অজৈব স্পেকট্রোস্কপি
  chapter326,  // 3.26  চৌম্বক রসায়ন
  chapter327,  // 3.27  অজৈব ফটোকেমিস্ট্রি
  chapter328,  // 3.28  কঠিন পদার্থের উন্নত তত্ত্ব
  chapter329,  // 3.29  শিল্প ও গবেষণাভিত্তিক অজৈব রসায়ন
  chapter330,  // 3.30  জটিল অজৈব যৌগের রসায়ন
  chapter331,  // 3.31  অজৈব রসায়নের গবেষণা পদ্ধতি
  chapter332,  // 3.32  Group Theory ও Molecular Symmetry
  chapter333,  // 3.33  Ligand Field Theory
  chapter334,  // 3.34  Crystal Field Theory বিস্তারিত
  chapter335,  // 3.35  Molecular Orbital Theory (অজৈব প্রয়োগ)
  chapter336,  // 3.36  Transition Metal Reaction Mechanism
  chapter337,  // 3.37  Metal Cluster ও Nanochemistry
  chapter338,  // 3.38  Advanced Bio-Inorganic Chemistry
  chapter339,  // 3.39  Inorganic Chemistry এর আধুনিক গবেষণা ক্ষেত্র
  chapter340,  // 3.40  Descriptive Chemistry (মৌলভিত্তিক)
  chapter341,  // 3.41  Transition Metal Element-wise Chemistry
  chapter342,  // 3.42  Lanthanide ও Actinide Advanced Chemistry
  chapter343,  // 3.43  Organometallic Catalysis Advanced
  chapter344,  // 3.44  Inorganic Reaction Kinetics
  chapter345,  // 3.45  Solid State Physics ভিত্তিক অজৈব রসায়ন
  chapter346,  // 3.46  Analytical Inorganic Chemistry Advanced
  chapter347,  // 3.47  Computational Inorganic Chemistry
  chapter348,  // 3.48  Main Group Element Advanced Chemistry
  chapter349,  // 3.49  Halogen Chemistry
  chapter350,  // 3.50  Oxygen ও Chalcogen Chemistry
  chapter351,  // 3.51  Nitrogen ও Phosphorus Chemistry
  chapter352,  // 3.52  Boron Chemistry
  chapter353,  // 3.53  Silicon ও Silicate Chemistry
  chapter354,  // 3.54  Sulfur Chemistry বিস্তারিত
  chapter355,  // 3.55  Fluorine Chemistry Advanced
  chapter356,  // 3.56  Carbon Chemistry (অজৈব)
  chapter357,  // 3.57  Metalloid Chemistry
  chapter358,  // 3.58  Intermetallic Compounds
  chapter359,  // 3.59  Inorganic Polymer Advanced Chemistry
  chapter360,  // 3.60  High Temperature Chemistry
  chapter361,  // 3.61  Nuclear Materials Chemistry
  chapter362,  // 3.62  Environmental Inorganic Chemistry Advanced
  chapter363,  // 3.63  Future Inorganic Chemistry Research
  chapter41,   // 4.1   বিশ্লেষণাত্মক রসায়নের পরিচয়
  chapter42,   // 4.2   পরিমাণগত বিশ্লেষণ
  chapter43,   // 4.3   টাইট্রেশন (ভলিউমেট্রিক বিশ্লেষণ)
  chapter44,   // 4.4   ক্রোমাটোগ্রাফি ও বিচ্ছেদ পদ্ধতি
  chapter45,   // 4.5   স্পেকট্রোস্কোপি (মৌলিক ভিত্তি)
  chapter46,   // 4.6   যান্ত্রিক বিশ্লেষণ (Electroanalytical)
  chapter47,   // 4.7   রাসায়নিক হিসাব ও স্টয়কিওমেট্রি
  chapter48,   // 4.8   রাসায়নিক সাম্যাবস্থা (বিশ্লেষণাত্মক)
  chapter49,   // 4.9   গ্র্যাভিমেট্রিক বিশ্লেষণ
  chapter410,  // 4.10  Analytical Instrumentation এর পরিচয়
  chapter411,  // 4.11  ইনফ্রারেড স্পেকট্রোস্কপি (IR)
  chapter412,  // 4.12  নিউক্লিয়ার ম্যাগনেটিক রেজোন্যান্স (NMR)
  chapter413,  // 4.13  ভর স্পেকট্রোমেট্রি
  chapter414,  // 4.14  পারমাণবিক স্পেকট্রোস্কপি
  chapter415,  // 4.15  এক্স-রে বিশ্লেষণ
  chapter416,  // 4.16  ক্রোমাটোগ্রাফির উন্নত পদ্ধতি
  chapter417,  // 4.17  তাপীয় বিশ্লেষণ
  chapter418,  // 4.18  ইলেক্ট্রোকেমিক্যাল সেন্সর ও বায়োসেন্সর
  chapter419,  // 4.19  পরিবেশগত বিশ্লেষণ
  chapter420,  // 4.20  ফার্মাসিউটিক্যাল বিশ্লেষণ
  chapter421,  // 4.21  উন্নত পরিমাণগত বিশ্লেষণ
  chapter422,  // 4.22  কেমোমেট্রিক্স
  chapter423,  // 4.23  Analytical Method Development
  chapter424,  // 4.24  Analytical Method Validation
  chapter425,  // 4.25  Quality Control ও Quality Assurance
  chapter426,  // 4.26  ট্রেস অ্যানালাইসিস
  chapter427,  // 4.27  বায়োঅ্যানালিটিক্যাল কেমিস্ট্রি
  chapter428,  // 4.28  ন্যানো অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter429,  // 4.29  ফরেনসিক অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter430,  // 4.30  শিল্প বিশ্লেষণাত্মক রসায়ন
  chapter431,  // 4.31  উন্নত ইন্সট্রুমেন্টাল বিশ্লেষণ
  chapter432,  // 4.32  Liquid Chromatography–Mass Spectrometry (LC-MS)
  chapter433,  // 4.33  উন্নত Gas Chromatography
  chapter434,  // 4.34  Surface Analytical Techniques
  chapter435,  // 4.35  উন্নত ইলেক্ট্রোঅ্যানালিটিক্যাল কেমিস্ট্রি
  chapter436,  // 4.36  সেন্সর ও স্মার্ট অ্যানালিটিক্যাল সিস্টেম
  chapter437,  // 4.37  গ্রিন অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter438,  // 4.38  প্রসেস অ্যানালিটিক্যাল টেকনোলজি (PAT)
  chapter439,  // 4.39  Analytical Chemistry এ Artificial Intelligence
  chapter440,  // 4.40  ভবিষ্যতের বিশ্লেষণাত্মক রসায়ন
  chapter441,  // 4.41  Analytical Chemistry Laboratory Techniques
  chapter442,  // 4.42  Sample Preparation Techniques
  chapter443,  // 4.43  Standard Reference Materials (SRM)
  chapter444,  // 4.44  Calibration Techniques
  chapter445,  // 4.45  pH এবং Ion Measurement Techniques
  chapter446,  // 4.46  Clinical Analytical Chemistry
  chapter447,  // 4.47  Food Analytical Chemistry
  chapter448,  // 4.48  Agricultural Analytical Chemistry
  chapter449,  // 4.49  Geological এবং Material Analysis
  chapter450,  // 4.50  Research Level Analytical Methods
  chapter451,  // 4.51  রামান স্পেকট্রোস্কপি
  chapter452,  // 4.52  ফ্লুরোসেন্স ও লুমিনেসেন্স স্পেকট্রোস্কপি
  chapter453,  // 4.53  সারফেস প্লাজমন রেজোন্যান্স (SPR)
  chapter454,  // 4.54  ইলেকট্রন স্পেকট্রোস্কপি
  chapter455,  // 4.55  নিউট্রন বিশ্লেষণ
  chapter456,  // 4.56  রেডিওকেমিক্যাল বিশ্লেষণ
  chapter457,  // 4.57  নিউক্লিয়ার অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter458,  // 4.58  উন্নত বিচ্ছেদ বিজ্ঞান
  chapter459,  // 4.59  Analytical Imaging Techniques
  chapter460,  // 4.60  Research Instrumentation ও Future Analytical Platforms
  chapter461,  // 4.61  উন্নত বায়োঅ্যানালিটিক্যাল কেমিস্ট্রি
  chapter462,  // 4.62  প্রোটিওমিক্স
  chapter463,  // 4.63  মেটাবোলোমিক্স
  chapter464,  // 4.64  জিনোমিক্স ও মলিকিউলার অ্যানালাইসিস
  chapter465,  // 4.65  উন্নত ফার্মাসিউটিক্যাল বিশ্লেষণ
  chapter466,  // 4.66  টক্সিকোলজিক্যাল অ্যানালাইসিস
  chapter467,  // 4.67  উন্নত ফরেনসিক অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter468,  // 4.68  উন্নত পরিবেশগত বিশ্লেষণ
  chapter469,  // 4.69  শিল্প প্রক্রিয়া নিয়ন্ত্রণ বিশ্লেষণ
  chapter470,  // 4.70  Regulatory Analytical Chemistry
  chapter471,  // 4.71  সুপ্রামলিকিউলার অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter472,  // 4.72  মলিকিউলার সেন্সর ও স্মার্ট সেন্সিং সিস্টেম
  chapter473,  // 4.73  ন্যানো-বায়ো অ্যানালিটিক্যাল সিস্টেম
  chapter474,  // 4.74  একক অণু বিশ্লেষণ
  chapter475,  // 4.75  কোয়ান্টাম অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter476,  // 4.76  কৃত্রিম বুদ্ধিমত্তা ভিত্তিক অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter477,  // 4.77  অটোনোমাস কেমিক্যাল ল্যাবরেটরি
  chapter478,  // 4.78  ডিজিটাল অ্যানালিটিক্যাল কেমিস্ট্রি
  chapter479,  // 4.79  Advanced Imaging Analytical Chemistry
  chapter480,  // 4.80  ভবিষ্যতের বিশ্লেষণাত্মক রসায়ন (সম্পূর্ণ)
  chapter51,   // 5.1   কোষ রসায়ন
  chapter53,   // 5.3   এনজাইম জীবরসায়ন
  chapter54,   // 5.4   বিপাক ক্রিয়া
  chapter55,   // 5.5   কার্বোহাইড্রেট বিপাক
  chapter57,   // 5.7   আণবিক জীববিদ্যা
  chapter58,   // 5.8   জীবরসায়নের পরিচিতি
  chapter59,   // 5.9   জীবরসায়নে পানি ও জৈব পরিবেশ
  chapter510,  // 5.10  জীবরসায়নিক অণু ও Functional Group
  chapter511,  // 5.11  কার্বোহাইড্রেট রসায়ন (জীবরসায়ন)
  chapter512,  // 5.12  লিপিড জীবরসায়ন
  chapter513,  // 5.13  প্রোটিন জীবরসায়ন
  chapter514,  // 5.14  নিউক্লিক অ্যাসিড জীবরসায়ন
  chapter515,  // 5.15  ভিটামিন ও কো-এনজাইম
  chapter516,  // 5.16  জৈব শক্তিবিদ্যা (Bioenergetics)
  chapter517,  // 5.17  লিপিড বিপাক
  chapter518,  // 5.18  অ্যামিনো অ্যাসিড ও প্রোটিন বিপাক
  chapter519,  // 5.19  জেনেটিক ইঞ্জিনিয়ারিং
  chapter520,  // 5.20  ক্লিনিক্যাল জীবরসায়ন
  chapter521,  // 5.21  রোগ প্রতিরোধ জীবরসায়ন (Immunochemistry)
  chapter522,  // 5.22  আধুনিক জীবরসায়ন ও বায়োটেকনোলজি
  chapter523,  // 5.23  উন্নত এনজাইমবিদ্যা
  chapter524,  // 5.24  উন্নত আণবিক জেনেটিক্স
  chapter525,  // 5.25  ক্যান্সার জীবরসায়ন
  chapter526,  // 5.26  স্নায়ু জীবরসায়ন (Neurochemistry)
  chapter527,  // 5.27  হরমোন জীবরসায়ন (Endocrine Biochemistry)
  chapter528,  // 5.28  পুষ্টি জীবরসায়ন
  chapter529,  // 5.29  কোষ ঝিল্লি জীবরসায়ন (Membrane Biochemistry)
  chapter530,  // 5.30  Structural Biology
  chapter531,  // 5.31  জীবরসায়ন গবেষণা প্রযুক্তি (Experimental Techniques)
  chapter532,  // 5.32  জীবরসায়ন গবেষণা পদ্ধতি (Research Methods)
  chapter533,  // 5.33  উন্নত ইমিউনোলজি
  chapter534,  // 5.34  ক্লিনিক্যাল মলিকিউলার ডায়াগনস্টিকস
  chapter535,  // 5.35  ফার্মাকোলজিক্যাল জীবরসায়ন
  chapter536,  // 5.36  ড্রাগ মেটাবলিজম ও ফার্মাকোকাইনেটিক্স
  chapter537,  // 5.37  বিষতত্ত্বীয় জীবরসায়ন
  chapter538,  // 5.38  মাইক্রোবিয়াল জীবরসায়ন
  chapter539,  // 5.39  উদ্ভিদ জীবরসায়ন
  chapter540,  // 5.40  পরিবেশীয় জীবরসায়ন
  chapter541,  // 5.41  শিল্প জীবরসায়ন
  chapter542,  // 5.42  উন্নত বায়োটেকনোলজি
  chapter543,  // 5.43  প্রোটিওমিক্স (জীবরসায়ন)
  chapter544,  // 5.44  জিনোমিক্স ও ট্রান্সক্রিপ্টোমিক্স
  chapter545,  // 5.45  মেটাবোলোমিক্স (জীবরসায়ন)
  chapter546,  // 5.46  স্ট্রাকচারাল বায়োইনফরমেটিক্স
  chapter547,  // 5.47  কম্পিউটেশনাল বায়োলজি
  chapter548,  // 5.48  মলিকিউলার মেডিসিন
  chapter549,  // 5.49  স্টেম সেল জীবরসায়ন
  chapter550,  // 5.50  পুনর্জন্ম চিকিৎসা (Regenerative Medicine)
  chapter551,  // 5.51  বার্ধক্য জীবরসায়ন (Aging Biochemistry)
  chapter552,  // 5.52  মহাকাশ ও চরম পরিবেশের জীবরসায়ন
  chapter553,  // 5.53  আণবিক বিবর্তন (Molecular Evolution)
  chapter554,  // 5.54  কেমিক্যাল বায়োলজি (জীবরসায়ন)
  chapter555,  // 5.55  গ্লাইকোবায়োলজি
  chapter556,  // 5.56  লিপিডোমিক্স
  chapter557,  // 5.57  উন্নত RNA জীববিজ্ঞান
  chapter558,  // 5.58  উন্নত সিস্টেমস বায়োলজি
  chapter559,  // 5.59  ইমিউনোথেরাপি জীবরসায়ন
  chapter560,  // 5.60  ভ্যাকসিন জীবরসায়ন
  chapter561,  // 5.61  বায়োইঞ্জিনিয়ারিং
  chapter562,  // 5.62  জীবরসায়নের ভবিষ্যৎ প্রবণতা
  chapter563,  // 5.63  উন্নত মেটাবলিক ইঞ্জিনিয়ারিং
  chapter564,  // 5.64  মলিকিউলার ফার্মাকোলজি
  chapter565,  // 5.65  বায়োফিজিক্যাল কেমিস্ট্রি
  chapter566,  // 5.66  প্রোটিন ইঞ্জিনিয়ারিং
  chapter567,  // 5.67  এনজাইম প্রযুক্তি
  chapter568,  // 5.68  বায়োঅ্যানালিটিক্যাল কেমিস্ট্রি (জীবরসায়ন)
  chapter569,  // 5.69  মলিকিউলার ইমেজিং
  chapter570,  // 5.70  ক্লিনিক্যাল জেনেটিক্স
  chapter571,  // 5.71  উন্নত মেডিকেল জীবরসায়ন
  chapter572,  // 5.72  গবেষণা পর্যায়ের জীবরসায়ন
  chapter573,  // 5.73  উন্নত ক্লিনিক্যাল জীবরসায়ন
  chapter574,  // 5.74  উন্নত বায়োটেকনোলজি প্রয়োগ
  chapter575,  // 5.75  উন্নত শিল্প ও ফার্মাসিউটিক্যাল জীবরসায়ন
  chapter576,  // 5.76  উন্নত পরিবেশ ও প্রতিবেশীয় জীবরসায়ন
  chapter577,  // 5.77  কৃষি জীবরসায়ন
  chapter578,  // 5.78  খাদ্য জীবরসায়ন
  chapter579,  // 5.79  সামুদ্রিক জীবরসায়ন
  chapter580,  // 5.80  উন্নত মহাকাশ ও অ্যাস্ট্রোবায়োকেমিস্ট্রি
  chapter581,  // 5.81  ভবিষ্যৎ মলিকিউলার বিজ্ঞান
  chapter582,  // 5.82  জীবরসায়নে পূর্ণাঙ্গ গবেষণা রোডম্যাপ
];
