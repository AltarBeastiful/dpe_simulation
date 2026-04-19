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
    const cout = s.cout;
    return {
      name,
      hvent: dep.hvent,
      hperm: dep.hperm,
      dep_air: dep.deperdition_renouvellement_air,
      dep_env: dep.deperdition_enveloppe,
      besoin_ch: ab.besoin_ch,
      besoin_ecs: ab.besoin_ecs,
      ef_ch: ef.conso_ch,
      ef_ecs: ef.conso_ecs,
      ef_ecl: ef.conso_eclairage,
      ef_aux: ef.conso_totale_auxiliaire,
      ep_ch: ep.ep_conso_ch,
      ep_ecs: ep.ep_conso_ecs,
      ep_ecl: ep.ep_conso_eclairage,
      ep_aux: ep.ep_conso_totale_auxiliaire,
      ep_total: ep.ep_conso_5_usages,
      ep_m2: ep.ep_conso_5_usages_m2,
      classe: ep.classe_bilan_dpe,
      ges_m2: ges.emission_ges_5_usages_m2,
      classe_ges: ges.classe_emission_ges,
      cout_annuel: cout.cout_5_usages,
    };
  } catch(e) {
    console.error(`=== ${name} === ERREUR: ${e.message}`);
    return null;
  }
}

// ===================== HELPER FUNCTIONS =====================

function setVMCHygroB(dpe) {
  const v = dpe.logement.ventilation_collection.ventilation[0];
  v.donnee_entree.enum_type_ventilation_id = "15"; // VMC SF hygro B après 2012
  v.donnee_entree.description = "VMC SF Hygroréglable B";
  delete v.donnee_entree.tv_debits_ventilation_id;
  delete v.donnee_entree.tv_q4pa_conv_id;
  delete v.donnee_intermediaire;
}

