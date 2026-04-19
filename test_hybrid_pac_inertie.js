#!/usr/bin/env node
/**
 * Test hybrid scenario: PAC air/air + radiateurs inertie
 *
 * Concept: 2 installations de chauffage
 *   - Installation 1: PAC air/air multisplit (salon + chambres) ~35 m²
 *   - Installation 2: Radiateurs à inertie NFC (SDB + cuisine) ~17 m²
 *
 * Variantes:
 *   - H1: Hybride avec VMC hygro B + CET 150L
 *   - H2: Hybride sans VMC + CET 150L
 *   - H3: Hybride PAC plus large (~42m²) + inertie SDB seule (~10m²)
 *
 * Comparaison avec:
 *   - S3: tout inertie + VMC + CET (129 EP/m²)
 *   - S9: tout PAC air/air + VMC + CET (64 EP/m²)
 */
import * as fs from 'fs';
import { calcul_3cl } from '@open3cl/engine';

const base = JSON.parse(fs.readFileSync('./dpe_current.json', 'utf8'));
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function runScenario(name, dpe) {
  try {
    const result = calcul_3cl(dpe);
    const s = result.logement.sortie;
    const ep = s.ep_conso;
    const ef = s.ef_conso;
    const ab = s.apport_et_besoin;
    const dep = s.deperdition;
    const cout = s.cout;

    // Extract per-installation details
    const installs = result.logement.installation_chauffage_collection.installation_chauffage;
    const installDetails = installs.map((inst, i) => ({
      idx: i,
      desc: inst.donnee_entree.description,
      surface: inst.donnee_entree.surface_chauffee,
      besoin_ch: inst.donnee_intermediaire?.besoin_ch,
      conso_ch: inst.donnee_intermediaire?.conso_ch,
      emetteur: inst.emetteur_chauffage_collection?.emetteur_chauffage?.[0]?.donnee_intermediaire,
      generateur: inst.generateur_chauffage_collection?.generateur_chauffage?.[0]?.donnee_intermediaire,
    }));

    return {
      name,
      dep_air: dep.deperdition_renouvellement_air,
      dep_env: dep.deperdition_enveloppe,
      gv: dep.deperdition_renouvellement_air + dep.deperdition_enveloppe,
      besoin_ch: ab.besoin_ch,
      besoin_ecs: ab.besoin_ecs,
      ef_ch: ef.conso_ch,
      ef_ecs: ef.conso_ecs,
      ef_ecl: ef.conso_eclairage,
      ef_aux: ef.conso_totale_auxiliaire,
      ef_total: ef.conso_ch + ef.conso_ecs + ef.conso_eclairage + ef.conso_totale_auxiliaire,
      ep_total: ep.ep_conso_5_usages,
      ep_m2: ep.ep_conso_5_usages_m2,
      classe: ep.classe_bilan_dpe,
      ges_m2: ges_m2(s),
      classe_ges: s.emission_ges.classe_emission_ges,
      cout_annuel: cout.cout_5_usages,
      installDetails,
    };
  } catch(e) {
    console.error(`=== ${name} === ERREUR: ${e.message}`);
    console.error(e.stack);
    return null;
  }
}

function ges_m2(s) {
  return s.emission_ges?.emission_ges_5_usages_m2 ?? 0;
}

// ===== HELPER FUNCTIONS =====

function setVMCHygroB(dpe) {
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15";
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;
}

function setECSCET150L(dpe) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "CET sur air extérieur 150L";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const gen = iecs.generateur_ecs_collection.generateur_ecs[0];
  gen.donnee_entree.description = "CET sur air extérieur après 2014 — 150L";
  gen.donnee_entree.enum_type_generateur_ecs_id = "6"; // CET air ext. post-2014
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "2";
  gen.donnee_entree.enum_type_stockage_ecs_id = "2";
  gen.donnee_entree.volume_stockage = 150;
  gen.donnee_entree.position_volume_chauffe = 1;
  gen.donnee_entree.position_volume_chauffe_stockage = 1;
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_intermediaire;
}

