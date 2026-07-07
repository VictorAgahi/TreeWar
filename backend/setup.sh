#!/bin/sh

# Quitte le script si une erreur survient
set -e

echo "🚀 Démarrage du setup backend..."

# 1. Installation des dépendances
echo "📦 Installation des dépendances..."
yarn install

# 2. Génération des clés RSA
echo "🔐 Vérification des clés RSA..."
mkdir -p keys
if [ ! -f keys/private.pem ]; then
  echo "Génération de la paire de clés RSA (2048 bits)..."
  openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048
  openssl rsa -pubout -in keys/private.pem -out keys/public.pem
  echo "✅ Clés générées avec succès dans le dossier keys/."
else
  echo "✅ Les clés RSA existent déjà."
fi

# 3. Démarrage de Docker
echo "🐘 Démarrage de la base de données via Docker Compose..."
# On remonte d'un dossier car le docker-compose.yml est à la racine
cd ..
docker-compose up -d
cd backend

echo "⏳ Attente de l'initialisation de PostGIS (5 secondes)..."
sleep 5

# 4. Migrations TypeORM
echo "🗄️ Exécution des migrations TypeORM..."
yarn migration:run

# 5. Compilation
echo "🏗️ Build du projet..."
yarn build

echo "🎉 Setup terminé ! Vous pouvez lancer le serveur avec 'yarn start:dev'"
