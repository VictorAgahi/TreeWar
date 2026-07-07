# Règles globales du projet TreeWar

## Vérification systématique
À la fin de chaque instruction ou série d'actions ayant modifié le code (frontend ou backend), tu **DOIS IMPÉRATIVEMENT** :
1. Lancer la commande `yarn build` dans le(s) dossier(s) modifié(s) pour vérifier que le projet compile.
2. Lancer la commande `yarn lint` dans le(s) dossier(s) modifié(s) pour vérifier que le code respecte les règles de linting (notamment l'absence de `any`).
3. Corriger automatiquement les erreurs éventuelles avant de répondre à l'utilisateur. Ne termine pas ton tour si des erreurs de lint ou de build persistent suite à tes modifications.