function setChauffageElecInertie(dpe) {
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
  em.donnee_entree.enum_equipement_intermittence_id = "5"; // thermostat + prog
  em.donnee_entree.enum_type_regulation_id = "1"; // thermostat d'ambiance
  em.donnee_entree.enum_periode_installation_emetteur_id = "3"; // après 2012
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;

  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "Radiateur électrique à inertie NFC";
  gen.donnee_entree.enum_type_generateur_ch_id = "100"; // radiateur élec NFC
  gen.donnee_entree.enum_type_energie_id = "1"; // Électricité
  gen.donnee_entree.enum_usage_generateur_id = "1"; // chauffage seul
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setChauffagePanneauRayonnant(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Panneaux rayonnants électriques";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "2"; // panneau rayonnant NFC
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
  gen.donnee_entree.description = "Panneau rayonnant électrique NFC";
  gen.donnee_entree.enum_type_generateur_ch_id = "99"; // panneau rayonnant NFC
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setChauffageConvecteurElec(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Convecteurs électriques NFC";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "1"; // convecteur NFC
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
  gen.donnee_entree.description = "Convecteur électrique NFC";
  gen.donnee_entree.enum_type_generateur_ch_id = "98"; // convecteur NFC
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setChauffagePACairair(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "PAC air/air multisplit";
  ich.donnee_entree.enum_type_installation_id = "1"; // individuel
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "42"; // soufflage air chaud fluide frigorigène
  em.donnee_entree.enum_type_chauffage_id = "1";
  em.donnee_entree.enum_temp_distribution_ch_id = "1"; // pas de réseau hydraulique
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = "5"; // thermostat + programmation
  em.donnee_entree.enum_type_regulation_id = "1"; // thermostat d'ambiance
  em.donnee_entree.enum_periode_installation_emetteur_id = "3"; // après 2012
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;

  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "PAC air/air post-2015";
  gen.donnee_entree.enum_type_generateur_ch_id = "3"; // PAC air/air post-2015
  gen.donnee_entree.enum_type_energie_id = "1"; // Électricité
  gen.donnee_entree.enum_usage_generateur_id = "1"; // chauffage seul
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setChauffagePACaireau(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "PAC air/eau sur radiateurs basse temp";
  ich.donnee_entree.enum_type_installation_id = "1"; // individuel
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  // Radiateur bitube avec robinet thermostatique sur réseau individuel basse température
  em.donnee_entree.enum_type_emission_distribution_id = "39";
  em.donnee_entree.enum_type_chauffage_id = "1"; // individuel
  em.donnee_entree.enum_temp_distribution_ch_id = "2"; // basse température
  em.donnee_entree.reseau_distribution_isole = 1;
  em.donnee_entree.tv_rendement_distribution_ch_id = 9;
  em.donnee_entree.enum_equipement_intermittence_id = "5";
  em.donnee_entree.enum_type_regulation_id = "1";
  em.donnee_entree.enum_periode_installation_emetteur_id = "3";
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;

  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "PAC air/eau post-2017";
  gen.donnee_entree.enum_type_generateur_ch_id = "7"; // PAC air/eau post-2017
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1"; // chauffage seul
  gen.donnee_entree.position_volume_chauffe = 1;
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setChauffagePoeleGranules(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Poêle à granulés flamme verte";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "21"; // poêle bois
  em.donnee_entree.enum_type_chauffage_id = "1";
  em.donnee_entree.enum_temp_distribution_ch_id = "1";
  delete em.donnee_entree.reseau_distribution_isole;
  em.donnee_entree.tv_rendement_distribution_ch_id = 1;
  em.donnee_entree.enum_equipement_intermittence_id = "5"; // thermostat + prog
  em.donnee_entree.enum_type_regulation_id = "1";
  em.donnee_entree.enum_periode_installation_emetteur_id = "3";
  delete em.donnee_entree.tv_rendement_emission_id;
  delete em.donnee_entree.tv_rendement_regulation_id;
  delete em.donnee_entree.tv_intermittence_id;
  delete em.donnee_intermediaire;

  const gen = ich.generateur_chauffage_collection.generateur_chauffage[0];
  gen.donnee_entree.description = "Poêle à granulés flamme verte post-2020";
  gen.donnee_entree.enum_type_generateur_ch_id = "46"; // poêle granulés FV post-2020
  gen.donnee_entree.enum_type_energie_id = "5"; // bois – granulés
  gen.donnee_entree.enum_usage_generateur_id = "1";
  gen.donnee_entree.position_volume_chauffe = 1;
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setChauffagePlancherRayonnantElec(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "Plancher rayonnant électrique";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;

  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "8"; // plancher rayonnant élec avec régulation
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
  gen.donnee_entree.description = "Plancher rayonnant électrique";
  gen.donnee_entree.enum_type_generateur_ch_id = "102"; // PRE avec régulation terminale
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function setECSBallonElec(dpe) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "Ballon électrique classique 100L";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "Ballon électrique vertical 100L cat. B";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "70"; // ballon vertical cat B ou 2 étoiles
  genecs.donnee_entree.enum_type_energie_id = "1";
  genecs.donnee_entree.enum_usage_generateur_id = "2"; // ECS seule
  genecs.donnee_entree.enum_type_stockage_ecs_id = "2"; // avec stockage
  genecs.donnee_entree.volume_stockage = 100;
  genecs.donnee_entree.position_volume_chauffe = 1;
  genecs.donnee_entree.position_volume_chauffe_stockage = 1;
  delete genecs.donnee_entree.reference_generateur_mixte;
  delete genecs.donnee_entree.tv_generateur_combustion_id;
  delete genecs.donnee_entree.presence_ventouse;
  delete genecs.donnee_intermediaire;
}

function setECSCETAirExt(dpe) {
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
  genecs.donnee_entree.description = "CET sur air extérieur après 2014";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "6"; // CET air ext. post-2014
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
}

function setECSCETAirExtrait(dpe) {
  const iecs = dpe.logement.installation_ecs_collection.installation_ecs[0];
  iecs.donnee_entree.description = "CET sur air extrait (VMC)";
  iecs.donnee_entree.enum_type_installation_id = "1";
  iecs.donnee_entree.nombre_niveau_installation_ecs = 1;
  iecs.donnee_entree.enum_bouclage_reseau_ecs_id = "1";
  iecs.donnee_entree.reseau_distribution_isole = 0;
  delete iecs.donnee_entree.ratio_virtualisation;
  delete iecs.donnee_entree.tv_rendement_distribution_ecs_id;
  delete iecs.donnee_intermediaire;

  const genecs = iecs.generateur_ecs_collection.generateur_ecs[0];
  genecs.donnee_entree.description = "CET sur air extrait après 2014";
  genecs.donnee_entree.enum_type_generateur_ecs_id = "9"; // CET air extrait post-2014
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
}

function setFenetresVIR(dpe) {
  const bv_list = dpe.logement.enveloppe.baie_vitree_collection.baie_vitree;
  for (const bv of bv_list) {
    bv.donnee_entree.enum_type_vitrage_id = "3"; // double VIR
    bv.donnee_entree.vitrage_vir = 1;
    bv.donnee_entree.enum_type_gaz_lame_id = "2"; // argon
    bv.donnee_entree.epaisseur_lame = 16;
    bv.donnee_entree.enum_type_materiaux_menuiserie_id = "4"; // PVC
    bv.donnee_entree.presence_joint = 1;
    bv.donnee_entree.uw_1 = 1.3;
    bv.donnee_entree.sw_1 = 0.42;
    bv.donnee_entree.enum_methode_saisie_perf_vitrage_id = "2"; // saisie directe
    delete bv.donnee_entree.tv_ug_id;
    delete bv.donnee_entree.tv_uw_id;
    delete bv.donnee_entree.tv_sw_id;
    delete bv.donnee_entree.tv_deltar_id;
    delete bv.donnee_entree.tv_ujn_id;
    delete bv.donnee_intermediaire;
  }
}

function setTripleVitrage(dpe) {
  const bv_list = dpe.logement.enveloppe.baie_vitree_collection.baie_vitree;
  for (const bv of bv_list) {
    bv.donnee_entree.enum_type_vitrage_id = "3"; // triple / double VIR
    bv.donnee_entree.vitrage_vir = 1;
    bv.donnee_entree.enum_type_gaz_lame_id = "2"; // argon
    bv.donnee_entree.epaisseur_lame = 16;
    bv.donnee_entree.enum_type_materiaux_menuiserie_id = "4"; // PVC
    bv.donnee_entree.presence_joint = 1;
    bv.donnee_entree.uw_1 = 0.9; // triple vitrage
    bv.donnee_entree.sw_1 = 0.35; // triple vitrage Sw plus bas
    bv.donnee_entree.enum_methode_saisie_perf_vitrage_id = "2";
    delete bv.donnee_entree.tv_ug_id;
    delete bv.donnee_entree.tv_uw_id;
    delete bv.donnee_entree.tv_sw_id;
    delete bv.donnee_entree.tv_deltar_id;
    delete bv.donnee_entree.tv_ujn_id;
    delete bv.donnee_intermediaire;
  }
}

function renforceIsolationMurs(dpe, epaisseur_cm) {
  // Renforcer l'isolation des murs extérieurs
  const murs = dpe.logement.enveloppe.mur_collection.mur;
  for (const mur of murs) {
    if (mur.donnee_entree.enum_type_adjacence_id === "1") { // murs donnant sur extérieur
      mur.donnee_entree.enum_type_isolation_id = "3"; // ITI
      mur.donnee_entree.epaisseur_isolation = epaisseur_cm;
      mur.donnee_entree.enum_methode_saisie_u_id = "3"; // calculé à partir épaisseur
      delete mur.donnee_intermediaire;
    }
  }
}

function renforceIsolationToiture(dpe, epaisseur_cm) {
  const ph = dpe.logement.enveloppe.plancher_haut_collection.plancher_haut;
  for (const p of ph) {
    // Accroître l'isolation des plafonds (rampants + combles)
    if (p.donnee_entree.enum_type_adjacence_id === "1" || p.donnee_entree.enum_type_adjacence_id === "12") {
      p.donnee_entree.epaisseur_isolation = epaisseur_cm;
      delete p.donnee_intermediaire;
    }
  }
}

// ===================== RUN ALL SCENARIOS =====================

const results = [];

// S0: État actuel
results.push(runScenario("S0 — État actuel (gaz collectif condensation)", deepClone(base)));

// === BLOC A: EFFET JOULE (radiateurs électriques) ===

// S1: VMC seule (gaz conservé)
{ const dpe = deepClone(base); setVMCHygroB(dpe); results.push(runScenario("S1 — VMC hygro B seule (gaz conservé)", dpe)); }

// S2: Élec inertie + ballon élec + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSBallonElec(dpe); results.push(runScenario("S2 — Élec inertie + ballon élec 100L + VMC", dpe)); }

// S3: Élec inertie + CET air ext + VMC (référence recommandée)
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); results.push(runScenario("S3 — Élec inertie + CET air ext + VMC ★ RÉFÉRENCE", dpe)); }

// S4: Élec inertie + CET air ext (sans VMC)
{ const dpe = deepClone(base); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); results.push(runScenario("S4 — Élec inertie + CET air ext (sans VMC)", dpe)); }

// S5: Élec inertie + CET + VMC + fenêtres DV VIR Uw=1.3
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); results.push(runScenario("S5 — Élec inertie + CET + VMC + fenêtres Uw=1.3", dpe)); }

// S6: Panneau rayonnant + CET + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePanneauRayonnant(dpe); setECSCETAirExt(dpe); results.push(runScenario("S6 — Panneau rayonnant + CET + VMC", dpe)); }

// S7: Convecteur NFC + CET + VMC (budget minimum)
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageConvecteurElec(dpe); setECSCETAirExt(dpe); results.push(runScenario("S7 — Convecteur NFC + CET + VMC (budget mini)", dpe)); }

