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

function setChauffagePACairair(dpe) {
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
}

function setChauffagePACaireau(dpe) {
  const ich = dpe.logement.installation_chauffage_collection.installation_chauffage[0];
  ich.donnee_entree.description = "PAC air/eau sur radiateurs basse temp";
  ich.donnee_entree.enum_type_installation_id = "1";
  ich.donnee_entree.nombre_niveau_installation_ch = 1;
  delete ich.donnee_entree.ratio_virtualisation;
  delete ich.donnee_intermediaire;
  const em = ich.emetteur_chauffage_collection.emetteur_chauffage[0];
  em.donnee_entree.enum_type_emission_distribution_id = "39";
  em.donnee_entree.enum_type_chauffage_id = "1";
  em.donnee_entree.enum_temp_distribution_ch_id = "2";
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
  gen.donnee_entree.enum_type_generateur_ch_id = "7";
  gen.donnee_entree.enum_type_energie_id = "1";
  gen.donnee_entree.enum_usage_generateur_id = "1";
  gen.donnee_entree.position_volume_chauffe = 1;
  delete gen.donnee_entree.reference_generateur_mixte;
  delete gen.donnee_entree.tv_generateur_combustion_id;
  delete gen.donnee_entree.presence_ventouse;
  delete gen.donnee_entree.presence_regulation_combustion;
  delete gen.donnee_intermediaire;
}

