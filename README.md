# Simulation DPE 3CL — 12 rue de l'Oberelsau

## Prérequis

- Node.js (v18+)

## Installation

```bash
npm install
```

## Utilisation

### Lancer tous les scénarios de rénovation

```bash
node run_scenarios.js
```

### Convertir un XML DPE en JSON

```bash
cat 2567E2792599K.xml | node xml_to_json.js > dpe_current.json
```

### Lancer le calcul 3CL sur un DPE JSON

```bash
node run_one_dpe.js dpe_current.json
```

## Fichiers

| Fichier | Description |
|---|---|
| `run_scenarios.js` | Simule 6 scénarios (état actuel + 5 variantes de rénovation) |
| `run_one_dpe.js` | Lance le calcul 3CL sur un fichier JSON DPE |
| `xml_to_json.js` | Convertit un fichier XML DPE ADEME en JSON |
| `dpe_current.json` | Votre DPE actuel converti en JSON |
| `2567E2792599K.xml` | Votre DPE original (XML ADEME) |
| `src/` | Moteur de calcul Open3CL (3CL-DPE 2021) |

## Scénarios simulés

| # | Description |
|---|---|
| 0 | État actuel (vérification) |
| 1 | VMC hygro B seule (gaz collectif conservé) |
| 2 | VMC hygro B + radiateurs élec inertie + ballon classique 100L |
| 3 | VMC hygro B + radiateurs élec inertie + CET air extérieur (RECOMMANDÉ) |
| 4 | Sans VMC + radiateurs élec inertie + CET air extérieur |
| 5 | VMC hygro B + radiateurs élec inertie + CET + fenêtres Uw=1.3 |

## Modifier les scénarios

Éditez `run_scenarios.js` pour tester d'autres configurations. Les enum importants :

### Ventilation (enum_type_ventilation_id)
- 1 = ouverture des fenêtres
- 15 = VMC SF hygro B après 2012

### Chauffage (enum_type_generateur_ch_id)
- 98 = convecteur électrique
- 99 = panneau rayonnant
- 100 = radiateur électrique NFC (inertie)
- 104 = radiateur à accumulation

### Émission/distribution (enum_type_emission_distribution_id)
- 1 = convecteur électrique
- 2 = panneau rayonnant
- 3 = radiateur électrique NFC

### ECS (enum_type_generateur_ecs_id)
- 6 = CET sur air extérieur après 2014
- 3 = CET sur air ambiant après 2014
- 9 = CET sur air extrait après 2014
- 30 = ballon électrique vertical catégorie B

## Note coefficient 2026 et Plan d'électrification des usages

**Open3CL v1.4+ utilise déjà le coefficient EP de 1,9** (nouveau coefficient officiel, confirmé par le Plan d'électrification des usages — voir [economie.gouv.fr](https://www.economie.gouv.fr/actualites/presentation-du-plan-delectrification-des-usages)). Les résultats de ce dépôt sont donc **directement conformes au DPE 2026** — aucune correction manuelle n'est nécessaire.

Vérification sur les données `renovation_results.json` (scénario S3, tout électrique) :
```
ep_ch / ef_ch = 5 038 / 2 652 = 1,900  ✓
ep_ecs / ef_ecs = 959 / 505 = 1,900    ✓
```

L'ancienne formule manuelle `EP_2026 = EF_élec × 1,9` était un contournement, désormais inutile.

> ⚠️ Note historique : une version antérieure de ce README indiquait que l'engine utilisait 2,3. C'était inexact pour la version @open3cl/engine ^1.4.x installée.

## Crédits

Moteur de calcul : [Open3CL](https://github.com/Open3CL/engine) (licence MIT)
