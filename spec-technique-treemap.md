# Spec Technique — TreeMap Paris (nom provisoire)

**Contexte :** Hackathon — MVP à livrer en 24-48h
**Version :** 0.1
**Date :** 07/07/2026

---

## 1. Pitch

Une carte interactive de Paris affichant l'ensemble des arbres de la ville. Les entreprises peuvent "acheter" virtuellement des arbres via un système d'enchères. Un leaderboard classe les entreprises selon leur nombre d'arbres achetés et le montant total dépensé.

**Objectif produit :** sensibiliser les entreprises à la végétalisation urbaine / RSE, sous forme ludique et compétitive (gamification + charité/sponsoring).

---

## 2. Hypothèses & choix par défaut (à valider avec l'équipe)

| Sujet | Choix par défaut | Raison |
|---|---|---|
| Source des données arbres | Open Data Paris ("Les Arbres" — data.paris.fr) | Dataset réel, gratuit, avec géoloc (lat/lon), espèce, hauteur, arrondissement |
| Type d'enchère | Pas de timer : chaque arbre a un prix courant, acheter = proposer un montant strictement supérieur, transfert immédiat de propriété | Logique ultra simple, pas de gestion de temps, transaction instantanée |
| Auth entreprise | Email + mot de passe simple (ou magic link) | Pas de vrai paiement en hackathon |
| Paiement | Fake money / crédits virtuels alloués au départ (ex: 10 000 crédits par compte) | Pas de vraie transaction bancaire à gérer en 48h |
| Temps réel | WebSockets (Socket.IO) pour prix des arbres + leaderboard live | Effet "wow" en démo, tout le monde voit un arbre changer de prix/propriétaire en direct |
| Carte | Leaflet.js + clustering (pas Mapbox, pour éviter API keys/coûts) | Open source, léger, clustering natif via plugin |

---

## 3. Stack technique proposée

- **Frontend :** React (Vite) + Leaflet (react-leaflet) + TailwindCSS
- **Backend :** Node.js + Express (ou Fastify) + Socket.IO
- **Base de données :** PostgreSQL + extension PostGIS (pour les coordonnées géo) — ou SQLite si contrainte de temps extrême
- **ORM :** Prisma
- **Déploiement démo :** Frontend sur Vercel/Netlify, backend + DB sur Railway/Render (setup rapide, gratuit en tier hackathon)
- **Import de données :** script Node ou Python one-shot pour charger le CSV/GeoJSON Open Data Paris en base

---

## 4. Architecture générale

```
[ Client React/Leaflet ]
        |  HTTP (REST) + WebSocket
        v
[ API Node/Express + Socket.IO ]
        |
        v
[ PostgreSQL + PostGIS ]
        ^
        |
[ Script d'import Open Data Paris (one-shot, à la mise en place) ]
```

- Le frontend récupère les arbres via une API paginée/filtrée par zone visible (bounding box) pour ne pas charger les ~200 000 arbres de Paris d'un coup.
- Les enchères et mises à jour du leaderboard sont poussées en temps réel via WebSocket à tous les clients connectés.

---

## 5. Modèle de données (simplifié)

### `Tree`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | |
| lat, lon | float | issus de l'Open Data |
| species | string | ex: "Platane" |
| arrondissement | int | |
| owner_id | FK → Company (nullable) | `null` = jamais acheté |
| current_price | decimal | prix de base au départ, puis dernier prix payé |
| min_increment | decimal (optionnel) | montant minimum au-dessus du prix courant pour pouvoir acheter (ex: +5%) |

### `Company`
| Champ | Type | Notes |
|---|---|---|
| id | UUID | |
| name | string | |
| email | string | |
| credits | decimal | solde virtuel |
| total_spent | decimal | dénormalisé pour le leaderboard |
| trees_owned_count | int | dénormalisé pour le leaderboard |

### `Purchase` (historique, remplace Auction/Bid)
| Champ | Type | Notes |
|---|---|---|
| id | UUID | |
| tree_id | FK → Tree | |
| company_id | FK → Company | |
| price | decimal | prix payé au moment de l'achat |
| created_at | timestamp | permet de reconstituer l'historique d'un arbre |

---

## 6. Endpoints API (MVP)

```
GET  /trees?bbox=lat1,lon1,lat2,lon2       → arbres visibles sur la carte (id, lat, lon, current_price, owner)
GET  /trees/:id                            → détail d'un arbre + historique d'achats
POST /trees/:id/buy                        → acheter { companyId, amount } — amount doit être > current_price
GET  /leaderboard                          → classement { company, total_spent, trees_owned }
POST /auth/login                           → connexion entreprise
GET  /companies/:id                        → profil + arbres possédés
```

### Événements WebSocket
```
"tree:purchased"    → { treeId, newOwnerId, newPrice }   → diffusé à tous les clients dès qu'un achat a lieu
"leaderboard:update"→ { top10: [...] }
```

---

## 7. Logique métier — Achat (sans timer)

1. Chaque arbre a un `current_price` visible sur la carte (prix de base au départ, ex: 50 crédits).
2. Une entreprise clique sur un arbre → voit le prix actuel → propose un montant.
3. Le montant proposé doit être **strictement supérieur** au `current_price` (et éventuellement au moins `current_price + min_increment` si on veut éviter les surenchères de 0,01 crédit).
4. Si le montant est valide et que l'entreprise a assez de crédits :
   - `owner_id` de l'arbre devient l'entreprise acheteuse
   - `current_price` de l'arbre devient le montant payé
   - Les crédits de l'entreprise sont débités du montant
   - `total_spent` et `trees_owned_count` de l'entreprise sont mis à jour
   - Une ligne `Purchase` est créée (historique)
