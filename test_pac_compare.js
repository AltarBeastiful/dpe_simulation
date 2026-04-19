import * as fs from 'fs';
import { calcul_3cl } from '@open3cl/engine';

const base = JSON.parse(fs.readFileSync('./dpe_current.json', 'utf8'));
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function setVMCHygroB(dpe) {
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15";
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;
}

function setECSCET(dpe) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "CET sur air extérieur";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;
  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "CET air ext. 150L";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "6";
  genecs.donnee_entree.enum_type_energie_id = "1";
  genecs.donnee_entree.enum_usage_generateur_id = "2";
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2";
  genecs.donnee_entree.volume_stockage = 150;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;
}

function setPACairair(dpe) {
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
  gen.donnee_entree.description = "PAC air/air multi-split post-2015";
  gen.donnee_entree.enum_type_generateur_ch_id = "3";
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function improveWindows(dpe) {
  for (const bv of dpe.logement.enveloppe.baie_vitree_collection.baie_vitree) {
    bv.donnee_entree.enum_type_vitrage_id = "3";
    bv.donnee_entree.enum_type_materiaux_menuiserie_id = "2";
    bv.donnee_entree.enum_type_baie_id = "1";
    bv.donnee_entree.vitrage_vir = 1;
    bv.donnee_entree.enum_type_gaz_lame_id = "2";
    bv.donnee_entree.epaisseur_lame = 16;
    bv.donnee_entree.enum_inclinaison_vitrage_id = "1";
    bv.donnee_entree.enum_type_fermeture_id = "6";
    bv.donnee_entree.presence_joint = 1;
    bv.donnee_entree.presence_retour_isolation = 1;
    delete bv.donnee_entree.tv_coef_masque_proche_id;
    delete bv.donnee_entree.tv_ug_id;
    delete bv.donnee_entree.tv_uw_id;
    delete bv.donnee_entree.tv_ujn_id;
    delete bv.donnee_entree.tv_sw_id;
    delete bv.donnee_intermediaire;
  }
}

function improveWalls(dpe) {
  for (const m of dpe.logement.enveloppe.mur_collection.mur) {
    m.donnee_entree.enum_type_isolation_id = "2";
    m.donnee_entree.enum_periode_isolation_id = "7";
    m.donnee_entree.epaisseur_isolation = 140;
    delete m.donnee_entree.tv_umur_id;
    delete m.donnee_intermediaire;
  }
}

function improveRoof(dpe) {
  for (const ph of dpe.logement.enveloppe.plancher_haut_collection.plancher_haut) {
    ph.donnee_entree.enum_type_isolation_id = "2";
    ph.donnee_entree.enum_periode_isolation_id = "7";
    ph.donnee_entree.epaisseur_isolation = 300;
    delete ph.donnee_entree.tv_uph_id;
    delete ph.donnee_intermediaire;
  }
}

function run(label, dpe) {
  const r = calcul_3cl(dpe);
  const s = r.logement.sortie;
  const inst = r.logement.installation_chauffage_collection.installation_chauffage[0];
  const em_di = inst.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_intermediaire;
  const gen_di = inst.generateur_chauffage_collection.generateur_chauffage[0].donnee_intermediaire;
  const GV = s.deperdition.deperdition_enveloppe + s.deperdition.deperdition_renouvellement_air;
  const GV_env = s.deperdition.deperdition_enveloppe;
  const GV_air = s.deperdition.deperdition_renouvellement_air;

  return {
    label,
    GV: GV.toFixed(1),
    GV_env: GV_env.toFixed(1),
    GV_air: GV_air.toFixed(1),
    besoin_ch: s.apport_et_besoin.besoin_ch.toFixed(0),
    re: em_di.rendement_emission,
    rd: em_di.rendement_distribution,
    rr: em_di.rendement_regulation,
    i0: em_di.i0,
    scop: gen_di.scop,
    rg: gen_di.rg,
    conso_ch_ef: gen_di.conso_ch.toFixed(0),
    ep_ch: s.ep_conso.ep_conso_ch.toFixed(0),
    ep_total_m2: s.ep_conso.ep_conso_5_usages_m2,
    classe: s.ep_conso.classe_bilan_dpe,
    cout: s.cout.cout_5_usages.toFixed(0),
    P_15: (GV * 34 / 1000).toFixed(2),
    P_10: (GV * 29 / 1000).toFixed(2),
    P_7: (GV * 26 / 1000).toFixed(2),
    P_0: (GV * 19 / 1000).toFixed(2),
    P_7pos: (GV * 12 / 1000).toFixed(2),
  };
}

// Scenario A: PAC air/air + enveloppe actuelle (VMC hygroB + CET 150L only)
const dpeA = deepClone(base);
setVMCHygroB(dpeA);
setPACairair(dpeA);
setECSCET(dpeA);
const A = run("PAC air/air + enveloppe actuelle", dpeA);

// Scenario B: PAC air/air + fenêtres rénovées
const dpeB = deepClone(base);
setVMCHygroB(dpeB);
setPACairair(dpeB);
setECSCET(dpeB);
improveWindows(dpeB);
const B = run("PAC air/air + fenêtres DV-argon-VIR", dpeB);

// Scenario C: PAC air/air + fenêtres + murs ITI 14cm
const dpeC = deepClone(base);
setVMCHygroB(dpeC);
setPACairair(dpeC);
setECSCET(dpeC);
improveWindows(dpeC);
improveWalls(dpeC);
const C = run("PAC air/air + fenêtres + murs ITI14cm", dpeC);

// Scenario D: PAC air/air + fenêtres + murs + combles 30cm
const dpeD = deepClone(base);
setVMCHygroB(dpeD);
setPACairair(dpeD);
setECSCET(dpeD);
improveWindows(dpeD);
improveWalls(dpeD);
improveRoof(dpeD);
const D = run("PAC air/air + fenêtres + murs + combles 30cm", dpeD);

console.log('\n====================================================');
console.log('COMPARAISON PAC air/air vs niveau d\'isolation');
console.log('====================================================\n');

for (const sc of [A, B, C, D]) {
  console.log(`--- ${sc.label} ---`);
  console.log(`  GV total = ${sc.GV} W/K (env ${sc.GV_env} + air ${sc.GV_air})`);
  console.log(`  Besoin ch = ${sc.besoin_ch} kWh/an`);
  console.log(`  Rendements: re=${sc.re} rd=${sc.rd} rr=${sc.rr} I0=${sc.i0}`);
  console.log(`  SCOP 3CL = ${sc.scop} (rg=${sc.rg})`);
  console.log(`  Conso ch EF = ${sc.conso_ch_ef} kWh | EP ch = ${sc.ep_ch} kWh`);
  console.log(`  EP/m² 5 usages = ${sc.ep_total_m2} → classe ${sc.classe}`);
  console.log(`  Coût 5 usages = ${sc.cout} €/an`);
  console.log(`  P_pointe: -15°C=${sc.P_15}kW, -10°C=${sc.P_10}kW, -7°C=${sc.P_7}kW, 0°C=${sc.P_0}kW, +7°C=${sc.P_7pos}kW`);
  console.log('');
}

// Real-world COP analysis
console.log('====================================================');
console.log('ANALYSE COP RÉEL vs TEMPÉRATURE EXTÉRIEURE');
console.log('====================================================\n');
console.log('Les PAC air/air ont un COP qui varie fortement avec Text:');
console.log('  Text=+7°C  → COP ≈ 4.0-4.5 (conditions A7/A20 nominales)');
console.log('  Text=+2°C  → COP ≈ 3.0-3.5');
console.log('  Text=-7°C  → COP ≈ 2.0-2.5 (avec givrage)');
console.log('  Text=-10°C → COP ≈ 1.7-2.0 (appoint résistif partiel)');
console.log('  Text=-15°C → COP ≈ 1.0-1.5 (résistif prédominant)');
console.log('');

// Strasbourg temperature distribution (H1b, DJU ~2800)
// Based on typical Strasbourg heating season Oct-April
const tempBins = [
  { text: -15, hours: 20,  label: 'Grand froid (-15°C)' },
  { text: -10, hours: 80,  label: 'Froid intense (-10°C)' },
  { text: -7,  hours: 200, label: 'Froid (-7°C)' },
  { text: -3,  hours: 400, label: 'Frais froid (-3°C)' },
  { text: 0,   hours: 600, label: 'Autour de 0°C' },
  { text: 3,   hours: 800, label: 'Frais (3°C)' },
  { text: 7,   hours: 1200, label: 'Doux (7°C)' },
  { text: 12,  hours: 800,  label: 'Tempéré (12°C)' },
];
// Rough COP curve for a typical PAC air/air multi-split
function copReal(text) {
  if (text <= -15) return 1.0;
  if (text <= -10) return 1.0 + (text + 15) * 0.16; // 1.0 @ -15 → 1.8 @ -10
  if (text <= -7)  return 1.8 + (text + 10) * 0.13;  // 1.8 @ -10 → 2.2 @ -7
  if (text <= 0)   return 2.2 + (text + 7) * 0.11;   // 2.2 @ -7 → 2.97 @ 0
  if (text <= 7)   return 3.0 + text * 0.14;          // 3.0 @ 0 → 4.0 @ 7
  if (text <= 15)  return 4.0 + (text - 7) * 0.06;   // 4.0 @ 7 → 4.5 @ 15
  return 4.5;
}

for (const sc of [A, D]) {
  const GV = parseFloat(sc.GV);
  let totalBesoin = 0;
  let totalEF = 0;
  console.log(`\n--- ${sc.label} (GV=${sc.GV} W/K) ---`);
  console.log('Text(°C) | Heures | Besoin(kWh) | COP réel | Conso EF(kWh)');
  console.log('---------|--------|-------------|----------|-------------');
  for (const bin of tempBins) {
    const deltaT = Math.max(0, 19 - bin.text);
    const besoin = GV * deltaT * bin.hours / 1000;
    const cop = copReal(bin.text);
    const ef = besoin / cop;
    totalBesoin += besoin;
    totalEF += ef;
    console.log(`  ${String(bin.text).padStart(4)}°C  |  ${String(bin.hours).padStart(4)}  |   ${besoin.toFixed(0).padStart(7)}   |   ${cop.toFixed(2)}   |   ${ef.toFixed(0).padStart(7)}`);
  }
  const scopReel = totalBesoin / totalEF;
  console.log(`TOTAL    |  ${tempBins.reduce((s,b)=>s+b.hours,0)}  |   ${totalBesoin.toFixed(0).padStart(7)}   | SCOP=${scopReel.toFixed(2)} |   ${totalEF.toFixed(0).padStart(7)}`);
  console.log(`→ SCOP réel estimé = ${scopReel.toFixed(2)} vs SCOP 3CL = ${sc.scop}`);
  console.log(`→ Surconsommation réelle estimée = +${((totalEF / (totalBesoin/3.0) - 1) * 100).toFixed(0)}% vs calcul 3CL`);
}

