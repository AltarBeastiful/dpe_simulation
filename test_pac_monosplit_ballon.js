#!/usr/bin/env node
/**
 * Simulation 3CL — PAC monosplit salon + radiateurs inertie (ch, sdb, cuisine)
 *
 * Scénario de base demandé :
 *   - PAC air/air monosplit dans le salon (~15 m²)
 *   - Radiateurs inertie NFC dans chambre, SDB, cuisine (~36.7 m²)
 *   - VMC hygro B
 *
 * Deux variantes ECS comparées :
 *   HB1 — ballon électrique classique 100L  (~400-600 €)
 *   HB2 — CET air extérieur 100L            (~1 000-1 400 €)
 *
 * Références incluses :
 *   S0  — État actuel gaz collectif
 *   S3  — Tout inertie + VMC + CET (meilleure option sans PAC)
 *   S9  — Tout PAC air/air + VMC + CET (meilleure option tout PAC)
 *   H5  — PAC salon + inertie partout + VMC + CET (identique à HB2)
 */

import * as fs from 'fs';
import { calcul_3cl } from '@open3cl/engine';

const base = JSON.parse(fs.readFileSync('./dpe_current.json', 'utf8'));
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ─── helpers ───────────────────────────────────────────────────────────────

function setVMCHygroB(dpe) {
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = '15';
  v.donnee_entree.description = 'VMC SF Hygroréglable B';
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;
}

function setECSBallon100L(dpe) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = 'Ballon électrique classique 100L';
  iecs.donnee_entree.enum_type_installation_id = '1';
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = '1';
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const gen = iecs.generateur_ecs_collection.generateur_ecs[0];
  gen.donnee_entree.description = 'Ballon électrique vertical 100L (cat. B / 2 étoiles)';
  gen.donnee_entree.enum_type_generateur_ecs_id = '30'; // ballon élec. vertical cat. B
  gen.donnee_entree.enum_type_energie_id = '1';         // électricité
  gen.donnee_entree.enum_usage_generateur_id = '2';     // ECS seule
  gen.donnee_entree.enum_type_stockage_ecs_id = '2';    // avec stockage
  gen.donnee_entree.volume_stockage = 100;
  gen.donnee_entree.position_volume_chauffe = 1;
  gen.donnee_entree.position_volume_chauffe_stockage = 1;
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_intermediaire;
}

function setECSCET100L(dpe) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = 'CET sur air extérieur 100L';
  iecs.donnee_entree.enum_type_installation_id = '1';
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = '1';
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const gen = iecs.generateur_ecs_collection.generateur_ecs[0];
  gen.donnee_entree.description = 'CET air extérieur post-2014 — 100L';
  gen.donnee_entree.enum_type_generateur_ecs_id = '6'; // CET air ext. post-2014
  gen.donnee_entree.enum_type_energie_id = '1';
  gen.donnee_entree.enum_usage_generateur_id = '2';
  gen.donnee_entree.enum_type_stockage_ecs_id = '2';
  gen.donnee_entree.volume_stockage = 100;
  gen.donnee_entree.position_volume_chauffe = 1;
  gen.donnee_entree.position_volume_chauffe_stockage = 1;
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_intermediaire;
}

function makeInstall(desc, type, surface) {
  const install = {
    donnee_entree: {
      description: desc,
      reference: `${type}_${surface}`,
      surface_chauffee: surface,
      rdim: 1,
      nombre_niveau_installation_ch: 1,
      enum_cfg_installation_ch_id: '1',
      enum_type_installation_id: '1',
      enum_methode_calcul_conso_id: '2',
    },
    emetteur_chauffage_collection: {
      emetteur_chauffage: [{
        donnee_entree: {
          description: '',
          reference: `em_${type}`,
          surface_chauffee: surface,
          enum_type_chauffage_id: '1',
          enum_temp_distribution_ch_id: '1',
          tv_rendement_distribution_ch_id: 1,
          enum_equipement_intermittence_id: '5',
          enum_type_regulation_id: '1',
          enum_periode_installation_emetteur_id: '3',
          enum_lien_generateur_emetteur_id: '1',
        },
      }],
    },
    generateur_chauffage_collection: {
      generateur_chauffage: [{
        donnee_entree: {
          description: '',
          reference: `gen_${type}`,
          enum_type_energie_id: '1',
          enum_usage_generateur_id: '1',
          position_volume_chauffe: 1,
          enum_methode_saisie_carac_sys_id: '2',
          enum_lien_generateur_emetteur_id: '1',
        },
      }],
    },
  };

  if (type === 'pac') {
    install.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_entree.enum_type_emission_distribution_id = '42';
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.description = 'PAC air/air monosplit post-2015';
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.enum_type_generateur_ch_id = '3';
  } else {
    install.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_entree.enum_type_emission_distribution_id = '3';
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.description = 'Radiateur électrique inertie NFC';
    install.generateur_chauffage_collection.generateur_chauffage[0].donnee_entree.enum_type_generateur_ch_id = '100';
  }
  return install;
}