function runDetailed(label, dpe) {
  const r = calcul_3cl(dpe);
  const s = r.logement.sortie;
  const inst = r.logement.installation_chauffage_collection.installation_chauffage[0];
  const em_di = inst.emetteur_chauffage_collection.emetteur_chauffage[0].donnee_intermediaire;
  const gen_di = inst.generateur_chauffage_collection.generateur_chauffage[0].donnee_intermediaire;
  
  // ECS details
  const iecs = r.logement.installation_ecs_collection.installation_ecs[0];
  const genECS_di = iecs.generateur_ecs_collection.generateur_ecs[0].donnee_intermediaire;
  
  const GV = s.deperdition.deperdition_enveloppe + s.deperdition.deperdition_renouvellement_air;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${label}`);
  console.log(`${'='.repeat(80)}`);
  
  console.log('\n--- Déperditions ---');
  console.log(`  GV enveloppe = ${s.deperdition.deperdition_enveloppe.toFixed(1)} W/K`);
  console.log(`  GV air = ${s.deperdition.deperdition_renouvellement_air.toFixed(1)} W/K`);
  console.log(`  GV total = ${GV.toFixed(1)} W/K`);
  
  console.log('\n--- Besoins ---');
  console.log(`  Besoin ch = ${s.apport_et_besoin.besoin_ch.toFixed(1)} kWh`);
  console.log(`  Besoin ECS = ${s.apport_et_besoin.besoin_ecs.toFixed(1)} kWh`);
  
  console.log('\n--- Chauffage (rendements) ---');
  console.log(`  Émission: re = ${em_di.rendement_emission}`);
  console.log(`  Distribution: rd = ${em_di.rendement_distribution}`);
  console.log(`  Régulation: rr = ${em_di.rendement_regulation}`);
  console.log(`  Intermittence: I0 = ${em_di.i0}`);
  console.log(`  Générateur SCOP/rg = ${gen_di.scop || gen_di.rg}`);
  console.log(`  Conso ch génér. = ${gen_di.conso_ch.toFixed(1)} kWh EF`);
  if (gen_di.conso_ch_depensier) console.log(`  Conso ch dépensier = ${gen_di.conso_ch_depensier.toFixed(1)} kWh EF`);
  
  console.log('\n--- ECS ---');
  console.log(`  Générateur ECS intermédiaire:`, JSON.stringify(genECS_di));
  
  console.log('\n--- Consommations EF ---');
  console.log(`  CH: ${s.ef_conso.conso_ch.toFixed(1)} kWh`);
  console.log(`  ECS: ${s.ef_conso.conso_ecs.toFixed(1)} kWh`);
  console.log(`  Éclairage: ${s.ef_conso.conso_eclairage.toFixed(1)} kWh`);
  console.log(`  Auxiliaires: ${s.ef_conso.conso_totale_auxiliaire.toFixed(1)} kWh`);
  
  console.log('\n--- Consommations EP ---');
  console.log(`  CH: ${s.ep_conso.ep_conso_ch.toFixed(1)} kWh EP`);
  console.log(`  ECS: ${s.ep_conso.ep_conso_ecs.toFixed(1)} kWh EP`);
  console.log(`  Éclairage: ${s.ep_conso.ep_conso_eclairage.toFixed(1)} kWh EP`);
  console.log(`  Auxiliaires: ${s.ep_conso.ep_conso_totale_auxiliaire.toFixed(1)} kWh EP`);
  console.log(`  TOTAL 5 usages: ${s.ep_conso.ep_conso_5_usages.toFixed(1)} kWh EP`);
  console.log(`  → EP/m² = ${s.ep_conso.ep_conso_5_usages_m2} | Classe = ${s.ep_conso.classe_bilan_dpe}`);
  
  console.log('\n--- GES ---');
  console.log(`  GES/m² = ${s.emission_ges.emission_ges_5_usages_m2} | Classe = ${s.emission_ges.classe_emission_ges}`);
  
  console.log('\n--- Coûts ---');
  console.log(`  Coût 5 usages = ${s.cout.cout_5_usages.toFixed(0)} €/an`);
  
  return {
    ep_m2: s.ep_conso.ep_conso_5_usages_m2,
    classe: s.ep_conso.classe_bilan_dpe,
    ges_m2: s.emission_ges.emission_ges_5_usages_m2,
    classe_ges: s.emission_ges.classe_emission_ges,
    cout: s.cout.cout_5_usages,
    ep_ch: s.ep_conso.ep_conso_ch,
    ep_ecs: s.ep_conso.ep_conso_ecs,
    ef_ch: s.ef_conso.conso_ch,
    ef_ecs: s.ef_conso.conso_ecs,
    besoin_ch: s.apport_et_besoin.besoin_ch,
    GV,
    scop: gen_di.scop || gen_di.rg,
  };
}

// ========= Scénario S0: état actuel =========
const dpe0 = deepClone(base);
const S0 = runDetailed("S0 — État actuel (gaz collectif + chaudière)", dpe0);

// ========= Scénario S9: PAC air/air + CET + VMC =========
const dpe9 = deepClone(base);
setVMCHygroB(dpe9);
setChauffagePACairair(dpe9);
setECSCETAirExt(dpe9);
const S9 = runDetailed("S9 — PAC air/air multisplit + CET 150L + VMC hygro B", dpe9);

// ========= Scénario S11: PAC air/eau + CET + VMC =========
const dpe11 = deepClone(base);
setVMCHygroB(dpe11);
setChauffagePACaireau(dpe11);
setECSCETAirExt(dpe11);
const S11 = runDetailed("S11 — PAC air/eau + CET 150L + VMC hygro B", dpe11);

// ========= ALSO: test PAC air/air SANS VMC =========
const dpe9nv = deepClone(base);
setChauffagePACairair(dpe9nv);
setECSCETAirExt(dpe9nv);
const S9nv = runDetailed("S9-bis — PAC air/air + CET 150L SANS VMC", dpe9nv);

// ========= Also: S3 reference (elec inertie + CET + VMC) for comparison =========
// Already exists in the doc for reference

// Summary
console.log('\n\n');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('SYNTHÈSE DES SCÉNARIOS PAC (sans travaux d\'enveloppe)');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log('Scénario           | EP/m² | Classe | GES | Cl.GES | Coût | Besoin_ch | SCOP');
console.log('-------------------|-------|--------|-----|--------|------|-----------|-----');
for (const [name, data] of [['S0 actuel', S0], ['S9 PAC aa+CET+VMC', S9], ['S11 PAC ae+CET+VMC', S11], ['S9nv PAC aa+CET noVMC', S9nv]]) {
  console.log(`${name.padEnd(19)}| ${String(data.ep_m2).padStart(5)} | ${data.classe.padStart(6)} | ${String(data.ges_m2).padStart(3)} | ${data.classe_ges.padStart(6)} | ${data.cout.toFixed(0).padStart(4)} | ${data.besoin_ch.toFixed(0).padStart(9)} | ${data.scop}`);
}

// Comparison with document
console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('CONFRONTATION avec les valeurs du document (§21.2)');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`\nS9 dans le doc:  EP/m² = 65, classe A, GES 2, A, 515€/an`);
console.log(`S9 simulé:       EP/m² = ${S9.ep_m2}, classe ${S9.classe}, GES ${S9.ges_m2}, ${S9.classe_ges}, ${S9.cout.toFixed(0)}€/an`);
console.log(`  → ${S9.ep_m2 === 65 ? '✅ CONFORME' : '❌ DIFFÉRENT'} pour EP/m²`);
console.log(`\nS11 dans le doc: EP/m² = 76, classe B, GES 2, A, 589€/an`);
console.log(`S11 simulé:      EP/m² = ${S11.ep_m2}, classe ${S11.classe}, GES ${S11.ges_m2}, ${S11.classe_ges}, ${S11.cout.toFixed(0)}€/an`);
console.log(`  → ${S11.ep_m2 === 76 ? '✅ CONFORME' : '❌ DIFFÉRENT'} pour EP/m²`);