// S8: Plancher rayonnant électrique + CET + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePlancherRayonnantElec(dpe); setECSCETAirExt(dpe); results.push(runScenario("S8 — Plancher ray. élec + CET + VMC", dpe)); }

// === BLOC B: POMPES À CHALEUR ===

// S9: PAC air/air (multisplit) + CET air ext + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACairair(dpe); setECSCETAirExt(dpe); results.push(runScenario("S9 — PAC air/air multisplit + CET + VMC", dpe)); }

// S10: PAC air/air + CET + VMC + fenêtres
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACairair(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); results.push(runScenario("S10 — PAC air/air + CET + VMC + fenêtres Uw=1.3", dpe)); }

// S11: PAC air/eau + CET + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACaireau(dpe); setECSCETAirExt(dpe); results.push(runScenario("S11 — PAC air/eau + CET + VMC", dpe)); }

// S12: PAC air/eau + CET + VMC + fenêtres
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACaireau(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); results.push(runScenario("S12 — PAC air/eau + CET + VMC + fenêtres Uw=1.3", dpe)); }

// === BLOC C: BOIS / GRANULÉS ===

// S13: Poêle à granulés + CET + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePoeleGranules(dpe); setECSCETAirExt(dpe); results.push(runScenario("S13 — Poêle granulés FV + CET + VMC", dpe)); }

