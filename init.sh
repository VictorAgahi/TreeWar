#!/bin/bash

echo "🌳 Lancement de InvesTree..."

# Lancement du backend en arrière-plan
echo "🚀 Démarrage du backend NestJS..."
(cd backend && yarn start:dev) &
BACKEND_PID=$!

# Lancement du frontend en arrière-plan
echo "✨ Démarrage du frontend React/Vite..."
(cd frontend && yarn dev) &
FRONTEND_PID=$!

# Fonction pour tout arrêter proprement quand on fait Ctrl+C
trap "echo '🛑 Arrêt des serveurs...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

echo "✅ Serveurs lancés ! Appuyez sur Ctrl+C pour tout arrêter."

# Attendre la fin des processus
wait $BACKEND_PID $FRONTEND_PID
