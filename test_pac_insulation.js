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

// Run PAC air/air with current envelope
const dpe1 = deepClone(base);
setVMCHygroB(dpe1);
setPACairair(dpe1);
setECSCET(dpe1);
const r1 = calcul_3cl(dpe1);
const s1 = r1.logement.sortie;

// Extract detailed PAC data
const ch1 = s1.chauffage;
const gen1 = ch1.installation_chauffage_collection.installation_chauffage[0];
const em1_di = gen1.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_intermediaire;
const gen1_di = gen1.generateur_chauffage_collection.generateur_chauffage[0].donnee_intermediaire;

console.log('=== PAC air/air — ENVELOPPE ACTUELLE (isolation sub-optimale) ===');
console.log('Déperdition enveloppe:', s1.deperdition.deperdition_enveloppe.toFixed(1), 'W/K');
console.log('Déperdition air:', s1.deperdition.deperdition_renouvellement_air.toFixed(1), 'W/K');
console.log('GV total:', (s1.deperdition.deperdition_enveloppe + s1.deperdition.deperdition_renouvellement_air).toFixed(1), 'W/K');
console.log('Besoin chauffage:', s1.apport_et_besoin.besoin_ch.toFixed(0), 'kWh');
console.log('');
console.log('Emetteur intermédiaire:', JSON.stringify(em1_di, null, 2));
console.log('');
console.log('Générateur intermédiaire:', JSON.stringify(gen1_di, null, 2));
console.log('');
console.log('EF chauffage:', s1.ef_conso.conso_ch.toFixed(0), 'kWh');
console.log('EP chauffage:', s1.ep_conso.ep_conso_ch.toFixed(0), 'kWh');
console.log('EP/m² total:', s1.ep_conso.ep_conso_5_usages_m2, 'Classe:', s1.ep_conso.classe_bilan_dpe);
console.log('Coût annuel:', s1.cout.cout_5_usages.toFixed(0), '€');

// Calculate effective COP
const cop_eff = s1.apport_et_besoin.besoin_ch / s1.ef_conso.conso_ch;
console.log('COP effectif (besoin/conso_ef):', cop_eff.toFixed(3));
console.log('');

// Now with improved envelope (S19-like: fenêtres + murs + toiture)
const dpe2 = deepClone(base);
setVMCHygroB(dpe2);
setPACairair(dpe2);
setECSCET(dpe2);

// Improve windows
const bv_list = dpe2.logement.enveloppe.baie_vitree_collection.baie_vitree;
for (const bv of bv_list) {
  bv.donnee_entree.enum_type_baie_vitree_id = "4";
  bv.donnee_entree.vitrage_vir = 1;
  bv.donnee_entree.enum_type_materiaux_menuiserie_id = "3";
  bv.donnee_entree.enum_type_vitrage_id = "3";
  bv.donnee_entree.enum_type_gaz_lame_id = "2";
  delete bv.donnee_entree.tv_ug_id;
  delete bv.donnee_entree.tv_uw_id;
  delete bv.donnee_entree.tv_sw_id;
  delete bv.donnee_intermediaire;
}

// Improve walls (16cm)
const murs = dpe2.logement.enveloppe.mur_collection.mur;
for (const m of murs) {
  if (parseFloat(m.donnee_entree.umur0_saisi || m.donnee_intermediaire?.umur0 || "99") > 0.3) {
    if (m.donnee_entree.umur_saisi) m.donnee_entree.umur_saisi = 0.22;
    if (m.donnee_intermediaire?.umur) m.donnee_intermediaire.umur = 0.22;
  }
}

// Improve roof (30cm)  
const phs = dpe2.logement.enveloppe.plancher_haut_collection.plancher_haut;
for (const ph of phs) {
  if (ph.donnee_entree.uph_saisi) ph.donnee_entree.uph_saisi = Math.min(ph.donnee_entree.uph_saisi, 0.13);
  if (ph.donnee_intermediaire?.uph) ph.donnee_intermediaire.uph = Math.min(ph.donnee_intermediaire.uph, 0.13);
}