// S14: Poêle à granulés + CET + VMC + fenêtres
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePoeleGranules(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); results.push(runScenario("S14 — Poêle granulés + CET + VMC + fenêtres", dpe)); }

// === BLOC D: VARIANTES ECS ===

// S15: Élec inertie + CET air extrait (VMC) + VMC
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExtrait(dpe); results.push(runScenario("S15 — Élec inertie + CET air extrait + VMC", dpe)); }

// S16: Élec inertie + ballon élec (sans VMC, minimum absolu)
{ const dpe = deepClone(base); setChauffageElecInertie(dpe); setECSBallonElec(dpe); results.push(runScenario("S16 — Élec inertie + ballon élec (sans VMC)", dpe)); }

// === BLOC E: ISOLATION RENFORCÉE ===

// S17: Réf S3 + isolation murs renforcée 16cm
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); renforceIsolationMurs(dpe, 16); results.push(runScenario("S17 — S3 + isolation murs 16cm", dpe)); }

// S18: Réf S3 + isolation toiture renforcée 30cm
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); renforceIsolationToiture(dpe, 30); results.push(runScenario("S18 — S3 + isolation toiture 30cm", dpe)); }

// S19: Réf S3 + fenêtres + isolation murs 16cm + toiture 30cm
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); renforceIsolationMurs(dpe, 16); renforceIsolationToiture(dpe, 30); results.push(runScenario("S19 — S3 + fenêtres + murs 16cm + toiture 30cm", dpe)); }

