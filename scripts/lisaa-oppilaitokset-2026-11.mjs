/**
 * lisaa-oppilaitokset-2026-11.mjs — Ensimmäiset oppilaitokset sivun alaosan
 * listaan Sarin taulukosta (Oppilaitosten_tiedot_Amisfitsivustolle.xlsx, 5.11.2026).
 * Lista on yksi yhteinen dokumentti kaikille kielille (Studio: 🏫 Oppilaitokset).
 *
 * TURVALLISUUS (sama malli kuin korjaa-tekstit-2026-10.mjs):
 *   - Oletuksena kuivaharjoitus: tulostaa, mitä lisättäisiin, eikä muuta mitään.
 *   - Lisää vain puuttuvat oppilaitokset listan loppuun. Olemassa olevia ei
 *     muuteta eikä poisteta. Sama oppilaitos tunnistetaan nimestä tai kotisivun
 *     verkkotunnuksesta, joten skriptin voi ajaa uudelleen turvallisesti.
 *   - Julkaisematon luonnos Studiossa → seis.
 *   - ifRevisionId: jos lista muuttui välissä → seis.
 *   - Peruttavissa Studion historiasta (History → Revert).
 *
 * AJO (Sanity CLI:n kirjautumisella, .env:ssä ei ole tokenia):
 *   cd studio && npx sanity exec ../scripts/lisaa-oppilaitokset-2026-11.mjs --with-user-token
 *   cd studio && npx sanity exec ../scripts/lisaa-oppilaitokset-2026-11.mjs --with-user-token -- --toteuta
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'

const TOTEUTA = process.argv.includes('--toteuta')
const DOC_ID = 'institutionList'

// Sarin taulukko 5.11.2026. Ruotsin- tai englanninkielinen osoite vain, jos se
// eroaa suomenkielisestä: tyhjänä sivu käyttää suomenkielistä kotisivua.
// Ruotsinkielisiä nimiä taulukossa ei ollut, joten nameSv jää tyhjäksi.
// Ammattiopisto Spesia lisätty 5.11.2026 (Sarin välittämä viesti, logo erikseen).
const OPPILAITOKSET = [
  { name: 'Ammattiopisto Luovi',                   url: 'https://luovi.fi/',      urlSv: 'https://luovi.fi/sv/', urlEn: 'https://luovi.fi/en/' },   // lisätty 5.11. (taulukon päivitys)
  { name: 'Ammattiopisto Spesia',                  url: 'https://www.spesia.fi/', urlEn: 'https://www.spesia.fi/en/etusivu/' },
  { name: 'Business College Helsinki',             url: 'https://www.bc.fi/',   urlEn: 'https://www.bc.fi/en/' },
  { name: 'Helsingin Maalariammattikoulu',         url: 'https://hmak.com/' },
  { name: 'Ingmanedu Kulttuurialan ammattiopisto', url: 'https://ingmanedu.fi/' },
  { name: 'Perho Liiketalousopisto',               url: 'https://perho.fi/',    urlEn: 'https://perho.fi/en/' },
  { name: 'Suomen Diakoniaopisto',                 url: 'https://www.sdo.fi/' },
  { name: 'TTS',                                   url: 'https://www.tts.fi/',    urlEn: 'https://www.tts.fi/en/home/' },   // lisätty 5.11. (taulukon päivitys)
]

const nimiAvain = (s = '') => s.trim().toLowerCase().replace(/\s+/g, ' ')
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

const nykyiset = doc?.institutions ?? []
console.log(`Listalla nyt ${nykyiset.length} oppilaitosta${doc ? '' : ' (listaa ei vielä ole, se luodaan)'}.`)
for (const o of nykyiset) console.log(`  · ${o.name}  ${o.url ?? ''}`)

const nimet = new Set(nykyiset.map((o) => nimiAvain(o.name)))
const hostit = new Set(nykyiset.map((o) => hostAvain(o.url)).filter(Boolean))
const lisattavat = []
const ohitetut = []
for (const o of OPPILAITOKSET) {
  if (nimet.has(nimiAvain(o.name)) || hostit.has(hostAvain(o.url))) ohitetut.push(o)
  else lisattavat.push(o)
}

console.log(`\nLisätään ${lisattavat.length}:`)
for (const o of lisattavat) {
  const muut = [o.urlSv && `sv: ${o.urlSv}`, o.urlEn && `en: ${o.urlEn}`].filter(Boolean).join(', ')
  console.log(`  + ${o.name}  ${o.url}${muut ? `  (${muut})` : ''}`)
}
if (ohitetut.length) {
  console.log(`Ohitetaan ${ohitetut.length}, koska ne ovat jo listalla:`)
  for (const o of ohitetut) console.log(`  = ${o.name}`)
}

if (!lisattavat.length) { console.log('\nEi lisättävää. Mitään ei muutettu.'); process.exit(0) }
if (!TOTEUTA) { console.log('\nKuivaharjoitus valmis. Aja --toteuta, niin oppilaitokset lisätään.'); process.exit(0) }

const kohteet = lisattavat.map((o) => ({
  _key: randomUUID().replace(/-/g, '').slice(0, 12),
  _type: 'institution',
  ...o,
}))

// Yksi transaktio: lista luodaan tarvittaessa ja oppilaitokset lisätään loppuun
const tx = client.transaction()
if (!doc) tx.createIfNotExists({ _id: DOC_ID, _type: 'institutionList', institutions: [] })
tx.patch(DOC_ID, (p) => (doc ? p.ifRevisionId(doc._rev) : p)
  .setIfMissing({ institutions: [] })
  .append('institutions', kohteet))
const res = await tx.commit()
console.log(`\n✔ Transaktio ${res.transactionId} tehty: ${kohteet.length} oppilaitosta lisätty.`)
console.log('Netlify-build lähtee Sanityn webhookista. Lista näkyy sivun alaosassa kaikilla kielillä.')
