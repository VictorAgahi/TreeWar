# 1. Vision du produit

TreeWar est un jeu de déduction sociale multijoueur (type *Among Us*) qui se déroule sur la carte réelle d'un arrondissement de Paris tiré au hasard, récupérée via OpenStreetMap. Les joueurs incarnent des **Citoyens** qui doivent végétaliser la ville avant l'arrivée de la canicule ; parmi eux, un **Maire** élu secrètement sabote leurs efforts. Une carte de chaleur (heatmap) montre en temps réel les rues en danger : plus une rue manque d'arbres, plus elle vire au rouge. L'objectif du jeu détourne un outil de sensibilisation écologique en une expérience ludique, tendue et compétitive.

> **PITCH EN UNE PHRASE**
>
> « Un *Among Us* écologique sur la vraie carte de Paris : les Citoyens plantent des arbres pour faire refroidir la ville avant la canicule, pendant que le Maire caché ferme les parcs et sabote — et tout le monde cherche l'imposteur. »

## 1.1 Objectifs du hackathon

- Livrer un **MVP jouable** en salon de 6 joueurs maximum, en réseau local ou en ligne, sur un arrondissement.
- Ancrer le jeu dans des **données ouvertes réelles** (carte OSM + arbres de Paris + chaleur) pour la crédibilité RSE / ODD.
- Faire de la **heatmap** la mécanique centrale : rendre visible le lien entre absence d'arbres et danger de chaleur.
- Démontrer une architecture temps réel propre et défendable en soutenance.
- Garder un périmètre sobre : pas d'usine à gaz, tout doit tourner sur un laptop.

## 1.2 Angle écologique & ODD

Le jeu reste rattaché à un propos sérieux : chaque arbre de la carte est un vrai arbre parisien, avec son espèce, sa hauteur et sa localisation. Détruire des arbres dans le jeu illustre par contraste leur valeur (ombrage, fraîcheur, biodiversité).

| **ODD** | **Lien avec le jeu** |
|---|---|
| ODD 11 — Villes durables | La canopée urbaine comme infrastructure vitale de la ville. |
| ODD 13 — Action climatique | Les arbres réduisent les îlots de chaleur, visualisés sur la carte. |
| ODD 15 — Vie terrestre | Diversité des espèces d'arbres, entretien des parcs. |
| ODD 3 — Santé & bien-être | Fraîcheur et qualité de l'air en période de canicule. |

## 1.3 Le cadre et la carte

- **Terrain de jeu :** une partie se déroule dans un arrondissement de Paris choisi au hasard. La carte réelle est récupérée via OpenStreetMap (OSM).
- **Nombre de joueurs :** un salon de 6 joueurs maximum.
- **Composante environnementale (heatmap) :** au début, la carte affiche les rues de l'arrondissement. Plus une rue manque d'arbres, plus elle vire au rouge vif pour symboliser le danger de la chaleur. Planter des arbres refroidit progressivement les rues (retour au vert).

# 2. Boucle de jeu & règles

## 2.1 Rôles (identités secrètes)

| **Rôle** | **Objectif** | **Capacités** |
|---|---|---|
| Citoyens | Sauver la ville avant l'arrivée de la canicule en la végétalisant. | Planter des arbres, arroser les jeunes pousses, ramasser les déchets, entretenir les espaces verts, voter. |
| Le Maire (imposteur) | Saboter les efforts des Citoyens sans se faire démasquer. | Fermer des parcs, bloquer l'accès à des rues, saboter le réseau d'eau, se déplacer, éliminer. |

Le **Maire** est élu secrètement et aléatoirement au début de la partie. Son identité est totalement inconnue des Citoyens.

## 2.2 Conditions de victoire

| **Camp** | **Comment gagner** |
|---|---|
| Citoyens | Végétaliser suffisamment la carte et finir les tâches avant le timer de la canicule — OU démasquer le Maire lors d'un vote. |
| Le Maire | Faire monter la heatmap au maximum, ou bloquer la ville jusqu'à ce que la canicule frappe et élimine les Citoyens. |

> **LE TIMER DE LA CANICULE**
>
> Une horloge de canicule court en fond pendant toute la partie. Elle matérialise la pression : si les Citoyens n'ont pas assez refroidi la ville quand elle atteint zéro, la canicule frappe et le Maire l'emporte. Chaque sabotage réussi peut accélérer cette horloge ; chaque zone végétalisée peut la ralentir. Le réglage exact (durée, poids des actions) est un paramètre d'équilibrage.