function makeInstallation(desc, type, surfaceChauffee, emetteurType, generateurType) {
  /**
   * type: "pac_air_air" | "inertie"
   */
  const install = {
    donnee_entree: {
      description: desc,
      reference: `hybrid_${type}_${Date.now()}`,
      surface_chauffee: surfaceChauffee,
      rdim: 1,
      nombre_niveau_installation_ch: 1,
      enum_cfg_installation_ch_id: "1",
      enum_type_installation_id: "1", // individuel
      enum_methode_calcul_conso_id: "2",
    },
    emetteur_chauffage_collection: {
      emetteur_chauffage: [
        {
          donnee_entree: {
            description: "",
            reference: `em_${type}_${Date.now()}`,
            surface_chauffee: surfaceChauffee,
            enum_type_chauffage_id: "1", // individuel
            enum_temp_distribution_ch_id: "1", // pas de réseau hydraulique
            tv_rendement_distribution_ch_id: 1,
            enum_equipement_intermittence_id: "5", // thermostat + prog
            enum_type_regulation_id: "1", // thermostat d'ambiance
            enum_periode_installation_emetteur_id: "3", // après 2012
            enum_lien_generateur_emetteur_id: "1",
          },
        }
      ]
    },
    generateur_chauffage_collection: {
      generateur_chauffage: [
        {
          donnee_entree: {
            description: "",
            reference: `gen_${type}_${Date.now()}`,
            enum_type_energie_id: "1", // Électricité
            enum_usage_generateur_id: "1", // chauffage seul
            position_volume_chauffe: 1,
            enum_methode_saisie_carac_sys_id: "2",
            enum_lien_generateur_emetteur_id: "1",
          },
        }
      ]
    }
  };

  if (type === "pac_air_air") {
    install.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_entree.enum_type_emission_distribution_id = "42"; // soufflage air chaud frigorigène
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.description = "PAC air/air post-2015";
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.enum_type_generateur_ch_id = "3";
  } else if (type === "inertie") {
    install.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_entree.enum_type_emission_distribution_id = "3"; // radiateur élec NFC
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.description = "Radiateur électrique à inertie NFC";
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.enum_type_generateur_ch_id = "100";
  }

  return install;
}

function setHybridPACInertie(dpe, surfacePAC, surfaceInertie) {
  // Replace the single installation with 2 installations
  dpe.logement.installation_chauffage_collection.installation_chauffage = [
    makeInstallation(
      `PAC air/air multisplit (salon+chambres)`,
      "pac_air_air",
      surfacePAC
    ),
    makeInstallation(
      `Radiateurs inertie NFC (SDB+cuisine)`,
      "inertie",
      surfaceInertie
    ),
  ];
}

// ===== REFERENCE SCENARIOS =====

// S0 — baseline
function buildS0() { return deepClone(base); }

// S3 — tout inertie + VMC + CET
function buildS3() {
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setECSCET150L(dpe);
  // Set all 51.7m² to inertie
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Radiateurs électriques à inertie";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;
  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "3";
  em.donnee_entree.enum_type_chauffage_id = "1";
  em.donnee_entree.enum_temp_distribution_ch_id = "1";
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = "5";
  em.donnee_entree.enum_type_regulation_id = "1";
  em.donnee_entree.enum_periode_installation_emetteur_id = "3";
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;
  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "Radiateur électrique à inertie NFC";
  gen.donnee_entree.enum_type_generateur_ch_id = "100";
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
  return dpe;
}

// S9 — tout PAC air/air + VMC + CET
function buildS9() {
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setECSCET150L(dpe);
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "PAC air/air multisplit";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;
  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "42";
  em.donnee_entree.enum_type_chauffage_id = "1";
  em.donnee_entree.enum_temp_distribution_ch_id = "1";
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = "5";
  em.donnee_entree.enum_type_regulation_id = "1";
  em.donnee_entree.enum_periode_installation_emetteur_id = "3";
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;
  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "PAC air/air post-2015";
  gen.donnee_entree.enum_type_generateur_ch_id = "3";
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
  return dpe;
}

