import * as fs from 'fs';
import { calcul_3cl } from '@open3cl/engine';

const base = JSON.parse(fs.readFileSync('./dpe_current.json', 'utf8'));
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// Helper functions (shortened)
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
  const g = iecs.generateur_ecs_collection.generateur_ecs[0];
  g.donnee_entree.description = "CET air ext. 150L";
  g.donnee_entree.enum_type_generateur_ecs_id = "6";
  g.donnee_entree.enum_type_energie_id = "1";
  g.donnee_entree.enum_usage_generateur_id = "2";
  g.donnee_entree.enum_type_stockage_ecs_id = "2";
  g.donnee_entree.volume_stockage = 150;
  g.donnee_entree.position_volume_chauffe = 1;
  g.donnee_entree.position_volume_chauffe_stockage = 1;
  delete g.donnee_entree.reference_generateur_mixte;
  delete g.donnee_entree.tv_generateur_combustion_id;
  delete g.donnee_entree.presence_ventouse;
  delete g.donnee_intermediaire;
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

// ============================================================
// MODÈLE RÉALISTE: PAC air/air avec capacité dégradée + backup
// ============================================================

// Typical multi-split PAC air/air performance (ex: Daikin/Mitsubishi 3-splits)
// Nominal capacity at A7/A20: 5.0 kW (typical for T3 ~50m²)
// Capacity derates with outdoor temp:
function pacCapacity(text, pNom) {
  // Capacity derating curve (% of nominal)
  if (text >= 15) return pNom * 1.0;
  if (text >= 7)  return pNom * 1.0;
  if (text >= 2)  return pNom * 0.90;
  if (text >= -5) return pNom * 0.75;
  if (text >= -10) return pNom * 0.55;
  if (text >= -15) return pNom * 0.40;
  return pNom * 0.30;
}

// COP at given outdoor temp (PAC mode only, not including backup)
function copPAC(text) {
  if (text >= 15) return 5.0;
  if (text >= 7)  return 4.0 + (text - 7) * 0.125;
  if (text >= 2)  return 3.2 + (text - 2) * 0.16;
  if (text >= -5) return 2.3 + (text + 5) * 0.13;
  if (text >= -10) return 1.8 + (text + 10) * 0.10;
  if (text >= -15) return 1.2 + (text + 15) * 0.12;
  return 1.0;
}

// Strasbourg temperature distribution (heating season, ~5100h)
// Based on Météo-France typical data for Strasbourg-Entzheim
const tempBins = [
  { text: -15, hours: 10 },
  { text: -12, hours: 30 },
  { text: -10, hours: 50 },
  { text: -7,  hours: 120 },
  { text: -5,  hours: 180 },
  { text: -3,  hours: 250 },
  { text: 0,   hours: 450 },
  { text: 2,   hours: 500 },
  { text: 5,   hours: 700 },
  { text: 7,   hours: 800 },
  { text: 10,  hours: 700 },
  { text: 12,  hours: 500 },
  { text: 15,  hours: 300 },
];

function analyzeRealWorld(label, GV_total, pNomPAC) {
  let totalBesoin = 0, totalEfPAC = 0, totalEfBackup = 0;
  const rows = [];
  
  for (const bin of tempBins) {
    const dT = Math.max(0, 19 - bin.text);
    if (dT === 0) continue; // pas de chauffage nécessaire
    
    const pBesoin = GV_total * dT / 1000; // kW de puissance nécessaire
    const pPAC = pacCapacity(bin.text, pNomPAC); // capacité PAC disponible
    const cop = copPAC(bin.text);
    
    const pFourniePAC = Math.min(pBesoin, pPAC); // PAC couvre ce qu'elle peut
    const pBackup = Math.max(0, pBesoin - pPAC); // le reste en résistif
    
    const besoin = pBesoin * bin.hours; // kWh
    const efPAC = (pFourniePAC * bin.hours) / cop; // kWh EF
    const efBackup = pBackup * bin.hours; // kWh EF (COP=1)
    
    totalBesoin += besoin;
    totalEfPAC += efPAC;
    totalEfBackup += efBackup;
    
    const pctBackup = pBackup > 0 ? ((pBackup / pBesoin) * 100).toFixed(0) : '0';
    rows.push({
      text: bin.text,
      hours: bin.hours,
      pBesoin: pBesoin.toFixed(2),
      pPAC: pPAC.toFixed(2),
      pBackup: pBackup.toFixed(2),
      cop: cop.toFixed(2),
      besoin: besoin.toFixed(0),
      efPAC: efPAC.toFixed(0),
      efBackup: efBackup.toFixed(0),
      pctBackup
    });
  }
  
  const totalEF = totalEfPAC + totalEfBackup;
  const scopReel = totalBesoin / totalEF;
  const scopSansBkp = totalBesoin / totalEfPAC;
  
  console.log(`\n${'='.repeat(90)}`);
  console.log(`${label}`);
  console.log(`GV=${GV_total.toFixed(1)} W/K | PAC nominale=${pNomPAC} kW | P_pointe(-15°C)=${(GV_total*34/1000).toFixed(2)} kW`);
  console.log(`${'='.repeat(90)}`);
  console.log('Text   |  h   | Pbesoin | Ppac  | Pbackup | COP  | Besoin | EF_pac | EF_bkp | %bkp');
  console.log('-------|------|---------|-------|---------|------|--------|--------|--------|-----');
  for (const r of rows) {
    console.log(`${String(r.text).padStart(4)}°C | ${String(r.hours).padStart(4)} | ${r.pBesoin.padStart(5)}kW | ${r.pPAC.padStart(3)}kW | ${r.pBackup.padStart(5)}kW | ${r.cop} | ${r.besoin.padStart(6)} | ${r.efPAC.padStart(6)} | ${r.efBackup.padStart(6)} | ${r.pctBackup.padStart(3)}%`);
  }
  console.log(`TOTAL  | ${tempBins.reduce((s,b)=>s+b.hours,0)} |         |       |         |      | ${totalBesoin.toFixed(0).padStart(6)} | ${totalEfPAC.toFixed(0).padStart(6)} | ${totalEfBackup.toFixed(0).padStart(6)} |`);
  console.log('');
  console.log(`  Conso EF totale = ${totalEF.toFixed(0)} kWh (PAC: ${totalEfPAC.toFixed(0)} + backup résistif: ${totalEfBackup.toFixed(0)})`);
  console.log(`  SCOP réel effectif = ${scopReel.toFixed(2)} (vs 3CL forfaitaire = 3.0)`);
  console.log(`  SCOP PAC seule (sans backup) = ${scopSansBkp.toFixed(2)}`);
  console.log(`  Part backup résistif = ${(totalEfBackup/totalEF*100).toFixed(1)}% de l'énergie finale`);
  console.log(`  Écart vs 3CL: conso réelle ≈ ${((totalEF/(totalBesoin/3.0)-1)*100).toFixed(0)}% ${totalEF > totalBesoin/3 ? 'supérieure' : 'inférieure'} au calcul 3CL`);
  
  return { scopReel, totalEF, totalBesoin, totalEfBackup, totalEfPAC };
}

