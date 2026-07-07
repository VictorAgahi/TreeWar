# Brief Claude Code — Dashboard Entreprise TreeMap Paris

## Objectif du dashboard

Créer une page dashboard claire, moderne et démonstrative pour un MVP hackathon 24h.

Le dashboard doit donner rapidement les informations suivantes :

- combien l'entreprise a investi ;
- combien d'arbres elle sponsorise ;
- combien de crédits il lui reste ;
- sa position dans le classement ;
- son arbre le plus cher ;
- la liste de ses derniers arbres sponsorisés ;
- une visualisation simple de sa progression ou de la répartition de ses arbres.

Le dashboard doit être pensé pour une démo : il doit être lisible immédiatement, visuel, et donner une impression de produit déjà vivant.

---

## Vocabulaire UI à utiliser

Éviter le terme **“arbres plantés”**, car l'application ne plante pas réellement des arbres. Elle permet de sponsoriser/acheter virtuellement des arbres existants.

Utiliser plutôt :

- **Arbres sponsorisés**
- **Montant investi**
- **Crédits restants**
- **Rang actuel**
- **Arbre premium** ou **Arbre le plus cher**
- **Voir sur la carte**

---

## Structure de la page

La page peut être organisée comme suit :

1. Header du dashboard
2. Cards KPI principales
3. Card de progression / objectif classement
4. Section arbre le plus cher
5. Mini leaderboard
6. Liste des arbres sponsorisés
7. Graphique simple
8. Historique récent des transactions

---

## 1. Header du dashboard

Créer un header simple avec :

- le nom de l'entreprise ;
- une phrase de résumé ;
- éventuellement un bouton de retour vers la carte.

Exemple :

```text
Dashboard GreenCorp
Suivez vos arbres sponsorisés, vos investissements et votre position dans le classement.
```

Ajouter un bouton :

```text
Retour à la carte
```

---

## 2. Cards KPI principales

Afficher 4 cards principales en haut de page.

### Card 1 — Montant investi

Label :

```text
Montant investi
```

Valeur exemple :

```text
5 800 crédits
```

Description courte :

```text
Total dépensé dans le sponsoring d'arbres
```

---

### Card 2 — Arbres sponsorisés

Label :

```text
Arbres sponsorisés
```

Valeur exemple :

```text
12
```

Description courte :

```text
Arbres actuellement détenus par votre entreprise
```

---

### Card 3 — Crédits restants

Label :

```text
Crédits restants
```

Valeur exemple :

```text
4 200 crédits
```

Description courte :

```text
Budget encore disponible
```

---

### Card 4 — Rang actuel

Label :

```text
Rang actuel
```

Valeur exemple :

```text
3e / 24
```

Description courte :

```text
Position dans le leaderboard des entreprises
```

---

## 3. Card de progression classement

Ajouter une card plus horizontale pour renforcer la gamification.

Exemple :

```text
Vous êtes à 1 400 crédits de la 2e place.
```

Ou :

```text
Encore 2 arbres sponsorisés pour entrer dans le top 2.
```

Données nécessaires :

- rang actuel de l'entreprise ;
- total dépensé de l'entreprise ;
- total dépensé de l'entreprise juste au-dessus dans le classement ;
- différence entre les deux.

Cette card est optionnelle si les données ne sont pas encore disponibles, mais elle donne beaucoup d'impact en démo.

---

## 4. Section arbre le plus cher

Créer une card dédiée à l'arbre le plus cher sponsorisé par l'entreprise.

Titre :

```text
Arbre le plus cher
```

Contenu exemple :

```text
Platane commun
820 crédits
Paris 15e arrondissement
Acheté le 07/07/2026
```

Ajouter un bouton :

```text
Voir sur la carte
```

Comportement attendu :

- au clic, rediriger vers la page carte ;
- centrer la carte sur les coordonnées de l'arbre ;
- ouvrir éventuellement le popup de détail de l'arbre.

Exemple de route possible :

```text
/map?treeId=abc123
```

Ou :

```text
/map?lat=48.8566&lon=2.3522&treeId=abc123
```

---

## 5. Mini leaderboard

Afficher un classement compact des 5 premières entreprises.

Titre :

```text
Classement des entreprises
```

Colonnes :

- position ;
- nom de l'entreprise ;
- montant investi ;
- nombre d'arbres sponsorisés.

Exemple :

```text
1. EcoPulse — 8 900 crédits — 18 arbres
2. BlueFactory — 7 200 crédits — 15 arbres
3. GreenCorp — 5 800 crédits — 12 arbres
4. UrbanLeaf — 4 950 crédits — 10 arbres
5. NovaCare — 3 700 crédits — 8 arbres
```

Mettre en surbrillance la ligne de l'entreprise connectée.

Si l'entreprise connectée n'est pas dans le top 5, afficher :

- le top 5 ;
- puis une ligne séparée avec la position réelle de l'entreprise.

Exemple :

```text
...
12. GreenCorp — 1 900 crédits — 4 arbres
```

---

## 6. Liste des arbres sponsorisés

Créer un tableau ou une grille avec les arbres actuellement possédés par l'entreprise.

Colonnes recommandées :

- espèce ;
- arrondissement ;
- prix payé ;
- date d'achat ;
- action.

Exemple :

| Espèce | Arrondissement | Prix payé | Date d'achat | Action |
|---|---:|---:|---|---|
| Platane commun | 15e | 820 crédits | 07/07/2026 | Voir sur la carte |
| Érable sycomore | 14e | 640 crédits | 07/07/2026 | Voir sur la carte |
| Tilleul argenté | 11e | 590 crédits | 06/07/2026 | Voir sur la carte |

Fonctionnalités utiles mais simples :

- tri par prix payé ;
- tri par date d'achat ;
- filtre par arrondissement ;
- bouton “Voir sur la carte”.

Priorité MVP : afficher le tableau même sans tri avancé.

---

## 7. Graphiques simples

Ajouter un ou deux graphiques maximum.

Pour aller vite, utiliser une librairie simple type **Recharts**.

### Graphique prioritaire — Évolution des investissements

Titre :

```text
Évolution de vos investissements
```

Type : line chart ou area chart.

Données exemple :

```js
const spendingOverTime = [
  { date: "10:00", cumulativeSpent: 500 },
  { date: "11:00", cumulativeSpent: 1200 },
  { date: "12:00", cumulativeSpent: 2500 },
  { date: "13:00", cumulativeSpent: 5800 }
]
```

---

## 8. Historique récent des transactions

Afficher les derniers achats de l'entreprise.

Titre :

```text
Dernières transactions
```

Exemple :

```text
07/07/2026 — Platane commun — Paris 15e — 820 crédits
07/07/2026 — Érable sycomore — Paris 14e — 640 crédits
06/07/2026 — Tilleul argenté — Paris 11e — 590 crédits
```

Prévoir une pagination ou un bouton :

```text
Voir tout l'historique
```

Pour le MVP, afficher seulement les 5 dernières transactions.