// ===== HYBRID SCENARIOS =====

// H1: PAC salon+chambres (35m²) + inertie SDB+cuisine (17m²) + VMC + CET
function buildH1() {
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setECSCET150L(dpe);
  setHybridPACInertie(dpe, 35, 16.7);
  return dpe;
}

// H2: same but without VMC
function buildH2() {
  const dpe = deepClone(base);
  setECSCET150L(dpe);
  setHybridPACInertie(dpe, 35, 16.7);
  return dpe;
}

// H3: PAC larger coverage (42m² = salon+2ch+cuisine) + inertie SDB only (10m²)
function buildH3() {
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setECSCET150L(dpe);
  setHybridPACInertie(dpe, 42, 9.7);
  return dpe;
}

// H4: PAC chambes only (20m²), inertie salon+SDB+cuisine (32m²)
// = si on veut garder l'inertie dans le salon aussi
function buildH4() {
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setECSCET150L(dpe);
  setHybridPACInertie(dpe, 20, 31.7);
  return dpe;
}

// H5: Only PAC salon (15m²), inertie everywhere else (37m²)
// = PAC mono-split salon uniquement, le reste en inertie
function buildH5() {
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setECSCET150L(dpe);
  setHybridPACInertie(dpe, 15, 36.7);
  return dpe;
}

// ===== S3 NO VMC (S4 equivalent) =====
function buildS4() {
  const dpe = deepClone(base);
  setECSCET150L(dpe);
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Radiateurs électriques à inertie";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;
  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "3";
  em.donnee_entree.enum_type_chauffage_id = "1";
  em.donnee_entree.enum_temp_distribution_ch_id = "1";
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = "5";
  em.donnee_entree.enum_type_regulation_id = "1";
  em.donnee_entree.enum_periode_installation_emetteur_id = "3";
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;
  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "Radiateur électrique à inertie NFC";
  gen.donnee_entree.enum_type_generateur_ch_id = "100";
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
  return dpe;
}

// ===== RUN ALL =====

console.log("=== HYBRID PAC + INERTIE — SIMULATION OPEN3CL ===\n");

const scenarios = [
  { name: "S0  — Actuel (gaz collectif)", build: buildS0 },
  { name: "S3  — Tout inertie + VMC + CET", build: buildS3 },
  { name: "S4  — Tout inertie + CET (sans VMC)", build: buildS4 },
  { name: "S9  — Tout PAC air/air + VMC + CET", build: buildS9 },
  { name: "H1  — PAC 35m² + Inertie 17m² + VMC + CET", build: buildH1 },
  { name: "H2  — PAC 35m² + Inertie 17m² + CET (sans VMC)", build: buildH2 },
  { name: "H3  — PAC 42m² + Inertie 10m² + VMC + CET", build: buildH3 },
  { name: "H4  — PAC 20m² (ch) + Inertie 32m² (sal+sdb+cui) + VMC", build: buildH4 },
  { name: "H5  — PAC 15m² (salon) + Inertie 37m² + VMC", build: buildH5 },
];

const results = [];
for (const sc of scenarios) {
  const r = runScenario(sc.name, sc.build());
  if (r) results.push(r);
}

console.log("\n=== RÉSUMÉ COMPARATIF ===\n");
console.log("| Scénario | EP/m² | Classe | GES | €/an | EF ch | EF ecs | EF aux | EF tot |");
console.log("|---|---|---|---|---|---|---|---|---|");
for (const r of results) {
  console.log(`| ${r.name} | **${r.ep_m2}** | **${r.classe}** | ${r.ges_m2} | ${Math.round(r.cout_annuel)} | ${Math.round(r.ef_ch)} | ${Math.round(r.ef_ecs)} | ${Math.round(r.ef_aux)} | ${Math.round(r.ef_total)} |`);
}

