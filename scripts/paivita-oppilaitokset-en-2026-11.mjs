/**
 * paivita-oppilaitokset-en-2026-11.mjs — Englanninkieliset kotisivut kolmelle
 * oppilaitokselle (Villen pyyntö 5.11.2026). Englanninkielisellä sivulla linkki
 * vie näihin osoitteisiin, muilla kielillä suomenkieliseen kotisivuun.
 *
 * TURVALLISUUS (sama malli kuin korjaa-tekstit-2026-10.mjs):
 *   - Oletuksena kuivaharjoitus: tulostaa muutokset, ei muuta mitään.
 *   - Muuttaa vain kentän urlEn _key-polulla, ei muuta muuta listaa.
 *   - Oppilaitos tunnistetaan kotisivun verkkotunnuksesta. Jos sitä ei löydy
 *     tai löytyy useampi kuin yksi → seis.
 *   - Julkaisematon luonnos Studiossa → seis.
 *   - ifRevisionId: jos lista muuttui välissä → seis.
 *   - Peruttavissa Studion historiasta (History → Revert).
 *
 * AJO (Sanity CLI:n kirjautumisella):
 *   cd studio && npx sanity exec ../scripts/paivita-oppilaitokset-en-2026-11.mjs --with-user-token
 *   cd studio && npx sanity exec ../scripts/paivita-oppilaitokset-en-2026-11.mjs --with-user-token -- --toteuta
 */

import { createClient } from '@sanity/client'

const TOTEUTA = process.argv.includes('--toteuta')
const DOC_ID = 'institutionList'

const PAIVITYKSET = [
  { host: 'hmak.com',     urlEn: 'https://hmak.com/in-english/' },
  { host: 'ingmanedu.fi', urlEn: 'https://ingmanedu.fi/international-partnerships/' },
  { host: 'sdo.fi',       urlEn: 'https://sdo.fi/about-us/' },
]

function hostAvain(url = '') {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' }
}

// Token .env-tiedostosta, tai Sanity CLI:n kirjautuminen (ks. AJO yllä)
const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN
let client
if (token) {
  client = createClient({ projectId: 'l442zg5l', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false, perspective: 'raw' })
} else {
  const mod = await import('sanity/cli')
  const getCliClient = mod.getCliClient ?? mod.default?.getCliClient
  client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ useCdn: false, perspective: 'raw' })
}

const [doc, draft] = await Promise.all([client.getDocument(DOC_ID), client.getDocument(`drafts.${DOC_ID}`)])
if (draft) {
  console.error('✖ Studiossa on julkaisematon luonnos oppilaitoslistasta – julkaise tai hylkää se ensin. Mitään ei muutettu.')
  process.exit(1)
}
if (!doc) { console.error('✖ Oppilaitoslistaa ei löydy. Mitään ei muutettu.'); process.exit(1) }

const lista = doc.institutions ?? []
const muutokset = []
let seis = false
for (const p of PAIVITYKSET) {
  const osumat = lista.filter((o) => hostAvain(o.url) === p.host)
  if (osumat.length !== 1) {
    console.error(`✖ ${p.host}: löytyi ${osumat.length} oppilaitosta (odotettu 1)`)
    seis = true
    continue
  }
  const o = osumat[0]
  if (o.urlEn === p.urlEn) { console.log(`  = ${o.name}: englanninkielinen osoite on jo ${p.urlEn}`); continue }
  muutokset.push({ key: o._key, name: o.name, ennen: o.urlEn || '(tyhjä, käytetään suomenkielistä)', jalkeen: p.urlEn })
}
if (seis) { console.error('\nSEIS: jokin oppilaitos ei täsmännyt. Mitään ei muutettu.'); process.exit(1) }

console.log(`Muutetaan ${muutokset.length} englanninkielistä osoitetta:`)
for (const m of muutokset) console.log(`  ~ ${m.name}\n      ${m.ennen}\n    → ${m.jalkeen}`)

if (!muutokset.length) { console.log('\nEi muutettavaa. Mitään ei muutettu.'); process.exit(0) }
if (!TOTEUTA) { console.log('\nKuivaharjoitus valmis. Aja --toteuta, niin osoitteet päivitetään.'); process.exit(0) }

const set = Object.fromEntries(muutokset.map((m) => [`institutions[_key=="${m.key}"].urlEn`, m.jalkeen]))
const res = await client.transaction().patch(DOC_ID, (p) => p.ifRevisionId(doc._rev).set(set)).commit()
console.log(`\n✔ Transaktio ${res.transactionId} tehty: ${muutokset.length} osoitetta päivitetty.`)
console.log('Netlify-build lähtee Sanityn webhookista.')