const r2 = calcul_3cl(dpe2);
const s2 = r2.logement.sortie;
const gen2_di = s2.chauffage.installation_chauffage_collection.installation_chauffage[0].generateur_chauffage_collection.generateur_chauffage[0].donnee_intermediaire;
const em2_di = s2.chauffage.installation_chauffage_collection.installation_chauffage[0].emetteur_chauffage_collection.emetteur_chauffage[0].donnee_intermediaire;

console.log('=== PAC air/air — ENVELOPPE AMÉLIORÉE (fenêtres+murs+toiture) ===');
console.log('Déperdition enveloppe:', s2.deperdition.deperdition_enveloppe.toFixed(1), 'W/K');
console.log('Déperdition air:', s2.deperdition.deperdition_renouvellement_air.toFixed(1), 'W/K');
console.log('GV total:', (s2.deperdition.deperdition_enveloppe + s2.deperdition.deperdition_renouvellement_air).toFixed(1), 'W/K');
console.log('Besoin chauffage:', s2.apport_et_besoin.besoin_ch.toFixed(0), 'kWh');
console.log('');
console.log('Emetteur intermédiaire:', JSON.stringify(em2_di, null, 2));
console.log('');
console.log('Générateur intermédiaire:', JSON.stringify(gen2_di, null, 2));
console.log('');
console.log('EF chauffage:', s2.ef_conso.conso_ch.toFixed(0), 'kWh');
console.log('EP chauffage:', s2.ep_conso.ep_conso_ch.toFixed(0), 'kWh');
console.log('EP/m² total:', s2.ep_conso.ep_conso_5_usages_m2, 'Classe:', s2.ep_conso.classe_bilan_dpe);
console.log('Coût annuel:', s2.cout.cout_5_usages.toFixed(0), '€');

const cop_eff2 = s2.apport_et_besoin.besoin_ch / s2.ef_conso.conso_ch;
console.log('COP effectif (besoin/conso_ef):', cop_eff2.toFixed(3));

// Puissance appel pointe
console.log('\n=== PUISSANCE DE POINTE ===');
// DJU Strasbourg ~2600, text ext. base = -12°C, text moyenne hiver ~5°C
const GV1 = s1.deperdition.deperdition_enveloppe + s1.deperdition.deperdition_renouvellement_air;
const GV2 = s2.deperdition.deperdition_enveloppe + s2.deperdition.deperdition_renouvellement_air;
const T_int = 19; // consigne DPE
const T_ext_base = -15; // température de base Strasbourg
const P1 = GV1 * (T_int - T_ext_base) / 1000;
const P2 = GV2 * (T_int - T_ext_base) / 1000;
console.log(`Enveloppe actuelle: GV=${GV1.toFixed(1)} W/K -> P_pointe = ${P1.toFixed(2)} kW (à ${T_ext_base}°C ext)`);
console.log(`Enveloppe améliorée: GV=${GV2.toFixed(1)} W/K -> P_pointe = ${P2.toFixed(2)} kW (à ${T_ext_base}°C ext)`);

// COP réel PAC à différentes températures extérieures
console.log('\n=== COP RÉEL PAC AIR/AIR (courbe type Daikin/Mitsubishi) ===');
console.log('(Données constructeur typiques, zone H1b)');
const temps = [-15, -10, -7, -5, 0, 2, 5, 7, 10, 15];
for (const t of temps) {
  // Approximation: COP = a + b*Text, basé sur données constructeur
  // COP7 (7°C) ~4.0, COP-7 ~2.2, COP2 ~3.2 (données SCOP EN14825)
  // Linear approx: COP = 3.2 + 0.13*(Text - 2)
  const cop_approx = Math.max(1.0, 3.2 + 0.13 * (t - 2));
  console.log(`  T_ext = ${t > 0 ? '+' : ''}${t}°C -> COP réel ≈ ${cop_approx.toFixed(1)}`);
}