// PAC monosplit salon (15 m²) + inertie ch+sdb+cui (36.7 m²)
function setPACMonosplitInertie(dpe) {
  dpe.logement.installation_chauffage_collection.installation_chauffage = [
    makeInstall('PAC air/air monosplit (salon)', 'pac', 15),
    makeInstall('Radiateurs inertie NFC (chambre, SDB, cuisine)', 'inertie', 36.7),
  ];
}

// ─── build full inertie reference (S3) ─────────────────────────────────────

function setToutInertie(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = 'Radiateurs électriques inertie — tout logement';
  ich.donnee_entree.enum_type_installation_id = '1';
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;
  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = '3';
  em.donnee_entree.enum_type_chauffage_id = '1';
  em.donnee_entree.enum_temp_distribution_ch_id = '1';
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = '5';
  em.donnee_entree.enum_type_regulation_id = '1';
  em.donnee_entree.enum_periode_installation_emetteur_id = '3';
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;
  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = 'Radiateur inertie NFC';
  gen.donnee_entree.enum_type_generateur_ch_id = '100';
  gen.donnee_entree.enum_type_energie_id = '1';
  gen.donnee_entree.enum_usage_generateur_id = '1';
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setToutPAC(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = 'PAC air/air multisplit — tout logement';
  ich.donnee_entree.enum_type_installation_id = '1';
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;
  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = '42';
  em.donnee_entree.enum_type_chauffage_id = '1';
  em.donnee_entree.enum_temp_distribution_ch_id = '1';
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = '5';
  em.donnee_entree.enum_type_regulation_id = '1';
  em.donnee_entree.enum_periode_installation_emetteur_id = '3';
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;
  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = 'PAC air/air post-2015';
  gen.donnee_entree.enum_type_generateur_ch_id = '3';
  gen.donnee_entree.enum_type_energie_id = '1';
  gen.donnee_entree.enum_usage_generateur_id = '1';
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

// ─── runner ─────────────────────────────────────────────────────────────────

function runScenario(name, dpe) {
  try {
    const result = calcul_3cl(dpe);
    const s = result.logement.sortie;
    const ep = s.ep_conso;
    const ef = s.ef_conso;
    const ab = s.apport_et_besoin;
    const dep = s.deperdition;
    const cout = s.cout;

    const installs = result.logement.installation_chauffage_collection.installation_chauffage;
    const instDetail = installs.map((inst, i) => ({
      idx: i,
      desc: inst.donnee_entree.description,
      surface: inst.donnee_entree.surface_chauffee,
      besoin_ch: inst.donnee_intermediaire?.besoin_ch,
      conso_ch: inst.donnee_intermediaire?.conso_ch,
    }));

    return {
      name,
      dep_air: dep.deperdition_renouvellement_air,
      dep_env: dep.deperdition_enveloppe,
      besoin_ch: ab.besoin_ch,
      besoin_ecs: ab.besoin_ecs,
      ef_ch: ef.conso_ch,
      ef_ecs: ef.conso_ecs,
      ef_ecl: ef.conso_eclairage,
      ef_aux: ef.conso_totale_auxiliaire,
      ef_total: ef.conso_ch + ef.conso_ecs + ef.conso_eclairage + ef.conso_totale_auxiliaire,
      ep_ch: ep.ep_conso_ch,
      ep_ecs: ep.ep_conso_ecs,
      ep_total: ep.ep_conso_5_usages,
      ep_m2: ep.ep_conso_5_usages_m2,
      classe: ep.classe_bilan_dpe,
      ges_m2: s.emission_ges?.emission_ges_5_usages_m2 ?? 0,
      classe_ges: s.emission_ges?.classe_emission_ges,
      cout_annuel: cout.cout_5_usages,
      instDetail,
    };
  } catch (e) {
    console.error(`\n=== ${name} === ERREUR: ${e.message}`);
    return null;
  }
}

// ─── scénarios ──────────────────────────────────────────────────────────────

const scenarios = [];

// S0 — état actuel gaz collectif
{
  const dpe = deepClone(base);
  const r = runScenario('S0  — Gaz collectif actuel', dpe);
  if (r) scenarios.push(r);
}

// S3 — tout inertie + VMC + CET (référence sans PAC)
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setToutInertie(dpe);
  setECSCET100L(dpe);
  const r = runScenario('S3  — Tout inertie + VMC + CET 100L', dpe);
  if (r) scenarios.push(r);
}

// S9 — tout PAC + VMC + CET (référence tout PAC)
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setToutPAC(dpe);
  setECSCET100L(dpe);
  const r = runScenario('S9  — Tout PAC air/air + VMC + CET 100L', dpe);
  if (r) scenarios.push(r);
}

// HB1 — PAC monosplit salon + inertie ch+sdb+cui + VMC + ballon 100L
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setPACMonosplitInertie(dpe);
  setECSBallon100L(dpe);
  const r = runScenario('HB1 — PAC salon + inertie + VMC + BALLON 100L', dpe);
  if (r) scenarios.push(r);
}