// S20: Triple vitrage + élec inertie + CET + VMC + isolation max
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffageElecInertie(dpe); setECSCETAirExt(dpe); setTripleVitrage(dpe); renforceIsolationMurs(dpe, 20); renforceIsolationToiture(dpe, 35); results.push(runScenario("S20 — Réno TOTALE (triple, murs 20cm, toit 35cm)", dpe)); }

// === BLOC F: PAC + ISOLATION ===

// S21: PAC air/air + CET + VMC + fenêtres + murs 16cm + toit 30cm
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACairair(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); renforceIsolationMurs(dpe, 16); renforceIsolationToiture(dpe, 30); results.push(runScenario("S21 — PAC air/air + CET + réno enveloppe complète", dpe)); }

// S22: PAC air/eau + CET + VMC + fenêtres + murs 16cm + toit 30cm
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACaireau(dpe); setECSCETAirExt(dpe); setFenetresVIR(dpe); renforceIsolationMurs(dpe, 16); renforceIsolationToiture(dpe, 30); results.push(runScenario("S22 — PAC air/eau + CET + réno enveloppe complète", dpe)); }

// S23: PAC air/air + CET + VMC + triple vitrage + isolation max
{ const dpe = deepClone(base); setVMCHygroB(dpe); setChauffagePACairair(dpe); setECSCETAirExt(dpe); setTripleVitrage(dpe); renforceIsolationMurs(dpe, 20); renforceIsolationToiture(dpe, 35); results.push(runScenario("S23 — PAC air/air + CET + réno MAX", dpe)); }

// ===================== OUTPUT =====================

console.log("\n" + "=".repeat(160));
console.log("COMPARATIF COMPLET — RÉNOVATION ÉNERGÉTIQUE 12 RUE DE L'OBERELSAU — 51,7m² — Strasbourg H1b");
console.log("=".repeat(160));

// Table header
const hdr = [
  "Scénario".padEnd(55),
  "EP/m²".padStart(6),
  "Cl.".padStart(4),
  "GES".padStart(4),
  "Cl.G".padStart(5),
  "ep_ch".padStart(7),
  "ep_ecs".padStart(7),
  "ep_aux".padStart(7),
  "ep_ecl".padStart(7),
  "EP tot".padStart(8),
  "€/an".padStart(8),
  "dep_env".padStart(8),
  "dep_air".padStart(8),
];
console.log(hdr.join(" | "));
console.log("-".repeat(160));

for (const r of results) {
  if (!r) continue;
  const row = [
    r.name.padEnd(55),
    String(r.ep_m2).padStart(6),
    r.classe.padStart(4),
    String(r.ges_m2).padStart(4),
    r.classe_ges.padStart(5),
    r.ep_ch.toFixed(0).padStart(7),
    r.ep_ecs.toFixed(0).padStart(7),
    r.ep_aux.toFixed(0).padStart(7),
    r.ep_ecl.toFixed(0).padStart(7),
    r.ep_total.toFixed(0).padStart(8),
    r.cout_annuel.toFixed(0).padStart(8),
    r.dep_env.toFixed(1).padStart(8),
    r.dep_air.toFixed(1).padStart(8),
  ];
  console.log(row.join(" | "));
}

console.log("\n" + "=".repeat(160));
console.log("CLASSEMENT PAR EP/m² (du meilleur au moins bon)");
console.log("=".repeat(160));

const sorted = results.filter(r => r !== null).sort((a, b) => a.ep_m2 - b.ep_m2);
for (const r of sorted) {
  const delta = r.ep_m2 - results[0].ep_m2;
  const deltaRef = results[3] ? r.ep_m2 - results[3].ep_m2 : 0; // vs S3
  console.log(`  ${String(r.ep_m2).padStart(4)} EP/m² (${r.classe}) | GES ${String(r.ges_m2).padStart(3)} (${r.classe_ges}) | ${r.cout_annuel.toFixed(0).padStart(6)} €/an | Δ vs actuel: ${delta > 0 ? '+' : ''}${delta} | Δ vs S3: ${deltaRef > 0 ? '+' : ''}${deltaRef} | ${r.name}`);
}

// JSON output for further analysis
fs.writeFileSync('./renovation_results.json', JSON.stringify(results, null, 2));
console.log("\n→ Résultats détaillés sauvegardés dans renovation_results.json");
