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

function setChauffageElecInertie(dpe) {
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
}

function setECSCET(dpe, volume) {
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
  genecs.donnee_entree.description = `CET air ext. ${volume}L`;
  genecs.donnee_entree.enum_type_generateur_ecs_id = "6";
  genecs.donnee_entree.enum_type_energie_id = "1";
  genecs.donnee_entree.enum_usage_generateur_id = "2";
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2";
  genecs.donnee_entree.volume_stockage = volume;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;
}

function setECSBallonElec(dpe, volume) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "Ballon électrique";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;
  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = `Ballon élec vertical ${volume}L cat. B`;
  genecs.donnee_entree.enum_type_generateur_ecs_id = "70";
  genecs.donnee_entree.enum_type_energie_id = "1";
  genecs.donnee_entree.enum_usage_generateur_id = "2";
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2";
  genecs.donnee_entree.volume_stockage = volume;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;
}

const volumes = [50, 75, 100, 150, 200, 250, 300];
const results = [];

for (const v of volumes) {
  // CET scenario
  const dpe1 = deepClone(base);
  setVMCHygroB(dpe1);
  setChauffageElecInertie(dpe1);
  setECSCET(dpe1, v);
  try {
    const r = calcul_3cl(dpe1);
    const s = r.logement.sortie;
    const genEcs = s.ecs?.generateur_ecs_collection?.generateur_ecs?.[0];
    results.push({
      type: 'CET air ext.',
      volume: v,
      ep_m2: s.ep_conso.ep_conso_5_usages_m2,
      classe: s.ep_conso.classe_bilan_dpe,
      ep_ecs: Math.round(s.ep_conso.ep_conso_ecs),
      ef_ecs: Math.round(s.ef_conso.conso_ecs),
      cout_an: Math.round(s.cout.cout_5_usages),
      pertes_stockage: genEcs?.donnee_intermediaire?.pertes_stockage_ecs ?? 'N/A',
    });
  } catch(e) { console.error(`CET ${v}L error: ${e.message}`); }

  // Ballon elec scenario  
  const dpe2 = deepClone(base);
  setVMCHygroB(dpe2);
  setChauffageElecInertie(dpe2);
  setECSBallonElec(dpe2, v);
  try {
    const r = calcul_3cl(dpe2);
    const s = r.logement.sortie;
    const genEcs = s.ecs?.generateur_ecs_collection?.generateur_ecs?.[0];
    results.push({
      type: 'Ballon élec.',
      volume: v,
      ep_m2: s.ep_conso.ep_conso_5_usages_m2,
      classe: s.ep_conso.classe_bilan_dpe,
      ep_ecs: Math.round(s.ep_conso.ep_conso_ecs),
      ef_ecs: Math.round(s.ef_conso.conso_ecs),
      cout_an: Math.round(s.cout.cout_5_usages),
      pertes_stockage: genEcs?.donnee_intermediaire?.pertes_stockage_ecs ?? 'N/A',
    });
  } catch(e) { console.error(`Ballon ${v}L error: ${e.message}`); }
}

console.table(results);

// Also print the Nadeq and V40 from the DPE
const dpe0 = deepClone(base);
setVMCHygroB(dpe0);
setChauffageElecInertie(dpe0);
setECSCET(dpe0, 100);
const r0 = calcul_3cl(dpe0);
const ab = r0.logement.sortie.apport_et_besoin;
console.log('\n=== Données ECS ===');
console.log('Nadeq:', ab.nadeq);
console.log('V40 journalier (standard):', ab.v40_ecs_journalier, 'L/jour');
console.log('V40 journalier (dépensier):', ab.v40_ecs_journalier_depensier, 'L/jour');
console.log('Besoin ECS annuel (standard):', Math.round(ab.besoin_ecs), 'kWh');
console.log('Besoin ECS annuel (dépensier):', Math.round(ab.besoin_ecs_depensier), 'kWh');
console.log('Surface habitable:', r0.logement.sortie.surface_habitable, 'm²');