// HB2 — PAC monosplit salon + inertie ch+sdb+cui + VMC + CET 100L
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setPACMonosplitInertie(dpe);
  setECSCET100L(dpe);
  const r = runScenario('HB2 — PAC salon + inertie + VMC + CET 100L', dpe);
  if (r) scenarios.push(r);
}

// ─── affichage ───────────────────────────────────────────────────────────────

console.log('\n════════════════════════════════════════════════════════════════');
console.log('  PAC MONOSPLIT SALON + INERTIE — SIMULATION OPEN3CL (3CL-DPE)');
console.log('════════════════════════════════════════════════════════════════\n');

console.log('┌─────────────────────────────────────────┬──────┬───────┬─────┬───────┬──────────┬──────────┬──────────┐');
console.log('│ Scénario                                │EP/m² │Classe │GES  │ €/an  │ EF ch    │ EF ecs   │ EF total │');
console.log('├─────────────────────────────────────────┼──────┼───────┼─────┼───────┼──────────┼──────────┼──────────┤');
for (const r of scenarios) {
  const name = r.name.padEnd(41);
  console.log(`│ ${name}│ ${String(r.ep_m2).padStart(4)} │  ${r.classe}    │  ${String(r.ges_m2).padStart(2)} │ ${String(Math.round(r.cout_annuel)).padStart(5)} │ ${String(Math.round(r.ef_ch)).padStart(8)} │ ${String(Math.round(r.ef_ecs)).padStart(8)} │ ${String(Math.round(r.ef_total)).padStart(8)} │`);
}
console.log('└─────────────────────────────────────────┴──────┴───────┴─────┴───────┴──────────┴──────────┴──────────┘');

console.log('\n════ DÉTAIL INSTALLATIONS CHAUFFAGE ════\n');
for (const r of scenarios.filter(r => r.instDetail.length > 1)) {
  console.log(`▶ ${r.name}`);
  console.log(`  Besoin total chauffage : ${Math.round(r.besoin_ch)} kWh`);
  for (const inst of r.instDetail) {
    console.log(`  [${inst.idx}] ${inst.desc}`);
    console.log(`      surface  : ${inst.surface} m²`);
    console.log(`      besoin   : ${inst.besoin_ch?.toFixed(0) ?? 'N/A'} kWh`);
    console.log(`      conso EF : ${inst.conso_ch?.toFixed(0) ?? 'N/A'} kWhEF`);
  }
  console.log('');
}

console.log('\n════ ANALYSE — BALLON 100L vs CET 100L ════\n');

const hb1 = scenarios.find(r => r.name.startsWith('HB1'));
const hb2 = scenarios.find(r => r.name.startsWith('HB2'));
const s0  = scenarios.find(r => r.name.startsWith('S0'));
const s3  = scenarios.find(r => r.name.startsWith('S3'));
const s9  = scenarios.find(r => r.name.startsWith('S9'));

if (hb1 && hb2) {
  const deltaEf_ecs  = hb1.ef_ecs  - hb2.ef_ecs;
  const deltaCout    = hb1.cout_annuel - hb2.cout_annuel;

  console.log(`EF ECS ballon    : ${Math.round(hb1.ef_ecs)} kWhEF/an`);
  console.log(`EF ECS CET       : ${Math.round(hb2.ef_ecs)} kWhEF/an`);
  console.log(`Économie ECS CET : ${Math.round(deltaEf_ecs)} kWhEF/an (÷ ~${(hb1.ef_ecs / hb2.ef_ecs).toFixed(1)}x)`);
  console.log('');
  console.log(`Coût annuel HB1 (ballon) : ${Math.round(hb1.cout_annuel)} €/an`);
  console.log(`Coût annuel HB2 (CET)    : ${Math.round(hb2.cout_annuel)} €/an`);
  console.log(`Économie annuelle CET    : ${Math.round(deltaCout)} €/an`);
  console.log('');
  const surcoutCET = 600; // fourchette basse installation CET vs ballon
  const surcoutCET_haut = 900;
  const retour_bas  = Math.round(surcoutCET     / deltaCout);
  const retour_haut = Math.round(surcoutCET_haut / deltaCout);
  console.log(`Surcoût CET vs ballon : ~${surcoutCET}–${surcoutCET_haut} € (fourni + posé)`);
  console.log(`Retour sur investissement : ${retour_bas}–${retour_haut} ans`);
  console.log('');
  console.log(`EP/m² HB1 (ballon) : ${hb1.ep_m2} — Classe ${hb1.classe}`);
  console.log(`EP/m² HB2 (CET)    : ${hb2.ep_m2} — Classe ${hb2.classe}`);
  console.log('');
}

if (s0 && hb1 && hb2 && s3 && s9) {
  console.log('════ POSITIONNEMENT DANS LE CLASSEMENT ════\n');
  const all = [s0, s3, hb1, hb2, s9];
  for (const r of all.sort((a, b) => a.cout_annuel - b.cout_annuel)) {
    const bar = '█'.repeat(Math.round(r.cout_annuel / 50));
    console.log(`  ${r.name.padEnd(45)} ${String(Math.round(r.cout_annuel)).padStart(5)} €/an  ${bar}`);
  }
}
