#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# update-config.sh
# Päivittää Sanity projectId:n kaikkiin tarvittaviin tiedostoihin.
#
# Käyttö:
#   chmod +x scripts/update-config.sh   (vain ensimmäisellä kerralla)
#   ./scripts/update-config.sh abc12345
# ─────────────────────────────────────────────────────────────────────────────

set -e

PROJECT_ID="${1}"

if [ -z "$PROJECT_ID" ]; then
  echo "❌  Anna Sanity Project ID parametrina."
  echo "   Käyttö: ./scripts/update-config.sh abc12345"
  exit 1
fi

# Validoi että ID näyttää järkevältä (8 merkkiä, kirjaimia ja numeroita)
if ! echo "$PROJECT_ID" | grep -qE '^[a-z0-9]{8,12}$'; then
  echo "⚠️   Varoitus: '$PROJECT_ID' ei näytä tyypilliseltä Sanity Project ID:ltä."
  echo "   Jatketaan silti..."
fi

echo "🔧  Päivitetään Sanity Project ID: $PROJECT_ID"
echo ""

# ── 1. studio/sanity.config.ts ───────────────────────────────────────────────
CONFIG="studio/sanity.config.ts"
if [ -f "$CONFIG" ]; then
  sed -i.bak "s/TÄYTÄ_TÄHÄN/${PROJECT_ID}/g" "$CONFIG"
  rm -f "${CONFIG}.bak"
  echo "✅  $CONFIG päivitetty"
else
  echo "⚠️   $CONFIG ei löydy – ohitetaan"
fi

# ── 2. .env (jos olemassa) ───────────────────────────────────────────────────
if [ -f ".env" ]; then
  sed -i.bak "s/^PUBLIC_SANITY_PROJECT_ID=.*/PUBLIC_SANITY_PROJECT_ID=${PROJECT_ID}/" ".env"
  rm -f ".env.bak"
  echo "✅  .env päivitetty"
else
  # Luo .env .env.examplesta ja täytä project ID
  cp .env.example .env
  sed -i.bak "s/^PUBLIC_SANITY_PROJECT_ID=.*/PUBLIC_SANITY_PROJECT_ID=${PROJECT_ID}/" ".env"
  rm -f ".env.bak"
  echo "✅  .env luotu .env.examplesta ja päivitetty"
fi

echo ""
echo "🎉  Valmis! Project ID '$PROJECT_ID' asetettu."
echo ""
echo "Seuraavat askeleet:"
echo "  1. cd studio && npm install && npx sanity deploy"
echo "  2. cd web && npm install && npm run dev"
