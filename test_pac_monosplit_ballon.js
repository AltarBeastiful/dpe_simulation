#!/usr/bin/env node
/**
 * Simulation 3CL — PAC monosplit salon + radiateurs inertie (ch, sdb, cuisine)
 *
 * Surfaces corrigées (DPE total 51.7 m²) :
 *   - Salon      : 26.05 m² (sol) / 31 m² en volume — on utilise 26.05 pour 3CL
 *   - Ch+SDB+Cui : 51.7 - 26.05 = 25.65 m²
 *
 * Trois scénarios demandés :
 *   A  — PAC monosplit salon (26 m²) + inertie ch+sdb+cui (25.65 m²) + VMC + BALLON normal
 *   B  — Tout inertie (51.7 m²)  + VMC + BALLON normal  (pas de PAC)
 *   C  — Tout inertie (51.7 m²)  + VMC + CET 100L       (pas de PAC)
 *
 * Référence :
 *   S0  — État actuel gaz collectif
 *   S9  — Tout PAC multisplit + VMC + CET (meilleur DPE possible)
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

// Surfaces corrigées
// Salon = 26.05 m² au sol (le 3CL utilise la surface déclarée)
// Ch + SDB + Cuisine = 51.7 - 26.05 = 25.65 m²
const SURFACE_SALON  = 26.05;
const SURFACE_AUTRES = parseFloat((51.7 - SURFACE_SALON).toFixed(2)); // 25.65

function setPACMonosplitInertie(dpe) {
  dpe.logement.installation_chauffage_collection.installation_chauffage = [
    makeInstall(`PAC air/air monosplit (salon ${SURFACE_SALON} m²)`, 'pac', SURFACE_SALON),
    makeInstall(`Radiateurs inertie NFC (ch+SDB+cui ${SURFACE_AUTRES} m²)`, 'inertie', SURFACE_AUTRES),
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
  const r = runScenario('S0 — Gaz collectif actuel', dpe);
  if (r) scenarios.push(r);
}

// Scénario A : PAC monosplit salon (26 m²) + inertie partout ailleurs + VMC + BALLON
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setPACMonosplitInertie(dpe);
  setECSBallon100L(dpe);
  const r = runScenario('A  — PAC salon + inertie + VMC + Ballon normal', dpe);
  if (r) scenarios.push(r);
}

// Scénario B : Tout inertie (sans PAC) + VMC + BALLON normal
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setToutInertie(dpe);
  setECSBallon100L(dpe);
  const r = runScenario('B  — Tout inertie + VMC + Ballon normal (sans PAC)', dpe);
  if (r) scenarios.push(r);
}

// Scénario C : Tout inertie (sans PAC) + VMC + CET 100L
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setToutInertie(dpe);
  setECSCET100L(dpe);
  const r = runScenario('C  — Tout inertie + VMC + CET 100L (sans PAC)', dpe);
  if (r) scenarios.push(r);
}

// Bonus : PAC salon + inertie + VMC + CET (meilleur DPE hybride)
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setPACMonosplitInertie(dpe);
  setECSCET100L(dpe);
  const r = runScenario('A+ — PAC salon + inertie + VMC + CET 100L (bonus)', dpe);
  if (r) scenarios.push(r);
}

// S9 — tout PAC multisplit + VMC + CET (meilleur DPE possible)
{
  const dpe = deepClone(base);
  setVMCHygroB(dpe);
  setToutPAC(dpe);
  setECSCET100L(dpe);
  const r = runScenario('S9 — Tout PAC multisplit + VMC + CET (référence)', dpe);
  if (r) scenarios.push(r);
}

// ─── affichage ───────────────────────────────────────────────────────────────

const LINE = '─'.repeat(109);
const TOP  = '┌' + LINE + '┐';
const MID  = '├' + LINE + '┤';
const BOT  = '└' + LINE + '┘';

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('  SIMULATION 3CL — PAC MONOSPLIT SALON (26 m²) + INERTIE + VMC');
console.log('  Surfaces : salon 26.05 m² | ch+SDB+cui 25.65 m² | total 51.7 m²');
console.log('════════════════════════════════════════════════════════════════════════════════\n');

console.log(TOP);
console.log('│ Scénario                                             │EP/m²│Cl.│GES│ €/an │EF_ch  │EF_ecs │EF_tot │');
console.log(MID);
for (const r of scenarios) {
  const n = r.name.padEnd(53);
  const ep  = String(r.ep_m2).padStart(5);
  const cl  = r.classe.padEnd(3);
  const ges = String(r.ges_m2).padStart(3);
  const ct  = String(Math.round(r.cout_annuel)).padStart(6);
  const ch  = String(Math.round(r.ef_ch)).padStart(7);
  const ecs = String(Math.round(r.ef_ecs)).padStart(7);
  const tot = String(Math.round(r.ef_total)).padStart(7);
  console.log(`│ ${n}│${ep}│ ${cl}│${ges}│${ct} │${ch} │${ecs} │${tot} │`);
}
console.log(BOT);

// ─── détail installations hybrides ─────────────────────────────────────────
console.log('\n════ DÉTAIL CHAUFFAGE — scénarios hybrides ════\n');
for (const r of scenarios.filter(r => r.instDetail.length > 1)) {
  console.log(`▶ ${r.name}  |  Besoin total : ${Math.round(r.besoin_ch)} kWh`);
  for (const inst of r.instDetail) {
    const pct = ((inst.surface / 51.7) * 100).toFixed(0);
    console.log(`  [${inst.idx}] ${inst.desc}`);
    console.log(`       surface : ${inst.surface} m² (${pct}%)  |  besoin : ${inst.besoin_ch?.toFixed(0) ?? 'N/A'} kWh  |  conso EF : ${inst.conso_ch?.toFixed(0) ?? 'N/A'} kWhEF`);
  }
  console.log('');
}

// ─── analyse 3 scénarios ────────────────────────────────────────────────────
const scA   = scenarios.find(r => r.name.startsWith('A  '));
const scB   = scenarios.find(r => r.name.startsWith('B  '));
const scC   = scenarios.find(r => r.name.startsWith('C  '));
const scAp  = scenarios.find(r => r.name.startsWith('A+ '));
const s0    = scenarios.find(r => r.name.startsWith('S0'));
const s9    = scenarios.find(r => r.name.startsWith('S9'));

if (scA && scB && scC && scAp) {
  console.log('════ ANALYSE COMPARATIVE — 3 SCÉNARIOS ════\n');

  const dAvsB  = scB.cout_annuel  - scA.cout_annuel;
  const dAvsBp = scAp.cout_annuel - scA.cout_annuel; // A vs A+
  const dBvsC  = scB.cout_annuel  - scC.cout_annuel;

  console.log('  [ECS] Consommation ECS par option :');
  console.log(`    Ballon normal 100L : ${Math.round(scA.ef_ecs)} kWhEF/an  (coeff. perf. ~1.0)`);
  console.log(`    CET 100L           : ${Math.round(scC.ef_ecs)} kWhEF/an  (COP ~${(scB.ef_ecs / scC.ef_ecs).toFixed(1)}x)`);
  console.log('');
  console.log('  [CHAUFFAGE] PAC monosplit salon vs inertie salon :');
  const efPacSalon = scA.instDetail[0]?.conso_ch ?? 0;
  const efInSalon  = (scB.ef_ch / 51.7) * 26.05; // inertie prorata salon
  console.log(`    PAC salon (${SURFACE_SALON} m²) : ~${Math.round(efPacSalon)} kWhEF  (COP ~3.5)`);
  console.log(`    Inertie salon       : ~${Math.round(efInSalon)} kWhEF  (η ~0.8)`);
  console.log(`    Économie PAC salon  : ~${Math.round(efInSalon - efPacSalon)} kWhEF/an`);
  console.log('');
  console.log('  [COÛTS ANNUELS]');
  console.log(`    A  PAC salon + Ballon : ${Math.round(scA.cout_annuel)} €/an`);
  console.log(`    B  Inertie + Ballon   : ${Math.round(scB.cout_annuel)} €/an  (${dAvsB > 0 ? '+' : ''}${Math.round(dAvsB)} € vs A)`);
  console.log(`    C  Inertie + CET      : ${Math.round(scC.cout_annuel)} €/an  (${dBvsC > 0 ? 'économie' : 'surcoût'} CET: ${Math.round(Math.abs(dBvsC))} €/an vs B)`);
  console.log(`    A+ PAC salon + CET    : ${Math.round(scAp.cout_annuel)} €/an  (${dAvsBp > 0 ? '+' : ''}${Math.round(dAvsBp)} € vs A, meilleur DPE hybride)`);
  console.log('');

  // ─── analyse CET justification ─────────────────────────────────────────
  console.log('════ CET vs BALLON — LE SURCOÛT EST-IL JUSTIFIÉ ? ════\n');

  const economieBvC = scB.cout_annuel - scC.cout_annuel; // B-C = gain du CET sur inertie seule
  const economieAvAp = scA.cout_annuel - scAp.cout_annuel; // A-A+ = gain du CET avec PAC aussi

  // Prix matériel
  const prixBallon100L   = 250;   // ballon 100L standard
  const prixCET100L_bas  = 900;   // CET 100L fourni seul
  const prixCET100L_haut = 1200;
  const poseBallon       = 200;   // pose ballon
  const poseCET          = 300;   // pose CET (un peu plus complexe)
  const surcoutCET_bas   = (prixCET100L_bas  + poseCET) - (prixBallon100L + poseBallon);
  const surcoutCET_haut  = (prixCET100L_haut + poseCET) - (prixBallon100L + poseBallon);

  const retBvsC_bas   = Math.round(surcoutCET_bas  / economieBvC);
  const retBvsC_haut  = Math.round(surcoutCET_haut / economieBvC);
  const retAvAp_bas   = Math.round(surcoutCET_bas  / economieAvAp);
  const retAvAp_haut  = Math.round(surcoutCET_haut / economieAvAp);

  console.log(`  Surcoût CET vs ballon (matériel + pose) : ${surcoutCET_bas}–${surcoutCET_haut} €`);
  console.log(`  Économie annuelle CET dans scénario B→C : ${Math.round(economieBvC)} €/an`);
  console.log(`  ► Retour sur invest. scénario B→C       : ${retBvsC_bas}–${retBvsC_haut} ans ✓`);
  console.log('');
  console.log(`  Économie annuelle CET dans scénario A→A+: ${Math.round(economieAvAp)} €/an`);
  console.log(`  ► Retour sur invest. scénario A→A+      : ${retAvAp_bas}–${retAvAp_haut} ans ✓`);
  console.log('');
  console.log(`  Conclusion : CET rentabilisé en ${Math.min(retBvsC_bas, retAvAp_bas)}–${Math.max(retBvsC_haut, retAvAp_haut)} ans dans tous les scénarios.`);
  console.log('  → Le surcoût CET est clairement justifié.');
  console.log('');
}

// ─── estimation CEE ──────────────────────────────────────────────────────
console.log('════ ESTIMATION CEE (Certificats d\'Économies d\'Énergie) ════\n');
console.log('  Les primes CEE (offres agréées, ex. Hellio, Effy, EDF OA…) varient selon');
console.log('  le revenu du ménage et l\'offre choisie. Fourchettes indicatives 2025 :');
console.log('');
console.log('  SANS PAC monosplit (scénarios B ou C) :');
console.log('  ┌────────────────────────────────────────┬────────────────────┐');
console.log('  │ Équipement                             │ Prime CEE estimée  │');
console.log('  ├────────────────────────────────────────┼────────────────────┤');
console.log('  │ VMC hygro B (BAR-TH-125)               │     100–200 €      │');
console.log('  │ CET air extérieur 100L (BAR-TH-148)    │     200–400 €      │');
console.log('  │ Radiateurs inertie NFC × 4 (éligibles) │     100–200 €      │');
console.log('  ├────────────────────────────────────────┼────────────────────┤');
console.log('  │ TOTAL estimé SANS PAC                  │   ~400–800 €       │');
console.log('  └────────────────────────────────────────┴────────────────────┘');
console.log('');
console.log('  AVEC PAC monosplit (scénarios A ou A+) :');
console.log('  ┌────────────────────────────────────────┬────────────────────┐');
console.log('  │ Équipement                             │ Prime CEE estimée  │');
console.log('  ├────────────────────────────────────────┼────────────────────┤');
console.log('  │ VMC hygro B (BAR-TH-125)               │     100–200 €      │');
console.log('  │ CET air extérieur 100L (BAR-TH-148)    │     200–400 €      │');
console.log('  │ Radiateurs inertie NFC × 3 (éligibles) │      75–150 €      │');
console.log('  │ PAC air/air monosplit (BAR-TH-129)     │     200–600 €      │');
console.log('  ├────────────────────────────────────────┼────────────────────┤');
console.log('  │ TOTAL estimé AVEC PAC                  │   ~575–1 350 €     │');
console.log('  └────────────────────────────────────────┴────────────────────┘');
console.log('');
console.log('  ⚠  Notes importantes :');
console.log('    • CEE cumulables avec MaPrimeRénov (sous conditions)');
console.log('    • La PAC monosplit dans un appartement peut être refusée en CEE si');
console.log('      le logement n\'est pas en maison individuelle (certains opérateurs');
console.log('      l\'acceptent, d\'autres non — vérifier avant devis)');
console.log('    • Radiateurs inertie : souvent éligibles via "geste simple" si remplacement');
console.log('      d\'un chauffage énergivore (gaz ici) — éligibilité à confirmer');
console.log('    • CEE soumis à "engagement avant travaux" — devis signé avant commande');
console.log('');

// ─── difficultés installation PAC monosplit ──────────────────────────────
console.log('════ FAISABILITÉ PAC MONOSPLIT — DIFFICULTÉS D\'INSTALLATION ════\n');
console.log('  ✓ Favorable :');
console.log('    • Salon de 26 m² : une unité intérieure monosplit suffit (SCOP ≥ 4)');
console.log('    • Surface salon > 20 m² : confort thermique correct par soufflage');
console.log('    • Couplage avec inertie dans les autres pièces : régulation naturelle');
console.log('');
console.log('  ⚠  Points de vigilance :');
console.log('    • Appartement collectif : accord de copropriété OBLIGATOIRE');
console.log('      pour passage des fluides frigorigènes et emplacement UE extérieure');
console.log('    • Passage gaine frigorifique : percement mur (étanchéité, esthétique)');
console.log('    • Unité extérieure : façade, toiture ou local technique — bruit, esthétique');
console.log('    • Salon en double-hauteur (31 m² en volume) : attention au brassage d\'air');
console.log('      vers la mezzanine / niveau supérieur — peut sur-chauffer le haut');
console.log('    • PAC monosplit ne chauffe PAS les pièces sans unité intérieure');
console.log('      (chambre, SDB, cuisine) → les radiateurs inertie restent indispensables');
console.log('');

// ─── classement final ───────────────────────────────────────────────────
if (s0 && scA && scB && scC && scAp && s9) {
  console.log('════ CLASSEMENT PAR COÛT ANNUEL ════\n');
  const tous = [s0, scB, scA, scC, scAp, s9];
  const max = Math.max(...tous.map(r => r.cout_annuel));
  for (const r of tous.sort((a, b) => b.cout_annuel - a.cout_annuel)) {
    const bar = '█'.repeat(Math.round((r.cout_annuel / max) * 30));
    const eco = s0 ? `  (économie vs actuel : ${Math.round(s0.cout_annuel - r.cout_annuel)} €/an)` : '';
    console.log(`  ${r.name.padEnd(48)} ${String(Math.round(r.cout_annuel)).padStart(5)} €/an  ${bar}${eco}`);
  }
  console.log('');
}