5. **Concurrence** : deux entreprises peuvent tenter d'acheter le même arbre en même temps → utiliser une transaction DB avec vérification du prix au moment du commit (optimistic locking : `WHERE current_price = :prixAttendu`) pour éviter qu'un achat écrase l'autre à un prix obsolète.
6. Dès qu'un achat est validé, l'événement `tree:purchased` est broadcasté à tous les clients → la carte met à jour la couleur/le prix de l'arbre en direct, sans refresh.
7. Le leaderboard est recalculé (ou mis à jour en incrémental) et broadcasté à tous les clients.

**Note :** ce système signifie qu'un même arbre peut être racheté plusieurs fois par différentes entreprises au fil de la démo — c'est même l'intérêt pour créer de la compétition sur les arbres "populaires" (ex: ceux près de la Tour Eiffel).

---

## 7bis. Dashboard entreprise (investissements & stats)

### Objectif
Chaque entreprise connectée doit avoir une page "Mon Dashboard" qui récapitule ses investissements dans les arbres et sa position par rapport aux autres.

### Contenu du dashboard

**Vue d'ensemble (cards en haut)**
- Total dépensé (`total_spent`)
- Nombre d'arbres possédés (`trees_owned_count`)
- Crédits restants (`credits`)
- Rang actuel au leaderboard (ex: "3ème / 24 entreprises")

**Liste des arbres possédés**
- Tableau ou grille : espèce, arrondissement, prix payé, date d'achat, mini-carte de localisation
- Tri par prix payé / date / arrondissement

**Graphiques**
- Évolution des dépenses dans le temps (line chart, cumulé) — basé sur `Purchase.created_at`
- Répartition des arbres possédés par arrondissement (bar chart ou pie chart)
- Répartition par espèce d'arbre (pie chart)

**Historique des transactions**
- Liste chronologique de tous les achats de l'entreprise (arbre, prix, date), avec pagination

### Modèle de données
Pas de nouveau modèle nécessaire : le dashboard se construit entièrement à partir de `Company`, `Tree` (jointure sur `owner_id`) et `Purchase` (filtré par `company_id`). Aucune dénormalisation supplémentaire requise pour le MVP.

### Endpoint API dédié

```
GET /companies/:id/dashboard
```
Réponse suggérée :
```json
{
  "company": { "id": "...", "name": "...", "credits": 4200, "total_spent": 5800, "trees_owned_count": 12, "rank": 3 },
  "trees": [
    { "treeId": "...", "species": "Platane", "arrondissement": 15, "pricePaid": 320, "purchasedAt": "2026-07-06T10:00:00Z" }
  ],
  "spendingOverTime": [
    { "date": "2026-07-06", "cumulativeSpent": 1200 }
  ],
  "byArrondissement": [ { "arrondissement": 15, "count": 5 } ],
  "bySpecies": [ { "species": "Platane", "count": 7 } ]
}
```

Ces agrégations (`spendingOverTime`, `byArrondissement`, `bySpecies`) peuvent être calculées côté backend avec des requêtes SQL `GROUP BY` simples sur `Purchase`/`Tree` — pas besoin de service d'analytics externe pour un hackathon.

### Composants frontend suggérés
- `DashboardPage` (route protégée, nécessite login)
- `StatsCards` (les 4 chiffres clés)
- `TreesOwnedTable`
- `SpendingChart`, `ArrondissementChart`, `SpeciesChart` (ex: via Recharts — léger et rapide à intégrer en React)
- `TransactionHistory`

### Priorité (si temps limité)
1. Cards de stats + liste des arbres possédés → **must have**
2. Historique des transactions → **must have**
3. Graphiques (dépenses dans le temps, répartition) → **nice to have**, mais fort impact visuel en démo si le temps le permet



## 8. Scope MVP vs Nice-to-have

### MVP (doit fonctionner pour la démo)
- Carte Paris avec arbres réels (clustering)
- Clic sur un arbre → détail + prix actuel + historique
- Achat instantané (proposer > prix courant) avec mise à jour temps réel
- Leaderboard temps réel
- Auth basique entreprise

### Nice-to-have (si temps restant)
- Filtres par arrondissement / espèce
- Historique des enchères par arbre
- Badge/certificat visuel "j'ai acheté cet arbre"
- Carte de chaleur des arbres les plus disputés
- Mode "sponsoring" avec logo entreprise affiché sur l'arbre

---

## 9. Plan de découpage (équipe hackathon)

1. **Data** : récupérer + nettoyer le dataset Open Data Paris, script d'import → DB
2. **Backend** : modèles Prisma, endpoints REST (achat, dashboard), WebSocket
3. **Frontend carte** : intégration Leaflet + clustering + affichage arbres
4. **Frontend achat + leaderboard** : UI temps réel
5. **Frontend dashboard** : stats cards, graphiques, historique
6. **Auth** : login simple entreprise
7. **Démo/polish** : scénario de démo, données de seed pour que ça ait l'air vivant

---

## 10. Risques identifiés

- **Volume de données** : ~200 000 arbres à Paris → nécessite clustering côté carte et requêtes filtrées par bbox, pas un `SELECT *`.
- **Temps réel** : Socket.IO ajoute de la complexité ; prévoir un fallback en polling REST si ça bloque.
- **Scope creep** : rester strict sur le MVP, l'enchère + leaderboard + carte suffisent pour une démo convaincante.

---

*Document généré comme base de travail — à ajuster selon la taille de l'équipe et le temps réellement disponible.*