## 2.3 Déroulé d'une partie

1. Lobby : jusqu'à 6 joueurs rejoignent via un code de salon et choisissent un avatar.
2. Attribution secrète des rôles : les Citoyens et le Maire caché.
3. Lancement du timer de canicule et affichage de la heatmap initiale (rues rouges).
4. Phase d'action : déplacement en vue du dessus, réalisation des tâches de végétalisation, sabotages du Maire.
5. Découverte d'un sabotage → déclenche une réunion d'urgence.
6. Phase de discussion & vote : les joueurs débattent et votent une éjection.
7. Retour en phase d'action jusqu'à une condition de victoire ou la fin du timer.

# 3. Gameplay & système de vision

## 3.1 Vue « oiseau » (top-down)

Les joueurs déplacent leur personnage sur la carte de Paris avec une vue du dessus. Le déplacement se fait au-dessus du fond OSM de l'arrondissement, les rues servant de couloirs de circulation.

## 3.2 Brouillard de guerre (champ de vision réduit)

Pour installer la tension propre au genre Among Us, chaque joueur dispose d'un champ de vision très réduit devant lui. On ne voit ce qui se passe — tâches en cours, déplacements, sabotages, autres joueurs — que lorsqu'un élément entre dans sa zone de vision directe. Le reste de la carte est masqué par un brouillard de guerre.

> **CONSÉQUENCES DE DESIGN**
>
> - Un sabotage effectué hors de vue reste invisible : l'alibi et le témoignage deviennent centraux.
> - La heatmap globale reste visible en permanence (vue stratégique), mais le détail local dépend du champ de vision.
> - Le rayon de vision est un **paramètre d'équilibrage** : trop large tue la tension, trop court rend le jeu frustrant.

## 3.3 Réunions & vote

- Déclenchées par la découverte d'un sabotage, ou par un bouton d'urgence limité.
- Chat textuel (ou vocal si le temps le permet) pendant un compte à rebours.
- Vote à la majorité ; possibilité de passer (skip). Égalité = personne n'est éjecté.

# 4. Tâches, sabotages & mécaniques

Cette section liste les mécaniques concrètes. Les éléments marqués *[à définir]* sont des pistes à équilibrer.

## 4.1 Tâches des Citoyens

Toutes les tâches suivent la même mécanique simple : le joueur reste appuyé sur la tâche pendant la durée indiquée pour l'effectuer. Aucun mini-jeu, aucune séquence complexe.

| **Tâche** | **Interaction** | **Durée** | **Effet** |
|---|---|---|---|
| Planter un arbre | Rester appuyé sur la tâche. | Court | Refroidit la rue (heatmap), progresse vers l'objectif. |
| Arroser une jeune pousse | Rester appuyé sur la tâche. | Court | Empêche une pousse de dépérir. |
| Entretenir un espace vert | Rester appuyé sur la tâche. | Moyen | Maintient le parc en bon état. |
| Rouvrir un parc | Rester appuyé sur la tâche. | Moyen | Annule une fermeture du Maire. |
| Rétablir le réseau d'eau | Rester appuyé sur la tâche. | Moyen | Répare un sabotage d'eau. |

## 4.2 Actions du Maire (imposteur)

| **Action** | **Effet** | **Cooldown** |
|---|---|---|
| Fermer un parc | Verrouille une zone, bloque les tâches associées. | Moyen |
| Bloquer une rue | Coupe un accès, force les détours, isole des joueurs. | Moyen |
| Saboter le réseau d'eau | Désactive l'arrosage d'une zone ; les pousses dépérissent. | Moyen |
| Accélérer la canicule | Fait grimper la heatmap ; doit être contré en équipe. | Long |

> **LIEN AVEC LA HEATMAP**
>
> Chaque action du Maire pousse la carte vers le rouge (danger de chaleur) et chaque tâche réussie des Citoyens la ramène vers le vert. La heatmap est donc le tableau de bord partagé de la partie : les deux camps la lisent en permanence pour évaluer qui est en train de gagner.

# 5. Données & carte

## 5.1 Sources de données ouvertes

