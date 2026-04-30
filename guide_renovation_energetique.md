# Guide de rénovation énergétique — 12 rue de l'Oberelsau, Strasbourg

> **Document de synthèse** — Ce guide consolide l'ensemble des analyses, simulations Open3CL et chiffrages réalisés pour la rénovation énergétique de l'appartement T3 de 51,7 m². Il est structuré comme un plan d'action pour lancer les travaux de manière éclairée.

---

## Table des matières

1. [Résumé exécutif — Ce qu'il faut retenir](#1-résumé-exécutif)
2. [Diagnostic de l'état actuel](#2-diagnostic-de-létat-actuel)
3. [Les 3 stratégies de rénovation](#3-les-3-stratégies-de-rénovation)
4. [Stratégie recommandée — Détail complet](#4-stratégie-recommandée--détail-complet)
5. [Choix des équipements](#5-choix-des-équipements)
6. [Devis détaillé — 6 lots](#6-devis-détaillé--6-lots)
7. [Aides financières et fiscalité](#7-aides-financières-et-fiscalité)
8. [Consommation réelle vs DPE — Ce qu'il faut vraiment attendre](#8-consommation-réelle-vs-dpe)
9. [Travaux techniques — Guide d'exécution](#9-travaux-techniques--guide-dexécution)
10. [Planning et chronologie](#10-planning-et-chronologie)
11. [Annexe A — Tableau des 24 scénarios simulés](#annexe-a--tableau-des-24-scénarios-simulés)
12. [Annexe B — Scénarios hybrides PAC + inertie](#annexe-b--scénarios-hybrides-pac--inertie)
13. [Annexe C — Solutions écartées et pièges à éviter](#annexe-c--solutions-écartées-et-pièges-à-éviter)
14. [Annexe D — PAC eau/eau géothermique — Propriété complète (4 logements, 292 m²)](#annexe-d--pac-eaueau-géothermique--simulation-pour-la-propriété-complète-4-logements-292-m)

---

## 1. Résumé exécutif

### Le logement

| | |
|---|---|
| **Adresse** | 12 rue de l'Oberelsau, Strasbourg (zone H1b) |
| **Type** | T3, 51,7 m², HSP 2,5 m, combles aménagés sous toiture |
| **Construction** | 1997 |
| **Destination** | Location / revente |

### Le problème

| | Avant rénovation |
|---|---|
| **DPE** | **221 EP/m² — Classe D** |
| **GES** | 48 g/m² — Classe D |
| **Facture estimée** | 1 251 €/an (3CL) · ~1 500-1 700 €/an (tarifs réels 2025) |
| **Chauffage** | Gaz collectif condensation (ratio 44 %), radiateurs bitube |
| **ECS** | Gaz collectif combiné — rendement distribution **26 %** (74 % de pertes) |
| **Ventilation** | Ouverture des fenêtres uniquement |

### La solution recommandée (stratégie 1 — Pragmatique)

| | Après rénovation (S3) |
|---|---|
| **DPE** | **127 EP/m² — Classe C** |
| **GES** | 5 g/m² — **Classe A** (÷10) |
| **Facture estimée** | 764 €/an (3CL) · ~960-1 000 €/an (tarifs réels 2025) |
| **Économie annuelle** | ~487 €/an (3CL) · ~555-700 €/an réelle |
| **Budget brut** | **7 700 – 9 000 €** |
| **Budget net (après aides)** | **5 650 – 7 050 €** |
| **ROI** | **10 – 15 ans** |
| **Plus-value revente estimée** | +15 000 à +30 000 € (passage D→C) |

### La solution optimale (si accord copropriété obtenu)

| | Après rénovation (S9) |
|---|---|
| **DPE** | **64 EP/m² — Classe A** |
| **GES** | 2 g/m² — **Classe A** |
| **Facture estimée** | 510 €/an (3CL) · ~665 €/an (tarifs réels 2025) |
| **Économie annuelle** | ~741 €/an (3CL) · ~1 000 €/an réelle |
| **Budget** | **8 500 – 13 500 €** |
| **ROI** | **11 – 18 ans** |
| **Plus-value revente estimée** | +33 000 à +60 000 € (passage D→A) |
| **Bonus** | Climatisation réversible — critique sous combles |

### Arbre de décision rapide

```
Accord copropriété pour unité extérieure PAC ?
├── OUI + Budget > 8 500 €  →  S9 — PAC air/air — Classe A (64 EP/m²)
├── OUI + Budget < 8 500 €  →  S3 — Inertie + CET — Classe C (127 EP/m²)
└── NON                      →  S3 — Inertie + CET — Classe C (127 EP/m²)
```

---

## 2. Diagnostic de l'état actuel

### 2.1 Bilan thermique — D'où viennent les pertes ?

Le coefficient de déperdition global (GV) du logement a été calculé par Open3CL. Ce GV indique combien de watts le logement perd par degré de différence intérieur/extérieur.

#### Sans VMC (état actuel)

| Poste | Coefficient | Part | Détail |
|---|---|---|---|
| **Murs extérieurs** | 24,7 W/K | 23 % | Brique 20 cm + ITI laine 9 cm, Umur = 0,36 W/m²·K |
| **Toiture (rampants)** | 18,1 W/K | 17 % | Rampants isolés 20 cm, Uph = 0,185 |
| **Comble faiblement ventilé** | 4,1 W/K | 4 % | 20 cm isolant, Uph = 0,176 |
| **Fenêtres (5 baies)** | 22,2 W/K | 21 % | Bois, DV air 16 mm, Uw = 2,4–2,9, sans joints |
| **Ponts thermiques** | 14,2 W/K | 13 % | Linéiques (planchers, menuiseries, angles) |
| **Plancher bas** | 0 W/K | 0 % | Dalle béton sur local chauffé (b = 0) |
| **Portes** | 2,0 W/K | 2 % | |
| **Sous-total enveloppe** | **85,3 W/K** | **81 %** | |
| **Ventilation (hvent)** | 0 W/K | — | Pas de VMC = pas de débit mécanique |
| **Perméabilité (hperm)** | **28,5 W/K** | **19 %** | Infiltrations parasites (q4pa forfaitaire = 1,5) |
| **GV TOTAL** | **155,2 W/K** | **100 %** | |

#### Avec VMC hygro B (après rénovation)

| Poste | Coefficient | Part |
|---|---|---|
| Enveloppe | 85,3 W/K | 60 % |
| Ventilation VMC (hvent) | 19,2 W/K | 13 % |
| Perméabilité (hperm) | 24,3 W/K | 17 % |
| **GV TOTAL** | **143,0 W/K** | **100 %** |

> **Observation** : la VMC réduit le GV global (155→143 W/K) car elle remplace les infiltrations désordonnées par un débit contrôlé plus faible. Les pertes par perméabilité baissent (28,5→24,3) même si la VMC ajoute 19,2 W/K de ventilation mécanique.

### 2.2 Répartition de la consommation actuelle

| Poste | kWh EP/an | % | Commentaire |
|---|---|---|---|
| **Chauffage (gaz)** | 5 848 | 51 % | Chaudière condensation + distribution bitube |
| **ECS (gaz)** | 5 038 | 44 % | Rendement distribution 26 % = catastrophique |
| **Auxiliaires** | 170 | 1,5 % | Circulateur chaudière |
| **Éclairage** | 378 | 3,5 % | Conventionnel |
| **TOTAL** | **11 434 kWh EP** | 100 % | → 221 EP/m² |

> **Le poste ECS est le scandale caché** : 44 % de la consommation totale, à cause d'un réseau de distribution gaz non isolé avec 74 % de pertes. Le simple passage à un CET individuel divise ce poste par **6** (5 038 → 959 kWh EP).

### 2.3 Détail des fenêtres

| # | Orientation | Pièce | Surface | Uw | Joints | Entrée d'air |
|---|---|---|---|---|---|---|
| 1 | Ouest | Salon | 1,76 m² | 2,9 | ❌ | ❌ |
| 2 | Ouest | Salon | 1,76 m² | 2,9 | ❌ | ❌ |
| 3 | Est | Chambre | 1,32 m² | 2,4 | ❌ | ❌ |
| 4 | Est | Chambre | 1,32 m² | 2,4 | ❌ | ❌ |
| 5 | Est | Cuisine | 0,68 m² | 2,9 | ❌ | ❌ |

L'absence de joints et d'entrées d'air est un facteur aggravant pour la perméabilité et empêche la validation de la VMC au DPE.

### 2.4 Points faibles identifiés — Priorités d'action

| Rang | Point faible | Impact | Solution |
|---|---|---|---|
| **1** | ECS gaz collectif (rendement distrib. 26 %) | 5 038 kWh EP = 44 % | CET individuel 150L |
| **2** | Chauffage gaz (ratio 44 % d'un système collectif) | 5 848 kWh EP = 51 % | Radiateurs élec. inertie ou PAC air/air |
| **3** | Pas de ventilation mécanique | Qualité air + DPE | VMC hygro B + entrées d'air |
| **4** | Fenêtres sans joints (Uw 2,4–2,9) | 22 W/K + infiltrations | Joints EPDM (DIY) ou remplacement (optionnel) |
| **5** | Perméabilité air (hperm = 28,5 W/K) | 19 % des pertes | Travaux d'étanchéité DIY (130–170 €) |

---

## 3. Les 3 stratégies de rénovation

Toutes les stratégies incluent le socle commun : **déconnexion du gaz collectif + CET 150L individuel + VMC hygro B**. La différence porte sur le système de chauffage.

### Comparatif synthétique

| | **Stratégie 1 — Pragmatique** | **Stratégie 2 — Optimale** | **Stratégie 3 — Budget max** |
|---|---|---|---|
| **Scénario** | S3 | S9 | S21 |
| **Chauffage** | Radiateurs élec. inertie NFC | PAC air/air multisplit | PAC air/air + réno enveloppe |
| **DPE** | **127 EP/m² — C** | **64 EP/m² — A** | **55 EP/m² — A** |
| **GES** | 5 g/m² — A | 2 g/m² — A | 2 g/m² — A |
| **Facture 3CL** | 764 €/an | 510 €/an | 440 €/an |
| **Facture réelle (2025)** | ~960–1 000 €/an | ~665 €/an | ~590 €/an |
| **Budget brut** | 7 700–9 000 € | 8 500–13 500 € | 14 000–22 000 € |
| **Budget net (aides)** | 5 650–7 050 € | 6 500–11 500 € | 12 000–20 000 € |
| **Économie/an vs actuel** | 487 €/an | 741 €/an | 811 €/an |
| **ROI** | 10–15 ans | 11–18 ans | 15–25 ans |
| **Plus-value revente** | +15 000 à +30 000 € | +33 000 à +60 000 € | +33 000 à +60 000 € |
| **Clim été** | ❌ | ✅ | ✅ |
| **Accord copro** | ✅ Non nécessaire | ⚠️ Nécessaire (UE PAC) | ⚠️ Nécessaire |

### Quelle stratégie choisir ?

**Stratégie 1 (Pragmatique)** si :
- Budget < 8 500 €
- Copropriété refuse l'unité extérieure PAC
- Objectif : sortir du D rapidement avec un excellent ROI

**Stratégie 2 (Optimale)** — **RECOMMANDÉE** si :
- Budget 8 500–13 500 € disponible
- Copropriété accepte l'unité extérieure
- Objectif : classe A + climatisation sous combles + valorisation maximale
- Le surcoût de ~4 000 € vs S1 rapporte +18 000–30 000 € en plus-value revente

**Stratégie 3 (Budget max)** seulement si :
- Budget > 14 000 € et objectif confort maximal long terme
- La plus-value revente est identique à S2 (les deux sont classe A)
- Le gain marginal est de 65 €/an pour 6 000–8 000 € supplémentaires

### Pourquoi ces stratégies et pas d'autres ?

24 scénarios ont été simulés via Open3CL (voir Annexe A). Les autres approches sont soit moins performantes en DPE, soit plus chères pour un résultat inférieur :

| Solution écartée | Pourquoi |
|---|---|
| PAC air/eau (S11) | 75 EP/m² (B) vs 64 (A) pour l'air/air, coût ×1,5, pas de vraie clim |
| Plancher rayonnant (S8) | 169 EP/m² ! Piège 3CL, +40 EP/m² vs inertie |
| Poêle granulés (S13) | 106 EP/m² (B), bon ROI mais conduit fumée + manutention + gradient thermique |
| Isolation seule (S17-S20) | ROI > 60 ans, ne change pas la classe sans changement de système |
| Triple vitrage (S20) | −5 EP/m² vs double VIR, surcoût +1 500–3 000 €, réduit apports solaires |

---

## 4. Stratégie recommandée — Détail complet

> Cette section détaille la **Stratégie 1 (Pragmatique — S3)**, la plus universellement applicable. Les spécificités de la Stratégie 2 (PAC) sont signalées par le tag **[PAC]**.

### 4.1 Lot 1 — Déconnexion du gaz collectif

L'appartement du haut (51,7 m²) se déconnecte de la chaudière gaz collective. L'appartement du bas conserve le système gaz.

**Travaux :**

| Tâche | Intervenant |
|---|---|
| Vidange partielle du circuit côté haut | Plombier |
| Dépose des 4–5 radiateurs eau chaude bitubes | Plombier |
| Coupure et bouchage des colonnes montantes au plancher | Plombier |
| Neutralisation/dépose des tuyaux apparents | Plombier |
| Rebouchage traversées de plancher (mousse PU + mortier) | Plombier ou propriétaire |
| Vérification/purge du circuit bas | Plombier |
| Condamnation arrivée gaz si existante dans l'appartement | Plombier PG / GRDF |

**Impact sur l'appartement du bas** : la chaudière 10,5 kW continue de desservir le bas (~66 m²), surdimensionnée mais fonctionnelle en modulation. Le rendement ECS du bas s'améliorera (réseau plus court). Adapter la courbe de chauffe (~100–150 €).

**Aspect copropriété** : si même propriétaire des deux lots, aucune démarche particulière. Sinon, accord écrit du copropriétaire du bas et potentiellement vote en AG.

### 4.2 Lot 2 — Installation électrique

Le logement passe en tout-électrique. Il faut créer les circuits depuis le tableau.

**Architecture requise (NF C 15-100) :**

```
TABLEAU ÉLECTRIQUE
│
├── Différentiel 40A / 30mA Type A
│   ├── Disjoncteur 20A ── Circuit 1 : Salon R1 (1250W) + Salon R2 (1250W) = 2 500 W → 10,9 A  [< 20A ✓]
│   ├── Disjoncteur 20A ── Circuit 2 : Chambre (1250W) + Cuisine (1000W) = 2 250 W  → 9,8 A   [< 20A ✓]
│   ├── Disjoncteur 20A ── Circuit 3 : SDB sèche-serviettes (750W + 1000W souffl.) = 1 750 W → 7,6 A   [< 20A ✓]
│   └── Disjoncteur 16A ── Circuit CET (résistance 2 000 W max) → 8,7 A [< 16A ✓] + contacteur HC/HP
```

> **Vérification NF C 15-100** : tous les circuits < 4 500 W max par circuit 20A. Câble 2,5 mm² supporte 20A en pose sous goulotte. Courants calculés : I = P / 230 V.

**Règles clés :**
- Max 4 500 W par circuit chauffage (disjoncteur 20A)
- Câble **2,5 mm²** obligatoire pour circuits chauffage
- Circuit **dédié** pour la SDB (sèche-serviettes)
- Contacteur jour/nuit pour le CET (fonctionne en heures creuses)

**Passage des câbles** : moulure apparente PVC blanche le long des plinthes (recommandé pour location — rapide, propre, conforme).

**Pilotage des radiateurs** : les modèles recommandés (Thermor Ovation 3, Atlantic Agilia, Thermor Allure 3) sont tous équipés **WiFi ET fil pilote** (entrée 6 ordres). Deux modes de pilotage possibles, à choisir avant pose :

| Mode | Avantages | Inconvénients |
|---|---|---|
| **WiFi seul** (sans fil pilote) | Pas de câble supplémentaire, app locataire, détection fenêtre | Dépend du WiFi/app, moins robuste |
| **Fil pilote 1,5 mm² noir** | Contrôle centralisé, indépendant du réseau, fiable à long terme | 1 câble noir supplémentaire par radiateur (5 × ~8 m = ~45 m) |

> **Recommandation** : tirer le fil pilote **même si WiFi activé** — cela ne coûte que ~16 € de câble et permet de basculer sur un programmateur central si le locataire ne configure pas l'app.

#### Liste des fournitures électriques à acheter

##### Tableau électrique

| Réf. | Désignation | Qté | Prix unit. | Total | Où acheter |
|---|---|---|---|---|---|
| — | Interrupteur différentiel 40A / 30mA **Type A** (ondulé) | 1 | 50–60 € | 55 € | Leroy Merlin / Schneider Resi9 |
| — | Disjoncteur 20A courbe C 1P+N | 3 | 9–12 € | 30 € | LM / Schneider Resi9 iC60N |
| — | Disjoncteur 16A courbe C 1P+N (circuit CET) | 1 | 9–12 € | 10 € | LM / Schneider |
| — | Contacteur jour/nuit 2P 25A + bobine 230V (HC/HP pour CET) | 1 | 30–40 € | 35 € | LM / Hager ESC225 |
| — | Peigne de raccordement phase 13 modules (pour rail du diff.) | 1 | 10–15 € | 12 € | LM / Hager |

> ⚠️ **Type A obligatoire** pour le différentiel protégeant le CET thermodynamique : la résistance d'appoint génère des courants de défaut pulsés non détectés par un Type AC standard.

##### Câblage — Circuits chauffage (3 × radiateurs)

| Réf. | Désignation | Qté | Prix unit. | Total | Notes |
|---|---|---|---|---|---|
| — | Câble souple **R2V 3G 2,5 mm²** (phase + neutre + PE) | 45 m | 2,50 €/m | 113 € | Couper en 3 longueurs : ~15m C1, ~15m C2, ~15m C3 |
| — | Goulotte PVC **20×10 mm** blanche avec couvercle clipsable | 20 m | 2,50 €/m | 50 € | Pose en plinthe le long des murs |
| — | Boîtes de dérivation IP40 85×85mm avec bornier | 6 | 4 € | 24 € | 1 par point de dérivation intermédiaire |
| — | Sorties de câble / boîtiers d'applique radiateurs | 6 | 5–7 € | 36 € | 1 par radiateur (sortie murale du câble) |
| — | Dominos / borniers à vis 2,5 mm² (sachet 100) | 1 | 3 € | 3 € | Connexions en boîtes de dérivation |
| — | Câble **R2V 3G 1,5 mm²** (circuit VMC, faible puissance) | 5 m | 1,80 €/m | 9 € | Raccordement caisson VMC ~10W |
| — | Câble **H05V-K 1,5 mm² noir** — fil pilote (1 fil/radiateur, ~8 m chacun) | 45 m | 0,35 €/m | 16 € | **Option** : 1 fil noir par radiateur, chemine avec le 3G2,5 dans la même goulotte |
| — | Bornier 1,5 mm² pour fil pilote (point de départ tableau) | 5 | 0,50 € | 3 € | 1 bornier par radiateur sur rail DIN du tableau |
| — | Goulotte PVC **25×10 mm** blanche (remplace 20×10 si fil pilote ajouté) | 20 m | 3,00 €/m | 60 € | Section légèrement supérieure pour loger 3G2,5 + 1×1,5 noir |

##### Câblage — Circuit CET (dédié 16A)

| Réf. | Désignation | Qté | Prix unit. | Total | Notes |
|---|---|---|---|---|---|
| — | Câble souple **R2V 3G 2,5 mm²** (tableau → SDB, ~10m) | 12 m | 2,50 €/m | 30 € | Marge incluse pour passage |
| — | Goulotte PVC 20×10 mm blanche (tronçon SDB) | 3 m | 2,50 €/m | 8 € | Si non mutualisé avec autre circuit |
| — | Prise **2P+T 16A étanche IP44** (ou borne directe selon CET) | 1 | 8–12 € | 10 € | Atlantic Calypso : connexion bornier direct = pas de prise |
| — | Boîte d'encastrement IP44 pour SDB (si prise) | 1 | 3 € | 3 € | — |

##### Fixation et accessoires radiateurs

| Réf. | Désignation | Qté | Prix unit. | Total | Notes |
|---|---|---|---|---|---|
| — | Chevilles longues **Fischer SXR 10×140** | 10 | 1,50 € | 15 € | 2 par radiateur mur ext. (placo+brique) |
| — | Vis + écrous pour taquets de radiateurs | 1 sachet | 3 € | 3 € | Fourni avec les radiateurs mais prévoir en plus |
| — | Chevilles Molly **M6 métal** (cloison SDB) | 4 | 0,80 € | 3 € | 2 fixations sèche-serviettes |
| — | Foret béton/SDS Ø10 × 160 mm | 1 | 6–8 € | 7 € | Perçage dans brique à travers l'isolant |
| — | Foret Ø10 × 60 mm standard (murs intérieurs) | 1 | 3 € | 3 € | — |

##### Récapitulatif fournitures électriques (hors MO)

| Sous-ensemble | Montant estimé |
|---|---|
| Tableau (diff. + disjoncteurs + contacteur + peigne) | **142 €** |
| Câblage circuits chauffage (câble 3G2,5 + goulotte + boîtes + sorties) | **235 €** |
| Fil pilote 1,5 mm² noir + borniers (option, ~45 m) | **+19 €** |
| Câblage circuit CET (câble + goulotte + borne) | **51 €** |
| Fixation radiateurs (chevilles + forets) | **34 €** |
| **Total fournitures électriques (sans fil pilote)** | **~462 €** |
| **Total fournitures électriques (avec fil pilote)** | **~481 €** |

> Budget MO électricien en sus : **700–1 100 €** (forfait journée, Strasbourg 2025)

### 4.3 Lot 3 — Chauffage

#### Stratégie 1 : 5 radiateurs électriques à inertie NFC

| Pièce | Puissance | Type |
|---|---|---|
| Salon (×2) | 2 × 1 250 W | Inertie sèche (fonte/cœur de chauffe) |
| Chambre | 1 250 W | Inertie sèche |
| Cuisine | 1 000 W | Inertie sèche |
| SDB | 750 W + soufflerie 1 000 W | Sèche-serviettes électrique |
| **Puissance totale** | **5 500 W** | |

**Dimensionnement validé** : puissance spécifique ~106 W/m², conforme pour zone H1b, combles aménagés, isolation existante (Umur = 0,36, Uph = 0,185).

Le DPE traite identiquement les technologies inertie sèche, fluide, panneaux rayonnants et convecteurs NFC (tous `enum_type_emission_id = 100`). Le choix de l'inertie est dicté par le **confort** (chaleur douce, pas de cycles on/off secs) et la **fiabilité** (corps de chauffe garanti à vie chez Noirot, Thermor).

#### [PAC] Stratégie 2 : PAC air/air multisplit

| Composant | Spécification |
|---|---|
| Unité extérieure | 5 kW nominale (dimensionnement validé pour GV=143 W/K, Tbase=−15°C) |
| Unités intérieures | 3 splits : salon (~2,5 kW) + chambre 1 (~1,5 kW) + chambre 2 (~1 kW) |
| Cuisine + SDB | Conservent un radiateur inertie ou sèche-serviettes électrique |
| SCOP forfaitaire 3CL | 3,0 (zone H1/H2) |
| SCOP réel vérifié | **2,99** (modélisation bin-par-bin, backup résistif < −7°C = 9,5 % du temps) |

**Dimensionnement critique** : avec GV = 143 W/K, le besoin à −15°C est de 4,86 kW. La PAC 5 kW ne couvre que 2,0 kW à cette température → les résistances intégrées complètent. Ce fonctionnement est normal et ne dure que ~210 h/an (4,6 % du temps de chauffe). Avec une PAC sous-dimensionnée (3,5 kW), le backup monte à 23 % et le SCOP tombe à 2,75.

### 4.4 Lot 4 — Eau chaude sanitaire (CET)

**Recommandation : CET air extérieur 150L gainable**

| Paramètre | Valeur |
|---|---|
| **Volume** | 150 L |
| **V40 disponible** | 157 L (>99 L/jour de besoin pour Nadeq = 1,77 personnes) |
| **COP forfaitaire 3CL** | 2,5 (constant quel que soit le volume 100L ou 150L) |
| **Consommation ECS 3CL** | 505 kWh EF/an (identique pour 100L et 150L) |
| **EP/m² total** | **127** (150L) vs **129** (100L) — avantage 150L : ses pertes à vide sont dissipées dans le volume chauffé, créditées comme gains chauffage par le 3CL |
| **Type** | Air extérieur gainable (gaines Ø160 vers combles/extérieur) |
| **Appoint** | Résistance électrique 2 kW intégrée |

**Pourquoi 150L et pas 100L** : le 100L a un V40 de 79 L, insuffisant les jours de forte demande (2 douches + vaisselle = 100 L). Le 150L offre une marge de confort avec un **léger gain DPE (−2 EP/m²)** : ses pertes à vide plus élevées (grande surface de ballon) se dissipent dans le volume chauffé, réduisant très légèrement le besoin de chauffage dans le bilan 3CL. La consommation ECS (505 kWh EF/an) est identique pour les deux volumes, mais l'EP/m² total passe de **129** (100L) à **127** (150L).

**Pourquoi air extérieur** :
- Indépendant de la VMC (pas de couplage = moins de risques de panne)
- COP meilleur en intersaison (air extérieur à 15°C > air intérieur en été pour le chauffage d'eau)
- Le CET sur air extrait ne gagne que **2 EP/m²** (129→127) pour un surcoût et une complexité significatifs
- Pas de refroidissement de la SDB en hiver

**Installation** : posé dans la SDB ou un placard. Deux gaines isolées Ø160 traversent le plafond vers les combles et sortent en toiture ou en pignon.

### 4.5 Lot 5 — VMC simple flux hygro B

**Recommandation : Aldes EasyHome Hygro Compact Classic**

| Composant | Rôle | Localisation |
|---|---|---|
| Caisson VMC | Moteur (crée la dépression) | Combles (sur silent-blocs) |
| Gaines isolées Ø80/125 | Relient bouches d'extraction au caisson | Combles |
| Bouches hygro B (×2) | Extraction air vicié | Cuisine + SDB |
| Entrées d'air hygro (×3-4) | Amenée d'air neuf contrôlée | Fenêtres salon (×2) + chambre (×1-2) |
| Sortie toiture Ø125 | Rejet air vicié | Toiture |

**Le paradoxe VMC au DPE** : la VMC ne fait gagner que **1 EP/m²** (128→127, classe C dans les deux cas). Elle économise 483 kWh EP en chauffage (air mieux contrôlé) mais en consomme 431 kWh EP en auxiliaires (ventilateur 24h/24). **Le vrai intérêt est ailleurs** :

1. **Recommandations DPE nettoyées** : sans VMC, le DPE mentionne systématiquement « installation VMC recommandée », ce qui inquiète les acheteurs
2. **Conformité décret décence** (location 2025+) : renouvellement d'air suffisant
3. **Plus-value perçue** : une rénovation chauffage + ECS + VMC est perçue comme complète ; sans VMC, c'est un levier de négociation à la baisse (~1 000–2 000 €)
4. **Qualité de l'air** : réduction humidité, moisissures, polluants

**Entrées d'air — Solution recommandée : fraisage du dormant bois**

Les fenêtres actuelles (bois battant) n'ont ni joints ni entrées d'air. Sans entrées d'air, le diagnostiqueur **ne peut pas valider** la VMC hygro B dans le DPE. La solution la plus économique et conforme (DTU 68.3) est le fraisage d'une rainure de 370 × 12 mm dans la traverse haute du dormant, avec pose d'un module hygroréglable Aereco EHA² (5–35 m³/h, 25–30 € pièce).

| Paramètre | Solution 1 : Fraisage dormant | Solution 2 : Traversée mur |
|---|---|---|
| Principe | Rainure dans le bois + module EA clipé | Trou Ø100 mm dans le mur + manchon EA |
| Coût matériel (3-4 EA) | **75–120 €** | 135–240 € |
| Coût posé | **235–425 €** | 350–610 € |
| Accord copro | Peu probable (grille discrète) | Possible (percement mur) |
| Conformité DPE | ✅ Totale | ✅ Totale |

### 4.6 Travaux complémentaires DIY — Étanchéité à l'air

**Budget : 130–170 € · Temps : 6–7 heures**

Le hperm (28,5 W/K = 19 % des pertes) est le plus gros poste non traité par les scénarios. Le DPE utilise une valeur **forfaitaire** (q4pa = 1,5) qui **ne change pas** avec les travaux — **sauf** si un test d'infiltrométrie est réalisé ensuite.

| Travail | Coût | Impact réel | Impact DPE |
|---|---|---|---|
| Joints EPDM sur 5 fenêtres | 40–50 € | ✅ Élevé | ❌ Aucun (forfaitaire) |
| Joint seuil porte d'entrée | 15–20 € | ✅ Moyen | ❌ Aucun |
| Membranes boîtiers élec. murs ext. | 25–30 € | ✅ Moyen | ❌ Aucun |
| Mousse passages gaines/tuyaux | 15–20 € | ✅ Moyen-élevé | ❌ Aucun |
| Mastic plinthes | 8–10 € | ✅ Faible | ❌ Aucun |

> **Option bonus** : test d'infiltrométrie (300–500 €) après tous les travaux. Si q4pa mesuré ≈ 1,0 → le prochain DPE gagne **−16 EP/m²** (127→111). Si remplacement fenêtres + q4pa ≈ 0,6 → **−27 EP/m²** (127→100 = classe B).

---

## 5. Choix des équipements

### 5.1 Radiateurs — Options comparées

Trois options ont été chiffrées, de l'économique au premium :

#### Option A — Inertie sèche (recommandée)

| Pièce | A1 Premium (Noirot) | A2 Milieu (Thermor) ★ | A3 Éco (Sauter) |
|---|---|---|---|
| Salon (×2) | Palazzio 1250W (670 € × 2) | Ovation 3 1250W (480 € × 2) | Malao 1250W (370 € × 2) |
| Chambre | Palazzio 1250W (670 €) | Ovation 3 1250W (480 €) | Malao 1250W (370 €) |
| Cuisine | Axiom 1000W (530 €) | Agilia 1000W (380 €) | Bolero Auto 1000W (300 €) |
| SDB | Allure 3 Étroit 750W+souffl. (450 €) | Allure 3 Étroit 750W+souffl. (450 €) | Marapi 750W+souffl. (310 €) |
| **Total** | **2 990 €** | **2 270 €** | **1 720 €** |

#### Option B — Inertie fluide (alternative)

| Pièce | B1 Premium (Acova) | B2 Milieu (Sauter) | B3 Éco (Atlantic) |
|---|---|---|---|
| Salon (×2) | Régate Twist+Air 1250W (545 € × 2) | Orosi 1250W (380 € × 2) | Accessio Digital 2 1250W (265 € × 2) |
| Chambre | Régate Twist+Air 1250W (545 €) | Orosi 1250W (380 €) | Accessio 1250W (265 €) |
| Cuisine | Fassane Premium 1000W (450 €) | Orosi 1000W (320 €) | Accessio 1000W (230 €) |
| SDB | Régate Twist+Air SDB 750W+souffl. (450 €) | Marapi SDB 750W+souffl. (310 €) | Allure SDB 750W+souffl. (310 €) |
| **Total** | **2 535 €** | **1 770 €** | **1 335 €** |

**Impact DPE** : identique entre inertie sèche et fluide (même `enum_type_emission_id` = 100). Le choix est un compromis confort/budget :
- **Inertie sèche** : meilleur confort (accumulation + rayonnement), plus lourd (16–19 kg)
- **Inertie fluide** : bonne douceur, plus léger (10–12 kg), fixation plus facile

**Recommandation : A2 (Thermor Ovation 3)** — bon compromis qualité/prix, connecté WiFi/Cozytouch, corps fonte active, 480 €/unité.

#### Alternative B2B intracommunautaire

Avec un SIRET + n° TVA intracommunautaire, les radiateurs **Rointe Kyros** (Espagne) offrent un excellent rapport qualité/prix à 304 € HT (~365 € TTC franchise en base) : WiFi + IA adaptative, garantie 10 ans corps aluminium, certification ERP LOT20.

| Scénario | Lot 3 | Économie vs A2 |
|---|---|---|
| A2 Thermor (France TTC) | 2 295 € | Référence |
| Rointe Kyros (B2B ES, franchise) | ~1 863 € | −430 € |
| Rointe Kyros (B2B ES, option TVA) | ~1 627 € | −670 € |

### 5.2 CET — Modèles recommandés

| Modèle | Volume | Type | V40 | Prix TTC | Commentaire |
|---|---|---|---|---|---|
| **Atlantic Calypso 150L** ★ | 150 L | Air ext. gainable non-connecté | 157 L | ~1 300 € | Référence marché, gainable, sobre |
| Atlantic Calypso Connect 150L | 150 L | Air ext. gainable connecté | 157 L | ~1 500 € | + app Cozytouch |
| Thermor Aéromax Access 150L | 150 L | Air ext. gainable | 150 L | ~1 200 € | Même groupe Atlantic, bon prix |
| Atlantic Aéromax 6 150L | 150 L | Air ext. non gainable (sur air ambiant) | 157 L | ~1 500 € | Non recommandé (refroidit la pièce) |

**Recommandation : Atlantic Calypso 150L gainable non-connecté** — le modèle le plus installé, gainable vers l'extérieur, COP certifié EN 16147.

### 5.3 VMC — Modèle recommandé

| Modèle | Type | Puissance | Conso réelle | Prix |
|---|---|---|---|---|
| **Aldes EasyHome Hygro Compact Classic** ★ | SF hygro B, micro-watt | ~5–25 W selon débit | ~88–105 kWh/an | 250–350 € |

Le DPE surestime la consommation du ventilateur VMC d'un **facteur ×2** (227 kWh/an 3CL vs ~100 kWh/an réel) car le coefficient forfaitaire 0,25 W/(m³/h) couvre les anciens moteurs AC. L'Aldes EasyHome avec moteur micro-watt EC est nettement plus sobre.

### 5.4 [PAC] Modèles PAC air/air recommandés

| Marque | Gamme | Config. 5 kW | Prix posé indicatif | Commentaire |
|---|---|---|---|---|
| **Daikin** | Perfera / Stylish | 1 UE + 3 UI multisplit | 5 000–7 000 € | Référence marché, fiabilité |
| **Mitsubishi Electric** | MSZ-AP / MSZ-EF | 1 UE + 3 UI multisplit | 5 500–7 500 € | Excellent SCOP vérifié |
| **Atlantic** | Fujitsu (Asyg) | 1 UE + 3 UI multisplit | 4 500–6 500 € | Bon rapport qualité/prix |

---

## 6. Devis détaillé — 6 lots

> Devis pour la **Stratégie 1 — Option A2 (Thermor Ovation 3) + CET Calypso 150L + VMC Aldes**. Tarifs TTC, Strasbourg, 2025.

| N° | Lot | Désignation | Qté | Prix unit. | **Total** |
|---|---|---|---|---|---|
| | **LOT 1 — PLOMBERIE : DÉPOSE GAZ** | | | | |
| 1.1 | Dépose | Dépose radiateurs eau chaude bitubes | 4–5 | Forfait | 400 € |
| 1.2 | Dépose | Coupure et bouchage colonnes montantes | 2 | Forfait | 300 € |
| 1.3 | Dépose | Neutralisation tuyaux apparents | 1 | Forfait | 150 € |
| 1.4 | Dépose | Rebouchage traversées plancher | 2 | Forfait | 75 € |
| 1.5 | Dépose | Vérification et purge circuit bas | 1 | Forfait | 150 € |
| 1.6 | Dépose | Condamnation arrivée gaz (si applicable) | 0–1 | 100–150 € | 0–150 € |
| | | **Sous-total lot 1** | | | **1 075–1 225 €** |
| | | | | | |
| | **LOT 2 — ÉLECTRICITÉ : TABLEAU + CÂBLAGE** | | | | |
| 2.1 | Tableau | Interrupteur différentiel 40A 30mA Type A (si nécessaire) | 0–1 | 55 € | 0–55 € |
| 2.2 | Tableau | Disjoncteur 20A courbe C × 3 | 3 | 10 € | 30 € |
| 2.3 | Tableau | Disjoncteur 16A (circuit CET) | 1 | 10 € | 10 € |
| 2.4 | Tableau | Contacteur jour/nuit HC/HP pour CET | 1 | 35 € | 35 € |
| 2.5 | Tableau | Peigne de raccordement | 1 | 12 € | 12 € |
| 2.6 | Câblage | Câble R2V 3G 2,5mm² (4 circuits × ~8m, marge chutes+connexions) | 45 m | 2,50 €/m | 113 € |
| 2.7 | Câblage | Goulotte PVC 20×10mm (salon ~6m + chambre/cuisine ~8m + SDB ~6m partagé) | 20 m | 2,50 €/m | 50 € |
| 2.8 | Câblage | Boîtes de dérivation | 6 | 4 € | 24 € |
| 2.9 | Câblage | Sorties de câble / boîtiers | 6 | 6 € | 36 € |
| 2.10 | MO | Main d'œuvre électricien | 1 | Forfait | 700–1 100 € |
| | | **Sous-total lot 2** | | | **1 000–1 470 €** |
| | | | | | |
| | **LOT 3 — CHAUFFAGE : 5 RADIATEURS** | | | | |
| 3.1 | Salon | Thermor Ovation 3 — 1 250 W × 2 | 2 | 480 € | 960 € |
| 3.2 | Chambre | Thermor Ovation 3 — 1 250 W | 1 | 480 € | 480 € |
| 3.3 | Cuisine | Atlantic Agilia — 1 000 W | 1 | 380 € | 380 € |
| 3.4 | SDB | Thermor Allure 3 Étroit — 750W + 1000W boost | 1 | 450 € | 450 € |
| 3.5 | Fixation | Chevilles longues SXR 10×140 + Molly SDB | 5 kits | 5 € | 25 € |
| | | **Sous-total lot 3** | | | **2 295 €** |
| | | | | | |
| | **LOT 4 — ECS : CET 150L** | | | | |
| 4.1 | CET | Atlantic Calypso 150L gainable non-connecté | 1 | 1 300 € | 1 300 € |
| 4.2 | Gaines | Kit gaines isolées Ø160 (2×4m) + raccords | 1 | Forfait | 250 € |
| 4.3 | Acc. | Groupe de sécurité NF + kit raccordement + bac | 1 | 80 € | 80 € |
| 4.4 | Acc. | Kit évacuation condensats | 1 | 12 € | 12 € |
| 4.5 | MO | Pose plombier (raccordement eau + évacuation) | 1 | Forfait | 400–600 € |
| 4.6 | MO | Pose gaines Ø160 (percement + passage combles) | 1 | Forfait | 300–500 € |
| | | **Sous-total lot 4** | | | **2 350–2 750 €** |
| | | | | | |
| | **LOT 5 — VMC HYGRO B** | | | | |
| 5.1 | VMC | Caisson Aldes EasyHome Hygro Compact Classic | 1 | 300 € | 300 € |
| 5.2 | Gaines | Gaines PVC souples isolées Ø80/125 (~8 m) | ~8 m | 12 €/m | 100 € |
| 5.3 | Bouches | Bouche hygro B cuisine + SDB | 2 | 40 € | 80 € |
| 5.4 | EA | Entrées d'air hygroréglables Aereco EHA² fenêtres | 3 | 25 € | 75 € |
| 5.5 | Sortie | Chapeau de toiture Ø125 + collerette | 1 | 50 € | 50 € |
| 5.6 | Racc. | Manchettes, colliers, silent-blocs | 1 | Forfait | 50 € |
| 5.7 | MO | Pose caisson combles + gaines + percements | 1 | Forfait | 500–800 € |
| | | **Sous-total lot 5** | | | **1 150–1 450 €** |
| | | | | | |
| | **LOT 6 — DIVERS** | | | | |
| 6.1 | EDF | Changement puissance 6→9 kVA | 1 | 45 € | 45 € |
| 6.2 | Évac. | Enlèvement anciens radiateurs | 1 | 25 € | 25 € |
| | | **Sous-total lot 6** | | | **70 €** |

### Récapitulatif

| Lot | Désignation | Montant |
|---|---|---|
| Lot 1 | Plomberie — dépose gaz + séparation | **1 075–1 225 €** |
| Lot 2 | Électricité — tableau + câblage + pose | **1 000–1 470 €** |
| Lot 3 | Chauffage — 5 radiateurs Thermor/Atlantic | **2 295 €** |
| Lot 4 | ECS — CET Calypso 150L gainable + pose | **2 350–2 750 €** |
| Lot 5 | VMC — Aldes EasyHome + gaines + pose | **1 150–1 450 €** |
| Lot 6 | Divers | **70 €** |
| **TOTAL BRUT TTC** | | **7 700–9 000 €** |
| **Aides (estimation)** | MaPrimeRénov' + CEE + TVA 10% | **−1 950 à −2 050 €** |
| **TOTAL NET ESTIMÉ** | | **5 650–7 050 €** |

### Variantes

| Variante | Diff. lot 3 | Diff. lot 4 | Total brut | Total net |
|---|---|---|---|---|
| A3 éco (Sauter) + CET Ariston | −550 € | −100 € | 7 050–8 350 € | 5 000–6 400 € |
| **A2 milieu (Thermor) + Calypso ★** | Réf. | Réf. | **7 700–9 000 €** | **5 650–7 050 €** |
| A1 premium (Noirot) + Aéromax 6 | +620 € | +200 € | 8 700–10 000 € | 6 650–8 050 € |

> **MO ≈ 40–50 % du budget total**. C'est le poste le plus variable. Demander **au minimum 3 devis** artisans RGE locaux.

---

## 7. Aides financières et fiscalité

### 7.1 Récapitulatif des aides

| Aide | Équipement | Montant estimé | Condition |
|---|---|---|---|
| **MaPrimeRénov' Décarbonation** (bailleur) | CET remplaçant chauffe-eau gaz | 400–1 200 € | Artisan **RGE**, logement > 15 ans |
| **CEE** — BAR-TH-158 | 5 radiateurs NFC | 250–750 € | Radiateurs connectés/NFC |
| **CEE** — BAR-TH-148 | CET | 80–200 € | — |
| **TVA réduite 10 %** | Matériel + pose par pro | ~500–600 € | Artisan professionnel, logement > 2 ans |
| **Total aides** | | **1 230–2 750 €** | |

> ⚠️ Les radiateurs électriques ne sont PAS éligibles à MaPrimeRénov' (pas considérés ENR). Seul le CET est éligible.

### 7.2 Procédure CEE

1. **Avant les travaux** : s'inscrire sur une plateforme CEE (PrimesEnergie, Effy, TotalEnergies) et obtenir une offre
2. **Ne pas signer de devis** avant d'avoir reçu la confirmation CEE
3. Réaliser les travaux par un artisan RGE
4. Envoyer les factures à la plateforme CEE
5. Recevoir le virement sous 4–8 semaines

### 7.3 Abonnement EDF

| | Base | HC/HP (recommandé) |
|---|---|---|
| Puissance | **9 kVA** | **9 kVA** |
| Abonnement annuel | ~193 €/an | ~207 €/an |
| Prix kWh | 0,2516 €/kWh | HC: 0,2068 €/kWh · HP: 0,2700 €/kWh |
| Intérêt | Simple | CET fonctionne la nuit en HC → −15–20 % sur l'ECS |

**Recommandation : HC/HP 9 kVA** avec contacteur jour/nuit pour le CET. Économie ~20–40 €/an sur l'ECS, contacteur amorti en 1 an.

Changement de puissance : gratuit (Linky), 24–48h, en ligne. C'est le **locataire** qui souscrit.

---

## 8. Consommation réelle vs DPE

> Le DPE 3CL utilise des hypothèses conventionnelles (Tint = 19°C, tarifs 01/2021, occupation standardisée). Les consommations et factures réelles diffèrent significativement.

### 8.1 Écarts systématiques

| Facteur | 3CL | Réel | Impact |
|---|---|---|---|
| **Tarif électricité** | 0,174 €/kWh (01/2021) | 0,2516 €/kWh (Base 2025) | **+44 %** sur la facture |
| **Consigne chauffage** | 19°C | ~20,5°C (moyenne réelle) | **+11 %** sur besoin chauffage |
| **VMC** | 0,25 W/(m³/h) forfaitaire | ~0,10 W/(m³/h) Aldes micro-watt | **−55 %** en réel |

### 8.2 Stratégie 1 (S3) — Consommation réelle estimée

| Poste | 3CL (EF) | Réel estimé (EF) |
|---|---|---|
| Chauffage (inertie COP=1) | 2 652 kWh | 2 944 kWh (+11 %) |
| ECS (CET COP=2,5) | 505 kWh | 505 kWh |
| Auxiliaires VMC | 227 kWh | ~100 kWh (−55 %) |
| Éclairage | 94 kWh | 94 kWh |
| **TOTAL EF** | **3 478 kWh** | **3 643 kWh** |

| Facture | 3CL | Réelle (Base 9 kVA) |
|---|---|---|
| Abonnement | inclus | 193 €/an |
| Consommation | — | 917 € (0,2516 × 3 643) |
| **TOTAL** | **764 €/an** | **~960–1 000 €/an** |

**La facture réelle est ~25–30 % supérieure au coût 3CL**, principalement à cause du tarif électricité (+44 %).

### 8.3 Stratégie 2 (S9 PAC) — Consommation réelle estimée

| Poste | 3CL (EF) | Réel estimé (EF) |
|---|---|---|
| Chauffage PAC (SCOP 3,0) | 932 kWh | 1 035 kWh (+11 %) |
| ECS (CET COP=2,5) | 505 kWh | 505 kWh |
| Auxiliaires VMC | 227 kWh | ~100 kWh |
| Éclairage | 94 kWh | 94 kWh |
| **TOTAL EF** | **1 758 kWh** | **1 734 kWh** |

| Facture | 3CL | Réelle (Base 9 kVA) |
|---|---|---|
| Abonnement | inclus | 193 €/an |
| Consommation | — | 436 € (0,2516 × 1 734) |
| **TOTAL** | **510 €/an** | **~665 €/an** |

> **Point clé** : en S9 (PAC), le chauffage ne coûte que ~260 €/an (39 % de la facture). L'abonnement pèse 193 € (29 %). Le gain de l'isolation supplémentaire ne serait que de ~85 €/an sur le chauffage — d'où le mauvais ROI de l'isolation quand on a déjà une PAC.

### 8.4 Comparaison des factures réelles

| Configuration | Facture 3CL | Facture réelle 2025 | Écart |
|---|---|---|---|
| **Actuel** (gaz collectif) | 1 251 €/an | ~1 500–1 700 €/an | +20–36 % |
| **S3** (inertie + CET + VMC) | 764 €/an | ~960–1 000 €/an | +26–31 % |
| **S9** (PAC + CET + VMC) | 510 €/an | ~665 €/an | +30 % |

**L'économie réelle entre l'actuel et S3** : ~550–700 €/an
**L'économie réelle entre l'actuel et S9** : ~850–1 000 €/an

---

## 9. Travaux techniques — Guide d'exécution

### 9.1 Fixation des radiateurs

Les murs extérieurs (salon, chambre, cuisine côté fenêtre) sont en **BA13 (13 mm) + laine minérale (90 mm) + brique creuse (200 mm)**. Il faut impérativement ancrer dans la brique.

| Mur | Fixation | Charge par point | Coût |
|---|---|---|---|
| **Mur extérieur** (placo+isolant+brique) | Cheville longue Fischer SXR 10×140 | 50 kg/point | 1,50–2 €/cheville |
| **Cloison intérieure** (SDB) | Cheville Molly métal M5 | 20 kg/point | 1–1,50 €/cheville |

**Points d'attention :**
- Foret SDS Ø10 × 160 mm avec butée de profondeur (130–140 mm min.)
- Détecteur multifonction (câbles, rails, tuyaux) — indispensable dans un immeuble avec ancien chauffage gaz
- Masque FFP2 pour le perçage à travers la laine minérale
- Radiateurs fluide : niveau horizontal impératif (sinon bulles d'air)
- Espacement mur-radiateur : 3–5 cm (entretoises fournies)

**Budget fixation total :** ~25–40 € (matériel) ou inclus dans la pose par l'électricien.

### 9.2 Raccordement CET

| Étape | Détail |
|---|---|
| Pose du CET | Dans la SDB ou placard, sur socle anti-vibrations |
| Gaines Ø160 | Percement plafond SDB → combles → sortie toiture ou pignon |
| Raccordement eau | Arrivée eau froide + sortie eau chaude + groupe de sécurité |
| Évacuation | Soupape vers bac de rétention ou évacuation eaux usées |
| Condensats | Tuyau souple vers siphon ou évacuation |
| Électricité | Circuit dédié 16A + contacteur jour/nuit au tableau |

### 9.3 Installation VMC

| Étape | Détail |
|---|---|
| Caisson | Posé dans les combles sur silent-blocs (absorbe vibrations) |
| Gaines extraction | Ø80 SDB + Ø125 cuisine → caisson combles |
| Bouches hygro B | Clipées au plafond SDB et cuisine |
| Sortie toiture | Chapeau Ø125 + collerette d'étanchéité |
| Entrées d'air | Fraisage dormant bois fenêtres salon (×2) + chambre (×1 min.) |
| Raccordement élec | Sur circuit existant (faible puissance ~10 W moyen) |

### 9.4 Film réfléchissant derrière les radiateurs

**Verdict : inutile pour ce logement.** Les murs extérieurs sont déjà isolés (9 cm de laine, Umur = 0,36). Le film réfléchissant n'apporte qu'un gain de 1–2 % sur un mur isolé. Ne se justifie que sur mur non isolé (pierre, béton brut).

---

## 10. Planning et chronologie

### Si Stratégie 1 (inertie électrique) — Pas d'accord copro nécessaire

| Phase | Action | Qui | Délai |
|---|---|---|---|
| **J-30** | Demander 3 devis (plombier + électricien RGE) | Propriétaire | 2–4 sem. |
| **J-15** | Inscrire les CEE sur plateforme **avant** signature devis | Propriétaire | 15 min |
| **J-10** | Commander radiateurs + CET + VMC | Propriétaire ou artisan | — |
| **J** | Dépose radiateurs gaz + séparation circuit | Plombier | 1–2 jours |
| **J+1** | Câblage électrique (tableau + circuits) | Électricien | 1 jour |
| **J+2** | Pose CET + raccordement | Plombier + Électricien | 1 jour |
| **J+2** | Pose radiateurs + raccordement | Électricien | même jour |
| **J+3** | Pose VMC (caisson combles + gaines + bouches) | Électricien/VMC-iste | 1 jour |
| **J+3** | Fraisage entrées d'air fenêtres | ½ jour (DIY ou menuisier) | ½ jour |
| **J+4** | Tests, mise en service, configuration WiFi | Électricien + Propriétaire | ½ jour |
| **J+7** | Travaux DIY étanchéité (§4.6) | Propriétaire | 1 jour |
| **J+7** | Dossier MaPrimeRénov' + envoi factures CEE | Propriétaire | 1h en ligne |
| **J+10** | Résiliation/recalcul charges gaz copro | Propriétaire | 1–2 mois |
| **J+10** | Locataire : passage 9 kVA HC/HP sur espace client EDF | Locataire | 24–48h |
| **J+30** | Nouveau DPE | Diagnostiqueur | 1h sur place |

**Durée des travaux sur site : 3–4 jours ouvrés.**
Prévoir l'absence du locataire ou intervenir en vacance locative.

### Si Stratégie 2 (PAC air/air) — Accord copro nécessaire

| Phase | Action | Délai |
|---|---|---|
| **M-3** | Vérifier règlement copropriété + préparer demande AG | 1–2 mois |
| **M-1** | Vote en AG (ou accord écrit copropriétaire du bas) | — |
| **J-30** | Devis artisans RGE (plombier + clim + électricien) | 2–4 sem. |
| **J-15** | CEE + commande PAC | — |
| **J** | Dépose gaz + câblage | 2 jours |
| **J+2** | Pose PAC (UE + 3 UI) + CET + VMC | 2–3 jours |
| **J+4** | Tests + mise en service + DPE | 1 jour |

---

## Annexe A — Tableau des 24 scénarios simulés

Tous les scénarios ont été simulés via Open3CL (`run_all_renovation_scenarios.js`).

| # | Scénario | EP/m² | Cl. | GES | Cl.GES | €/an | Δ EP | Δ €/an |
|---|---|---|---|---|---|---|---|---|
| S0 | État actuel (gaz collectif condensation) | **221** | **D** | 48 | D | 1 251 | — | — |
| S1 | VMC hygro B seule (gaz conservé) | 221 | D | 46 | D | 1 284 | 0 | +33 |
| S2 | Élec inertie + ballon élec 100L + VMC | 177 | C | 6 | B | 1 028 | −44 | −223 |
| **S3** | **Élec inertie + CET air ext + VMC ★** | **127** | **C** | **5** | **A** | **764** | **−94** | **−487** |
| S4 | Élec inertie + CET air ext (sans VMC) | 128 | C | 5 | A | 737 | −93 | −514 |
| S5 | Élec inertie + CET + VMC + fenêtres Uw=1.3 | 118 | C | 4 | A | 725 | −103 | −526 |
| S6 | Panneau rayonnant + CET + VMC | 127 | C | 5 | A | 764 | −94 | −487 |
| S7 | Convecteur NFC + CET + VMC (budget mini) | 129 | C | 5 | A | 772 | −92 | −479 |
| S8 | Plancher rayonnant élec + CET + VMC | 166 | C | 6 | B | 924 | −55 | −327 |
| **S9** | **PAC air/air multisplit + CET + VMC ★** | **64** | **A** | **2** | **A** | **510** | **−157** | **−741** |
| S10 | PAC air/air + CET + VMC + fenêtres Uw=1.3 | 61 | A | 2 | A | 483 | −160 | −768 |
| S11 | PAC air/eau + CET + VMC | 75 | B | 2 | A | 586 | −146 | −665 |
| S12 | PAC air/eau + CET + VMC + fenêtres | 71 | B | 2 | A | 565 | −150 | −686 |
| S13 | Poêle granulés FV + CET + VMC | 104 | B | 3 | A | 471 | −117 | −780 |
| S14 | Poêle granulés + CET + VMC + fenêtres | 97 | B | 3 | A | 448 | −124 | −803 |
| S15 | Élec inertie + CET air extrait + VMC | 125 | C | 5 | A | 748 | −96 | −503 |
| S16 | Élec + ballon élec (sans VMC) | 178 | C | 6 | B | 1 001 | −43 | −250 |
| S17 | S3 + isolation murs 16 cm | 117 | C | 4 | A | 723 | −104 | −528 |
| S18 | S3 + isolation toiture 30 cm | 122 | C | 4 | A | 742 | −99 | −509 |
| S19 | S3 + fenêtres + murs 16 cm + toiture 30 cm | 102 | B | 4 | A | 665 | −119 | −586 |
| S20 | Réno TOTALE (triple + iso max, élec) | 98 | B | 3 | A | 648 | −123 | −603 |
| S21 | PAC air/air + CET + réno enveloppe complète | 55 | A | 2 | A | 440 | −166 | −811 |
| S22 | PAC air/eau + CET + réno enveloppe complète | 65 | A | 2 | A | 516 | −156 | −735 |
| S23 | PAC air/air + CET + réno MAX (triple + iso max) | 54 | A | 2 | A | 427 | −167 | −824 |

### Classement par DPE

| Rang | Scénario | EP/m² | Classe |
|---|---|---|---|
| 1 | S23 — PAC air/air + réno MAX | 54 | A |
| 2 | S21 — PAC air/air + enveloppe | 55 | A |
| 3 | S10 — PAC air/air + fenêtres | 61 | A |
| 4 | **S9 — PAC air/air seule** | **64** | **A** |
| 5 | S22 — PAC air/eau + enveloppe | 65 | A |
| 6 | S12 — PAC air/eau + fenêtres | 71 | B |
| 7 | S11 — PAC air/eau seule | 75 | B |
| 8 | S14 — Poêle granulés + fenêtres | 97 | B |
| 9 | S20 — Réno totale (élec inertie) | 98 | B |
| 10 | S19 — Enveloppe complète | 102 | B |

### Classement par coût annuel

| Rang | Scénario | €/an |
|---|---|---|
| 1 | S23 | 427 |
| 2 | S21 | 440 |
| 3 | S14 — Poêle granulés + fenêtres | 448 |
| 4 | S13 — Poêle granulés | 471 |
| 5 | S10 | 483 |
| 6 | **S9 — PAC air/air** | **510** |
| 7 | S22 | 516 |
| 8 | S12 | 565 |
| 9 | S11 | 586 |
| 10 | S20 | 648 |

---

## Annexe B — Scénarios hybrides PAC + inertie

Si la PAC n'est installée que dans certaines pièces (stratégie 2 étapes ou contraintes de pose), voici les résultats Open3CL (`test_hybrid_pac_inertie.js`) :

| Scénario | Configuration | Surf. PAC | Surf. Inertie | EP/m² | Cl. | €/an |
|---|---|---|---|---|---|---|
| **S3** | Tout inertie | 0 m² | 51,7 m² | **127** | **C** | 764 |
| **H5** | PAC salon seul + inertie reste | 15 m² | 37 m² | **109** | **B** | 732 |
| **H4** | PAC 2 chambres + inertie salon/SDB/cui | 20 m² | 32 m² | **103** | **B** | 722 |
| **H1** | PAC salon+chambres + inertie SDB+cui | 35 m² | 17 m² | **85** | **B** | 671 |
| **H3** | PAC salon+ch+cuisine + inertie SDB | 42 m² | 10 m² | **76** | **B** | 604 |
| **S9** | Tout PAC | 51,7 m² | 0 m² | **64** | **A** | 510 |

> **Règle empirique** : chaque m² transféré de l'inertie (COP=1) vers la PAC (SCOP=3) fait gagner ~1 EP/m². Les 16,7 m² en inertie dans H1 (32 % de la surface) consomment 58 % de l'énergie de chauffage.

### Analyse financière de la stratégie 2 étapes

| | Étape 1 seule (S3) | 2 étapes (H1) | Direct (S9) |
|---|---|---|---|
| Investissement | 4 600–8 000 € | 9 600–16 000 € | 8 500–13 500 € |
| DPE | 127 — C | 85 — B | 64 — A |
| Facture 3CL | 764 €/an | 671 €/an | 510 €/an |
| ROI global | 9–16 ans | 20–33 ans | 12–20 ans |
| Gaspillage (rads remplacés) | 0 € | 600–1 200 € | 0 € |

**Verdict** : la stratégie 2 étapes a du sens **uniquement si le budget initial est < 8 000 €**. Si > 8 500 € disponibles, aller directement en S9 (A) coûte moins cher au total et donne un meilleur DPE. L'étape 2 seule (ajout PAC) a un ROI de 54–86 ans — elle ne se justifie que pour le confort (clim été) ou la plus-value revente.

---

## Annexe C — Solutions écartées et pièges à éviter

### Pièges DPE

| Solution | EP/m² | Pourquoi c'est un piège |
|---|---|---|
| **Plancher rayonnant** (S8) | 166 | +39 EP/m² vs inertie ! La 3CL pénalise l'inertie lourde (temps de réponse → forte pénalité intermittence) |
| **Ballon élec classique** au lieu du CET (S2) | 177 | +50 EP/m² vs CET (pas de COP > 1). Le CET est l'investissement au meilleur ROI |
| **VMC seule** (S1) | 221 | 0 EP/m² gagné ! La VMC gagne en chauffage mais perd en auxiliaires. Strictement neutre en 3CL |
| **Triple vitrage** (S20 vs S19) | −5 | Gain marginal pour +1 500–3 000 € et réduction des apports solaires |

### Travaux à ROI prohibitif (> 60 ans)

| Travail | Gain | Coût | ROI |
|---|---|---|---|
| Remplacement fenêtres (seul) | −9 EP/m², −40 €/an | 3 000–5 000 € | 75–125 ans |
| Surisolation murs 9→16 cm (seule) | −10 EP/m², −42 €/an | 2 500–5 000 € | 60–120 ans |
| Surisolation toiture 20→30 cm (seule) | −5 EP/m², −22 €/an | 1 500–3 000 € | 68–136 ans |
| Enveloppe complète (fen+murs+toit) | −25 EP/m², −100 €/an | 7 000–13 000 € | 70–130 ans |

> L'isolation ne se justifie PAS par l'économie d'énergie seule. Elle se justifie par le confort (parois froides, courants d'air) ou si les éléments sont en fin de vie.

### Ce qu'il NE FAUT PAS faire

| Erreur | Risque |
|---|---|
| Brancher radiateurs sur prises existantes | Non conforme NF C 15-100, surcharge, incendie |
| Un seul disjoncteur pour tout le chauffage | Non conforme (max 4 500 W/circuit) |
| Pas de terre | Danger de mort |
| Radiateurs sans thermostat | Non conforme décret décence (location) |
| Fixer dans le placo seul (sans ancrage brique) | Radiateur de 17 kg qui tombe |
| Installer VMC sans entrées d'air | VMC non comptée dans le DPE |
| CET sur air ambiant dans la SDB | Refroidit la pièce, perte de confort |
| Connecter VMC au CET (air extrait) pour un T3 | +800–2 000 € pour −2 EP/m², problème de débit nuit |

### PAC air/air vs PAC air/eau — Pourquoi l'air/air gagne

| Critère | PAC air/air (S9) | PAC air/eau (S11) |
|---|---|---|
| DPE | **64 EP/m² — A** | 75 EP/m² — B |
| SCOP 3CL | 3,0 | 2,8 |
| Distribution | rd = 1,00 (pas de réseau) | rd = 0,95 (hydraulique) |
| Auxiliaires | 227 kWh (VMC seule) | 391 kWh (VMC + circulateurs) |
| Facture réelle | ~665 €/an | ~745 €/an |
| Coût travaux | 8 500–13 500 € | 12 000–20 000 € |
| Clim été | ✅ Intégrée | ❌ Non (ventilo-convecteurs coûteux) |

La PAC air/eau est pénalisée en 3CL par trois facteurs cumulatifs : SCOP inférieur, pertes de distribution hydraulique, et circulateurs. Elle consomme **17 % de plus** en énergie primaire.

### Impact changement climatique — Pourquoi la clim n'est plus un luxe

| Facteur | Aujourd'hui | 2050 (Alsace, RCP 4.5/8.5) |
|---|---|---|
| Jours > 30°C | 10–15/an | **25–40/an** |
| Température estivale | — | **+2 à 4°C** |
| Température intérieure combles sans clim | 32–38°C en canicule | Pire encore |
| DJU chauffage | ~2 600 | ~2 000–2 200 (−15–25 %) |

**L'appartement sous combles sera inhabitable en canicule sans climatisation dans 10–15 ans.** La PAC air/air réversible est le seul système qui couvre chauffage + rafraîchissement.

### Impact revente — Chiffres clés

| Passage DPE | Plus-value brute estimée (51,7 m², Strasbourg) | Coût travaux | Plus-value nette |
|---|---|---|---|
| D → C (S3) | +15 000 à +30 000 € | 5 650–7 050 € (net) | **+8 000 à +25 000 €** |
| D → A (S9) | +33 000 à +60 000 € | 6 500–11 500 € (net) | **+20 000 à +50 000 €** |

---

## Résumé des actions à lancer

### Immédiatement

- [ ] Vérifier le règlement de copropriété (unité extérieure PAC autorisée ?)
- [ ] Si copro favorable : demander 3 devis PAC air/air multisplit 5 kW
- [ ] Si copro défavorable : demander 3 devis radiateurs inertie + CET + VMC
- [ ] S'inscrire sur une plateforme CEE **avant** de signer un devis

### Avant les travaux

- [ ] Commander les CEE + attendre la confirmation
- [ ] Signer les devis avec artisans **RGE**
- [ ] Commander le matériel (ou laisser l'artisan commander)
- [ ] Prévenir le locataire (ou prévoir vacance locative de 1 semaine)
- [ ] Prévenir le copropriétaire du bas (coupure circuit gaz temporaire)

### Pendant les travaux (3–4 jours)

- [ ] J : Dépose gaz + plomberie
- [ ] J+1 : Câblage électrique
- [ ] J+2 : Pose CET + radiateurs (ou PAC)
- [ ] J+3 : Pose VMC + entrées d'air + tests

### Après les travaux

- [ ] Travaux DIY étanchéité (joints fenêtres, mousse, membranes) — 130–170 €, 1 jour
- [ ] Dossier MaPrimeRénov' en ligne (CET uniquement)
- [ ] Envoi factures à la plateforme CEE
- [ ] Locataire : changement 9 kVA HC/HP sur espace client EDF
- [ ] Résiliation/recalcul charges gaz copropriété
- [ ] **Nouveau DPE** pour officialiser la nouvelle classe

---

*Document généré à partir de 24 simulations Open3CL + 7 scénarios hybrides, données DPE réelles extraites du XML 2567E2792599K, tarifs 2025, prix marché Strasbourg.*

---

## Annexe D — PAC eau/eau géothermique — Simulation pour la propriété complète (4 logements, 292 m²)

> **Contexte** : cette annexe simule l'installation d'une PAC eau/eau géothermique comme système de chauffage collectif pour les 4 logements de la propriété. Deux variantes sont comparées : **G1** (réutilisation du réseau bitube et des radiateurs existants) et **G2** (installation complète avec canalisations pré-isolées et radiateurs basse température neufs). Les calculs reprennent la méthode 3CL-DPE 2021 appliquée à la propriété étendue.

---

### D.1 Description de la propriété et configuration des bâtiments

| | Bâtiment A (petit) | Bâtiment B (grand) |
|---|---|---|
| **Logements** | T3 — 51 m² (étudié) + T3 — 66 m² | T4 — 87 m² + T4 — 88 m² |
| **Surface totale** | **117 m²** | **175 m²** |
| **Étages** | 2 niveaux (1 logement/étage) | 2 niveaux (1 logement/étage) |
| **Particularités** | Jardin accessible attenant | Cave (local technique) au sous-sol |
| **Distance entre bâtiments** | **8 m** (tranchée inter-bâtiments nécessaire) | — |
| **Distance cave → jardin** | — | **~20 m** (mesurée depuis la cave) |
| **Surface totale chauffée** | **292 m²** | |

**Logique de l'installation :**

```
[JARDIN]──sondes géo (5 × 120 m)
    │
    └─[Bât. A — petit]─────8 m────[Bât. B — grand]
       T3 51 m² (R+1)              T4 88 m² (RDC)
       T3 66 m² (RDC)              T4 87 m² (R+1)
                                   [CAVE — PAC 25 kW + ballon tampon]
```

La PAC est installée dans la **cave du bâtiment B** (local technique sec et protégé, idéal). Les sondes géothermiques sont forées dans le **jardin attenant au bâtiment A**. Un réseau de canalisations relie les deux bâtiments en souterrain sur 8 m.

---

### D.2 Calcul DPE 3CL — Méthode et hypothèses

#### Données thermiques de référence (T3, 51,7 m²)

Le DPE réel de l'appartement T3 donne les paramètres suivants (calculés par Open3CL) :

| Paramètre | Valeur | Source |
|---|---|---|
| GV (avec VMC hygro B) | **143 W/K** | Open3CL, section 2.1 |
| Besoin thermique de chauffage (Bch) | **≈ 2 010 kWh_th/an** | Déduit de S9 (PAC air/air, SCOP=3,0) |
| DJU zone H1b (Strasbourg) | **2 600 °C·j** | Méthode 3CL |
| Puissance de pointe à −15 °C | **≈ 4 900 W** | GV × (19 − (−15)) = 143 × 34 |

#### Extrapolation aux 4 logements

Les 4 logements sont supposés de construction similaire (même époque, même zone climatique H1b). Le besoin par m² est déduit du T3, les murs mitoyens entre logements ayant déjà un coefficient de réduction b = 0 dans le calcul 3CL de référence.

| Logement | Surface | Bch estimé | Puissance pointe |
|---|---|---|---|
| T3 — 51 m² (référence) | 51,7 m² | 2 010 kWh_th | 4 900 W |
| T3 — 66 m² | 66,0 m² | 2 566 kWh_th | 6 260 W |
| T4 — 87 m² | 87,0 m² | 3 381 kWh_th | 8 250 W |
| T4 — 88 m² | 88,0 m² | 3 420 kWh_th | 8 350 W |
| **TOTAL** | **292,7 m²** | **11 377 kWh_th/an** | **≈ 27 760 W** |

> **Dimensionnement PAC** : puissance nominale requise **25–28 kW**. Avec une PAC de 25 kW, le backup résistif n'intervient que pour les températures < −12 °C (représentant < 3 % du temps de chauffe annuel à Strasbourg).

#### Paramètres 3CL pour la PAC géothermique eau/eau

| Paramètre | G1 (réseau existant) | G2 (installation neuve) |
|---|---|---|
| **SCOP forfaitaire 3CL** | **3,5** | **3,5** |
| **Température départ réseau** | 55–60 °C (contrainte radiateurs existants) | 40–45 °C (radiateurs BT neufs) |
| **SCOP réel estimé** | 2,8–3,2 (pénalité haute temp.) | 4,0–4,5 (basse temp. optimale) |
| **rd — rendement distribution** | 0,90 (réseau existant, non-isolé, long) | 0,95 (canalisations pré-isolées neuves) |
| **re — rendement émission** | 0,97 (radiateurs eau existants) | 0,98 (radiateurs panel BT neufs, surdimensionnés) |
| **Auxiliaires (circulateurs)** | +230 kWh EP/an par logement (réseau long, pompes actuelles) | +60 kWh EP/an par logement (pompes ECM modernes) |

> **Note 3CL** : la méthode 3CL applique un SCOP forfaitaire de **3,5** pour une PAC géothermique eau/eau en zone H1, indépendamment de la température de départ. L'avantage réel de G2 (basse température) apparaît donc davantage sur la **facture réelle** et la **durée de vie** de l'équipement que sur l'étiquette DPE.

---

### D.3 Scénario G1 — PAC géothermique + réutilisation du réseau et des radiateurs existants

**Principe** : la PAC remplace la chaudière gaz collective. Le réseau bitube existant et les radiateurs eau chaude de chaque appartement sont conservés. La PAC fonctionne à 55–60 °C pour maintenir une puissance suffisante aux radiateurs existants.

#### Compatibilité radiateurs existants à température réduite

Les radiateurs dimensionnés pour 70/55 °C (système gaz) délivrent à 55/45 °C (PAC) :

| Température départ/retour | Puissance relative | Commentaire |
|---|---|---|
| 70 °C / 55 °C (nominal gaz) | 100 % | Référence |
| 60 °C / 45 °C | ~74 % | PAC haute temp. — borderline |
| 55 °C / 40 °C | ~63 % | Nécessite radiateurs surdimensionnés |
| 45 °C / 35 °C (optimal géo) | ~41 % | **Incompatible** sans remplacement |

> ⚠️ **Condition impérative pour G1** : les radiateurs existants doivent être surdimensionnés d'au moins **1,6×** les besoins réels pour fonctionner à 55 °C. C'est fréquent dans les immeubles 1990–2000 où les installateurs prévoyaient une marge de sécurité, mais doit être vérifié pièce par pièce avec un bilan thermique.

#### Calcul DPE 3CL — Scénario G1 (par logement de 51,7 m²)

| Poste | kWh EF/an | kWh EP/an | Détail |
|---|---|---|---|
| **Chauffage (PAC géo)** | **644** | **1 481** | Bch=2 010 / (SCOP 3,5 × rd 0,90 × re 0,97) |
| **Auxiliaires** (circ. + VMC) | **187** | **430** | Circulateur collectif share + VMC hygro B |
| **ECS** (CET individuel 150L) | **505** | **1 162** | COP CET = 2,5 (inchangé) |
| **Éclairage** | **164** | **378** | Conventionnel 3CL |
| **Total** | **1 500** | **3 451** | |
| **EP/m²** | | **≈ 67 EP/m²** | **→ Classe A** |
| **EP/m² (coeff. 2026 × 1,9)** | | **≈ 55 EP/m²** | **→ Classe A** |

**Facture annuelle estimée (51,7 m²) :**

| Tarif | Coût/an | Économie vs état actuel |
|---|---|---|
| 3CL (0,22 €/kWh) | **~330 €/an** | −921 €/an (−74 %) |
| Réel 2025 (0,25 €/kWh) | **~375 €/an** | ~−925 €/an |

**Facture totale propriété (4 logements, ~292 m²) :**
- ~330 × (292/51,7) ≈ **1 865 €/an** (3CL)
- ~375 × (292/51,7) ≈ **2 120 €/an** (réel 2025)

#### Chiffrage G1

| Poste | Coût TTC estimé |
|---|---|
| PAC eau/eau géothermique 25 kW (ex : Viessmann Vitocal 200-G, Stiebel WPF 25) | 10 000 – 15 000 € |
| Sondes géothermiques verticales : 5 sondes × 120 m × 40 €/m (forage + sonde + coulis) | 24 000 – 30 000 € |
| Tranchée horizontale de liaison jardin → cave (8 m inter-bâtiments + 10 m internes) | 2 000 – 4 000 € |
| Ballon tampon 300 L + vase d'expansion + soupapes | 1 500 – 2 500 € |
| Module hydraulique central (séparateur, manifold, by-pass) | 2 000 – 4 000 € |
| Adaptation réseau bitube existant (nettoyage, désembouage, robinets thermostatiques) | 2 000 – 5 000 € |
| Remplacement circulateur collectif (pompe ECM) | 500 – 1 000 € |
| Compteurs d'énergie thermique (calorimètres) × 4 logements | 1 200 – 2 400 € |
| CET individuels 150 L × 4 (si non existants) | 3 000 – 5 200 € |
| VMC hygro B × 4 logements (si non existantes) | 4 000 – 8 000 € |
| Tableau électrique PAC + câblage (triphasé 400V recommandé) | 2 000 – 4 000 € |
| Dépose chaudière gaz + raccordements + résiliation réseau | 2 000 – 4 000 € |
| Étude géothermique préalable + permis + géologue | 2 000 – 4 000 € |
| **Total brut G1** | **56 200 – 89 100 €** |
| Aides financières (voir D.8) | −18 000 à −30 000 € |
| **Total net G1 estimé** | **≈ 38 000 – 59 000 €** |

---

### D.4 Scénario G2 — PAC géothermique + installation complète neuve

**Principe** : remplacement intégral du système de chauffage. Canalisations pré-isolées neuves dimensionnées pour basse température (40–45 °C), nouveaux radiateurs eau de grande surface (panneaux acier ou fonte), pompes ECM à vitesse variable. Ce scénario maximise le SCOP réel et la durée de vie du système.

#### Avantage basse température pour le SCOP réel

| Température départ | COP réel (sol à 10 °C) | SCOP annuel estimé | Surcoût vs G1 |
|---|---|---|---|
| 55 °C (G1 — existant) | 2,8 – 3,2 | ~3,1 | Référence |
| 45 °C (G2 — optimisé) | 3,5 – 4,0 | ~3,8 | — |
| 35 °C (plancher chauffant) | 4,2 – 5,0 | ~4,5 | +15 000 à +35 000 € (travaux PCH) |

> **Géocooling passif (bonus G2)** : en été, la PAC peut inverser le cycle sans compresseur — elle fait circuler l'eau des sondes (10–12 °C) dans les canalisations et rafraîchit passivement les logements via les radiateurs (ventilo-convecteurs) ou le plancher. Consommation électrique : **< 200 W** (pompe seule). Ce rafraîchissement est gratuit et silencieux, idéal pour les combles du T3.

#### Dimensionnement radiateurs BT (G2)

Pour fonctionner à 45/35 °C, les radiateurs doivent être **2,4× plus puissants** qu'à 70/55 °C pour le même apport thermique :

| Pièce (T3, 51 m²) | Besoin réel | Radiateur 70/55 °C (existant) | Radiateur BT 45/35 °C (G2) |
|---|---|---|---|
| Salon (×2) | 2 × 620 W | 2 × 1 000 W | 2 × 2 400 W (panneau acier double) |
| Chambre | 490 W | 800 W | 1 200 W |
| Cuisine | 300 W | 500 W | 720 W |
| SDB | 280 W | 400 W | 700 W |
| **Total** | **2 310 W** | **3 500 W** | **7 720 W** |

#### Calcul DPE 3CL — Scénario G2 (par logement de 51,7 m²)

| Poste | kWh EF/an | kWh EP/an | Détail |
|---|---|---|---|
| **Chauffage (PAC géo)** | **602** | **1 385** | Bch=2 010 / (SCOP 3,5 × rd 0,95 × re 0,98) |
| **Auxiliaires** (circ. ECM + VMC) | **143** | **329** | Pompes ECM 20 W × 8 760 h (share) + VMC |
| **ECS** (CET individuel 150 L) | **505** | **1 162** | Inchangé |
| **Éclairage** | **164** | **378** | Inchangé |
| **Total** | **1 414** | **3 254** | |
| **EP/m²** | | **≈ 63 EP/m²** | **→ Classe A** |
| **EP/m² (coeff. 2026 × 1,9)** | | **≈ 52 EP/m²** | **→ Classe A solide** |

**Facture annuelle estimée (51,7 m²) :**

| Tarif | Coût/an | Économie vs état actuel |
|---|---|---|
| 3CL (0,22 €/kWh) | **~311 €/an** | −940 €/an (−75 %) |
| Réel 2025 (0,25 €/kWh) | **~354 €/an** | ~−950 €/an |

**Facture totale propriété (4 logements) :**
- ~311 × (292/51,7) ≈ **1 756 €/an** (3CL)
- ~354 × (292/51,7) ≈ **1 997 €/an** (réel 2025)

#### Chiffrage G2 (surcoût par rapport à G1)

| Poste | Coût TTC estimé | Δ vs G1 |
|---|---|---|
| PAC eau/eau géothermique 25 kW | 10 000 – 15 000 € | = |
| Sondes géothermiques verticales (identiques) | 24 000 – 30 000 € | = |
| Tranchée inter-bâtiments | 2 000 – 4 000 € | = |
| Ballon tampon 300 L + hydraulique | 1 500 – 2 500 € | = |
| **Canalisations pré-isolées twin-pipe** (≈ 150 m réseau total) | **6 000 – 12 000 €** | **+4 000 – 8 000 €** |
| **Radiateurs eau BT panel acier** (~20 unités, 292 m²) | **8 000 – 15 000 €** | **+6 000 – 10 000 €** |
| Robinets thermostatiques électroniques × 20 | 1 500 – 3 000 € | +500 € |
| Compteurs d'énergie thermique × 4 | 1 200 – 2 400 € | = |
| CET individuels × 4 | 3 000 – 5 200 € | = |
| VMC × 4 | 4 000 – 8 000 € | = |
| Électricité + tableau PAC | 2 000 – 4 000 € | = |
| Dépose ancien système (étendu : tous les radiateurs et tuyauteries) | 4 000 – 8 000 € | +2 000 – 4 000 € |
| Études + permis | 2 000 – 4 000 € | = |
| **Total brut G2** | **69 200 – 113 100 €** | **+13 000 – 24 000 € vs G1** |
| Aides financières | −18 000 à −30 000 € | = |
| **Total net G2 estimé** | **≈ 51 000 – 83 000 €** | |

---

### D.5 Individualisation des consommations et de la commande par logement

Un système de chauffage collectif doit impérativement permettre à chaque logement de **contrôler sa propre température** et d'être **facturé individuellement**. Voici les solutions disponibles.

#### Régulation individuelle par logement

| Solution | Principe | Coût par logement | Compatible G1/G2 |
|---|---|---|---|
| **Robinets thermostatiques** (RTV) sur chaque radiateur | Régulation mécanique, chaque pièce ajuste son radiateur | 20 – 50 € par radiateur | ✅ G1 et G2 |
| **Robinets thermostatiques électroniques** (têtes programmables) | Programmation horaire + détection fenêtre ouverte, WiFi | 40 – 100 € par radiateur | ✅ G1 et G2 (recommandé G2) |
| **Vanne motorisée d'appartement** | Coupe complètement le circuit de l'appartement si absence | 150 – 300 € par appart. | ✅ G1 et G2 |
| **Thermostat central d'appartement** + vanne 3 voies | Régulation par pièce pilote avec circuit secondaire dédié | 200 – 500 € par appart. | ✅ G2 recommandé |

> **Recommandation** : G1 → robinets thermostatiques classiques sur chaque radiateur (solution minimale, 400–600 € par appartement en matériel). G2 → têtes thermostatiques programmables WiFi (Danfoss Eco, Tado, Netatmo) + vanne motorisée d'arrêt, pour un pilotage précis par pièce.

#### Comptage individuel des consommations

**Option 1 — Répartiteurs de chaleur (allocateurs)** *(G1 recommandé)*

Petits capteurs électroniques fixés sur la tête de chaque radiateur. Ils mesurent l'écart de température entre la surface du radiateur et l'air ambiant, enregistrant une valeur proportionnelle à la chaleur émise. En fin d'année, un relevé permet de ventiler la facture collective entre logements.

| Caractéristique | Valeur |
|---|---|
| Coût par radiateur | 30 – 80 € |
| Coût total (≈ 20 radiateurs) | **600 – 1 600 €** |
| Précision | Relative (±15 %) — suffisante pour la répartition |
| Obligation légale | Relevé annuel obligatoire si bâtiment > 10 kW |
| Relevé | Télérelevé radio ou visite annuelle |

**Option 2 — Calorimètres d'appartement (compteurs d'énergie thermique)** *(G2 recommandé)*

Un calorimètre (compteur Wh thermique) est installé sur l'arrivée de chaque appartement. Il mesure le débit + la différence de température entrée/sortie → kWh consommés avec précision.

| Caractéristique | Valeur |
|---|---|
| Coût par appartement | 250 – 600 € (fourniture + pose) |
| Coût total (4 appartements) | **1 000 – 2 400 € |
| Précision | Haute (±2 %) — utilisable pour facturation directe |
| Norme | EN 1434, Directive MID |
| Relevé | Télérelevé M-Bus ou Wired-M-Bus |

> **Comparaison** : le calorimètre est plus précis et juridiquement robuste (facturation directe kWh). Le répartiteur est moins cher mais ne mesure qu'une valeur relative (la facture est toujours répartie proportionnellement sur le total collectif).

#### Répartition fixe/variable des charges collectives

Quelle que soit l'option de comptage, la facture globale se décompose :

| Type de charge | Part fixe (abonnement + entretien PAC) | Part variable (énergie consommée) |
|---|---|---|
| Méthode légale (décret 2012) | **30 %** de la facture totale répartis au prorata des m² | **70 %** répartis au prorata des relevés individuels |
| Exemple pour 51 m² (292 m² total) | 51/292 × 30 % = 5,2 % de la facture totale (fixe) | 70 % × part individuelle mesurée |

---

### D.6 Eau chaude sanitaire (ECS) — Options collectives vs individuelles

#### Option A — CET individuels par logement *(Recommandée — déjà simulée en S3/S9)*

Chaque appartement conserve ou installe son propre chauffe-eau thermodynamique (CET) de 150 L. L'ECS est totalement indépendante du système de chauffage collectif.

| Avantage | Inconvénient |
|---|---|
| ✅ Facturation individuelle automatique (compteur élec. locataire) | ❌ Encombrement (1 ballon 150 L par logement) |
| ✅ Panne indépendante (un CET en panne n'affecte pas les voisins) | ❌ Investissement initial ×4 |
| ✅ Régime locatif simplifié (le locataire paie son propre CET) | ❌ 4 unités à entretenir |
| ✅ Déjà modélisé en 3CL (COP = 2,5 forfaitaire) | — |
| **Impact DPE** : −1 162 kWh EP par logement (intégré dans G1/G2 ci-dessus) | |

#### Option B — ECS collective via PAC géothermique + HIU par logement

Le système de géothermie produit aussi l'eau chaude sanitaire. Chaque appartement reçoit un **module interface hydraulique (HIU — Heat Interface Unit)** : un petit échangeur à plaques qui produit l'ECS à la demande à partir du circuit collectif, sans stockage individuel (ou avec un micro-ballon de 15–30 L).

```
[PAC géo 25 kW]
   │
   ├─ [Circuit chauffage] → radiateurs
   │
   └─ [Circuit ECS 55–60 °C] ──┬── [HIU T3 51 m²]  → robinets eau chaude
                                ├── [HIU T3 66 m²]
                                ├── [HIU T4 87 m²]
                                └── [HIU T4 88 m²]
```

| Paramètre | Valeur |
|---|---|
| Coût HIU par logement (échangeur + pompe + vanne + compteur ECS) | 1 500 – 3 000 € |
| Coût total 4 HIU | **6 000 – 12 000 €** |
| Comptage ECS | Volume d'eau chaude mesuré par compteur d'eau froide d'appoint |
| COP ECS via PAC à 55 °C | ~2,0 – 2,5 (moins bon qu'un CET air ext. isolé) |
| Gain espace logement | ✅ Pas de ballon 150 L |
| Impact DPE ECS via PAC | ≈ −15 à −25 EP/m² vs CET individuel (COP inférieur) |

> ⚠️ **Attention DPE** : produire l'ECS via la PAC géothermique à 55–60 °C dégrade le COP (2,0–2,5) par rapport à un CET sur air extérieur (COP 2,5 forfaitaire 3CL + gain géothermique). Dans le bilan 3CL, les CET individuels restent donc **légèrement meilleurs pour le DPE** que l'ECS collective par géothermie, sauf si la PAC est spécialement optimisée pour la production ECS.

#### Option C — Ballon collectif avec boucle de distribution et compteurs d'eau chaude

Un grand ballon collectif (500 L) est installé dans la cave. L'eau chaude est distribuée en boucle isolée vers chaque appartement. Un compteur d'eau chaude à l'entrée de chaque appartement mesure la consommation.

| Paramètre | Valeur |
|---|---|
| Ballon collectif 500 L | 2 000 – 4 000 € |
| Réseau boucle ECS pré-isolé | 3 000 – 6 000 € |
| Compteurs eau chaude × 4 | 400 – 800 € |
| Pertes boucle (sans bon calorifugeage) | 15 – 30 % de l'énergie ECS |
| Impact DPE | Pertes de distribution pénalisent le bilan (rd_ECS ≈ 0,85) |

> **Verdict ECS** : pour une propriété en location, **l'Option A (CET individuels)** est la plus simple et la plus favorable au DPE. Elle permet à chaque locataire de gérer et payer son propre chauffe-eau. L'Option B (HIU) se justifie si l'espace manque dans chaque appartement ou en copropriété avec un seul propriétaire voulant une gestion centralisée.

---

### D.7 Comparatif des scénarios — Propriété complète (292 m²)

#### Par logement de référence (T3, 51,7 m²) — Coefficient 3CL 2021

| Scénario | Système | EP/m² | Classe | Facture 3CL | Facture réelle 2025 |
|---|---|---|---|---|---|
| **S0** | État actuel (gaz collectif) | **221** | **D** | 1 251 €/an | ~1 500 €/an |
| **S3** | Inertie élec. + CET + VMC | **127** | **C** | 764 €/an | ~975 €/an |
| **S9** | PAC air/air + CET + VMC | **64** | **A** | 510 €/an | ~665 €/an |
| **S11** | PAC air/eau + CET + VMC | **75** | **B** | 586 €/an | ~745 €/an |
| **G1** | PAC géo + réseau existant + CET | **~67** | **A** | ~330 €/an | ~375 €/an |
| **G2** | PAC géo + installation neuve + CET | **~63** | **A** | ~311 €/an | ~354 €/an |

#### Propriété complète (4 logements, ~292 m²)

| Scénario | EP/m² | Facture totale 3CL | Facture totale réelle | Invest. net (après aides) | ROI |
|---|---|---|---|---|---|
| État actuel | 221 | ~7 070 €/an | ~8 500 €/an | — | — |
| G1 — géo réseau existant | ~67 | ~1 865 €/an | ~2 120 €/an | 38 000 – 59 000 € | **8 – 14 ans** |
| G2 — géo installation neuve | ~63 | ~1 756 €/an | ~1 997 €/an | 51 000 – 83 000 € | **12 – 19 ans** |

> **Économie annuelle** : G1 permet d'économiser **~5 200 – 6 380 €/an** vs l'état actuel pour toute la propriété. G2 offre ~120 €/an supplémentaire vs G1 pour 13 000 – 24 000 € d'investissement en plus → le **G1 est généralement plus rentable à court/moyen terme**.

---

### D.8 Aides financières spécifiques géothermie (2025)

| Aide | Dispositif | Montant estimé | Conditions |
|---|---|---|---|
| **MaPrimeRénov' Chauffage** | PAC géothermique (R-1) | **2 000 – 4 000 € par logement** (selon revenus) = 8 000 – 16 000 € total | Artisan RGE, résidence principale (si propriétaire occupant) ou bailleur sous conditions |
| **CEE** — BAR-TH-141 | PAC géothermique collective | **3 000 – 7 000 €** (forfait par puissance installée) | Bâtiment résidentiel > 15 ans |
| **CEE** — BAR-TH-148 | CET × 4 | **320 – 800 €** (80–200 € × 4 appareils) | — |
| **Éco-PTZ** | Prêt taux zéro rénovation | Jusqu'à **50 000 €** | Travaux groupés, banque partenaire |
| **TVA 5,5 %** | Sur fourniture + pose | Économie ~12–15 % du HT | Logement > 2 ans, artisan professionnel |
| **Aides locales** | Région Grand Est + ADEME + Eurométropole | 1 000 – 3 000 € | Variable selon programme en cours |
| **Total aides estimées** | | **18 000 – 30 000 €** | |

> **Strasbourg — avantage nappe phréatique** : si l'étude géologique confirme l'accès à la nappe alluviale du Rhin (fréquent en Alsace à 10–20 m de profondeur, T° constante 12–14 °C), le forage coûte **3 fois moins cher** que les sondes profondes (~8 000–15 000 € pour 2 puits de pompage/rejet vs 24 000–30 000 € pour sondes verticales). Le COP monte alors à **4,5–5,0**, le SCOP annuel à **4,0–4,5**. Une **déclaration en Préfecture du Bas-Rhin** est requise (délai ~3 mois, pas de refus systématique en zone non protégée).

---

### D.9 Avantages et inconvénients

#### ✅ Avantages

| Avantage | G1 | G2 |
|---|---|---|
| **DPE Classe A** garanti pour les 4 logements | ✅ | ✅ |
| **SCOP stable** quelle que soit la température extérieure (vs PAC air/air pénalisée < −7 °C) | ✅ | ✅ |
| **Pas d'unité extérieure** visible — pas de nuisances sonores — pas de travaux en copropriété | ✅ | ✅ |
| **Géocooling passif** en été (rafraîchissement gratuit < 200 W électrique) | ⚠️ Partiel (radiateurs peu adaptés) | ✅ Plein (ventilo-convecteurs ou plancher) |
| **Durée de vie 20–25 ans** (vs 15 ans pour PAC air/air) | ✅ | ✅ |
| **Solution centralisée** : 1 seul équipement à entretenir pour 4 logements | ✅ | ✅ |
| **Économies d'échelle** : coût de maintenance mutualisé | ✅ | ✅ |
| **SCOP réel optimisé** (basse température) | ❌ 2,8–3,2 (haute temp. contrainte) | ✅ 4,0–4,5 (basse temp.) |
| **Compatibilité plancher chauffant** futur | ❌ | ✅ |
| **Investissement plus bas** | ✅ | ❌ |

#### ❌ Inconvénients

| Inconvénient | G1 | G2 |
|---|---|---|
| **Investissement initial élevé** | 38 000–59 000 € net | 51 000–83 000 € net |
| **Étude géothermique préalable obligatoire** (3–6 mois, 2 000–4 000 €) | ✅ obligatoire | ✅ obligatoire |
| **Autorisation préfectorale** (nappe phréatique) ou permis forage (sondes) | ✅ | ✅ |
| **Tranchée inter-bâtiments** : travaux de génie civil entre les deux bâtiments | ✅ | ✅ |
| **Réseau long** (cave → jardin = ~28 m) : pertes de distribution plus élevées qu'un système compact | ✅ pénalisant | ⚠️ maîtrisé avec isolation |
| **Dépendance à un système unique** : panne PAC = 4 logements sans chauffage | ✅ risque | ✅ risque |
| **Gestion collective** : nécessite une convention entre propriétaires si la propriété est divisée | ✅ | ✅ |
| **Vérification compatibilité radiateurs** (surdimensionnement requis) | ⚠️ Indispensable | ❌ sans objet |
| **SCOP réel pénalisé** (haute température d'émission) | ⚠️ SCOP ~3,1 | ✅ SCOP ~4,2 |
| **Délai de réalisation** : 6–12 mois (études + autorisations + travaux) | ✅ | ✅ |

#### Synthèse — Quelle option choisir ?

```
Contraintes budgétaires ?
├── Budget < 50 000 € net   →  G1 (réutilisation réseau existant)
│   ├── Vérifier surdimensionnement radiateurs existants
│   └── Prévoir robinets thermostatiques + calorimètres
│
└── Budget 50 000 – 85 000 € net  →  G2 (installation complète)
    ├── Radiateurs BT neufs → confort + SCOP optimal
    ├── Géocooling passif possible (été)
    └── Système pérenne 25 ans sans compromis
        │
        └── Objectif vacance locative minimale ?
            ├── OUI  →  4 CET individuels (Option A ECS)
            └── NON  →  HIU par logement (Option B ECS)
```

---

*Les simulations G1 et G2 sont basées sur la méthode 3CL-DPE 2021 appliquée proportionnellement aux données réelles du T3 (51,7 m², DPE 2567E2792599K). Les coûts sont des estimations HT+TVA marché Strasbourg 2025. Une étude thermique et géothermique par bureau d'études certifié RGE est indispensable avant tout investissement.*
