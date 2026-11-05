/**
 * lisaa-logot-2026-11.mjs — Oppilaitosten logot Sanityyn logoruudukon kokeilua
 * varten (5.11.2026). Logotiedostot ovat projektikansiossa repon ulkopuolella:
 *   ETEKAn 1. sovelluskatselmointi/oppilaitosten_logot/
 *
 * TURVALLISUUS (sama malli kuin korjaa-tekstit-2026-10.mjs):
 *   - Oletuksena kuivaharjoitus: tarkistaa tiedostot ja näyttää suunnitelman,
 *     ei lataa eikä muuta mitään.
 *   - Oppilaitos tunnistetaan kotisivun verkkotunnuksesta. Jos sitä ei löydy
 *     tai löytyy useampi kuin yksi → seis.
 *   - Oppilaitosta, jolla on jo logo, ei muuteta (paitsi lisävalinnalla --korvaa).
 *   - Julkaisematon luonnos Studiossa → seis.
 *   - ifRevisionId: jos lista muuttui välissä → seis.
 *   - Peruttavissa Studion historiasta (History → Revert).
 *
 * AJO (Sanity CLI:n kirjautumisella):
 *   cd studio && npx sanity exec ../scripts/lisaa-logot-2026-11.mjs --with-user-token
 *   cd studio && npx sanity exec ../scripts/lisaa-logot-2026-11.mjs --with-user-token -- --toteuta
 */

import { createClient } from '@sanity/client'
import { existsSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const TOTEUTA = process.argv.includes('--toteuta')
const KORVAA = process.argv.includes('--korvaa')
const DOC_ID = 'institutionList'

const LOGOT = [
  { host: 'hmak.com', tiedosto: 'hmak.svg',  tyyppi: 'image/svg+xml' },
  { host: 'perho.fi', tiedosto: 'perho.png', tyyppi: 'image/png' },
]

function hostAvain(url = '') {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' }
}

// Logokansio: studio-kansiosta ajettaessa ../../oppilaitosten_logot,
// varalla sama polku tämän skriptin sijainnista laskettuna.
function polku(tiedosto) {
  const ehdokkaat = [resolve(process.cwd(), '..', '..', 'oppilaitosten_logot', tiedosto)]
  try { ehdokkaat.push(fileURLToPath(new URL(`../../oppilaitosten_logot/${tiedosto}`, import.meta.url))) } catch {}
  return ehdokkaat.find((p) => existsSync(p)) ?? null
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
const suunnitelma = []
let seis = false
for (const l of LOGOT) {
  const osumat = lista.filter((o) => hostAvain(o.url) === l.host)
  if (osumat.length !== 1) { console.error(`✖ ${l.host}: löytyi ${osumat.length} oppilaitosta (odotettu 1)`); seis = true; continue }
  const o = osumat[0]
  const p = polku(l.tiedosto)
  if (!p) { console.error(`✖ ${o.name}: tiedostoa oppilaitosten_logot/${l.tiedosto} ei löydy`); seis = true; continue }
  if (o.logo?.asset?._ref && !KORVAA) { console.log(`  = ${o.name}: logo on jo, ohitetaan (--korvaa vaihtaa sen)`); continue }
  suunnitelma.push({ key: o._key, name: o.name, polku: p, tyyppi: l.tyyppi })
}
if (seis) { console.error('\nSEIS: jokin tarkistus ei täsmännyt. Mitään ei muutettu.'); process.exit(1) }

console.log(`Lisätään ${suunnitelma.length} logoa:`)
for (const s of suunnitelma) console.log(`  + ${s.name}  ←  ${basename(s.polku)}`)
if (!suunnitelma.length) { console.log('\nEi lisättävää. Mitään ei muutettu.'); process.exit(0) }
if (!TOTEUTA) { console.log('\nKuivaharjoitus valmis. Aja --toteuta, niin logot ladataan ja liitetään.'); process.exit(0) }

const set = {}
for (const s of suunnitelma) {
  const asset = await client.assets.upload('image', readFileSync(s.polku), { filename: basename(s.polku), contentType: s.tyyppi })
  console.log(`  ↑ ${basename(s.polku)} ladattu (${asset._id})`)
  set[`institutions[_key=="${s.key}"].logo`] = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}
const res = await client.transaction().patch(DOC_ID, (p) => p.ifRevisionId(doc._rev).set(set)).commit()
console.log(`\n✔ Transaktio ${res.transactionId} tehty: ${suunnitelma.length} logoa liitetty.`)
console.log('Netlify-build lähtee Sanityn webhookista.')
