#!/usr/bin/env node
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
    const ges = s.emission_ges;
    console.log(`\n=== ${name} ===`);
    console.log(`hvent: ${dep.hvent?.toFixed(2)} | hperm: ${dep.hperm?.toFixed(2)} | dep_air: ${dep.deperdition_renouvellement_air?.toFixed(2)} | dep_env: ${dep.deperdition_enveloppe?.toFixed(2)}`);
    console.log(`besoin_ch: ${ab.besoin_ch?.toFixed(0)} | besoin_ecs: ${ab.besoin_ecs?.toFixed(0)}`);
    console.log(`ef_ch: ${ef.conso_ch?.toFixed(0)} | ef_ecs: ${ef.conso_ecs?.toFixed(0)} | ef_ecl: ${ef.conso_eclairage?.toFixed(0)} | ef_aux: ${ef.conso_totale_auxiliaire?.toFixed(0)}`);
    console.log(`ep_ch: ${ep.ep_conso_ch?.toFixed(0)} | ep_ecs: ${ep.ep_conso_ecs?.toFixed(0)} | ep_ecl: ${ep.ep_conso_eclairage?.toFixed(0)} | ep_aux: ${ep.ep_conso_totale_auxiliaire?.toFixed(0)}`);
    console.log(`EP TOTAL: ${ep.ep_conso_5_usages?.toFixed(0)} | EP/m2: ${ep.ep_conso_5_usages_m2} | CLASSE: ${ep.classe_bilan_dpe}`);
    console.log(`GES/m2: ${ges.emission_ges_5_usages_m2} | CLASSE GES: ${ges.classe_emission_ges}`);
  } catch(e) {
    console.log(`\n=== ${name} === ERREUR: ${e.message}`);
  }
}

// === SCENARIO 0: État actuel (vérification) ===
runScenario("0. ÉTAT ACTUEL (vérification)", deepClone(base));

// === SCENARIO 1: VMC hygro B seule (sans changer chauffage/ECS) ===
{
  const dpe = deepClone(base);
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15"; // VMC SF hygro B après 2012
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;
  runScenario("1. VMC HYGRO B seule (gaz collectif conservé)", dpe);
}

// === SCENARIO 2: VMC hygro B + radiateurs élec inertie + ballon élec classique ===
{
  const dpe = deepClone(base);

  // VMC hygro B
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15";
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;

  // Chauffage: radiateurs électriques à inertie individuels
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Radiateurs électriques à inertie";
  ich.donnee_entree.enum_type_installation_id = "1"; // individuel
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "3"; // radiateur électrique NFC
  em.donnee_entree.enum_type_chauffage_id = "1"; // individuel
  em.donnee_entree.enum_temp_distribution_ch_id = "1"; // absence de réseau
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1; // pas de réseau, rd=1
  em.donnee_entree.enum_equipement_intermittence_id = "5"; // thermostat d'ambiance avec programmation
  em.donnee_entree.enum_type_regulation_id = "1"; // Thermostat d'ambiance
  em.donnee_entree.enum_periode_installation_emetteur_id = "3"; // après 2012
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;

  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "Radiateur électrique à inertie NFC";
  gen.donnee_entree.enum_type_generateur_ch_id = "100"; // radiateur électrique NFC
  gen.donnee_entree.enum_type_energie_id = "1"; // Electricité
  gen.donnee_entree.enum_usage_generateur_id = "1"; // chauffage seul
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;

  // ECS: ballon électrique classique individuel 100L
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "Ballon électrique classique 100L";
  iecs.donnee_entree.enum_type_installation_id = "1"; // individuel
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1"; // pas de bouclage
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "Ballon électrique vertical 100L";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "30"; // ballon électrique vertical catégorie B ou 2 étoiles
  genecs.donnee_entree.enum_type_energie_id = "1"; // Electricité
  genecs.donnee_entree.enum_usage_generateur_id = "2"; // ECS seule
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2"; // avec stockage
  genecs.donnee_entree.volume_stockage = 100;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;

  runScenario("2. VMC hygro B + élec inertie + ballon classique 100L", dpe);
}

// === SCENARIO 3: VMC hygro B + radiateurs élec inertie + CET air extérieur ===
{
  const dpe = deepClone(base);

  // VMC hygro B
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15";
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;

  // Chauffage: même que scénario 2
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

  // ECS: CET sur air extérieur après 2014
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "Chauffe-eau thermodynamique sur air extérieur";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "CET sur air extérieur après 2014";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "6"; // CET air extérieur après 2014
  genecs.donnee_entree.enum_type_energie_id = "1"; // Electricité
  genecs.donnee_entree.enum_usage_generateur_id = "2"; // ECS seule
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2"; // avec stockage
  genecs.donnee_entree.volume_stockage = 100;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;

  runScenario("3. VMC hygro B + élec inertie + CET air extérieur (RECOMMANDÉ)", dpe);
}

// === SCENARIO 4: Sans VMC + radiateurs élec inertie + CET air extérieur ===
{
  const dpe = deepClone(base);

  // Pas de changement ventilation (ouverture fenêtres conservée)

  // Chauffage: radiateurs électriques à inertie
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

  // ECS: CET sur air extérieur
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "Chauffe-eau thermodynamique sur air extérieur";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "CET sur air extérieur après 2014";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "6";
  genecs.donnee_entree.enum_type_energie_id = "1";
  genecs.donnee_entree.enum_usage_generateur_id = "2";
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2";
  genecs.donnee_entree.volume_stockage = 100;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;

  runScenario("4. SANS VMC + élec inertie + CET air extérieur", dpe);
}

// === SCENARIO 5: VMC hygro B + élec inertie + CET + fenêtres améliorées ===
{
  const dpe = deepClone(base);

  // VMC hygro B
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15";
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;

  // Chauffage élec inertie (même que scénario 3)
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

  // ECS: CET air extérieur (même que scénario 3)
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "Chauffe-eau thermodynamique sur air extérieur";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "CET sur air extérieur après 2014";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "6";
  genecs.donnee_entree.enum_type_energie_id = "1";
  genecs.donnee_entree.enum_usage_generateur_id = "2";
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2";
  genecs.donnee_entree.volume_stockage = 100;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;

  // Fenêtres améliorées: double vitrage argon VIR Uw=1.3 Sw=0.42
  const bv_list = dpe.logement.enveloppe.baie_vitree_collection.baie_vitree;
  for (const bv of bv_list) {
    bv.donnee_entree.enum_type_vitrage_id = "3"; // triple ou double VIR
    bv.donnee_entree.vitrage_vir = 1;
    bv.donnee_entree.enum_type_gaz_lame_id = "2"; // argon
    bv.donnee_entree.epaisseur_lame = 16;
    bv.donnee_entree.enum_type_materiaux_menuiserie_id = "4"; // PVC
    bv.donnee_entree.presence_joint = 1;
    bv.donnee_entree.uw_1 = 1.3;
    bv.donnee_entree.sw_1 = 0.42;
    bv.donnee_entree.enum_methode_saisie_perf_vitrage_id = "2"; // saisie directe Uw
    delete bv.donnee_entree.tv_ug_id;
    delete bv.donnee_entree.tv_uw_id;
    delete bv.donnee_entree.tv_sw_id;
    delete bv.donnee_entree.tv_deltar_id;
    delete bv.donnee_entree.tv_ujn_id;
    delete bv.donnee_intermediaire;
  }

  runScenario("5. VMC hygro B + élec inertie + CET + fenêtres Uw=1.3", dpe);
}
