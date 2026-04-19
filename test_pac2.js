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

// Explore sortie structure for chauffage
console.log('Keys sortie:', Object.keys(s1));
const chKeys = Object.keys(s1).filter(k => k.includes('ch') || k.includes('Ch') || k.includes('chauff'));
console.log('Chauffage-related keys:', chKeys);

// Try to find the intermediate data
try {
  // Look at the full result structure  
  const inst = r1.logement.installation_chauffage_collection.installation_chauffage[0];
  const em_di = inst.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_intermediaire;
  const gen_di = inst.generateur_chauffage_collection.generateur_chauffage[0].donnee_intermediaire;
  
  console.log('\n=== EMETTEUR (données intermédiaires) ===');
  console.log(JSON.stringify(em_di, null, 2));
  console.log('\n=== GENERATEUR (données intermédiaires) ===');
  console.log(JSON.stringify(gen_di, null, 2));
} catch(e) {
  console.log('Error accessing r1.logement...:', e.message);
  // Try via sortie
  try {
    const sortieStr = JSON.stringify(s1, null, 2);
    // Find rg or scop
    const rgMatch = sortieStr.match(/"rg"\s*:\s*[\d.]+/g);
    const scopMatch = sortieStr.match(/"scop"\s*:\s*[\d.]+/g);
    const reMatch = sortieStr.match(/"re"\s*:\s*[\d.]+/g);
    const rdMatch = sortieStr.match(/"rd"\s*:\s*[\d.]+/g);
    const rrMatch = sortieStr.match(/"rr"\s*:\s*[\d.]+/g);
    const i0Match = sortieStr.match(/"i0"\s*:\s*[\d.]+/g);
    console.log('rg (SCOP):', rgMatch);
    console.log('scop:', scopMatch);
    console.log('re:', reMatch);
    console.log('rd:', rdMatch);
    console.log('rr:', rrMatch);
    console.log('i0:', i0Match);
  } catch(e2) { console.log('Also failed:', e2.message); }
}

console.log('\n=== RÉSULTATS COMPARÉS ===');
console.log('--- Enveloppe actuelle ---');
console.log('GV:', (s1.deperdition.deperdition_enveloppe + s1.deperdition.deperdition_renouvellement_air).toFixed(1), 'W/K');
console.log('Besoin ch:', s1.apport_et_besoin.besoin_ch.toFixed(0), 'kWh');
console.log('EF chauffage:', s1.ef_conso.conso_ch.toFixed(0), 'kWh');
console.log('EP chauffage:', s1.ep_conso.ep_conso_ch.toFixed(0), 'kWh');
console.log('EP/m² total:', s1.ep_conso.ep_conso_5_usages_m2, s1.ep_conso.classe_bilan_dpe);
console.log('COP effectif:', (s1.apport_et_besoin.besoin_ch / s1.ef_conso.conso_ch).toFixed(3));
console.log('Coût annuel:', s1.cout.cout_5_usages.toFixed(0), '€');

// Puissance
const GV1 = s1.deperdition.deperdition_enveloppe + s1.deperdition.deperdition_renouvellement_air;
console.log('P_pointe (-15°C):', (GV1 * (19 - (-15)) / 1000).toFixed(2), 'kW');
console.log('P_pointe (-10°C):', (GV1 * (19 - (-10)) / 1000).toFixed(2), 'kW');
console.log('P_pointe (-7°C):', (GV1 * (19 - (-7)) / 1000).toFixed(2), 'kW');