| **Source** | **Contenu** | **Usage dans le jeu** |
|---|---|---|
| OpenStreetMap | Rues, bâtiments, découpage de l'arrondissement. | Fond de carte, réseau de rues pour la heatmap et le déplacement. |
| Open Data Paris — Les arbres | Position, espèce, hauteur, stade. | Densité d'arbres par rue = niveau initial de la heatmap. |
| Open Data Paris — Espaces verts | Contours des parcs et jardins. | Zones de parc à entretenir / fermer. |
| Copernicus / LST | Température de surface. | Calibrage optionnel de la heatmap de départ. |

> **NOTE TECHNIQUE — HEATMAP PAR RUE**
>
> La heatmap se calcule au niveau de la rue : pour chaque segment de rue OSM, on compte les arbres à proximité (Open Data Paris) pour en déduire une couleur (rouge = peu d'arbres, vert = bien végétalisé). Un arrondissement peut contenir plusieurs milliers d'arbres : il faudra échantillonner ou agréger par segment pour garder une carte lisible et performante. Les données sont pré-téléchargées en GeoJSON et versionnées : aucune requête API en cours de partie.

# 6. Liste des fonctionnalités

Priorités : **P0** = indispensable au MVP, **P1** = important si le temps le permet, **P2** = bonus / soutenance.

| **#** | **Fonctionnalité** | **Prio.** |
|---|---|---|
| F1 | Lobby avec code de salon (6 joueurs max) | P0 |
| F2 | Carte OSM d'un arrondissement tiré au hasard | P0 |
| F3 | Heatmap par rue selon la densité d'arbres | P0 |
| F4 | Déplacement des joueurs en vue du dessus, temps réel | P0 |
| F5 | Attribution secrète des rôles (Citoyens / Maire) | P0 |
| F6 | Tâches de végétalisation (planter, arroser, ramasser) | P0 |
| F7 | Actions de sabotage du Maire (parc, rue, eau) | P0 |
| F8 | Timer de canicule et conditions de victoire | P0 |
| F9 | Réunion, discussion et vote d'éjection | P0 |
| F10 | Brouillard de guerre (champ de vision réduit) | P1 |
| F11 | Refroidissement de la heatmap quand on plante | P1 |
| F12 | Fermeture / réouverture et blocage de rues | P1 |
| F13 | Chat textuel pendant les réunions | P1 |
| F15 | Fiche d'un arbre réel au clic (espèce, hauteur) | P2 |

# 8. Organisation & planning

## 8.1 Répartition des rôles (4 personnes)

| **Membre** | **Périmètre** |
|---|---|
| A — Données & carte | Récupération OSM + arbres, affichage Leaflet, calcul de la heatmap par rue. |
| B — Serveur temps réel | WebSocket, état autoritaire, brouillard de guerre, rôles, timer canicule. |
| C — Gameplay & UI | Tâches, sabotages, réunions, vote, écrans, vue top-down. |
| D — Intégration & soutenance | Assemblage, équilibrage, doc technique, pitch. |

## 8.2 Timeline 48h

| **Créneau** | **Objectif** |
|---|---|
| J1 · 0–4h | Cadrage, tirage d'arrondissement, récupération OSM + arbres, squelette. |
| J1 · 4–12h | Carte + heatmap par rue + déplacement temps réel + lobby. |
| J1 · 12–20h | Rôles, tâches de végétalisation, sabotages du Maire. |
| J2 · 0–8h | Timer canicule, réunions, vote, conditions de victoire. |
| J2 · 8–14h | Brouillard de guerre, équilibrage, polish, bonus. |
| J2 · 14–16h | Doc, répétition de la soutenance, démo. |

## 8.3 Risques & parades

| **Risque** | **Parade** |
|---|---|
| Synchro temps réel instable | Serveur autoritaire simple, snapshots réguliers plutôt que diffs fins. |
| Trop d'arbres = carte lente | Agréger les arbres par segment de rue, limiter la zone jouable. |
| Brouillard de guerre coûteux | Calcul de vision simplifié (rayon fixe), en dernier si le temps manque (P1). |
| Scope trop large | Bloquer les P0 d'abord, tout le reste est bonus. |
| Équilibrage du jeu | Paramètres (cooldowns, durée canicule, rayon vision) dans un fichier de config. |