console.log('╔══════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║  ANALYSE RÉALISTE: PAC air/air + dimensionnement + backup résistif                 ║');
console.log('║  Strasbourg H1b — Text base = -15°C — T3 51.7m² sous combles                      ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════╝');

// PAC sized at 5.0 kW nominal (typical multi-split 3 unités pour T3)
const pNom = 5.0;

// Scenario A: enveloppe actuelle, GV=143 W/K
const rA = analyzeRealWorld('Scénario A: PAC air/air + enveloppe ACTUELLE (murs 9cm + rampants 20cm + DV ancien)', 143.0, pNom);

// Scenario B: fenêtres seules, GV≈145 W/K (paradoxe: GV augmente car meilleure étanchéité pas prise en compte)  
// Skip B, use the 3CL values
const rB = analyzeRealWorld('Scénario B: PAC air/air + fenêtres DV-argon-VIR (GV 3CL=145.1)', 145.1, pNom);

// Scenario C: fenêtres + murs ITI 14cm, GV=137.3
const rC = analyzeRealWorld('Scénario C: PAC air/air + fenêtres + murs ITI 14cm (GV 3CL=137.3)', 137.3, pNom);

// Scenario D: complet, GV=126.9
const rD = analyzeRealWorld('Scénario D: PAC air/air + fenêtres + murs + combles 30cm (GV 3CL=126.9)', 126.9, pNom);

// Also test with smaller PAC (3.5 kW — typical if single split or budget)
console.log('\n\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║  VARIANTE: PAC 3.5 kW nominale (mono-split salon + appoints chambres)              ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════╝');
const rA35 = analyzeRealWorld('Scénario A (3.5kW): PAC + enveloppe actuelle', 143.0, 3.5);
const rD35 = analyzeRealWorld('Scénario D (3.5kW): PAC + rénovation complète', 126.9, 3.5);

// Summary
console.log('\n\n');
console.log('╔══════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║  SYNTHÈSE                                                                          ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log('PAC 5.0 kW nominale (multi-split 3 UI):');
console.log(`  Env. actuelle (GV=143): SCOP réel = ${rA.scopReel.toFixed(2)}, backup = ${(rA.totalEfBackup/rA.totalEF*100).toFixed(1)}%, écart 3CL = ${((rA.totalEF/(rA.totalBesoin/3)-1)*100).toFixed(0)}%`);
console.log(`  Fenêtres seules (GV=145): SCOP réel = ${rB.scopReel.toFixed(2)}, backup = ${(rB.totalEfBackup/rB.totalEF*100).toFixed(1)}%, écart 3CL = ${((rB.totalEF/(rB.totalBesoin/3)-1)*100).toFixed(0)}%`);
console.log(`  + Murs ITI14 (GV=137): SCOP réel = ${rC.scopReel.toFixed(2)}, backup = ${(rC.totalEfBackup/rC.totalEF*100).toFixed(1)}%, écart 3CL = ${((rC.totalEF/(rC.totalBesoin/3)-1)*100).toFixed(0)}%`);
console.log(`  + Combles 30cm (GV=127): SCOP réel = ${rD.scopReel.toFixed(2)}, backup = ${(rD.totalEfBackup/rD.totalEF*100).toFixed(1)}%, écart 3CL = ${((rD.totalEF/(rD.totalBesoin/3)-1)*100).toFixed(0)}%`);
console.log('');
console.log('PAC 3.5 kW nominale (mono-split + appoints):');
console.log(`  Env. actuelle (GV=143): SCOP réel = ${rA35.scopReel.toFixed(2)}, backup = ${(rA35.totalEfBackup/rA35.totalEF*100).toFixed(1)}%, écart 3CL = ${((rA35.totalEF/(rA35.totalBesoin/3)-1)*100).toFixed(0)}%`);
console.log(`  Rénovation complète (GV=127): SCOP réel = ${rD35.scopReel.toFixed(2)}, backup = ${(rD35.totalEfBackup/rD35.totalEF*100).toFixed(1)}%, écart 3CL = ${((rD35.totalEF/(rD35.totalBesoin/3)-1)*100).toFixed(0)}%`);

