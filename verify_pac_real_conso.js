import * as fs from 'fs';
import { calcul_3cl } from '@open3cl/engine';

// The 3CL gives conventional consumption. Let's compute realistic estimates.
// Key factors that make real consumption differ from 3CL:
// 1. Real internal temp: 20.5°C vs 3CL's 19°C → +15-20% besoin_ch
// 2. Real occupation: can be higher or lower than conventional Nadeq=1.77
// 3. Real SCOP: ~3.0 with 5kW PAC (confirmed in §22), close to 3CL
// 4. Real weather: varies year to year, 3CL uses average

// S9 data (PAC air/air + CET 150L + VMC):
//   EF ch=932, EF ecs=505, EF ecl=94, EF aux=227, total EF=1758 kWh
//   EP total = 3340 → 64 EP/m² 
//   Coût = 510€/an (tarif 3CL conventionnel)

// S11 data (PAC air/eau + CET 150L + VMC):
//   EF ch=1062, EF ecs=505, EF ecl=94, EF aux=391, total EF=2052 kWh
//   EP total = 3900 → 75 EP/m²
//   Coût = 586€/an

// Real-world consumption estimate
console.log('═══════════════════════════════════════════════════════════════');
console.log('ESTIMATION CONSOMMATION RÉELLE — PAC air/air (S9)');
console.log('═══════════════════════════════════════════════════════════════\n');

const scenarios = [
  {
    name: 'S9 — PAC air/air + CET 150L + VMC',
    ef_ch_3cl: 932,
    ef_ecs_3cl: 505,
    ef_ecl_3cl: 94,
    ef_aux_3cl: 227,
    scop: 3.0,
    scop_reel: 2.99,
  },
  {
    name: 'S11 — PAC air/eau + CET 150L + VMC',
    ef_ch_3cl: 1062,
    ef_ecs_3cl: 505,
    ef_ecl_3cl: 94,
    ef_aux_3cl: 391,
    scop: 2.8,
    scop_reel: 2.8, // same as 3CL for air/eau with proper sizing
  }
];

for (const sc of scenarios) {
  const total_3cl = sc.ef_ch_3cl + sc.ef_ecs_3cl + sc.ef_ecl_3cl + sc.ef_aux_3cl;
  console.log(`\n--- ${sc.name} ---`);
  console.log(`\nConsommation 3CL conventionnelle (EF) :`);
  console.log(`  Chauffage : ${sc.ef_ch_3cl} kWh (SCOP=${sc.scop})`);
  console.log(`  ECS (CET) : ${sc.ef_ecs_3cl} kWh (COP=2.5)`);
  console.log(`  Éclairage : ${sc.ef_ecl_3cl} kWh`);
  console.log(`  Auxiliaires: ${sc.ef_aux_3cl} kWh`);
  console.log(`  TOTAL EF   : ${total_3cl} kWh`);
  
  // Real-world adjustments
  // 1. Temperature: 20.5°C vs 19°C → besoin_ch × (20.5-Text_moy)/(19-Text_moy)
  //    Text_moy Strasbourg ≈ 5°C pendant la saison de chauffe
  //    Factor = (20.5-5)/(19-5) = 15.5/14 = 1.107 → +10.7% sur besoin_ch
  const factorTemp = 1.107;
  // 2. SCOP réel (confirmed in §22: 2.99 avec PAC 5kW) 
  const factorSCOP = sc.scop / sc.scop_reel;
  // 3. ECS réelle: 3CL suppose consommation conventionnelle V40=99L/j
  //    Si comportement standard: V40 réel ≈ 80-120L/j → facteur 1.0 en moyenne
  const factorECS = 1.0;
  // 4. Éclairage réel: dépend fortement de l'occupant, garder ×1.0
  // 5. Auxiliaires: VMC tourne 24/7 → réaliste, garder ×1.0
  
  const ef_ch_reel = sc.ef_ch_3cl * factorTemp * factorSCOP;
  const ef_ecs_reel = sc.ef_ecs_3cl * factorECS;
  const ef_ecl_reel = sc.ef_ecl_3cl;
  const ef_aux_reel = sc.ef_aux_3cl;
  const total_reel = ef_ch_reel + ef_ecs_reel + ef_ecl_reel + ef_aux_reel;
  
  console.log(`\nEstimation consommation RÉELLE (EF) :`);
  console.log(`  Chauffage : ${ef_ch_reel.toFixed(0)} kWh (+${((factorTemp*factorSCOP-1)*100).toFixed(0)}% vs 3CL: +1.5°C consigne)`);
  console.log(`  ECS (CET) : ${ef_ecs_reel.toFixed(0)} kWh (conventionnel = réaliste)`);
  console.log(`  Éclairage : ${ef_ecl_reel.toFixed(0)} kWh`);
  console.log(`  Auxiliaires: ${ef_aux_reel.toFixed(0)} kWh`);
  console.log(`  TOTAL EF   : ${total_reel.toFixed(0)} kWh`);
  console.log(`  Écart vs 3CL: +${((total_reel/total_3cl-1)*100).toFixed(0)}%`);
  
  // Cost estimate with real tariff
  // EDF Base 2025: ~0.2516 €/kWh
  // EDF HC/HP: HP ~0.2700 €/kWh, HC ~0.2068 €/kWh
  // CET runs mostly HC, PAC mostly HP, VMC 24h→mix
  const prixHP = 0.2700;
  const prixHC = 0.2068;
  const prixBase = 0.2516;
  const aboBase9kva = 16.07 * 12; // abonnement mensuel base 9kVA ≈ 193€/an
  const aboHCHP9kva = 17.28 * 12; // abonnement mensuel HC/HP 9kVA ≈ 207€/an
  
  // En base: tout au même prix
  const coutBase = total_reel * prixBase + aboBase9kva;
  
  // En HC/HP: CET en HC (nuit), PAC en HP (journée), VMC 24h (50/50)
  const coutHCHP = ef_ch_reel * prixHP + ef_ecs_reel * prixHC + ef_ecl_reel * prixHP + ef_aux_reel * (prixHP*0.67 + prixHC*0.33) + aboHCHP9kva;
  
  console.log(`\nEstimation facture annuelle :`);
  console.log(`  Tarif Base (9 kVA): ${coutBase.toFixed(0)} €/an (abo ${aboBase9kva.toFixed(0)}€ + conso ${(total_reel * prixBase).toFixed(0)}€)`);
  console.log(`  Tarif HC/HP (9 kVA): ${coutHCHP.toFixed(0)} €/an (avantage HC pour CET la nuit)`);
  console.log(`  3CL conventionnel: ${sc.name.includes('S9') ? '510' : '586'} €/an`);
}

// Also show what happens with "dépensier" mode (3CL also computes this)
console.log('\n\n═══════════════════════════════════════════════════════════════');
console.log('NOTE SUR LE TARIF 3CL vs TARIF RÉEL');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log('Le 3CL utilise des tarifs conventionnels arrêtés au 01/01/2021:');
console.log('  Électricité: 0.1740 €/kWh (pour l\'estimation de coût)');
console.log('  Abonnement: ~180 €/an (9 kVA)');
console.log('');
console.log('Tarifs réels 2025 (après augmentations successives):');
console.log(`  Base: 0.2516 €/kWh (+44% vs 3CL)`);
console.log(`  HP: 0.2700 €/kWh | HC: 0.2068 €/kWh`);
console.log('');
console.log('→ La facture réelle sera ~40-50% supérieure au coût 3CL.');