console.log("\n=== DÉTAIL PAR INSTALLATION (scénarios hybrides) ===\n");
for (const r of results) {
  if (r.name.startsWith("H")) {
    console.log(`\n--- ${r.name} ---`);
    console.log(`  GV total: ${r.gv.toFixed(1)} W/K (env: ${r.dep_env.toFixed(1)}, air: ${r.dep_air.toFixed(1)})`);
    console.log(`  Besoin CH: ${Math.round(r.besoin_ch)} kWh`);
    for (const inst of r.installDetails) {
      console.log(`  Installation ${inst.idx}: ${inst.desc}`);
      console.log(`    Surface: ${inst.surface} m²`);
      console.log(`    Besoin CH: ${inst.besoin_ch?.toFixed(0) ?? 'N/A'} kWh`);
      console.log(`    Conso CH: ${inst.conso_ch?.toFixed(0) ?? 'N/A'} kWh EF`);
      if (inst.emetteur) {
        console.log(`    re=${inst.emetteur.rendement_emission?.toFixed(3)}, rd=${inst.emetteur.rendement_distribution?.toFixed(3)}, rr=${inst.emetteur.rendement_regulation?.toFixed(3)}, I0=${inst.emetteur.i0?.toFixed(3)}`);
      }
      if (inst.generateur) {
        console.log(`    Rendement génération: ${inst.generateur.rendement_generation?.toFixed(4) ?? 'N/A'}`);
        console.log(`    Conso gen: ${inst.generateur.conso_ch?.toFixed(0) ?? 'N/A'} kWh`);
      }
    }
  }
}

// ===== ANALYSE 2 ÉTAPES =====
console.log("\n\n=== ANALYSE STRATÉGIE EN 2 ÉTAPES ===\n");

const s0 = results.find(r => r.name.startsWith("S0"));
const s3 = results.find(r => r.name.startsWith("S3"));
const s4 = results.find(r => r.name.startsWith("S4"));
const s9 = results.find(r => r.name.startsWith("S9"));
const h1 = results.find(r => r.name.startsWith("H1"));
const h2 = results.find(r => r.name.startsWith("H2"));
const h3 = results.find(r => r.name.startsWith("H3"));

if (s0 && s3 && s4 && s9 && h1 && h2 && h3) {
  console.log("ÉTAPE 1 — Radiateurs inertie partout + CET + VMC");
  console.log(`  S3: ${s3.ep_m2} EP/m² (${s3.classe}), ${Math.round(s3.cout_annuel)} €/an`);
  console.log(`  Investissement: ~5 000-7 000 € (5 rads inertie + CET + VMC)`);
  console.log(`  Économie vs S0: ${Math.round(s0.cout_annuel - s3.cout_annuel)} €/an`);
  console.log("");
  console.log("ÉTAPE 2 — Ajout PAC air/air, retrait de certains radiateurs");
  console.log(`  H1: ${h1.ep_m2} EP/m² (${h1.classe}), ${Math.round(h1.cout_annuel)} €/an`);
  console.log(`  Surcoût PAC: ~4 000-8 000 € (1 UE + 2-3 UI multisplit)`);
  console.log(`  Économie supplémentaire vs S3: ${Math.round(s3.cout_annuel - h1.cout_annuel)} €/an`);
  console.log("");
  console.log("COMPARAISON DIRECTE:");
  console.log(`  S9 (tout PAC direct): ${s9.ep_m2} EP/m² (${s9.classe}), ${Math.round(s9.cout_annuel)} €/an`);
  console.log(`  H1 (hybride final):   ${h1.ep_m2} EP/m² (${h1.classe}), ${Math.round(h1.cout_annuel)} €/an`);
  console.log(`  Écart: ${h1.ep_m2 - s9.ep_m2} EP/m², ${Math.round(h1.cout_annuel - s9.cout_annuel)} €/an`);
  console.log(`  H3 (PAC 42m² final):  ${h3.ep_m2} EP/m² (${h3.classe}), ${Math.round(h3.cout_annuel)} €/an`);
}
